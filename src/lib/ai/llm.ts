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

        // INTENT DETECTION: "Open X", "Go to X"
        const isNavigationIntent = /open|go to|show me|navigate/i.test(lastUserMsg);

        // AUTO-OPEN: If user types EXACT title or very close match (implied navigation)
        // We assume topResult comes from searchEngine sorted by score. 
        // If the match is super obvious (e.g. "Arrays" -> "Arrays Intro"), treat as nav.
        const isDirectTopicMatch = topResult.title.toLowerCase().includes(lastUserMsg.toLowerCase()) && lastUserMsg.length > 3;

        // Trigger Action
        if ((isNavigationIntent || isDirectTopicMatch) && topResult.url) {
            return JSON.stringify({
                text: `I found **${topResult.title}**. Opening it for you...`,
                action: 'navigate',
                path: topResult.url
            });
        }

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
