import { useState, useEffect } from 'react';
import { Shield, ChevronRight, HelpCircle, ExternalLink, ArrowLeft, Search, CheckCircle2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { mockRightsData } from '../services/mockRightsData';

export const Rights = () => {
    const { language, t } = useLanguage();
    const location = useLocation();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const currentData = mockRightsData[language as keyof typeof mockRightsData] || mockRightsData.en;
    const filteredData = currentData.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        // Handle navigation from Landing page with state
        if (location.state?.openLanguage) {
            const element = document.getElementById('lang-selector');
            element?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location]);

    const selectedRight = currentData.find(r => r.id === selectedId);

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold">
                    <Shield size={16} />
                    <span>Legal Awareness Initiative</span>
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900">{t.rightsTitle}</h1>
                <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                    Empowering citizens through knowledge. Explore simplified explanations of your fundamental legal rights in India.
                </p>
            </div>

            {!selectedId ? (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search categories (Consumer, Tenant...)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredData.map((right) => (
                            <div
                                key={right.id}
                                onClick={() => setSelectedId(right.id)}
                                className="group p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-blue-100 hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden"
                            >
                                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <HelpCircle className="text-blue-600 w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{right.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-2">{right.description}</p>
                                <div className="flex items-center text-blue-600 font-bold text-sm">
                                    View Details <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform -z-10"></div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500 max-w-4xl mx-auto">
                    <button
                        onClick={() => setSelectedId(null)}
                        className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 font-bold mb-8 transition-colors group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Categories</span>
                    </button>

                    {selectedRight && (
                        <div className="space-y-10">
                            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-bold text-slate-900">{selectedRight.title}</h2>
                                    <p className="text-xl text-slate-700 leading-relaxed font-medium">
                                        {selectedRight.description}
                                    </p>
                                </div>

                                <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl space-y-3">
                                    <h4 className="font-bold text-blue-900 flex items-center space-x-2">
                                        <CheckCircle2 size={18} />
                                        <span>Real-world Example</span>
                                    </h4>
                                    <p className="text-blue-800 leading-relaxed italic">
                                        "{selectedRight.example}"
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h3>
                                    <div className="space-y-4">
                                        {selectedRight.faqs.map((faq, idx) => (
                                            <details key={idx} className="group border border-slate-100 rounded-2xl bg-slate-50 open:bg-white transition-all">
                                                <summary className="p-5 font-bold text-slate-800 cursor-pointer list-none flex justify-between items-center">
                                                    {faq.question}
                                                    <ChevronRight size={18} className="group-open:rotate-90 transition-transform" />
                                                </summary>
                                                <div className="p-5 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-50 group-open:border-slate-100">
                                                    {faq.answer}
                                                </div>
                                            </details>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                    <p className="text-sm text-slate-500">Information verified by legal consultants.</p>
                                    <button className="flex items-center space-x-2 text-blue-600 font-bold hover:underline">
                                        <span>Official Gazette</span>
                                        <ExternalLink size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
