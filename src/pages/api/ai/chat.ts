import type { NextApiRequest, NextApiResponse } from 'next';
import { generateMockResponse, AIChatMessage, AIContextData } from '../../../lib/ai/llm';

// In a real app, this would use OpenAI/Gemini SDKs
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { messages, context } = req.body as { messages: AIChatMessage[], context: AIContextData };

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
        const rawResponse = generateMockResponse(messages, context || {});
        let finalContent = rawResponse;
        let action = null;
        let path = null;

        // Check if response is a JSON Action
        if (rawResponse.trim().startsWith('{')) {
            try {
                const parsed = JSON.parse(rawResponse);
                if (parsed.action) {
                    finalContent = parsed.text;
                    action = parsed.action;
                    path = parsed.path;
                }
            } catch (e) {
                // Not valid JSON, ignore
            }
        }

        return res.status(200).json({
            role: 'assistant',
            content: finalContent,
            action,
            path
        });
    } catch (error) {
        console.error('AI API Error:', error);
        return res.status(500).json({ error: 'Internal AI Error' });
    }
}
