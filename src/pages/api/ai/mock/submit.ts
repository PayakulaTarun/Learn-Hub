import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';
import { db } from '@/lib/firebase-admin';
import { MockInterviewService } from '@/services/MockService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const idToken = authHeader.split('Bearer ')[1];
        await getAuth().verifyIdToken(idToken);

        const { sessionId, answer } = req.body;
        if (!sessionId || !answer) return res.status(400).json({ error: 'Session and answer required' });

        const sessionRef = db.collection('mock_sessions').doc(sessionId);
        const sessionDoc = await sessionRef.get();

        if (!sessionDoc.exists) return res.status(404).json({ error: 'Session not found' });

        const sessionData = sessionDoc.data()!;
        const currentIndex = sessionData.currentIndex;
        const currentQuestion = sessionData.questions[currentIndex];

        // Evaluate Answer
        const evaluation = await MockInterviewService.evaluateAnswer(currentQuestion, answer);

        // Update Session
        const nextIndex = currentIndex + 1;
        const isFinished = nextIndex >= 50;

        await sessionRef.update({
            [`answers`]: [...sessionData.answers, {
                questionId: currentQuestion.id,
                question: currentQuestion.question,
                userAnswer: answer,
                evaluation
            }],
            currentIndex: nextIndex,
            status: isFinished ? 'finished' : 'ongoing'
        });

        return res.status(200).json({
            evaluation,
            nextQuestion: isFinished ? null : sessionData.questions[nextIndex].question,
            isFinished
        });

    } catch (e: any) {
        console.error('[Mock API] Error:', e);
        res.status(500).json({ error: e.message });
    }
}
