import { useState, useRef, useEffect } from "react";
import PageWrapper from "../components/PageWrapper";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { FaFileUpload, FaBalanceScale } from "react-icons/fa";

function LegalAnalyzer() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [profile, setProfile] = useState("first_timer");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please upload a document first.");
      return;
    }

    setError("");
    setLoading(true);
    setAnalysis(null);
    setMessages([]);

    const newSessionId = Date.now().toString();
    setSessionId(newSessionId);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("user_profile", profile);
      formData.append("session_id", newSessionId);

      const response = await fetch(
        "http://localhost:8000/legal/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError("Something went wrong while analyzing the document.");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setChatLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/legal/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            message: input,
            history: updatedMessages,
          }),
        }
      );

      const data = await response.json();

      const assistantMessage = {
        role: "assistant",
        content: data.response || "No response received.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error connecting to AI." },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto space-y-10">

          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
                <FaBalanceScale className="text-white text-2xl" />
              </div>
            </div>
            <h1 className="text-3xl font-semibold text-gray-900">
              Legal Document Analyzer
            </h1>
            <p className="text-gray-600">
              Upload your legal document and receive AI-powered analysis.
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6">
            <div>
              <label className="block font-medium mb-2">
                Upload Document (PDF or DOCX)
              </label>
              <div className="border-2 border-dashed border-indigo-300 rounded-xl p-6 text-center hover:border-indigo-500 transition">
                <FaFileUpload className="mx-auto text-indigo-500 text-2xl mb-3" />
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="block mx-auto"
                />
                {selectedFile && (
                  <p className="mt-3 text-sm text-gray-600">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2">
                Select Your Profile
              </label>
              <select
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="first_timer">First Timer</option>
                <option value="student">Student</option>
                <option value="business">Business</option>
                <option value="senior">Senior</option>
              </select>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button variant="primary" fullWidth onClick={handleAnalyze}>
              Analyze Document
            </Button>
          </div>

          {loading && (
            <div className="flex justify-center">
              <Loader />
            </div>
          )}

          {/* Summary */}
          {analysis && !loading && (
            <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold capitalize">
                  {analysis.doc_type.replace("_", " ")}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    analysis.final_summary.severity === "high"
                      ? "bg-red-100 text-red-600"
                      : analysis.final_summary.severity === "medium"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {analysis.final_summary.severity.toUpperCase()}
                </span>
              </div>

              <p>{analysis.final_summary.simple_summary}</p>

              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                <p className="text-indigo-700 font-medium">
                  {analysis.final_summary.one_line_verdict}
                </p>
              </div>
            </div>
          )}

          {/* Chat Section */}
          {analysis && (
            <div className="bg-white shadow-xl rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-semibold">
                Ask Questions About This Document
              </h3>

              <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-xl max-w-xs text-sm ${
                        msg.role === "user"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-800 shadow"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="text-gray-500 text-sm">
                    AI is typing...
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about this document..."
                  className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
                <Button variant="primary" onClick={handleSend}>
                  Send
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

export default LegalAnalyzer;