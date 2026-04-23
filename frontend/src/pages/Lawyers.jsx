import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUserTie, FaMapMarkerAlt, FaChevronRight, 
  FaSpinner, FaBalanceScale, FaStar 
} from 'react-icons/fa';
import PageWrapper from '../components/PageWrapper';
import Card from '../components/Card';
import Button from '../components/Button';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';

const BASE_URL = "http://127.0.0.1:8000";

const Lawyers = () => {
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  const cities = ['Bangalore', 'Delhi', 'Mumbai', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'];
  const categories = ['Criminal', 'Civil', 'Family', 'Corporate', 'Property', 'Labour', 'Taxation', 'Consumer', 'Cyber', 'Immigration'];

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!city || !category) return;
    
    setLoading(true);
    setResults(null);
    setError(null);
    
    try {
      const res = await axios.post(`${BASE_URL}/lawyers/lawyers/search`, { city, category });
      setResults(res.data);
      if (res.data.total_found > 0) {
        addToast(`Found ${res.data.total_found} verified lawyers`, 'success');
      } else {
        addToast('No professionals found in this area', 'info');
      }
    } catch (err) {
      setError("Professional database is unreachable.");
      addToast('Search failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const parseRating = (ratingStr) => {
    // Contract: Parse "4.7 | 200+ user ratings"
    if (!ratingStr) return { score: 0, count: "No reviews" };
    const parts = ratingStr.split('|');
    const score = parseFloat(parts[0]) || 0;
    const count = parts[1] ? parts[1].trim() : "Reviews N/A";
    return { score, count };
  };

  const renderStars = (score) => {
    return (
      <div className="flex text-amber-500 space-x-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <FaStar key={s} size={10} className={s <= Math.round(score) ? 'fill-current' : 'text-gray-700'} />
        ))}
      </div>
    );
  };

  return (
    <PageWrapper>
      <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex p-4 bg-indigo-500/10 rounded-3xl text-indigo-400 mb-2"
          >
            <FaUserTie size={32} />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-tighter">
            Legal Professionals
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto font-medium">
            Connect with verified legal experts in your city for specific case needs.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto p-8 shadow-2xl">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Location</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer appearance-none"
              >
                <option value="">Select City</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Specialization</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer appearance-none"
              >
                <option value="">Select Practice Area</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="h-[58px]"
            >
              {loading ? <FaSpinner className="animate-spin" /> : "SEARCH LAWYERS"}
            </Button>
          </form>
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-black uppercase text-center tracking-widest">
              {error}
            </div>
          )}
        </Card>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-16 w-16 rounded-2xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {results && results.total_found === 0 && !loading && (
            <EmptyState 
              icon={FaUserTie}
              title="No professionals found"
              description={`We couldn't find any ${category} specialists in ${city} right now.`}
              actionText="Reset Search"
              onAction={() => { setCity(''); setCategory(''); setResults(null); }}
            />
          )}

          {results && results.total_found > 0 && (
            <div className="space-y-12 stagger-in">
              <h2 className="text-xl font-black text-white px-2 uppercase tracking-tight">
                Found {results.total_found} verified specialists in <span className="text-indigo-400">{city}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.lawyers.map((lawyer, idx) => {
                  const rating = parseRating(lawyer.rating);
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-[2.5rem] p-8 hover:border-indigo-500/50 hover:bg-white/[0.07] hover:scale-[1.02] transition-all duration-500 flex flex-col group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="flex items-center space-x-5 mb-6">
                        <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-white/10 flex-shrink-0 group-hover:border-indigo-500/50 transition-all duration-500">
                          <img
                            src={lawyer.image || 'https://via.placeholder.com/150'}
                            alt={lawyer.name}
                            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${lawyer.name}&background=6366f1&color=fff`; }}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-bold text-white truncate group-hover:text-indigo-400 transition-colors">{lawyer.name}</h3>
                          <div className="flex items-center text-gray-500 text-[10px] font-black uppercase tracking-widest space-x-1 mt-1">
                            <FaMapMarkerAlt className="text-indigo-500" /> <span className="truncate">{lawyer.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-6">
                        <div className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                          {lawyer.experience}
                        </div>
                        <div className="text-right">
                          {renderStars(rating.score)}
                          <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-1">{rating.count}</div>
                        </div>
                      </div>

                      <div className="mb-8 flex-1">
                        <div className="text-[10px] uppercase font-black text-gray-600 mb-3 tracking-widest">Expertise</div>
                        <div className="flex flex-wrap gap-2">
                          {lawyer.practice_area.split(',').map((area, i) => (
                            <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-bold text-gray-500">{area.trim()}</span>
                          ))}
                        </div>
                      </div>

                      <a
                        href={lawyer.profile_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 bg-indigo-600/10 group-hover:bg-indigo-600 text-white rounded-2xl text-center text-[10px] font-black uppercase tracking-widest transition-all border border-indigo-500/20 group-hover:border-transparent flex items-center justify-center space-x-2"
                      >
                        <span>View Official Profile</span> <FaChevronRight className="text-[8px] group-hover:translate-x-1 transition-transform" />
                      </a>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};

export default Lawyers;
