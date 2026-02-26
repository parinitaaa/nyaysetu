import { FileText, Shield, ArrowRight, MessageSquare, Plus, Activity, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export const Dashboard = () => {
    const navigate = useNavigate();
    const { history, setCurrentDocument } = useAppContext();

    const stats = [
        { label: 'Analyzed', value: history.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Flags Found', value: 12, icon: Shield, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Chat Sessions', value: 8, icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-50' },
    ];

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-500 font-medium">Welcome back! Here's what's happening with your legal cases.</p>
                </div>
                <button
                    onClick={() => navigate('/upload')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center space-x-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                >
                    <Plus size={20} />
                    <span>New Analysis</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="glass-card rounded-3xl p-6 border border-slate-100 flex items-center space-x-4 shadow-sm">
                        <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                            <h4 className="text-2xl font-black text-slate-900">{stat.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Cases */}
                <div className="glass-card rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                            <Activity className="text-blue-600" size={20} />
                            <span>Recent Activity</span>
                        </h3>
                        <button onClick={() => navigate('/history')} className="text-sm font-bold text-blue-600 hover:underline">View All</button>
                    </div>

                    <div className="space-y-4">
                        {history.map((doc) => (
                            <div
                                key={doc.id}
                                onClick={() => {
                                    setCurrentDocument(doc);
                                    navigate('/summary');
                                }}
                                className="group flex items-center p-4 bg-slate-50 hover:bg-white border border-transparent hover:border-blue-100 rounded-2xl transition-all cursor-pointer hover:shadow-lg hover:shadow-blue-50/50"
                            >
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                                    <FileText size={20} />
                                </div>
                                <div className="ml-4 flex-1">
                                    <h4 className="font-bold text-slate-900 line-clamp-1">{doc.name}</h4>
                                    <p className="text-xs text-slate-500">{doc.date} • {doc.type}</p>
                                </div>
                                <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Tips or AI Insight */}
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-8 relative overflow-hidden">
                    <div className="space-y-4 relative z-10">
                        <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                            <Shield size={14} />
                            <span>AI Tip of the Day</span>
                        </div>
                        <h3 className="text-2xl font-bold leading-snug">Always verify the "Effective Date" in rental agreements.</h3>
                        <p className="text-slate-400 leading-relaxed font-medium">
                            Legal obligations usually begin from the Effective Date, not necessarily the Signing Date. Ensure these align with your actual occupancy.
                        </p>
                        <button className="pt-4 flex items-center space-x-2 text-blue-400 font-bold text-sm hover:underline">
                            <span>Read Full Legal Guide</span>
                            <ArrowRight size={14} />
                        </button>
                    </div>

                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600 rounded-full blur-[80px] opacity-20 -mr-24 -mt-24"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-600 rounded-full blur-[60px] opacity-20 -ml-16 -mb-16"></div>

                    <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center">
                            <CheckCircle2 size={20} />
                        </div>
                        <p className="text-xs text-slate-300 font-medium">Your account is 100% secure and data is encrypted locally.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
