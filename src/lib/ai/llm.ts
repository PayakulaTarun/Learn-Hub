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

export const generateMockResponse = (messages: AIChatMessage[], context: AIContextData): string => {
    const lastUserMsg = messages[messages.length - 1].content.toLowerCase();

    if (context.currentCode) {
        if (lastUserMsg.includes('explain')) {
            return `I see you are working on **${context.problemTitle || 'code'}** in *${context.language}*.\n\nYour code:\n\`\`\`${context.language}\n${context.currentCode.substring(0, 50)}...\n\`\`\`\n\nIt looks like you're initializing a function. Do you need help with the logic?`;
        }
        if (lastUserMsg.includes('error')) {
            return "I can help debug. Please share the specific error message from the console.";
        }
    }

    if (lastUserMsg.includes('hello') || lastUserMsg.includes('hi')) {
        return "Hello! I am your AI Tutor. I can help you with coding problems, concepts, and debugging. What are you working on?";
    }

    return "I'm currently in **Mock Mode** (no API key configured). But I can see your context! Integrating a real LLM here is easy via `src/lib/llm.ts`.";
};
