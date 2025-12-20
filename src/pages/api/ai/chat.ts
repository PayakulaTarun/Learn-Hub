import type { NextApiRequest, NextApiResponse } from 'next';
import { AIService } from '@/services/AIService';
import { auth, db } from '@/lib/firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No Token' });
    }
    const token = authHeader.split('Bearer ')[1];

    let uid: string;
    try {
        const decoded = await auth.verifyIdToken(token);
        uid = decoded.uid;
    } catch (e) {
        return res.status(403).json({ error: 'Forbidden: Invalid Token' });
    }

    try {
        const today = new Date().toISOString().split('T')[0];
        const quotaRef = db.collection('user_quotas').doc(`${uid}_${today}`);

        await db.runTransaction(async (t) => {
            const doc = await t.get(quotaRef);
            const current = doc.data()?.count || 0;
            if (current >= 50) {
                throw new Error('QUOTA_EXCEEDED');
            }
            t.set(quotaRef, { count: current + 1, uid, date: today }, { merge: true });
        });
    } catch (e: any) {
        if (e.message === 'QUOTA_EXCEEDED') {
            return res.status(429).json({ error: 'Daily Limit Reached (50 chats/day).' });
        }
    }

    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Invalid messages format' });
    }

    const lastMessage = messages[messages.length - 1].content;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    try {
        await AIService.streamResponse(lastMessage, res);
    } catch (error) {
        res.end();
    }
}
