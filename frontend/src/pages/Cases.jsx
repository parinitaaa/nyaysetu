import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, FaFilter, FaHistory, FaGavel, 
  FaChevronRight, FaClock, FaBalanceScale, FaSpinner,
  FaChevronDown, FaChevronUp, FaExternalLinkAlt
} from 'react-icons/fa';
import PageWrapper from '../components/PageWrapper';
import Card from '../components/Card';
import Button from '../components/Button';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';

const BASE_URL = "http://127.0.0.1:8000";

const Cases = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setResults(null);
    setError(null);
    setExpandedIdx(null);

    const body = {
      query: query,
      case_number: "",
      court_doctypes: "",
      fromdate: "", // DD-MM-YYYY format expected if provided
      todate: "",
      title: "",
      cite: "",
      page: 0,
      max_results: 5,
      mode: "exact_first",
      enrich: true
    };

    try {
      const res = await axios.post(`${BASE_URL}/cases/cases/search`, body);
      setResults(res.data);
      if (res.data.results && res.data.results.length > 0) {
        addToast(`Found ${res.data.results_count}`, 'success');
      } else {
        addToast('No matching cases found', 'info');
      }
    } catch (err) {
      setError("Legal database is currently unreachable. Please check your connection.");
      addToast('Search failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (idx) => {
    setExpandedIdx(expandedIdx === idx ? null : idx);
  };

  return (
    <PageWrapper>
      <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex p-4 bg-indigo-500/10 rounded-3xl text-indigo-400 mb-2"
          >
            <FaGavel size={32} />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-tighter">
            Indian Case Search
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto font-medium">
            Access millions of Indian court judgments and legal precedents instantly.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto">
          <Card className="p-4 shadow-2xl group focus-within:border-indigo-500/50 transition-all duration-500">
            <form onSubmit={handleSearch} className="flex items-center gap-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by keyword, case name, or citation..."
                  className="w-full bg-transparent border-none text-white focus:ring-0 pl-12 py-3 font-medium placeholder:text-gray-600"
                />
              </div>
              <Button type="submit" disabled={loading} className="px-8">
                {loading ? <FaSpinner className="animate-spin" /> : "SEARCH"}
              </Button>
            </form>
          </Card>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold text-center">
              {error}
            </motion.div>
          )}
        </div>

        {/* Results */}
        <AnimatePresence>
          {loading ? (
            <div className="space-y-6 max-w-4xl mx-auto">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-48 w-full rounded-[2.5rem]" />
              ))}
            </div>
          ) : results && results.results && results.results.length > 0 ? (
            <div className="space-y-8 stagger-in max-w-5xl mx-auto">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold text-white">Search Results ({results.results_count})</h2>
                <div className="flex items-center space-x-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  <FaFilter /> <span>Most Relevant</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {results.results.map((c, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="h-full"
                  >
                    <Card className="h-full group hover:bg-white/[0.07] transition-all duration-500 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="space-y-6">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-md text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                                {Math.round(c.similarity_score * 100)}% MATCH
                              </span>
                              <div className="flex items-center text-gray-500 text-[10px] font-black uppercase tracking-widest">
                                <FaBalanceScale className="mr-1" /> Precedent
                              </div>
                            </div>
                            <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors leading-tight">
                              {c.case_title}
                            </h3>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Court</div>
                            <div className="text-sm font-bold text-gray-400">{c.court || 'Supreme Court of India'}</div>
                          </div>
                        </div>

                        <p className="text-gray-500 text-base font-medium line-clamp-3 leading-relaxed">
                          {c.snippet}
                        </p>

                        {c.verdict && (
                          <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                             <p className="text-xs font-bold text-indigo-300 italic">{c.verdict}</p>
                          </div>
                        )}

                        {/* Summary Accordion */}
                        {c.summary && (
                          <div className="border-t border-white/5 pt-4">
                            <button 
                              onClick={() => toggleExpand(idx)}
                              className="flex items-center justify-between w-full text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors"
                            >
                              <span>AI GENERATED SUMMARY</span>
                              {expandedIdx === idx ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                            
                            <AnimatePresence>
                              {expandedIdx === idx && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="pt-6 space-y-6 text-sm font-medium">
                                    <div className="space-y-2">
                                      <h4 className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">The Facts</h4>
                                      <p className="text-gray-400">{c.summary.facts}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                      <div className="space-y-2">
                                        <h4 className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Petitioner Arguments</h4>
                                        <p className="text-gray-400">{c.summary.arguments_petitioner}</p>
                                      </div>
                                      <div className="space-y-2">
                                        <h4 className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Respondent Arguments</h4>
                                        <p className="text-gray-400">{c.summary.arguments_respondent}</p>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <h4 className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Court Reasoning</h4>
                                      <p className="text-gray-400">{c.summary.reasoning}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {c.summary.key_sections.map((s, i) => (
                                        <span key={i} className="px-2 py-1 bg-white/5 rounded-md text-[10px] text-gray-500">Act {s}</span>
                                      ))}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                          <div className="flex space-x-2">
                            {['Judicial', 'Precedent'].map(tag => (
                              <span key={tag} className="text-[10px] text-gray-600 font-bold px-2 py-1 bg-white/5 rounded-md">{tag}</span>
                            ))}
                          </div>
                          <a
                            href={c.public_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-indigo-400 hover:text-white text-xs font-black uppercase tracking-widest transition-colors group/link"
                          >
                            <span>Read Full Case</span>
                            <FaChevronRight className="ml-2 group-hover/link:translate-x-2 transition-transform" />
                          </a>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : results && results.results && results.results.length === 0 ? (
            <EmptyState 
              icon={FaSearch}
              title="No results found"
              description={`We couldn't find any cases matching "${query}". Try different keywords or specific citations.`}
              actionText="Clear Search"
              onAction={() => { setQuery(''); setResults(null); }}
            />
          ) : (
            <div className="max-w-2xl mx-auto py-24 text-center space-y-8">
              <div className="p-10 bg-white/5 border border-dashed border-white/10 rounded-[3rem] space-y-6">
                <FaHistory className="mx-auto text-gray-700" size={64} />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-500">Legal History at your fingertips</h3>
                  <p className="text-gray-600 text-sm font-medium">Search through judgments from High Courts and the Supreme Court of India.</p>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};

export default Cases;
