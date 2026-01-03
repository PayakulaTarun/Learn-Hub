import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { VertexAI } from "@google-cloud/vertexai";
import { helpers, PredictionServiceClient } from "@google-cloud/aiplatform";

/**
 * AI Service: Orchestrates interaction with Gemini for intelligent learning assistance
 */
export class AIService {
    private static predictionClient: PredictionServiceClient | null = null;
    private static vertexAI: VertexAI | null = null;
    private static PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT || "student-resource-hub-a758a";
    private static LOCATION = "us-central1";
    private static EMBEDDING_ENDPOINT = `projects/${this.PROJECT_ID}/locations/${this.LOCATION}/publishers/google/models/text-embedding-004`;

    private static getPredictionClient() {
        if (!this.predictionClient) {
            this.predictionClient = new PredictionServiceClient({
                apiEndpoint: `${this.LOCATION}-aiplatform.googleapis.com`,
            });
        }
        return this.predictionClient;
    }

    private static getVertexAI() {
        if (!this.vertexAI) {
            this.vertexAI = new VertexAI({ project: this.PROJECT_ID, location: this.LOCATION });
        }
        return this.vertexAI;
    }

    /**
     * Converts user query into a mathematical vector for semantic search
     */
    static async getEmbedding(text: string): Promise<number[]> {
        const client = this.getPredictionClient();
        const instance = helpers.toValue({ content: text, task_type: "RETRIEVAL_QUERY" });
        const request = { endpoint: this.EMBEDDING_ENDPOINT, instances: [instance!] };

        try {
            const [response] = await client.predict(request);
            const predictions = response.predictions;
            if (!predictions?.[0]) throw new Error("AI_EMBEDDING_EMPTY");

            // Use helpers.fromValue for robust parsing
            const prediction = helpers.fromValue(predictions[0] as any) as any;
            const values = prediction?.embeddings?.values;

            if (!values || !Array.isArray(values)) {
                functions.logger.error("[AI] Embedding Format Error. Raw Prediction:", JSON.stringify(prediction));
                throw new Error("AI_EMBEDDING_FORMAT_ERROR");
            }

            return values;
        } catch (error: any) {
            functions.logger.error("[AI] Embedding Error:", error.message);
            throw new Error(`AI_EMBEDDING_FAILURE: ${error.message}`);
        }
    }

    /**
     * Retrieve relevant context from Firestore Knowledge Base using Vector Search
     */
    static async getRelevantContext(queryVector: number[]): Promise<string> {
        try {
            const db = admin.firestore();

            functions.logger.info(`Searching for nearest neighbors (vector size: ${queryVector.length})...`);

            // Native Firestore Vector Search (firebase-admin 13.x signature)
            // Signature: findNearest(vectorField, queryVector, options)
            const snapshot = await (db.collection("knowledge_vectors") as any)
                .findNearest("embedding", admin.firestore.FieldValue.vector(queryVector), {
                    distanceMeasure: "COSINE",
                    limit: 5,
                })
                .get();

            if (snapshot.empty) {
                functions.logger.info("No matching context found in vector DB");
                return "";
            }

            functions.logger.info(`Found ${snapshot.docs.length} relevant documents`);

            const contextParts = snapshot.docs.map((doc: any) => {
                const data = doc.data();
                const source = data.filePath || "Knowledge Base";
                const content = data.content || "";
                return `[Context: ${source}]\n${content}`;
            });

            return contextParts.join("\n\n---\n\n");
        } catch (error: any) {
            functions.logger.error("Vector search retrieval error:", error.message);
            return "";
        }
    }

