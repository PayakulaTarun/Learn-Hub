import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { VertexAI, SchemaType } from "@google-cloud/vertexai";

export interface LearnerProfile {
    skill_level: "beginner" | "intermediate" | "advanced";
    learning_style: "example-driven" | "theory-driven" | "problem-first" | "revision-oriented";
    confidence_level: "low" | "medium" | "high";
    intent_distribution: {
        learning: number;
        revision: number;
        interview: number;
        exploration: number;
    };
    weak_concept_clusters: string[];
    lastUpdated?: string;
}

export class LearnerProfileService {
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
     * Analyzes user interactions to generate/update their learner profile.
     * This should be called asynchronously (e.g. via Pub/Sub or after a chat session).
     */
    static async updateLearnerProfile(uid: string, recentInteractions: string[]): Promise<LearnerProfile | null> {
        try {
            const db = admin.firestore();
            const profileRef = db.collection("learner_profiles").doc(uid);

            // Fetch existing profile to provide context (optional, but good for "gradual updates")
            const doc = await profileRef.get();
            const currentProfile = doc.exists ? doc.data() : null;

            const systemInstruction = `
You are the Learner Profiling Engine of an AI-powered educational platform.

Your responsibility is to silently observe user interactions and maintain
an evolving cognitive profile for each learner.

━━━━━━━━━━━━━━━━━━━━━━
INPUT SIGNALS YOU RECEIVE
━━━━━━━━━━━━━━━━━━━━━━
• User questions
• Answer patterns
• Time taken to respond
• Confidence indicators (hesitation, phrasing)
• Mistake repetition
• Interview performance scores

━━━━━━━━━━━━━━━━━━━━━━
PROFILE ATTRIBUTES (MANDATORY)
━━━━━━━━━━━━━━━━━━━━━━
Maintain the following learner profile fields:

• skill_level:
  - beginner
  - intermediate
  - advanced

• learning_style:
  - example-driven
  - theory-driven
  - problem-first
  - revision-oriented

• confidence_level:
  - low
  - medium
  - high

• intent_distribution:
  - learning
  - revision
  - interview
  - exploration
  (Provide a percentage distribution summing to 100)

• weak_concept_clusters:
  - inferred topic groups the learner struggles with

━━━━━━━━━━━━━━━━━━━━━━
UPDATE RULES
━━━━━━━━━━━━━━━━━━━━━━
• Never ask the user directly for their level
• Infer from behavior only
• Update gradually (no sudden jumps)
• Prioritize recent interactions but retain long-term patterns
• If NO useful signal is present (e.g. "hi"), return the existing profile or defaults.

━━━━━━━━━━━━━━━━━━━━━━
OUTPUT
━━━━━━━━━━━━━━━━━━━━━━
Produce a structured learner profile object suitable for storage.
You do NOT generate explanations.
You ONLY model the learner.
Output purely JSON.
`;

            const userContext = currentProfile
                ? `CURRENT PROFILE:\n${JSON.stringify(currentProfile)}\n\nRECENT INTERACTIONS:\n${recentInteractions.join("\n")}`
                : `NEW USER. RECENT INTERACTIONS:\n${recentInteractions.join("\n")}`;

            const vertex = this.getVertexAI();
            const model = vertex.getGenerativeModel({
                model: "gemini-1.5-pro",
                generationConfig: {
                    temperature: 0.1, // Low temp for analytical consistency
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: SchemaType.OBJECT,
                        properties: {
                            skill_level: { type: SchemaType.STRING, enum: ["beginner", "intermediate", "advanced"] },
                            learning_style: { type: SchemaType.STRING, enum: ["example-driven", "theory-driven", "problem-first", "revision-oriented"] },
                            confidence_level: { type: SchemaType.STRING, enum: ["low", "medium", "high"] },
                            intent_distribution: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    learning: { type: SchemaType.NUMBER },
                                    revision: { type: SchemaType.NUMBER },
                                    interview: { type: SchemaType.NUMBER },
                                    exploration: { type: SchemaType.NUMBER }
                                }
                            },
                            weak_concept_clusters: {
                                type: SchemaType.ARRAY,
                                items: { type: SchemaType.STRING }
                            }
                        },
                        required: ["skill_level", "learning_style", "confidence_level", "intent_distribution", "weak_concept_clusters"]
                    }
                },
                systemInstruction: {
                    role: 'system',
                    parts: [{ text: systemInstruction }]
                }
            });

            const result = await model.generateContent(userContext);
            const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!responseText) {
                throw new Error("No response from Profiling Engine");
            }

            const newProfile = JSON.parse(responseText) as LearnerProfile;
            newProfile.lastUpdated = new Date().toISOString();

            // Save to Firestore
            await profileRef.set(newProfile, { merge: true });

            functions.logger.info(`Learner Profile Updated for ${uid}`, newProfile);

            return newProfile;

        } catch (error: any) {
            functions.logger.error("Error updating learner profile:", error);
            return null;
        }
    }
}
