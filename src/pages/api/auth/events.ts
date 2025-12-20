import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';
import { z } from 'zod';

const eventSchema = z.object({
    event_type: z.enum(['login', 'logout', 'view', 'complete']),
    entity_type: z.string(),
    entity_id: z.string().optional(),
    metadata: z.record(z.any()).optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // 1. Validate Input
    const parseResult = eventSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error });
    }

    // 2. Auth Guard
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Missing authorization token' });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // 3. Trusted Write
    const { error: dbError } = await supabase.from('user_activity_events').insert({
        user_id: user.id,
        ...parseResult.data
    });

    if (dbError) {
        console.error('DB Write Error:', dbError);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(200).json({ success: true });
}
