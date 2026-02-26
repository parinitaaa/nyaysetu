import { useState } from 'react';
import { Search, MapPin, Star, Phone, MessageCircle, Filter, ArrowRight } from 'lucide-react';
import { mockLawyers } from '../services/mockLawyers';

export const Lawyers = () => {
    const [city, setCity] = useState('');
    const [filteredLawyers, setFilteredLawyers] = useState(mockLawyers);

    const handleFilter = (query: string) => {
        setCity(query);
        const filtered = mockLawyers.filter(l =>
            l.city.toLowerCase().includes(query.toLowerCase()) ||
            l.specialization.toLowerCase().includes(query.toLowerCase()) ||
            l.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredLawyers(filtered);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Legal Directory</h1>
                    <p className="text-slate-600 text-lg">Find and connect with top legal professionals across India.</p>
                </div>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Type city or name (e.g., Mumbai)..."
                        value={city}
                        onChange={(e) => handleFilter(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-slate-500 font-bold uppercase tracking-wider">
                <Filter size={14} />
                <span>Browsing {filteredLawyers.length} verified professionals</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredLawyers.map((lawyer) => (
                    <div
                        key={lawyer.id}
                        className="group glass-card rounded-[2.5rem] p-8 border border-slate-100 hover:border-blue-200 transition-all hover:shadow-2xl hover:shadow-blue-100/50"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                {lawyer.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex items-center space-x-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold">
                                <Star size={12} fill="currentColor" />
                                <span>{lawyer.rating}</span>
                            </div>
                        </div>

                        <div className="space-y-2 mb-8">
                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{lawyer.name}</h3>
                            <div className="flex items-center text-slate-500 text-sm space-x-4">
                                <div className="flex items-center space-x-1 font-medium">
                                    <MapPin size={14} />
                                    <span>{lawyer.city}</span>
                                </div>
                                <div className="flex items-center space-x-1 font-medium">
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <span>{lawyer.specialization}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                disabled
                                className="py-3 bg-slate-100 text-slate-400 rounded-xl font-bold text-sm flex items-center justify-center cursor-not-allowed"
                            >
                                <Phone size={14} className="mr-2" /> Call
                            </button>
                            <button
                                disabled
                                className="py-3 bg-slate-100 text-slate-400 rounded-xl font-bold text-sm flex items-center justify-center cursor-not-allowed group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors"
                            >
                                <MessageCircle size={14} className="mr-2" /> Message
                            </button>
                        </div>

                        <button className="mt-4 w-full flex items-center justify-center space-x-2 text-slate-400 text-xs font-bold hover:text-blue-600 transition-colors py-2">
                            <span>View Profile & Experience</span>
                            <ArrowRight size={12} />
                        </button>
                    </div>
                ))}
            </div>

            {filteredLawyers.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-slate-400 font-medium">No legal professionals found in your selected area.</p>
                </div>
            )}
        </div>
    );
};
