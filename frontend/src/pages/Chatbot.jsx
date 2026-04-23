import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaRobot, FaPaperPlane, FaSpinner, 
  FaCopy, FaCheck, FaTrash, FaBalanceScale, FaExclamationCircle 
} from 'react-icons/fa';
import PageWrapper from '../components/PageWrapper';
import Card from '../components/Card';
import { useToast } from '../context/ToastContext';

const BASE_URL = "http://127.0.0.1:8000";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm NyaySetu AI. Ask me any legal question and I will provide information based on Indian Law.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const chatEndRef = useRef(null);
  const { addToast } = useToast();

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessageText = input.trim();
    const userMsg = { 
      role: 'user', 
      content: userMessageText, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/chat`, {
        question: userMessageText
      });

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: res.data.answer, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'error', 
        content: "⚠ The AI assistant is temporarily unavailable. Please try again shortly.", 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
      addToast("AI Assistant unavailable", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast("Copied to clipboard!", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([{ 
      role: 'assistant', 
      content: "Chat cleared. Ask me something else!", 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }]);
  };

  return (
    <PageWrapper>
      <div className="min-h-screen pt-32 pb-6 px-4 md:px-8 max-w-5xl mx-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
              <FaRobot size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">NyaySetu AI</h1>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">General Legal Assistant • Stateless</p>
            </div>
          </div>
          <button 
            onClick={clearChat}
            className="p-3 bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-xl transition-all border border-white/10"
          >
            <FaTrash size={16} />
          </button>
        </div>

        {/* Chat Window */}
        <Card className="flex-1 flex flex-col p-0 overflow-hidden relative mb-4">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-500" />
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}
              >
                <div className={`max-w-[85%] md:max-w-[70%] space-y-2`}>
                  <div className={`flex items-center space-x-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                      {msg.role === 'user' ? 'User' : msg.role === 'error' ? 'System' : 'NyaySetu AI'} • {msg.timestamp}
                    </span>
                  </div>
                  
                  <div className={`relative p-4 md:p-5 rounded-[1.5rem] text-sm md:text-base leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : msg.role === 'error'
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20 rounded-tl-none'
                    : 'bg-white/5 text-gray-200 border border-white/10 rounded-tl-none'
                  }`}>
                    {msg.content}
                    
                    {msg.role === 'assistant' && (
                      <button 
                        onClick={() => copyToClipboard(msg.content, idx)}
                        className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 transition-all p-2 text-gray-600 hover:text-indigo-400"
                      >
                        {copiedId === idx ? <FaCheck className="text-green-500" /> : <FaCopy />}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-white/5 border border-white/10 p-5 rounded-[1.5rem] rounded-tl-none flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                  </div>
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">AI is thinking...</span>
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-6 bg-white/[0.02] border-t border-white/10">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about IPC sections, legal terms, or your rights..."
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="absolute right-2 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all disabled:opacity-50"
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default Chatbot;
