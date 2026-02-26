import React, { useState } from 'react';
import { Search as SearchIcon, Gavel, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { mockLawSections } from '../services/mockLawSections';

export const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<typeof mockLawSections>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        // Simulate lookup delay
        setTimeout(() => {
            const filtered = mockLawSections.filter(s =>
                s.id.includes(query) ||
                s.title.toLowerCase().includes(query.toLowerCase()) ||
                s.description.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered);
            setIsSearching(false);
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold text-slate-900">BNS / BSB Search</h1>
                <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                    Search through the Bharatiya Nyaya Sanhita (BNS) and BSB sections instantly using keywords or section numbers.
                </p>
            </div>

            <div className="glass-card rounded-[2.5rem] p-4 border border-slate-100 shadow-2xl shadow-blue-50/50">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                        <input
                            type="text"
                            placeholder="e.g., 420, Cheating, Murder, Cruelty..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-lg font-medium"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSearching}
                        className="md:w-40 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50"
                    >
                        {isSearching ? <Loader2 className="animate-spin" /> : <span>Find Section</span>}
                    </button>
                </form>
            </div>

            <div className="space-y-6">
                {results.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {results.map((section) => (
                            <div key={section.id} className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:border-blue-200 transition-all space-y-4 group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                            <Gavel size={20} />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                            {section.title}
                                        </h3>
                                    </div>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">SECTION {section.id}</span>
                                </div>
                                <p className="text-slate-600 leading-relaxed text-lg italic">
                                    "{section.description}"
                                </p>
                                <div className="pt-4 flex items-center space-x-4 border-t border-slate-50">
                                    <button className="text-sm font-bold text-blue-600 flex items-center hover:underline">
                                        Full Interpretation <ArrowRight size={14} className="ml-1" />
                                    </button>
                                    <button className="text-sm font-bold text-slate-400 flex items-center hover:underline">
                                        Related Precedents
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : !isSearching && query && (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <AlertCircle className="mx-auto text-slate-300 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-slate-400">No sections found for "{query}"</h3>
                        <p className="text-slate-400 text-sm">Try searching for common numbers like 420 or terms like "cheating".</p>
                    </div>
                )}
            </div>
        </div>
    );
};
