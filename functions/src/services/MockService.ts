import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyCl2WNSeQgIMLa7tM1Hq990eHKWrsxHFNM";

interface MockQuestion {
    id: string | number;
    question: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    category: string;
    topic: string;
    answer_variants: any[];
}

export class MockInterviewService {
    /**
     * Load 50 questions for a subject from Firestore
     * 20 Beginner, 20 Intermediate, 10 Advanced
     */
    static async getMockQuestions(subjectSlug: string): Promise<MockQuestion[]> {
        try {
            const db = admin.firestore();

            // Query Firestore for QA data
            const snapshot = await db
                .collection("knowledge_vectors")
                .where("subject", "==", subjectSlug)
                .where("type", "==", "qa")
                .limit(100)
                .get();

            if (snapshot.empty) {
                functions.logger.warn(`No QA data found for subject: ${subjectSlug}`);
                return [];
            }

            const allQuestions: MockQuestion[] = [];

            snapshot.docs.forEach((doc) => {
                const data = doc.data();
                if (data.question) {
                    allQuestions.push({
                        id: doc.id,
                        question: data.question || data.text,
                        difficulty: data.difficulty || "Intermediate",
                        category: data.category || subjectSlug,
                        topic: data.topic || subjectSlug,
                        answer_variants: data.answer_variants || [],
                    });
                }
            });

            // Distribute by difficulty
            const beginner = this.shuffle(
                allQuestions.filter((q) => q.difficulty === "Beginner")
            ).slice(0, 20);
            const intermediate = this.shuffle(
                allQuestions.filter((q) => q.difficulty === "Intermediate")
            ).slice(0, 20);
            const advanced = this.shuffle(
                allQuestions.filter((q) => q.difficulty === "Advanced")
            ).slice(0, 10);

            let selected = [...beginner, ...intermediate, ...advanced];

            // Fill if short
            if (selected.length < 50) {
                const remaining = allQuestions.filter((q) => !selected.includes(q));
                selected.push(...this.shuffle(remaining).slice(0, 50 - selected.length));
            }

            functions.logger.info(`Selected ${selected.length} questions for ${subjectSlug}`);
            return selected.slice(0, 50);
        } catch (error: any) {
            functions.logger.error("Error loading questions:", error);
            throw new Error("Failed to load questions");
        }
    }

    /**
     * Evaluate user answer against expert answers
     */
    static async evaluateAnswer(
        question: MockQuestion,
        userAnswer: string
    ): Promise<any> {
        if (!userAnswer || userAnswer.trim().length < 10) {
            return {
                level: "Weak",
                strengths: "",
                missingConcepts: "Answer too short",
                suggestions: "Provide a more detailed explanation",
                logicFlow: "Incomplete",
            };
        }

        const variants = question.answer_variants
            .filter((v) => ["interview", "technical", "deep_explanation"].includes(v.style))
            .map((v) => v.answer)
            .join("\n\n");

        const systemPrompt = `You are a Technical Interview Evaluator.

EXPERT ANSWERS for "${question.question}":
${variants}

TASK: Evaluate the USER ANSWER against these expert answers.

Return ONLY valid JSON:
{
  "level": "Excellent | Good | Average | Weak",
  "strengths": "what was correct",
  "missingConcepts": "what was missed",
  "suggestions": "how to improve",
  "logicFlow": "quality of explanation"
}`;

        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-pro",
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 512,
                },
            });

            const result = await model.generateContent(
                `${systemPrompt}\n\nUSER ANSWER: ${userAnswer}`
            );

            const responseText = result.response.text();
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);

            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            return {
                level: "Average",
                strengths: "Partial attempt",
                missingConcepts: "Evaluation incomplete",
                suggestions: "Try explaining in more detail",
                logicFlow: "Basic",
            };
        } catch (error: any) {
            functions.logger.error("Evaluation error:", error);
            return {
                level: "Average",
                strengths: "Answer recorded",
                missingConcepts: "Auto-evaluation failed",
                suggestions: "Review expert answers",
                logicFlow: "Unable to assess",
            };
        }
    }

    /**
     * Generate final report
     */
    static async generateFinalReport(sessionData: any): Promise<any> {
        const answers = sessionData.answers || [];

        const topics: Record<string, { total: number; score: number }> = {};

        answers.forEach((ans: any) => {
            const t = ans.question.topic || "General";
            if (!topics[t]) topics[t] = { total: 0, score: 0 };

            topics[t].total++;
            const levelScore = {
                Excellent: 100,
                Good: 75,
                Average: 50,
                Weak: 25,
            }[ans.evaluation.level as string] || 0;
            topics[t].score += levelScore;
        });

        const strong: string[] = [];
        const medium: string[] = [];
        const weak: string[] = [];

        Object.entries(topics).forEach(([topic, data]) => {
            const avg = data.score / data.total;
            if (avg >= 80) strong.push(topic);
            else if (avg >= 50) medium.push(topic);
            else weak.push(topic);
        });

        const totalScore = answers.reduce((acc: number, curr: any) => {
            return (
                acc +
                ({ Excellent: 100, Good: 75, Average: 50, Weak: 25 }[
                    curr.evaluation.level as string
                ] || 0)
            );
        }, 0);

        const preparationPercentage = Math.round(totalScore / (answers.length || 1));

        let readiness: "Beginner" | "Junior" | "Mid-level" = "Beginner";
        if (preparationPercentage > 85) readiness = "Mid-level";
        else if (preparationPercentage > 60) readiness = "Junior";

        return {
            title: "Mock Interview Report",
            subject: sessionData.subject,
            totalAttempted: answers.length,
            date: new Date().toLocaleDateString(),
            evaluations: answers,
            readinessSummary: { strong, medium, weak },
            overallScore: preparationPercentage,
            readinessLevel: readiness,
            feedback: this.getFinalFeedback(preparationPercentage),
        };
    }

    private static getFinalFeedback(score: number): string {
        if (score > 85) return "Excellent! Ready for interviews!";
        if (score > 60) return "Good foundation, polish your depth.";
        return "Focus on core concepts before interviews.";
    }

    private static shuffle(array: any[]) {
        return array.sort(() => Math.random() - 0.5);
    }
}
