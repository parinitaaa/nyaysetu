import { useState, useRef, useEffect } from "react";
import { askQuestion } from "../api/chatbotApi";
import PageWrapper from "../components/PageWrapper";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaUser, FaPaperPlane } from "react-icons/fa";

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-2">
      <motion.div
        className="w-2 h-2 bg-indigo-400 rounded-full"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
      />
      <motion.div
        className="w-2 h-2 bg-indigo-400 rounded-full"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div
        className="w-2 h-2 bg-indigo-400 rounded-full"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  );
}

function LoadingShimmer() {
  return (
    <div className="bg-white rounded-2xl px-5 py-3 shadow-lg border border-gray-100">
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded-full w-3/4 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded-full w-full animate-pulse" />
        <div className="h-3 bg-gray-200 rounded-full w-5/6 animate-pulse" />
      </div>
    </div>
  );
}

function Chatbot() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    "What are tenant rights?",
    "How to file a PIL?",
    "Consumer complaint process",
  ];

  // Smooth auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handlePromptClick = (prompt) => {
    setQuestion(prompt);
    inputRef.current?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    const userMessage = question.trim();
    setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await askQuestion(userMessage);
      const botText =
        typeof response === "string" ? response : response.answer || response;

      setMessages((prev) => [
        ...prev,
        { type: "bot", text: botText },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Check if previous message is from same sender
  const isConsecutiveMessage = (index) => {
    if (index === 0) return false;
    return messages[index].type === messages[index - 1].type;
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 pt-20 md:pt-24 pb-4 md:pb-8">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-12 h-[calc(100vh-5rem)] md:h-[calc(100vh-8rem)] flex flex-col">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 md:mb-6"
          >
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <FaRobot className="text-white text-lg md:text-xl" />
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                AI Legal Assistant
              </h1>
            </div>
            <p className="text-sm md:text-base text-gray-600">
              Ask any legal question and get instant guidance
            </p>
          </motion.div>

          {/* Chat Container */}
          <div className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col border border-gray-100 min-h-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-gray-50 to-white">
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 md:py-16"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaRobot className="text-indigo-600 text-2xl md:text-3xl" />
                  </div>
                  <p className="text-base md:text-lg text-gray-600 mb-4 md:mb-6 px-4">
                    Start a conversation by asking a legal question
                  </p>
                  {/* Suggested Prompts */}
                  <div className="flex flex-wrap justify-center gap-2 px-4">
                    {suggestedPrompts.map((prompt, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handlePromptClick(prompt)}
                        className="px-3 md:px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs md:text-sm font-medium hover:bg-indigo-100 transition-colors border border-indigo-200 touch-manipulation min-h-[36px]"
                      >
                        {prompt}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-2 md:gap-3 ${
                      msg.type === "user" ? "justify-end" : "justify-start"
                    } ${isConsecutiveMessage(index) ? "mt-1" : "mt-3 md:mt-4"}`}
                  >
                    {msg.type === "bot" && (
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <FaRobot className="text-indigo-600 text-xs md:text-sm" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] rounded-2xl px-4 md:px-5 py-2.5 md:py-3 shadow-lg ${
                        msg.type === "user"
                          ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white"
                          : "bg-white text-gray-800 border border-gray-100"
                      }`}
                    >
                      <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {msg.text}
                      </p>
                    </div>
                    {msg.type === "user" && (
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <FaUser className="text-indigo-600 text-xs md:text-sm" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2 md:gap-3 justify-start mt-3 md:mt-4"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <FaRobot className="text-indigo-600 text-xs md:text-sm" />
                  </div>
                  <LoadingShimmer />
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar with Suggested Prompts */}
            <div className="border-t border-gray-200 bg-white">
              {/* Suggested Prompt Chips */}
              {messages.length > 0 && question.length === 0 && (
                <div className="px-3 md:px-4 pt-2 md:pt-3 pb-2 flex flex-wrap gap-2">
                  {suggestedPrompts.map((prompt, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handlePromptClick(prompt)}
                      className="px-2.5 md:px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium hover:bg-indigo-100 transition-colors border border-indigo-200 touch-manipulation min-h-[32px]"
                    >
                      {prompt}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="p-3 md:p-4">
                <div className="flex gap-2 md:gap-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a legal question..."
                    disabled={loading}
                    className="flex-1 px-4 md:px-5 py-3 md:py-3.5 rounded-full bg-gray-50 border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base min-h-[44px]"
                  />
                  <motion.button
                    type="submit"
                    disabled={!question.trim() || loading}
                    whileHover={!question.trim() || loading ? {} : { scale: 1.05 }}
                    whileTap={!question.trim() || loading ? {} : { scale: 0.95 }}
                    className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white px-4 md:px-6 py-3 md:py-3.5 rounded-full font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:shadow-glow shadow-lg touch-manipulation min-h-[44px] min-w-[44px]"
                  >
                    <FaPaperPlane className="text-sm md:text-base" />
                    <span className="hidden sm:inline">Send</span>
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Chatbot;
