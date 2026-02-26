import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Trash2 } from 'lucide-react';
import { getMockAIResponse } from '../services/mockChatService';
import { useLanguage } from '../context/LanguageContext';

interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    timestamp: string;
}

export const Chatbot = () => {
    const { t } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            sender: 'bot',
            text: "Hello! I'm your AI Legal Assistant. How can I help you today?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: input,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        const botResponse = await getMockAIResponse(input);

        const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: botResponse,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
    };

    const clearChat = () => {
        setMessages([{
            id: Date.now().toString(),
            sender: 'bot',
            text: "Chat cleared. How can I help you?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-12rem)] relative">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-t-3xl border-b-0 shadow-sm">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 text-white">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-900">AI Legal Associate</h2>
                        <div className="flex items-center space-x-1.5">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-xs text-slate-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis">Online & Ready</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={clearChat}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Clear Chat"
                >
                    <Trash2 size={20} />
                </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50 border-x border-slate-200">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                    >
                        <div className={`flex max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'} items-end space-x-2`}>
                            <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${msg.sender === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-blue-600'
                                }`}>
                                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>
                            <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.sender === 'user'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                                }`}>
                                {msg.text}
                                <div className={`text-[10px] mt-2 font-medium opacity-60 ${msg.sender === 'user' ? 'text-right' : 'text-left'
                                    }`}>
                                    {msg.timestamp}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start animate-in fade-in duration-300">
                        <div className="flex items-end space-x-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                <Bot size={16} />
                            </div>
                            <div className="px-5 py-3 bg-white border border-slate-100 rounded-2xl flex items-center space-x-1.5">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
                onSubmit={handleSend}
                className="p-4 bg-white border border-slate-200 rounded-b-3xl shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.05)]"
            >
                <div className="relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t.chatPlaceholder}
                        className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder:text-slate-400"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="absolute right-2 top-2 bottom-2 w-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 active:scale-95 group"
                    >
                        <Send size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                </div>
                <p className="text-[10px] text-center text-slate-400 mt-3 font-medium uppercase tracking-wider flex items-center justify-center space-x-1">
                    <Sparkles size={10} className="text-blue-500" />
                    <span>AI-generated responses. Always verify legal advice.</span>
                </p>
            </form>
        </div>
    );
};
