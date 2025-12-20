import React, { useEffect, useRef, useState } from 'react';
import { useAI } from '../../context/AIContext';
import { Bot, X, Send, Maximize2, Minimize2, Trash2, Code2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ChatWidget() {
    const { isOpen, toggleChat, messages, sendMessage, isTyping, contextData, clearChat } = useAI();
    const [input, setInput] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        sendMessage(input);
        setInput('');
    };

    if (!isOpen) {
        return (
            <button 
                onClick={toggleChat}
                className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full shadow-glow-rose hover:scale-110 transition-transform z-50 group"
            >
                <Bot className="w-8 h-8 text-white animate-pulse-slow" />
                <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-ui-card border border-ui-border rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Ask AI Tutor
                </span>
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 bg-ui-card border border-ui-border shadow-2xl z-50 flex flex-col transition-all duration-300 ${
            isExpanded ? 'w-[90vw] h-[80vh] rounded-3xl' : 'w-[380px] h-[600px] rounded-2xl'
        }`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-ui-border bg-ui-dark/50 rounded-t-2xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">AI Tutor</h3>
                        {contextData.problemTitle && (
                            <p className="text-[10px] text-text-muted truncate max-w-[150px]">
                                Context: {contextData.problemTitle}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={clearChat} className="p-2 hover:bg-ui-border rounded-lg text-text-muted hover:text-rose-400 transition-colors" title="Clear Chat">
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 hover:bg-ui-border rounded-lg text-text-muted transition-colors">
                        {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                    <button onClick={toggleChat} className="p-2 hover:bg-rose-500/20 rounded-lg text-text-muted hover:text-rose-500 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-full bg-ui-border flex flex-shrink-0 items-center justify-center">
                                <Bot className="w-4 h-4 text-text-muted" />
                            </div>
                        )}
                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                            msg.role === 'user' 
                            ? 'bg-primary text-text-primary rounded-tr-none border border-ui-border' 
                            : 'bg-ui-dark text-text-secondary rounded-tl-none border border-ui-border'
                        }`}>
                            <div className="prose prose-invert prose-sm max-w-none">
                                <ReactMarkdown 
                                    components={{
                                        code({node, inline, className, children, ...props}: any) {
                                            return !inline ? (
                                                <div className="bg-black/30 p-2 rounded-lg my-2 border border-ui-border font-mono text-xs overflow-x-auto">
                                                    {children}
                                                </div>
                                            ) : (
                                                <code className="bg-black/30 px-1 py-0.5 rounded text-rose-300 font-mono text-xs" {...props}>
                                                    {children}
                                                </code>
                                            )
                                        }
                                    }}
                                >
                                    {msg.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-ui-border flex flex-shrink-0 items-center justify-center">
                            <Bot className="w-4 h-4 text-text-muted" />
                        </div>
                        <div className="bg-ui-dark p-4 rounded-2xl rounded-tl-none border border-ui-border">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce delay-75"></span>
                                <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce delay-150"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-ui-border bg-ui-dark/30">
                {contextData.currentCode && (
                    <div className="mb-2 flex gap-2 overflow-x-auto pb-2">
                        <button 
                            type="button"
                            onClick={() => sendMessage("Explain my current code logic.")}
                            className="px-3 py-1.5 bg-primary/50 hover:bg-primary border border-ui-border rounded-full text-[10px] font-bold text-text-muted whitespace-nowrap transition-colors flex items-center gap-1"
                        >
                            <Code2 className="w-3 h-3" /> Explain Code
                        </button>
                        <button 
                            type="button"
                            onClick={() => sendMessage("Why is my code failing?")}
                            className="px-3 py-1.5 bg-primary/50 hover:bg-primary border border-ui-border rounded-full text-[10px] font-bold text-text-muted whitespace-nowrap transition-colors"
                        >
                            🐞 Debug Help
                        </button>
                         <button 
                            type="button"
                            onClick={() => sendMessage("Optimize this solution for time complexity.")}
                            className="px-3 py-1.5 bg-primary/50 hover:bg-primary border border-ui-border rounded-full text-[10px] font-bold text-text-muted whitespace-nowrap transition-colors"
                        >
                            ⚡ Optimize
                        </button>
                    </div>
                )}
                
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything..."
                        className="flex-1 bg-ui-dark border border-ui-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 transition-colors placeholder:text-text-muted/50"
                    />
                    <button 
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="p-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-glow-rose"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
}
