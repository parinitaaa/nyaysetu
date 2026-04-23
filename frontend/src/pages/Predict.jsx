import React, { useEffect, useState } from "react";
import axios from "axios";
import PageWrapper from "../components/PageWrapper";
import Card from "../components/Card";
import Button from "../components/Button";
import Loader from "../components/Loader";
import Skeleton from "../components/Skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { FaChartLine, FaExclamationTriangle, FaBalanceScale, FaSpinner } from "react-icons/fa";
import { useToast } from "../context/ToastContext";

const BASE_URL = "http://127.0.0.1:8000";

function AnimatedCounter({ value }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(value);
    if (isNaN(end)) return;
    
    let timer = setInterval(() => {
      start += 1;
      if (start >= end) {
        setDisplayValue(end.toFixed(1));
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, 15);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue}</span>;
}

const Predict = () => {
  const [options, setOptions] = useState(null);
  const [formData, setFormData] = useState({
    state: "",
    court_type: "",
    case_type: "",
    public_interest: "No"
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/options`);
        setOptions(res.data);
      } catch (err) {
        setError("Failed to load case categories from server.");
        addToast("Options loading failed", "error");
      } finally {
        setOptionsLoading(false);
      }
    };
    fetchOptions();
  }, [addToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);
    setError(null);

    try {
      const res = await axios.post(`${BASE_URL}/predict`, formData);
      // Contract: Response is nested under 'prediction'
      setPrediction(res.data.prediction);
      addToast("Case analysis complete!", "success");
    } catch (err) {
      setError("Prediction engine is currently unavailable.");
      addToast("Prediction failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-10">
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex p-4 bg-indigo-500/10 rounded-3xl text-indigo-400 mb-2"
            >
              <FaChartLine size={32} />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-tighter">
              Case Predictor
            </h1>
            <p className="text-gray-400 text-lg font-medium">
              Analyze likely court outcomes using historical data and AI pattern recognition.
            </p>
          </div>

          <Card className="p-8 md:p-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />
            
            {optionsLoading ? (
              <div className="space-y-8">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 gap-6">
                  {/* State Dropdown */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Judiciary State</label>
                    <select
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      required
                    >
                      <option value="">Select State</option>
                      {options?.states?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>

                  {/* Court Type */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Court Level</label>
                    <select
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
                      value={formData.court_type}
                      onChange={(e) => setFormData({ ...formData, court_type: e.target.value })}
                      required
                    >
                      <option value="">Select Court Type</option>
                      {options?.court_types?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>

                  {/* Case Type */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Legal Category</label>
                    <select
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
                      value={formData.case_type}
                      onChange={(e) => setFormData({ ...formData, case_type: e.target.value })}
                      required
                    >
                      <option value="">Select Case Type</option>
                      {options?.case_types?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>

                  {/* Public Interest */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Public Interest Litigation?</label>
                    <div className="grid grid-cols-2 gap-4">
                      {options?.public_interest?.map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setFormData({ ...formData, public_interest: opt })}
                          className={`py-4 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${
                            formData.public_interest === opt ? "bg-indigo-600 border-transparent text-white" : "bg-white/5 border-white/10 text-gray-500"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={loading} fullWidth className="py-5">
                  {loading ? <FaSpinner className="animate-spin mr-2" /> : "RUN PREDICTION"}
                </Button>
              </form>
            )}
            
            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center">
                {error}
              </div>
            )}
          </Card>
        </div>

        <div className="lg:sticky lg:top-32">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-[650px] flex flex-col items-center justify-center space-y-8 bg-white/5 border border-white/10 rounded-[3rem] text-center p-12"
              >
                <Loader size="lg" />
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-white uppercase tracking-widest">Processing Precedents</h3>
                  <p className="text-gray-500 text-sm max-w-xs font-medium">Scanning through 2M+ Indian court judgments for patterns...</p>
                </div>
              </motion.div>
            ) : prediction ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <Card className="p-12 text-center space-y-10 relative overflow-hidden border-t-4 border-t-indigo-500">
                  <div className="relative w-48 h-48 mx-auto">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="96" cy="96" r="88" fill="none" stroke="currentColor" strokeWidth="12" className="text-white/5" />
                      <motion.circle 
                        cx="96" cy="96" r="88" fill="none" stroke="currentColor" strokeWidth="12" 
                        strokeDasharray={553}
                        initial={{ strokeDashoffset: 553 }}
                        animate={{ strokeDashoffset: 553 - (553 * prediction.confidence) / 100 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="text-indigo-500"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-5xl font-black text-white"><AnimatedCounter value={prediction.confidence} />%</div>
                      <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Confidence</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-4xl font-black text-white capitalize">{prediction.outcome}</h2>
                    <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs">AI Predicted Verdict</p>
                  </div>

                  <div className="w-full space-y-4 pt-10 border-t border-white/5">
                    <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <span>Favorable Probability</span>
                      <span className="text-indigo-400">{prediction.favorable_probability.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${prediction.favorable_probability}%` }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500" 
                      />
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-500 leading-tight italic flex items-center justify-center">
                    <FaExclamationTriangle className="mr-2 text-amber-500/50" />
                    Predictions are based on AI modeling and should not be taken as legal advice.
                  </p>
                </Card>
              </motion.div>
            ) : (
              <div className="h-[650px] flex flex-col items-center justify-center space-y-6 bg-white/5 border border-dashed border-white/10 rounded-[3rem] text-center p-12">
                <FaBalanceScale className="text-gray-700 text-6xl mb-4" />
                <h3 className="text-2xl font-bold text-gray-500 tracking-tight">Outcome Preview</h3>
                <p className="text-gray-600 max-w-xs font-medium">Results will be displayed here once you provide case details.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Predict;
