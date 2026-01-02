import fs from 'fs';
import path from 'path';
import { db } from '../lib/firebase-admin';
import { AIService } from './AIService';
import { VertexAI } from '@google-cloud/vertexai';

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT;
const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

interface MockQuestion {
    id: string | number;
    question: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    category: string;
    topic: string;
    answer_variants: any[];
}

export class MockInterviewService {

    /**
     * Loads 50 questions for a subject with strict distribution:
     * 20 Beginner, 20 Intermediate, 10 Advanced
     */
    static async getMockQuestions(subjectSlug: string): Promise<MockQuestion[]> {
        const qaDir = path.join(process.cwd(), 'qa_database', 'json_parts');
        const files = fs.readdirSync(qaDir).filter(f => f.startsWith(`${subjectSlug}_`));

        let allQuestions: MockQuestion[] = [];

        for (const file of files) {
            const data = JSON.parse(fs.readFileSync(path.join(qaDir, file), 'utf-8'));
            if (data.parts) {
                data.parts.forEach((part: any) => {
                    allQuestions.push(...part.questions);
                });
            }
        }

        // Shuffle and filter by difficulty
        const beginner = this.shuffle(allQuestions.filter(q => q.difficulty === 'Beginner')).slice(0, 20);
        const intermediate = this.shuffle(allQuestions.filter(q => q.difficulty === 'Intermediate')).slice(0, 20);
        const advanced = this.shuffle(allQuestions.filter(q => q.difficulty === 'Advanced')).slice(0, 10);

        const selected = [...beginner, ...intermediate, ...advanced];

        // Fill if short (unlikely with our dataset, but safe for production)
        if (selected.length < 50) {
            const remaining = allQuestions.filter(q => !selected.includes(q));
            selected.push(...this.shuffle(remaining).slice(0, 50 - selected.length));
        }

        return selected;
    }

    /**
     * Evaluates a user answer against the standard expert answers
     */
    static async evaluateAnswer(question: MockQuestion, userAnswer: string): Promise<any> {
        if (!userAnswer || userAnswer.trim().length < 10) {
            return {
                level: 'Weak',
                feedback: 'Insufficient explanation provided.',
                score: 0,
                strengths: '',
                missingConcepts: 'Detailed explanation missing.',
                suggestions: 'Revise the core concepts of this topic.'
            };
        }

        // Use ONLY the provided variants for grounding
        const variants = question.answer_variants
            .filter(v => ['interview', 'technical', 'deep_explanation'].includes(v.style))
            .map(v => v.answer)
            .join('\n\n');

        const systemPrompt = `You are a Principal Technical Interview Evaluator.
        STRICT RULE: Evaluate the user's answer ONLY against the provided EXPERT ANSWERS.
        Do NOT use external knowledge.
        
        EXPERT ANSWERS FOR "${question.question}":
        ${variants}
        
        INSTRUCTIONS:
        1. Compare user answer with expert keywords and logic.
        2. Score the answer: Excellent, Good, Average, Weak.
        3. Identify Strengths and Missing Concepts.
        4. Provide specific improvement suggestions.
        5. Return ONLY a JSON object.

        FORMAT:
        {
           "level": "Excellent | Good | Average | Weak",
           "strengths": "Brief summary of what was right",
           "missingConcepts": "Key points from expert answers missed by user",
           "suggestions": "One clear action to improve",
           "logicFlow": "Assessment of explanation quality"
        }`;

        try {
            const vertexAI = new VertexAI({ project: PROJECT_ID!, location: LOCATION });
            const model = vertexAI.getGenerativeModel({
                model: 'gemini-1.5-flash',
                generationConfig: { responseMimeType: 'application/json' }
            });

            const result = await model.generateContent(`${systemPrompt}\n\nUSER ANSWER: ${userAnswer}`);
            const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
            return JSON.parse(responseText || '{}');
        } catch (e) {
            console.error('Mock Evaluation Error:', e);
            return { level: 'Average', feedback: 'Automated evaluation partially failed.' };
        }
    }

    /**
     * Aggregates a finished session into a detailed training report
     */
    static async generateFinalReport(sessionData: any): Promise<any> {
        const answers = sessionData.answers || [];
        const topics: Record<string, { total: number, score: number, questions: any[] }> = {};

        // 1. Topic Aggregation
        answers.forEach((ans: any) => {
            const t = ans.question.topic || 'General';
            if (!topics[t]) topics[t] = { total: 0, score: 0, questions: [] };

            topics[t].total++;
            const levelScore = { 'Excellent': 100, 'Good': 75, 'Average': 50, 'Weak': 25 }[ans.evaluation.level as string] || 0;
            topics[t].score += levelScore;
            topics[t].questions.push(ans);
        });

        // 2. Strength Determination
        const manifestPath = path.join(process.cwd(), 'src', 'generated', 'manifest.json');
        let manifest: any = {};
        if (fs.existsSync(manifestPath)) {
            manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
        }

        const strong: string[] = [];
        const medium: string[] = [];
        const weak: string[] = [];
        const improvementPlan: any[] = [];

        Object.entries(topics).forEach(([topic, data]) => {
            const avg = data.score / data.total;
            let status: 'Strong' | 'Medium' | 'Weak';

            if (avg >= 80) { status = 'Strong'; strong.push(topic); }
            else if (avg >= 50) { status = 'Medium'; medium.push(topic); }
            else { status = 'Weak'; weak.push(topic); }

            if (status !== 'Strong') {
                // Find related static page by topic keyword
                const relatedPage = Object.values(manifest).find((item: any) =>
                    item.title.toLowerCase().includes(topic.toLowerCase()) ||
                    topic.toLowerCase().includes(item.title.toLowerCase())
                ) as any;

                improvementPlan.push({
                    topic,
                    status,
                    reason: status === 'Weak' ? 'Missing key concepts in answers' : 'Partial or unclear explanations',
                    actions: [
                        relatedPage ? `Read: ${relatedPage.title}` : `Revise the core logic of ${topic}`,
                        `Focus on: ${topic} internals and standard interview variants`,
                        `Practice: Retake mock questions from ${topic}`
                    ]
                });
            }
        });

        // 3. Overall Scoring
        const totalScore = answers.reduce((acc: number, curr: any) => {
            return acc + ({ 'Excellent': 100, 'Good': 75, 'Average': 50, 'Weak': 25 }[curr.evaluation.level as string] || 0);
        }, 0);
        const preparationPercentage = Math.round(totalScore / (answers.length || 1));

        let readiness: 'Beginner' | 'Junior' | 'Mid-level' = 'Beginner';
        if (preparationPercentage > 85) readiness = 'Mid-level';
        else if (preparationPercentage > 60) readiness = 'Junior';

        return {
            title: "Mock Interview Training Report",
            subject: sessionData.subject,
            totalAttempted: answers.length,
            date: new Date().toLocaleDateString(),
            evaluations: answers,
            readinessSummary: { strong, medium, weak },
            improvementPlan,
            overallScore: preparationPercentage,
            readinessLevel: readiness,
            feedback: this.getFinalFeedback(preparationPercentage)
        };
    }

    private static getFinalFeedback(score: number): string {
        if (score > 85) return "Your preparation is excellent. You are ready for live interviews!";
        if (score > 60) return "You have a good foundation but need to polish your depth of explanation.";
        return "Focus more on the core concepts before attempting live interviews.";
    }

    private static shuffle(array: any[]) {
        return array.sort(() => Math.random() - 0.5);
    }
}
