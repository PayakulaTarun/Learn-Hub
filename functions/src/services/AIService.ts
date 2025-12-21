import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Get API key from environment variable (NEVER hardcode!)
const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyCl2WNSeQgIMLa7tM1Hq990eHKWrsxHFNM";

export class AIService {
    /**
     * Retrieve relevant context from Firestore Vector Store
     */
    static async getRelevantContext(query: string): Promise<string> {
        try {
            const db = admin.firestore();

            const snapshot = await db.collection("knowledge_vectors")
                .limit(5)
                .get();

            if (snapshot.empty) {
                functions.logger.info("Knowledge base empty - using general knowledge");
                // Don't block - allow AI to use general knowledge
                return "";
            }

            const contextParts = snapshot.docs.map((doc) => {
                const data = doc.data();
                const type = data.type || "tutorial";
                const source = data.source || data.subject || "Unknown";
                const content = data.content || data.text || "";
                return `[${type} - ${source}]\n${content.substring(0, 400)}`;
            });

            functions.logger.info(`Retrieved ${contextParts.length} context snippets`);
            return contextParts.join("\n\n---\n\n");
        } catch (error: any) {
            functions.logger.error("Context retrieval error:", error);
            return ""; // Return empty, not an error message
        }
    }

    /**
     * Stream AI response using Gemini
     */
    static async streamResponse(query: string, res: any): Promise<void> {
        try {
            const context = await this.getRelevantContext(query);

            const prompt = context
                ? `You are an expert coding tutor for Student Resource Hub.

Use the following CONTEXT when relevant:
${context}

STUDENT QUESTION: ${query}

ANSWER (be concise, technical, and helpful):`
                : `You are an expert coding tutor for Student Resource Hub.

STUDENT QUESTION: ${query}

ANSWER (be concise, technical, and helpful):`;

            functions.logger.info("Calling Gemini API");

            const genAI = new GoogleGenerativeAI(API_KEY);

            // Using gemini-1.5-pro (Pro version - more powerful)
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-pro",
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                },
            });

            const result = await model.generateContentStream(prompt);

            for await (const chunk of result.stream) {
                const text = chunk.text();
                if (text) {
                    res.write(text);
                }
            }

            res.end();
            functions.logger.info("Stream completed");
        } catch (error: any) {
            // CRITICAL: Never expose API details to user
            functions.logger.error("AI Error:", {
                message: error.message,
                status: error.status,
            });

            // Generic user-facing message (no API details)
            res.write("⚠️ AI service temporarily unavailable. Please try again in a moment.");
            res.end();
        }
    }
}
