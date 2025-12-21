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

        const { sessionId } = req.body;
        if (!sessionId) return res.status(400).json({ error: 'Session ID required' });

        const sessionRef = db.collection('mock_sessions').doc(sessionId);
        const sessionDoc = await sessionRef.get();
        if (!sessionDoc.exists) return res.status(404).json({ error: 'Session not found' });

        const sessionData = sessionDoc.data()!;
        const report = await MockInterviewService.generateFinalReport(sessionData);

        await sessionRef.update({
            report,
            status: 'completed'
        });

        return res.status(200).json(report);

    } catch (e: any) {
        console.error('[Mock Finalize API] Error:', e);
        res.status(500).json({ error: e.message });
    }
}
