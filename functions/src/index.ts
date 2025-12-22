import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { AIService } from "./services/AIService";
import { MockInterviewService } from "./services/MockService";

// Initialize Firebase Admin
admin.initializeApp();

/**
 * Main API Cloud Function
 * Handles /api/ai/chat and /api/ai/mock/* endpoints
 */
export const api = functions.https.onRequest(async (req, res) => {
    // Enable CORS
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
    }

    // Extract path
    const path = req.path || req.url;

    try {
        // ========== AI CHAT ==========
        if (path.includes("/ai/chat") || path.includes("/chat")) {
            if (req.method !== "POST") {
                res.status(405).json({ error: "Method not allowed" });
                return;
            }

            const authHeader = req.headers.authorization as string;
            if (!authHeader?.startsWith("Bearer ")) {
                res.status(401).json({ error: "Unauthorized: Missing token" });
                return;
            }

            let uid: string;
            try {
                const token = authHeader.split("Bearer ")[1];
                const decoded = await admin.auth().verifyIdToken(token);
                uid = decoded.uid;
            } catch (authError: any) {
                functions.logger.error("Auth Error:", authError.message);
                res.status(401).json({ error: "Unauthorized: Invalid token" });
                return;
            }

            // Check quota
            const today = new Date().toISOString().split("T")[0];
            const quotaRef = admin.firestore().collection("user_quotas").doc(`${uid}_${today}`);

            let currentCount = 0;
            try {
                const quotaDoc = await quotaRef.get();
                currentCount = quotaDoc.data()?.count || 0;
            } catch (dbError: any) {
                functions.logger.warn("Quota retrieval error (defaulting to 0):", dbError.message);
            }

            if (currentCount >= 500) {
                res.status(429).json({ error: "Daily limit reached" });
                return;
            }

            await quotaRef.set({ count: currentCount + 1, uid, date: today }, { merge: true });

            const { messages } = req.body;
            if (!messages || !Array.isArray(messages)) {
                res.status(400).json({ error: "Invalid format: messages array required" });
                return;
            }

            const lastMessage = messages[messages.length - 1]?.content;
            if (!lastMessage) {
                res.status(400).json({ error: "Message content cannot be empty" });
                return;
            }

            res.setHeader("Content-Type", "text/event-stream");
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("Connection", "keep-alive");
            res.flushHeaders();

            functions.logger.info(`Starting AI stream for user ${uid}`);
            await AIService.streamResponse(lastMessage, res);
        }
        // ========== MOCK INTERVIEW START ==========
        else if (path.includes("/mock/start")) {
            if (req.method !== "POST") {
                res.status(405).json({ error: "Method not allowed" });
                return;
            }

            const authHeader = req.headers.authorization as string;
            if (!authHeader?.startsWith("Bearer ")) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            const token = authHeader.split("Bearer ")[1];
            const decoded = await admin.auth().verifyIdToken(token);
            const uid = decoded.uid;

            const { subject } = req.body;
            if (!subject) {
                res.status(400).json({ error: "Subject required" });
                return;
            }

            functions.logger.info(`Starting mock interview for ${subject}`, { uid });

            const questions = await MockInterviewService.getMockQuestions(subject);

            if (questions.length === 0) {
                res.status(404).json({
                    error: "No questions found",
                    message: "This subject doesn't have QA data yet.",
                });
                return;
            }

            const sessionRef = await admin.firestore().collection("mock_sessions").add({
                uid,
                subject,
                questions,
                currentIndex: 0,
                answers: [],
                startedAt: admin.firestore.FieldValue.serverTimestamp(),
                status: "in_progress",
            });

            res.status(200).json({
                sessionId: sessionRef.id,
                subject,
                totalQuestions: questions.length,
                currentQuestion: questions[0],
                currentIndex: 0,
            });
        }
        // ========== MOCK INTERVIEW SUBMIT ==========
        else if (path.includes("/mock/submit")) {
            if (req.method !== "POST") {
                res.status(405).json({ error: "Method not allowed" });
                return;
            }

            const authHeader = req.headers.authorization as string;
            if (!authHeader?.startsWith("Bearer ")) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            const token = authHeader.split("Bearer ")[1];
            const decoded = await admin.auth().verifyIdToken(token);
            const uid = decoded.uid;

            const { sessionId, answer } = req.body;
            if (!sessionId || !answer) {
                res.status(400).json({ error: "SessionId and answer required" });
                return;
            }

            const sessRef = admin.firestore().collection("mock_sessions").doc(sessionId);
            const sessDoc = await sessRef.get();

            if (!sessDoc.exists || sessDoc.data()?.uid !== uid) {
                res.status(404).json({ error: "Session not found" });
                return;
            }

            const session = sessDoc.data()!;
            const currentQuestion = session.questions[session.currentIndex];

            const evaluation = await MockInterviewService.evaluateAnswer(currentQuestion, answer);

            const updatedAnswers = [
                ...session.answers,
                {
                    question: currentQuestion,
                    userAnswer: answer,
                    evaluation,
                    timestamp: new Date().toISOString(),
                },
            ];

            const nextIndex = session.currentIndex + 1;
            const isComplete = nextIndex >= session.questions.length;

            await sessRef.update({
                answers: updatedAnswers,
                currentIndex: nextIndex,
                status: isComplete ? "completed" : "in_progress",
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            res.status(200).json({
                evaluation,
                nextQuestion: isComplete ? null : session.questions[nextIndex],
                currentIndex: nextIndex,
                isComplete,
                progress: {
                    answered: updatedAnswers.length,
                    total: session.questions.length,
                },
            });
        }
        // ========== MOCK INTERVIEW FINALIZE ==========
        else if (path.includes("/mock/finalize")) {
            if (req.method !== "POST") {
                res.status(405).json({ error: "Method not allowed" });
                return;
            }

            const authHeader = req.headers.authorization as string;
            if (!authHeader?.startsWith("Bearer ")) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            const token = authHeader.split("Bearer ")[1];
            const decoded = await admin.auth().verifyIdToken(token);
            const uid = decoded.uid;

            const { sessionId } = req.body;
            if (!sessionId) {
                res.status(400).json({ error: "SessionId required" });
                return;
            }

            const sessRef = admin.firestore().collection("mock_sessions").doc(sessionId);
            const sessDoc = await sessRef.get();

            if (!sessDoc.exists || sessDoc.data()?.uid !== uid) {
                res.status(404).json({ error: "Session not found" });
                return;
            }

            const session = sessDoc.data()!;
            const report = await MockInterviewService.generateFinalReport(session);

            await sessRef.update({
                report,
                status: "finalized",
                finalizedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            res.status(200).json({ report });
        }
        // ========== UNKNOWN ENDPOINT ==========
        else {
            res.status(404).json({ error: "Endpoint not found" });
        }
    } catch (error: any) {
        functions.logger.error("API Error:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});
