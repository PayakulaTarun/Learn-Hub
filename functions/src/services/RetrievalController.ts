import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { VertexAI, SchemaType } from "@google-cloud/vertexai";
import { AIService } from "./AIService";
import { LearnerProfile } from "./LearnerProfileService";

export interface RetrievalResult {
    intent: string;
    strategy: string;
    chunks: {
        content: string;
        source: string;
        similarity: number;
        type: string;
    }[];
    confidence: number;
    needsClarification: boolean;
}

export class RetrievalController {
    private static PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT || "student-resource-hub-a758a";
    private static LOCATION = "us-central1";
    private static vertexAI: VertexAI | null = null;

    // Threshold for vector similarity (0.0 to 1.0, cosine distance usually returns distance, so similarity = 1 - distance)
    // Firestore findNearest uses distance. Smaller is better.
    // Let's assume we convert/normalize or just use a distance threshold.
    // For Cosine Distance: 0 is identical, 1 is orthogonal, 2 is opposite.
    // "High Confidence" = Low Distance (< 0.4 approx for embeddings usually, dependent on model).
    private static SIMILARITY_THRESHOLD = 0.45;
    private static PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || "http://127.0.0.1:8000/api/v1/intent_check/";

    private static getVertexAI() {
        if (!this.vertexAI) {
            this.vertexAI = new VertexAI({ project: this.PROJECT_ID, location: this.LOCATION });
        }
        return this.vertexAI;
    }

    /**
     * Determines user intent and retrieval strategy using Gemini.
     */
    private static async determineIntent(query: string, profile: LearnerProfile | null): Promise<{ intent: string, searchTerms: string, strategy: string }> {

        // --- PHASE 1 MIGRATION: Python Sidecar Check ---
        if (process.env.USE_PYTHON_BACKEND === "true") {
            try {
                functions.logger.info(" contacting Python Brain for Intent Analysis...");
                const response = await fetch(this.PYTHON_BACKEND_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query, context: profile })
                });

                if (response.ok) {
                    const data = await response.json();
                    functions.logger.info("Python Brain Response:", data);
                    return {
                        intent: data.intent,
                        searchTerms: query,
                        strategy: "Phase 1 Heuristic Strategy (Python)"
                    };
                }
            } catch (e) {
                functions.logger.warn("⚠️ Python Sidecar Unreachable. Falling back to Gemini.", e);
            }
        }

        const vertex = this.getVertexAI();
        const model = vertex.getGenerativeModel({
            model: "gemini-1.5-pro",
            generationConfig: {
                temperature: 0.1,
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        intent: {
                            type: SchemaType.STRING,
                            enum: ["concept_learning", "quick_revision", "interview_preparation", "problem_solving", "exploratory_question"]
                        },
                        search_optimized_query: { type: SchemaType.STRING, description: "Rewritten query optimized for vector search based on intent" },
                        strategy_description: { type: SchemaType.STRING }
                    },
                    required: ["intent", "search_optimized_query", "strategy_description"]
                }
            },
            systemInstruction: {
                role: 'system',
                parts: [{
                    text: `
You are the Intent-Aware Retrieval Controller for a RAG-based learning system.

Your task is to decide HOW content should be retrieved before any generation occurs.

━━━━━━━━━━━━━━━━━━━━━━
INPUTS
━━━━━━━━━━━━━━━━━━━━━━
• User query
• Learner profile (if available)

━━━━━━━━━━━━━━━━━━━━━━
INTENT CLASSIFICATION (MANDATORY)
━━━━━━━━━━━━━━━━━━━━━━
Classify the user's intent as ONE of:
• concept_learning
• quick_revision
• interview_preparation
• problem_solving
• exploratory_question

━━━━━━━━━━━━━━━━━━━━━━
RETRIEVAL STRATEGY RULES
━━━━━━━━━━━━━━━━━━━━━━
Use the intent to rewrite the search query:

• concept_learning: 
  → Focus on key terms, definitions, and theory.
  
• quick_revision: 
  → Add terms like "summary", "overview", "key points".

• interview_preparation: 
  → Add terms like "interview questions", "common mistakes", "complexity".

• problem_solving: 
  → Focus on implementation details, syntax, constraints.

• exploratory_question: 
  → Broad conceptual search.

RETURN JSON ONLY.
` }]
            }
        });

        const profileContext = profile
            ? `Learner Profile: Level=${profile.skill_level}, Style=${profile.learning_style}`
            : "Learner Profile: Unknown (Assume Intermediate)";

        const content = `${profileContext}\nUser Query: "${query}"`;

        try {
            const result = await model.generateContent(content);
            const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) throw new Error("Empty intent response");

            const parsed = JSON.parse(text);
            return {
                intent: parsed.intent,
                searchTerms: parsed.search_optimized_query || query,
                strategy: parsed.strategy_description
            };
        } catch (e) {
            functions.logger.error("Intent Classification Failed", e);
            // Fallback
            return { intent: "exploratory_question", searchTerms: query, strategy: "Fallback default search" };
        }
    }

    /**
     * Executes the smart retrieval process.
     */
    static async retrieve(query: string, profile: LearnerProfile | null): Promise<RetrievalResult> {
        // 1. Determine Intent
        const { intent, searchTerms, strategy } = await this.determineIntent(query, profile);
        functions.logger.info(`[Retrieval] Intent: ${intent} | Query: "${searchTerms}"`);

        // 2. Generate Embedding for relevant search terms
        const queryVector = await AIService.getEmbedding(searchTerms);

        // 3. Execute Vector Search
        const db = admin.firestore();
        const coll = db.collection("knowledge_vectors");

        // Dynamic limit based on intent? 
        // quick_revision might need fewer docs, concept_learning might need more.
        const limit = intent === "quick_revision" ? 3 : 5;

        // Note: 'distance' in vector search is dissimilarity. Lower is better.
        // Assuming cosine distance.
        const snapshot = await (coll as any)
            .findNearest("embedding", admin.firestore.FieldValue.vector(queryVector), {
                distanceMeasure: "COSINE",
                limit: limit,
                distanceResultField: "distance"
            })
            .get();

        if (snapshot.empty) {
            return {
                intent,
                strategy,
                chunks: [],
                confidence: 0,
                needsClarification: true
            };
        }

        // 4. Process Results & Check Confidence
        const chunks = snapshot.docs.map((doc: any) => {
            const data = doc.data();
            return {
                content: data.content,
                source: data.filePath,
                type: data.type,
                similarity: 1.0 - (data.distance || 1.0) // Convert distance to similarity
            };
        });

        const topSimilarity = chunks[0]?.similarity || 0;

        // 0.45 distance threshold -> 0.55 similarity
        const needsClarification = topSimilarity < (1 - this.SIMILARITY_THRESHOLD);

        if (needsClarification) {
            functions.logger.warn(`[Retrieval] Low confidence (${topSimilarity.toFixed(2)}). Threshold ${(1 - this.SIMILARITY_THRESHOLD).toFixed(2)}`);
        }

        return {
            intent,
            strategy,
            chunks,
            confidence: topSimilarity,
            needsClarification
        };
    }
}
