import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { AIChatMessage, AIContextData } from '../lib/ai/llm';

interface AIContextType {
    isOpen: boolean;
    toggleChat: () => void;
    messages: AIChatMessage[];
    sendMessage: (content: string) => Promise<void>;
    isTyping: boolean;
    contextData: AIContextData;
    updateContext: (data: Partial<AIContextData>) => void;
    clearChat: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<AIChatMessage[]>([
        { role: 'assistant', content: 'Hi! I am your AI Tutor. Ask me anything about your code or the platform.' }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [contextData, setContextData] = useState<AIContextData>({});

    const toggleChat = () => setIsOpen(prev => !prev);

    const updateContext = (data: Partial<AIContextData>) => {
        setContextData(prev => ({ ...prev, ...data }));
    };

    const clearChat = () => {
        setMessages([{ role: 'assistant', content: 'Chat history cleared. How can I help?' }]);
    };

    const router = useRouter();

    const sendMessage = async (content: string) => {
        const userMsg: AIChatMessage = { role: 'user', content };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        try {
            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMsg],
                    context: contextData
                })
            });
            
            if (!res.ok) throw new Error('API Failed');
            
            const data = await res.json();
            setMessages(prev => [...prev, data]);

            // Handle Navigation Actions
            if (data.action === 'navigate' && data.path) {
                setTimeout(() => {
                    router.push(data.path);
                }, 1500); // Small delay so user reads "Navigating..."
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error connecting to the AI brain.' }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <AIContext.Provider value={{ 
            isOpen, toggleChat, messages, sendMessage, isTyping, contextData, updateContext, clearChat 
        }}>
            {children}
        </AIContext.Provider>
    );
}

export const useAI = () => {
    const context = useContext(AIContext);
    if (!context) throw new Error('useAI must be used within AIProvider');
    return context;
};
