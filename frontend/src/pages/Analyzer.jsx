import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCloudUploadAlt, FaFilePdf, FaHistory, FaCheckCircle, 
  FaExclamationTriangle, FaChevronRight, FaDownload, 
  FaShieldAlt, FaListUl, FaSpinner, FaRobot, FaPaperPlane 
} from 'react-icons/fa';
import PageWrapper from '../components/PageWrapper';
import Card from '../components/Card';
import Button from '../components/Button';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import { useToast } from '../context/ToastContext';

const BASE_URL = "http://127.0.0.1:8000";

const Badge = ({ children, color = 'indigo' }) => {
  const colors = {
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    indigo: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${colors[color] || colors.indigo}`}>
      {children}
    </span>
  );
};

const Analyzer = () => {
  const [file, setFile] = useState(null);
  const [userProfile, setUserProfile] = useState("first_timer");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [activeTab, setActiveTab] = useState('summary');
  const [history, setHistory] = useState([]);
  
  // Doc Chatbot State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  const { addToast } = useToast();

  const loadingSteps = [
    "Uploading document...",
    "Extracting legal terminology...",
    "Scanning for risky clauses...",
    "Applying Indian law context...",
    "Finalizing AI summary..."
  ];

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/docs/legal/history/${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Failed to fetch history");
    }
  }, [sessionId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, chatLoading]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
    } else {
      addToast("Please upload a PDF file", "error");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setLoadingStep(0);
    setResults(null);
    setChatHistory([]);

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 3000);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_profile", userProfile);
    formData.append("session_id", sessionId);

    try {
      const response = await fetch(`${BASE_URL}/docs/legal/analyze`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Upload failed");
      
      const data = await response.json();
      setResults(data);
      addToast("Analysis complete!", "success");
      fetchHistory();
    } catch (err) {
      addToast("Analysis failed. Please try again.", "error");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  const handleDocChat = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = { role: "user", content: chatInput.trim() };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/docs/legal/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: userMsg.content,
          history: chatHistory.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) throw new Error("Chat failed");
      const data = await response.json();
      
      setChatHistory(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { 
        role: "assistant", 
        content: "⚠ I encountered an error while processing your request. Please try again." 
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const exportCurrentAnalysis = async () => {
    if (!results) return;
    setExportLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/docs/legal/export-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          final_summary: results.final_summary,
          risky_clauses: results.risky_clauses,
          doc_filename: results.doc_type || file?.name || "document.pdf"
        })
      });

      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `legal_report_${Date.now()}.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
      addToast("PDF downloaded!", "success");
    } catch (err) {
      addToast("Export failed. Try again.", "error");
    } finally {
      setExportLoading(false);
    }
  };

  const exportHistoryPDF = async (analysisId) => {
    setExportLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/docs/legal/history/${analysisId}/pdf`, {
        method: "GET"
      });

      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `legal_report_history_${analysisId}.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
      addToast("PDF downloaded!", "success");
    } catch (err) {
      addToast("Export failed. Try again.", "error");
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex p-4 bg-indigo-500/10 rounded-3xl text-indigo-400 mb-2"
          >
            <FaShieldAlt size={32} />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-tighter">
            Legal Doc Analyzer
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto font-medium">
            Upload any legal document to get a risk-mapped AI assessment instantly.
          </p>
        </div>

        {/* Upload Zone */}
        {!results && !loading && (
          <Card className="max-w-3xl mx-auto p-12">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <div className="relative w-32 h-32 bg-white/5 border-2 border-dashed border-white/10 rounded-full flex items-center justify-center text-indigo-400">
                <FaCloudUploadAlt size={48} />
              </div>
              
              <div className="w-full max-w-md space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {["first_timer", "legal_professional"].map(profile => (
                    <button
                      key={profile}
                      onClick={() => setUserProfile(profile)}
                      className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        userProfile === profile ? "bg-indigo-600 border-transparent text-white" : "bg-white/5 border-white/10 text-gray-500 hover:border-indigo-500/50"
                      }`}
                    >
                      {profile.replace("_", " ")}
                    </button>
                  ))}
                </div>

                <label className="flex items-center justify-center w-full h-16 border-2 border-white/10 border-dashed rounded-2xl cursor-pointer hover:bg-white/5 transition-all group">
                  <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors uppercase tracking-widest">
                    {file ? file.name : "Choose PDF Document"}
                  </span>
                  <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                </label>

                <Button fullWidth onClick={handleUpload} disabled={!file}>
                  ANALYZE DOCUMENT
                </Button>
              </div>
            </div>
            
            {/* Quick History Preview */}
            {history.length > 0 && (
              <div className="mt-12 pt-8 border-t border-white/5">
                <div className="flex items-center justify-between mb-4 px-2">
                   <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Recent History</h4>
                   <button onClick={() => setActiveTab('history')} className="text-[10px] font-black text-indigo-400 hover:text-white uppercase tracking-widest">View All</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {history.slice(0, 2).map((item, i) => (
                     <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between group">
                        <div className="flex items-center space-x-3">
                           <FaFilePdf className="text-gray-600 group-hover:text-indigo-400 transition-colors" />
                           <span className="text-xs font-bold text-gray-400 truncate max-w-[120px]">{item.filename}</span>
                        </div>
                        <button onClick={() => exportHistoryPDF(item.id)} className="p-2 text-gray-600 hover:text-indigo-400"><FaDownload size={12} /></button>
                     </div>
                   ))}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Loading Progress */}
        {loading && (
          <Card className="max-w-2xl mx-auto p-12 text-center space-y-10">
            <Loader size="lg" />
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-indigo-400 tracking-tight">{loadingSteps[loadingStep]}</h3>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Results View */}
        {results && (
          <div className="space-y-12 stagger-in max-w-5xl mx-auto">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/5 rounded-2xl text-indigo-400 border border-white/10">
                  <FaFilePdf size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white leading-none mb-2">Analysis Result</h2>
                  <div className="flex items-center space-x-3">
                    <Badge color={results.final_summary.severity === 'high' ? 'red' : results.final_summary.severity === 'medium' ? 'amber' : 'green'}>
                      {results.final_summary.severity.toUpperCase()} RISK
                    </Badge>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{results.doc_type}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={exportCurrentAnalysis}
                  disabled={exportLoading}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all flex items-center space-x-2"
                >
                  {exportLoading ? <FaSpinner className="animate-spin" /> : <FaDownload />}
                  <span>Export Report</span>
                </button>
                <Button variant="secondary" onClick={() => { setResults(null); setFile(null); setChatHistory([]); }}>
                  Analyze New
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 p-1 bg-white/5 rounded-2xl max-w-md mx-auto border border-white/10">
              {['summary', 'clauses', 'history'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === tab ? "bg-indigo-600 text-white shadow-lg" : "text-gray-500 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
               {activeTab === 'summary' && (
                 <motion.div key="summary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
                    <Card className="p-10 space-y-10 border-t-4 border-t-indigo-500">
                       <div className="space-y-4">
                          <h3 className="text-indigo-400 text-xs font-black uppercase tracking-widest">Legal Verdict</h3>
                          <p className="text-3xl font-black text-white leading-tight">{results.final_summary.one_line_verdict}</p>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                          <div className="space-y-6">
                             <div className="space-y-2">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Document Nature</h4>
                                <p className="text-gray-300 font-medium">{results.final_summary.what_is_it}</p>
                             </div>
                             <div className="space-y-2">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Simple Explanation</h4>
                                <p className="text-gray-400 font-medium leading-relaxed">{results.final_summary.simple_summary}</p>
                             </div>
                          </div>

                          <div className="space-y-8">
                             <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center"><FaExclamationTriangle className="mr-2"/> Red Flags</h4>
                                <div className="space-y-2">
                                   {results.final_summary.red_flags.map((flag, i) => (
                                     <div key={i} className="text-sm font-bold text-gray-300 bg-red-500/5 border border-red-500/10 p-3 rounded-xl">{flag}</div>
                                   ))}
                                </div>
                             </div>
                             <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-green-400 uppercase tracking-widest flex items-center"><FaCheckCircle className="mr-2"/> Action Items</h4>
                                <div className="space-y-2">
                                   {results.final_summary.action_items.map((item, i) => (
                                     <div key={i} className="text-sm font-bold text-gray-300 bg-green-500/5 border border-green-500/10 p-3 rounded-xl">{item}</div>
                                   ))}
                                </div>
                             </div>
                          </div>
                       </div>
                    </Card>

                    {/* Document Chatbot Panel */}
                    <Card className="p-0 overflow-hidden border-indigo-500/30 shadow-[0_0_50px_rgba(79,70,229,0.1)]">
                       <div className="p-6 bg-indigo-600/10 border-b border-white/10 flex items-center justify-between">
                          <div>
                             <h3 className="text-lg font-black text-white flex items-center">
                                <FaRobot className="mr-2 text-indigo-400" /> Ask About This Document
                             </h3>
                             <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">AI assistant trained on your specific file</p>
                          </div>
                       </div>

                       <div className="h-[400px] overflow-y-auto p-6 space-y-6 bg-black/20">
                          {chatHistory.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                               <FaListUl size={32} className="text-gray-600" />
                               <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">No messages yet. Ask me something!</p>
                            </div>
                          ) : (
                            chatHistory.map((msg, i) => (
                              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                 <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${
                                   msg.role === 'user' 
                                   ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg' 
                                   : 'bg-white/5 text-gray-200 border border-white/10 rounded-tl-none'
                                 }`}>
                                    {msg.content}
                                 </div>
                              </div>
                            ))
                          )}
                          {chatLoading && (
                            <div className="flex justify-start">
                               <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center space-x-3">
                                  <div className="flex space-x-1">
                                     <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 bg-indigo-500 rounded-full" />
                                     <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-indigo-500 rounded-full" />
                                     <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-indigo-500 rounded-full" />
                                  </div>
                               </div>
                            </div>
                          )}
                          <div ref={chatEndRef} />
                       </div>

                       <div className="p-4 bg-white/[0.02] border-t border-white/10">
                          <div className="relative flex items-center gap-3">
                             <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleDocChat()}
                                placeholder="Ask questions about your document..."
                                className="flex-1 bg-black/40 border border-white/10 rounded-xl py-3 px-5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                             />
                             <button
                                onClick={handleDocChat}
                                disabled={!chatInput.trim() || chatLoading}
                                className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all disabled:opacity-50"
                             >
                                <FaPaperPlane size={14} />
                             </button>
                          </div>
                       </div>
                    </Card>
                 </motion.div>
               )}

               {activeTab === 'clauses' && (
                 <motion.div key="clauses" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                    <h3 className="text-xl font-black text-white px-4">Flagged Clauses ({results.risky_clauses.length})</h3>
                    <div className="grid grid-cols-1 gap-6">
                       {results.risky_clauses.map((clause, idx) => (
                         <Card key={idx} className={`p-8 border-l-4 ${clause.risk_level === 'high' ? 'border-l-red-500' : clause.risk_level === 'medium' ? 'border-l-amber-500' : 'border-l-green-500'}`}>
                            <div className="space-y-6">
                               <div className="flex items-center justify-between">
                                  <Badge color={clause.risk_level === 'high' ? 'red' : clause.risk_level === 'medium' ? 'amber' : 'green'}>
                                     {clause.risk_level.toUpperCase()} RISK
                                  </Badge>
                                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{clause.category}</span>
                               </div>
                               
                               <blockquote className="p-4 bg-black/40 rounded-xl border border-white/5 text-sm text-gray-400 italic">
                                  "{clause.clause}"
                               </blockquote>

                               <div className="space-y-2">
                                  <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Reasoning</h4>
                                  <p className="text-sm font-medium text-gray-300">{clause.reason}</p>
                               </div>
                            </div>
                         </Card>
                       ))}
                    </div>
                 </motion.div>
               )}

               {activeTab === 'history' && (
                 <motion.div key="history" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
                    {history.length > 0 ? (
                      history.map((record, idx) => (
                        <div 
                          key={record.id} 
                          className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:bg-white/10 hover:border-indigo-500/30 transition-all"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                              <FaFilePdf size={20} />
                            </div>
                            <div>
                              <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors">{record.filename}</h4>
                              <div className="flex items-center space-x-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                <span className="capitalize">{record.doc_type}</span>
                                <span>•</span>
                                <span>{new Date(record.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
                            <Badge color={record.severity === 'high' ? 'red' : record.severity === 'medium' ? 'amber' : 'green'}>
                              {record.severity.toUpperCase()}
                            </Badge>
                            <button 
                              onClick={() => exportHistoryPDF(record.id)}
                              disabled={exportLoading}
                              className="p-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-indigo-400 rounded-xl border border-white/10 transition-all"
                              title="Download PDF"
                            >
                              <FaDownload size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <EmptyState icon={FaHistory} title="No History Found" description="Your analyzed documents will appear here for future reference." />
                    )}
                 </motion.div>
               )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Analyzer;
