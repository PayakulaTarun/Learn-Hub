import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { VertexAI, SchemaType } from "@google-cloud/vertexai";

export interface LearningSignal {
    sessionId: string;
    userId: string;
    timestamp: string;
    metrics: {
        question_difficulty: "basic" | "intermediate" | "advanced";
        retrieval_confidence: number;
        detected_confusion: boolean;
        explanation_quality_score: number; // 1-10 inferred
        content_coverage_gap: boolean;
    };
    context: {
        topic: string;
        intent: string;
    };
}

export class LearningObserver {
    private static PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT || "student-resource-hub-a758a";
    private static LOCATION = "us-central1";
    private static vertexAI: VertexAI | null = null;

    private static getVertexAI() {
        if (!this.vertexAI) {
            this.vertexAI = new VertexAI({ project: this.PROJECT_ID, location: this.LOCATION });
        }
        return this.vertexAI;
    }

    /**
     * Asynchronously observes an interaction to extract offline training signals.
     * This does NOT affect the live response.
     */
    static async observe(
        sessionId: string,
        userId: string,
        userMessage: string,
        aiResponse: string,
        retrievalData: { confidence: number, topic?: string, intent?: string }
    ): Promise<void> {
        try {
            // In a real system, use Cloud Tasks to decouple this.
            // Here we run it as a detached promise for demonstration/prototype.
            this.analyzeAndLog(sessionId, userId, userMessage, aiResponse, retrievalData).catch(err =>
                console.error("Observer Analysis Failed", err)
            );
        } catch (e) {
            console.error("Observer Dispatch Failed", e);
        }
    }

    private static async analyzeAndLog(
        sessionId: string,
        userId: string,
        userMessage: string,
        aiResponse: string,
        retrievalData: { confidence: number, topic?: string, intent?: string }
    ) {
        const vertex = this.getVertexAI();
        const model = vertex.getGenerativeModel({
            model: "gemini-1.5-pro",
            generationConfig: {
                temperature: 0.1,
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        question_difficulty: {
                            type: SchemaType.STRING,
                            enum: ["basic", "intermediate", "advanced"]
                        },
                        detected_confusion: { type: SchemaType.BOOLEAN },
                        explanation_quality_score: { type: SchemaType.NUMBER, description: "Rating 1-10 of how well the AI addressed the user need" },
                        content_coverage_gap: { type: SchemaType.BOOLEAN, description: "True if the user asked something seemingly valid that the AI couldn't answer fully due to content limits" },
                        inferred_topic: { type: SchemaType.STRING }
                    },
                    required: ["question_difficulty", "detected_confusion", "explanation_quality_score", "content_coverage_gap", "inferred_topic"]
                }
            },
            systemInstruction: {
                role: 'system',
                parts: [{
                    text: `
You are the AI Learning Observer.
Your task is to observe interactions and extract learning signals that help improve the system over time.

You do NOT change model behavior directly.
You generate structured logs for offline learning models.

Analyze the USER QUESTION and AI RESPONSE to infer:
1. Difficulty of the question relative to a CS curriculum.
2. Whether the user seems confused (detected_confusion).
3. How well the AI explained it (1-10).
4. If there is a noticeable gap in the AI's knowledge (content_coverage_gap).
` }]
            }
        });

        const context = `
USER: "${userMessage}"
AI: "${aiResponse.substring(0, 500)}..."
RETRIEVAL CONFIDENCE: ${retrievalData.confidence}
INTENT: ${retrievalData.intent || "unknown"}
`;

        try {
            const result = await model.generateContent(context);
            const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text;

            if (text) {
                const analysis = JSON.parse(text);

                const signal: LearningSignal = {
                    sessionId,
                    userId,
                    timestamp: new Date().toISOString(),
                    metrics: {
                        question_difficulty: analysis.question_difficulty,
                        retrieval_confidence: retrievalData.confidence,
                        detected_confusion: analysis.detected_confusion,
                        explanation_quality_score: analysis.explanation_quality_score,
                        content_coverage_gap: analysis.content_coverage_gap
                    },
                    context: {
                        topic: retrievalData.topic || analysis.inferred_topic,
                        intent: retrievalData.intent || "unknown"
                    }
                };

                // Save to 'learning_signals' collection (Separate from feedback logs)
                // This collection is for Data Science / R&D usage (offline training)
                await admin.firestore().collection("learning_signals").add(signal);

                functions.logger.info("Learning Signal Logged", signal.metrics);
            }
        } catch (error) {
            functions.logger.error("Observer Inference Failed", error);
        }
    }
}