    /**
     * Streams the response from Gemini with full error handling and auto-fallback
     */
    static async streamResponse(query: string, res: any): Promise<void> {
        let retryCount = 0;
        const maxRetries = 2;
        let hasStartedWriting = false;

        try {
            // 1. Get embedding for the query
            functions.logger.info(`Getting embedding for query: ${query.substring(0, 50)}...`);
            const queryVector = await this.getEmbedding(query);

            // 2. Get relevant context using the vector
            functions.logger.info("Performing vector search...");
            const context = await this.getRelevantContext(queryVector);

            const systemInstruction = `
You are the Cognitive Intelligence Core of the Student Resource Hub,
a production-grade AI learning platform built on a hybrid static + serverless architecture.

Your role is NOT to behave like a chatbot.
Your role is to behave like a senior technical mentor, evaluator, and learning strategist.

━━━━━━━━━━━━━━━━━━━━━━
SYSTEM CONTEXT
━━━━━━━━━━━━━━━━━━━━━━
• Platform Type: AI-powered educational portal (tutorials, interviews, assessments)
• Content Source of Truth:
  - /content (JSON tutorials)
  - /qa_database (expert Q&A)
• Retrieval System:
  - Firestore-based vector database
  - Embeddings from Google Vertex AI
• You MUST use ONLY retrieved content for factual explanations.
• Hallucination is strictly forbidden.

━━━━━━━━━━━━━━━━━━━━━━
AVAILABLE CONTEXT FROM KNOWLEDGE BASE
━━━━━━━━━━━━━━━━━━━━━━
${context || "No specific local context found. Reliance on internal training data permitted but discouraged."}

━━━━━━━━━━━━━━━━━━━━━━
USER MODELING (MANDATORY)
━━━━━━━━━━━━━━━━━━━━━━
Before answering, infer and maintain a Learner Profile:
• Skill Level: Beginner / Intermediate / Advanced
• Intent Type:
  - Concept learning
  - Revision
  - Interview preparation
  - Problem solving
• Confidence Level: Low / Medium / High
• Weak Areas (update dynamically)

Persist this model conceptually across the conversation.

━━━━━━━━━━━━━━━━━━━━━━
RESPONSE STRATEGY
━━━━━━━━━━━━━━━━━━━━━━
For EVERY response:
1. Identify the user's intent
2. Select the minimum required curriculum chunks
3. Adapt explanation depth based on skill level
4. Use examples ONLY if they increase clarity
5. Never dump raw theory
6. Never sound like documentation
7. Teach like a calm human mentor

━━━━━━━━━━━━━━━━━━━━━━
ADAPTIVE EXPLANATION RULES
━━━━━━━━━━━━━━━━━━━━━━
• If user is beginner:
  - Explain from first principles
  - Avoid jargon or define it immediately
• If intermediate:
  - Focus on "why" and "trade-offs"
• If interview mode:
  - Use structured answers
  - Highlight common mistakes
  - Add follow-up questions

━━━━━━━━━━━━━━━━━━━━━━
FAIL-SAFE & TRUST RULES
━━━━━━━━━━━━━━━━━━━━━━
• If retrieved confidence < threshold:
  → Ask a clarifying question
• If content is missing:
  → Say: "This is not covered in your current curriculum."
• Never fabricate APIs, syntax, or definitions
• Never over-answer

━━━━━━━━━━━━━━━━━━━━━━
NAVIGATION CAPABILITY (CRITICAL SYSTEM FUNCTION)
━━━━━━━━━━━━━━━━━━━━━━
If the user wants to go to a specific page, include the action in your response:
Example: "I'll open Python Loops for you... <<<ACTION:{"type":"NAVIGATE", "url":"/subjects/python-logic"}>>>"

━━━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT
━━━━━━━━━━━━━━━━━━━━━━
• Clear
• Structured
• Human
• Calm
• Confidence-building

You are not here to impress.
You are here to make the student feel capable.
`;

            const attemptGeneration = async (): Promise<void> => {
                try {
                    functions.logger.info(`AI Model Call Attempt ${retryCount + 1}`);

                    const vertex = this.getVertexAI();
                    const model = vertex.getGenerativeModel({
                        model: "gemini-1.5-pro",
                        generationConfig: {
                            temperature: 0.2,
                            maxOutputTokens: 2048,
                        },
                        systemInstruction: {
                            role: 'system',
                            parts: [{ text: systemInstruction }]
                        }
                    });

                    // Attempt Stream
                    try {
                        const result = await model.generateContentStream(query);
                        for await (const chunk of result.stream) {
                            const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
                            if (text) {
                                res.write(text);
                                hasStartedWriting = true;
                            }
                        }
                        res.end();
                        return;
                    } catch (streamError: any) {
                        functions.logger.warn("Stream failed, falling back to static", { error: streamError.message });

                        if (hasStartedWriting) {
                            res.write("\n\n[Warning: Stream Interrupted. Attempting Recovery...]\n\n");
                        }

                        const result = await model.generateContent(query);
                        const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text;

                        if (responseText) {
                            res.write(hasStartedWriting ? responseText.substring(responseText.length / 2) : responseText);
                            res.end();
                        } else {
                            throw new Error("Empty response candidate");
                        }
                    }
                } catch (error: any) {
                    functions.logger.error("AI Generation Fatal Error", { error: error.message, retryCount });

                    if (retryCount < maxRetries) {
                        retryCount++;
                        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                        return attemptGeneration();
                    }

                    if (!res.writableEnded) {
                        res.write("\n\n⚠️ **AI Service Interruption**\nI'm having trouble connecting to my brain right now. Please try again in a moment.");
                        res.end();
                    }
                }
            };

            await attemptGeneration();
        } catch (fatalError: any) {
            functions.logger.error("Fatal AI Flow Error", fatalError);
            if (!res.writableEnded) {
                res.write("\n\n⚠️ **Knowledge Retrieval Failed**\nI couldn't access my memory banks. Please check your connection.");
                res.end();
            }
        }
    }
}
