import * as admin from "firebase-admin";
import { LearnerProfile } from "./LearnerProfileService";
import { RetrievalResult } from "./RetrievalController";
import { RuntimeModelArtifact } from "./TrainingController";

export interface AdaptiveBehavior {
    systemInstruction: string;
    temperature: number;
    maxOutputTokens: number;
    styleGuide: string;
}

export class BehaviorAdapter {

    /**
     * Constructs the final adaptive behavior configuration for the AI model.
     * It combines Global System Intelligence (Latest Model) with Local User Context (Profile).
     */
    static async adapt(
        profile: LearnerProfile | null,
        retrievalResult: RetrievalResult
    ): Promise<AdaptiveBehavior> {

        // 1. Fetch Global Intelligence (The "Trained" Model Config)
        // In a high-perf scenario, this would be cached in memory.
        let modelArtifact: RuntimeModelArtifact | null = null;
        try {
            const snapshot = await admin.firestore().collection("system_models").doc("latest").get();
            if (snapshot.exists) {
                modelArtifact = snapshot.data() as RuntimeModelArtifact;
            }
        } catch (e) {
            console.warn("Failed to load latest system model, using defaults.");
        }

        // Defaults if model not found
        const config = modelArtifact?.explanation_config || {
            beginner_verbosity: 0.8,
            advanced_conciseness: 0.7,
            interview_strictness: 0.8
        };

        // 2. Adapt Temperature (Creativity) based on Intent
        let temperature = 0.2; // Default: Precise
        if (retrievalResult.intent === "exploratory_question") temperature = 0.6; // More creative
        if (retrievalResult.intent === "problem_solving") temperature = 0.1; // Very strict
        if (retrievalResult.intent === "interview_preparation") temperature = 0.4; // Varied but accurate

        // 3. Adapt Explanation Style based on Learner Profile
        const skillLevel = profile?.skill_level || "intermediate";
        let styleDirective = "";

        if (skillLevel === "beginner") {
            styleDirective = `
    - EXPLANATION DEPTH: HIGH (Verbosity: ${config.beginner_verbosity})
    - USE ANALOGIES: YES
    - TONE: Encouraging, patient.
    - STRUCTURE: "What" -> "Why" -> "How" -> "Example".
    - AVOID: Specialized jargon without immediate definition.
            `;
        } else if (skillLevel === "advanced") {
            styleDirective = `
    - EXPLANATION DEPTH: LOW/FOCUSED (Conciseness: ${config.advanced_conciseness})
    - USE ANALOGIES: NO (waste of tokens)
    - TONE: Professional, peer-to-peer.
    - STRUCTURE: Direct answer, optimization notes, edge cases.
            `;
        } else {
            // Intermediate
            styleDirective = `
    - BALANCE: Mix theory and practice.
    - FOCUS: "Why" triggers and trade-offs.
            `;
        }

        // 4. Adapt for Interview Mode (Strictness)
        if (retrievalResult.intent === "interview_preparation") {
            styleDirective += `
    \n*** INTERVIEW MODE ACTIVE (Strictness: ${config.interview_strictness}) ***
    - Be critical of vague answers.
    - Ask follow-up "Why did you choose X?" questions.
    - Simulate a FAANG interviewer persona.
            `;
        }

        // 5. Construct Final System Instruction
        const systemInstruction = `
You are the Student Resource Hub AI.
You are currently operating under the following ADAPTIVE CONFIGURATION:

${styleDirective}

CONTEXTUAL INTENT: ${retrievalResult.intent.toUpperCase()}
RETRIEVAL CONFIDENCE: ${retrievalResult.confidence.toFixed(2)}

Remember: Adapt your output strictly to these parameters.
`;

        return {
            systemInstruction,
            temperature,
            maxOutputTokens: 2048,
            styleGuide: styleDirective
        };
    }
}
