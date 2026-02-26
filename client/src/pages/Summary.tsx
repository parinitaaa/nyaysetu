import { useState } from 'react';
import { FileText, MessageSquare, Shield, AlertCircle, Share2, Download, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { mockDocumentData } from '../services/mockDocument';

export const Summary = () => {
    const { currentDocument } = useAppContext();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'short' | 'detailed' | 'plain'>('short');

    if (!currentDocument) {
        return (
            <div className="text-center py-20 space-y-6">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="text-slate-400 w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">No Document Selected</h2>
                <p className="text-slate-600 max-w-md mx-auto">Please upload a document first to see its analysis here.</p>
                <Link to="/upload" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-xl font-bold">Go to Upload</Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{currentDocument.name}</h1>
                        <p className="text-sm text-slate-500">Analyzed on {currentDocument.date}</p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"><Share2 size={18} /></button>
                    <button className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"><Download size={18} /></button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Tabs */}
                    <div className="bg-white p-1 rounded-2xl border border-slate-200 flex space-x-1">
                        {(['short', 'detailed', 'plain'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === tab
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                    : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)} Summary
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="glass-card rounded-3xl p-8 border border-slate-100 min-h-[300px]">
                        <p className="text-slate-700 leading-relaxed text-lg italic">
                            {activeTab === 'short' && mockDocumentData.shortSummary}
                            {activeTab === 'detailed' && mockDocumentData.detailedSummary}
                            {activeTab === 'plain' && mockDocumentData.plainEnglish}
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                        <Shield className="text-blue-600" size={20} />
                        <span>Important Clauses</span>
                    </h3>
                    <div className="space-y-4">
                        {mockDocumentData.importantClauses.map((clause, idx) => (
                            <div key={idx} className="p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 transition-all shadow-sm">
                                <h4 className="font-bold text-slate-900 mb-1">{clause.title}</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">{clause.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-4">
                        <h4 className="font-bold flex items-center space-x-2">
                            <AlertCircle size={18} className="text-blue-400" />
                            <span>Doubtful about a clause?</span>
                        </h4>
                        <p className="text-sm text-slate-400">Ask our AI Chatbot to explain specific parts of this document in your regional language.</p>
                        <button
                            onClick={() => navigate('/chatbot')}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold flex items-center justify-center space-x-2 transition-colors"
                        >
                            <MessageSquare size={18} />
                            <span>Chat with AI</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
