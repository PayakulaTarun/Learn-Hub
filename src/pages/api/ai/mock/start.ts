import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';
import { db } from '@/lib/firebase-admin';
import { MockInterviewService } from '@/services/MockService';
import { FieldValue } from 'firebase-admin/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await getAuth().verifyIdToken(idToken);
        const userId = decodedToken.uid;

        const { subject } = req.body;
        if (!subject) return res.status(400).json({ error: 'Subject is required' });

        // 1. Fetch 50 questions
        const questions = await MockInterviewService.getMockQuestions(subject);

        // 2. Create Session in Firestore
        const sessionRef = db.collection('mock_sessions').doc();
        await sessionRef.set({
            userId,
            subject,
            startTime: FieldValue.serverTimestamp(),
            questions: questions.map(q => ({
                id: q.id,
                question: q.question,
                difficulty: q.difficulty,
                topic: q.topic,
                answer_variants: q.answer_variants // Keep for grounding later
            })),
            currentIndex: 0,
            answers: [],
            status: 'ongoing'
        });

        return res.status(200).json({
            sessionId: sessionRef.id,
            firstQuestion: questions[0].question,
            totalQuestions: 50
        });

    } catch (e: any) {
        console.error('[Mock API] Error:', e);
        res.status(500).json({ error: e.message });
    }
}
