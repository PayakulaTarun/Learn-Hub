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

            // --- NAVIGATION INJECTION ---
            const navigationPrompt = `
IMPORTANT: You have the ability to NAVIGATE the user to specific pages.
If the user asks to "open", "go to", "show me", or "solve" a specific topic, append a HIDDEN ACTION at the very end of your response.

**PEDAGOGICAL INSTRUCTION:**
When navigating, do NOT just say "Opening page."
Act as a LEARNING GUIDE. Explain **why** this topic is the next logical step.
Example: "Since you mastered Arrays, let's move to **Linked Lists** to understand dynamic memory allocation. Opening Linked Lists..."

Valid URL Patterns:
1. Topic/Tutorial: /subjects/[subject-slug]/[topic-slug]
   (Infer from context file paths like 'content/data-structures/binary-search.json' -> '/subjects/data-structures/binary-search')
2. Practice Hub: /practice
3. Mock Interview: /practice/mock-interview
4. Coding Problems: /practice/code-problems
5. Subject: /subjects/[subject-slug]

FORMAT:
<<<ACTION:{"type":"NAVIGATE","url":"/exact/path","label":"Opening [Topic Name]..."}>>>

Rules:
- Only navigate if user EXPLICITLY asks.
- Do NOT navigate for general "explain" questions.
- If unsure of the path, do NOT navigate.
- Put the action block at the VERY END.
`;

            // Combine prompts
            const finalPrompt = `${prompt}\n\n${navigationPrompt}`;

            functions.logger.info("Calling Gemini API with Navigation Capability");

            const genAI = new GoogleGenerativeAI(API_KEY);

            // Using gemini-1.5-pro (Pro version - more powerful)
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-pro",
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                },
                systemInstruction: "You are a helpful AI tutor that can control the website navigation.",
            });

            const result = await model.generateContentStream(finalPrompt);

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
