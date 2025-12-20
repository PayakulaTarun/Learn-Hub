export interface AIChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface AIContextData {
    pageTitle?: string;
    problemTitle?: string;
    currentCode?: string;
    language?: string;
    selection?: string;
}

import { searchKnowledge } from './searchEngine';

export const generateMockResponse = (messages: AIChatMessage[], context: AIContextData): string => {
    const lastUserMsg = messages[messages.length - 1].content;
    const lowerMsg = lastUserMsg.toLowerCase();

    // 1. Context Aware Help (Code)
    if (context.currentCode && (lowerMsg.includes('explain') || lowerMsg.includes('code'))) {
        return `I see you are working on **${context.problemTitle || 'code'}** in *${context.language}*.\n\nYour code:\n\`\`\`${context.language}\n${context.currentCode.substring(0, 50)}...\n\`\`\`\n\nIt looks like you're initializing a function. Do you need help with the logic?`;
    }

    // 2. Knowledge Base Search
    const results = searchKnowledge(lastUserMsg, context.problemTitle);

    if (results.length > 0) {
        const topResult = results[0];
        const secondary = results.slice(1, 3);

        let response = `Here is what I found about **${topResult.title}** from your notes:\n\n> ${topResult.description}...\n\n`;

        if (topResult.url) {
            response += `[Read Full Article](${topResult.url})\n\n`;
        }

        if (secondary.length > 0) {
            response += `\n*Related Topics: ${secondary.map(s => s.title).join(', ')}*`;
        }

        return response;
    }

    // 3. Fallback
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        return "Hello! I am your AI Tutor. I can search our entire library for you. Try asking about 'Arrays' or 'Merge Sort'.";
    }

    return "I couldn't find that in our course materials. Try simplifying your query or ask about a specific topic from the syllabus.";
};
