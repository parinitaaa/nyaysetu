import { Clock, FileText, ArrowRight, Calendar, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export const History = () => {
    const navigate = useNavigate();
    const { history, setCurrentDocument } = useAppContext();

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Analysis History</h1>
                    <p className="text-slate-500 font-medium">Review and re-access your previously analyzed documents.</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search history..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                    />
                </div>
            </div>

            {history.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {history.map((doc) => (
                        <div
                            key={doc.id}
                            onClick={() => {
                                setCurrentDocument(doc);
                                navigate('/summary');
                            }}
                            className="group bg-white p-6 border border-slate-100 rounded-3xl shadow-sm hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 transition-all cursor-pointer flex items-center space-x-6"
                        >
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                                <FileText size={28} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-bold text-slate-900 truncate mb-1">{doc.name}</h3>
                                <div className="flex items-center space-x-4 text-sm text-slate-500 font-medium">
                                    <div className="flex items-center space-x-1.5">
                                        <Calendar size={14} />
                                        <span>{doc.date}</span>
                                    </div>
                                    <div className="flex items-center space-x-1.5">
                                        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                        <span>{doc.type}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:flex items-center space-x-2 text-blue-600 font-bold text-sm bg-blue-50/0 group-hover:bg-blue-50 px-4 py-2 rounded-xl transition-all">
                                <span>View Summary</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                    <Clock className="mx-auto text-slate-300 mb-4" size={56} />
                    <h3 className="text-xl font-bold text-slate-900">Your history is empty</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mt-2">Start by uploading a document for analysis to see it tracked here.</p>
                    <button
                        onClick={() => navigate('/upload')}
                        className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100"
                    >
                        Analyze First Document
                    </button>
                </div>
            )}
        </div>
    );
};
