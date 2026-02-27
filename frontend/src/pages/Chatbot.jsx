import { useState, useRef, useEffect } from "react";
import { askQuestion } from "../api/chatbotApi";

function Chatbot() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setMessages((prev) => [...prev, { type: "user", text: question }]);
    setQuestion("");
    setLoading(true);

    const response = await askQuestion(question);

    const botText =
      typeof response === "string"
        ? response
        : response.answer;

    setMessages((prev) => [
      ...prev,
      { type: "bot", text: botText },
    ]);

    setLoading(false);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto flex flex-col h-[80vh]">

      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        AI Legal Assistant
      </h1>

      <div className="flex-1 bg-white shadow-md border border-blue-100 rounded-2xl p-4 overflow-y-auto space-y-4">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[75%] p-3 rounded-xl ${
              msg.type === "user"
                ? "bg-blue-600 text-white ml-auto"
                : "bg-slate-100 text-slate-800"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="bg-slate-100 p-3 rounded-xl w-fit">
            Thinking...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-4 flex gap-3"
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a legal question..."
          className="flex-1 p-3 rounded-xl bg-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-semibold transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chatbot;