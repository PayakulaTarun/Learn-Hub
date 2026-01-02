import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { AIChatMessage, AIContextData } from '../lib/ai/llm';
import { auth } from '../lib/firebase';

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


// ... (Top of file)

    const sendMessage = async (content: string, isRetry = false) => {
        const userMsg: AIChatMessage = { role: 'user', content };
        if (!isRetry) {
            setMessages(prev => [...prev, userMsg]);
        }
        setIsTyping(true);

        try {
            const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
            
            // USE FULL URL TO AVOID LOCALHOST 404s
            const API_URL = window.location.hostname === 'localhost' 
                ? 'https://us-central1-student-resource-hub-a758a.cloudfunctions.net/api/ai/chat'
                : '/api/ai/chat';

            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    messages: isRetry ? [...messages] : [...messages, userMsg],
                    context: contextData
                })
            });
            
            if (!res.ok) {
                // AUTO RETRY ONCE FOR TRANSIENT ERRORS
                if (!isRetry && res.status >= 500) {
                    console.warn("Retrying AI request...");
                    return sendMessage(content, true);
                }

                let errorMessage = res.statusText;
                try {
                    const errorData = await res.json();
                    errorMessage = errorData.error || res.statusText;
                } catch (e) { /* ignore */ }
                throw new Error(errorMessage || `Server Error ${res.status}`);
            }

            if (!res.body) throw new Error('No body');

            // Initialize empty assistant message
            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value);
                
                setMessages(prev => {
                    const newHistory = [...prev];
                    const last = newHistory[newHistory.length - 1];
                    if (last.role === 'assistant') {
                        last.content += chunkValue;
                    }
                    return newHistory;
                });
            }

            // --- AI ACTION HANDLER ---
            setMessages(prev => {
                const newHistory = [...prev];
                const last = newHistory[newHistory.length - 1];
                
                if (last && last.role === 'assistant') {
                    const actionRegex = /<<<ACTION:(.*?)>>>/;
                    const match = last.content.match(actionRegex);
                    
                    if (match) {
                        try {
                            const action = JSON.parse(match[1]);
                            // Clean UI
                            last.content = last.content.replace(match[0], '').trim();
                            
                            if (action.type === 'NAVIGATE' && action.url) {
                                // Execute Navigation
                                router.push(action.url);
                            }
                        } catch (e) { console.error("AI Action Error:", e); }
                    }
                }
                return newHistory;
            });

        } catch (error: any) {
             // AUTO-RETRY ON NETWORK ERROR
            if (!isRetry) {
                console.warn("Retrying AI request after network failure...");
                return sendMessage(content, true);
            }

            console.error('AI Stream Error:', error);
            const msg = error.message || 'Unknown Error';
            setMessages(prev => {
                 const last = prev[prev.length - 1];
                 if (last.role === 'assistant' && last.content === '') {
                     const newHistory = [...prev];
                     newHistory[newHistory.length - 1].content = `⚠️ **Connection Error:** ${msg}. \n\n*Using offline knowledge base where available.*`;
                     return newHistory;
                 }
                 return [...prev, { role: 'assistant', content: `⚠️ **Connection Error:** ${msg}` }];
            });
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
