import { useEffect, useState } from "react";
import { predictCase } from "../api/predictApi";
import { getOptions } from "../api/optionsApi";
import PageWrapper from "../components/PageWrapper";
import Card from "../components/Card";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { FaChartLine, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";

function AnimatedCounter({ value, duration = 1.5 }) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    damping: 20,
    stiffness: 90,
  });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return unsubscribe;
  }, [spring]);

  return <span>{displayValue}</span>;
}

function Predict() {
  const [options, setOptions] = useState(null);
  const [formData, setFormData] = useState({
    state: "",
    court_type: "",
    case_type: "",
    public_interest: "No",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const data = await getOptions();
        setOptions(data);
      } catch (err) {
        setError("Failed to load options. Please refresh the page.");
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await predictCase(formData);
      setResult(data);
    } catch (err) {
      setError("Failed to predict case outcome. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!options) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 pt-20 md:pt-24 pb-16 md:pb-20">
          <div className="max-w-4xl mx-auto px-4 md:px-12 flex items-center justify-center min-h-[60vh]">
            <Loader size="lg" />
          </div>
        </div>
      </PageWrapper>
    );
  }

  const getOutcomeColor = (outcome) => {
    if (outcome?.toLowerCase().includes("favorable")) {
      return "bg-green-100 text-green-800 border-green-200";
    }
    if (outcome?.toLowerCase().includes("unfavorable")) {
      return "bg-red-100 text-red-800 border-red-200";
    }
    return "bg-indigo-100 text-indigo-800 border-indigo-200";
  };

  const formatFieldName = (field) => {
    return field.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 pt-20 md:pt-24 pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-12 space-y-6 md:space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-3 md:mb-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                <FaChartLine className="text-white text-2xl md:text-3xl" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 mb-2 md:mb-3">
              Predict Your Case Outcome
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Analyze your case details to get an AI-powered prediction
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card shadow="xl" className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                  {["state", "court_type", "case_type"].map((field) => (
                    <div key={field} className="sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {field.replace("_", " ")}
                      </label>
                      <select
                        name={field}
                        onChange={handleChange}
                        value={formData[field]}
                        required
                        className="w-full px-4 py-3 md:py-3.5 rounded-xl bg-gray-50 border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm md:text-base min-h-[44px] touch-manipulation"
                      >
                        <option value="">Select {field.replace("_", " ")}</option>
                        {options[field + "s"]?.map((item) => (
                          <option key={item} value={item.toLowerCase()}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}

                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Public Interest
                    </label>
                    <select
                      name="public_interest"
                      onChange={handleChange}
                      value={formData.public_interest}
                      className="w-full px-4 py-3 md:py-3.5 rounded-xl bg-gray-50 border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm md:text-base min-h-[44px] touch-manipulation"
                    >
                      {options.public_interest?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  fullWidth
                  className="py-4 text-base"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader size="sm" />
                      Analyzing...
                    </span>
                  ) : (
                    "Analyze Case"
                  )}
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center"
            >
              <Card shadow="xl" className="p-6 md:p-8">
                <div className="flex flex-col items-center gap-4">
                  <Loader size="lg" />
                  <p className="text-sm md:text-base text-gray-600">Analyzing your case...</p>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Error State Card */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Card shadow="xl" className="p-5 md:p-6 bg-red-50 border-2 border-red-200">
                  <div className="flex items-center gap-3">
                    <FaExclamationTriangle className="text-red-600 flex-shrink-0 text-lg md:text-xl" />
                    <div>
                      <h3 className="font-semibold text-red-900 mb-1 text-sm md:text-base">Error</h3>
                      <p className="text-red-800 text-xs md:text-sm">{error}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result Card */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card shadow="xl" className="p-6 md:p-8 space-y-5 md:space-y-6 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-2 md:gap-3 mb-2">
                      <FaChartLine className="text-indigo-600 text-lg md:text-xl" />
                      <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                        Prediction Result
                      </h2>
                    </div>

                    {/* Outcome */}
                    <div className="space-y-3 md:space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
                        <div className="flex-1">
                          <p className="text-xs md:text-sm text-gray-600 mb-1">Predicted Outcome</p>
                          <p className="text-xl md:text-2xl font-bold text-gray-900">
                            {result.prediction?.outcome || "N/A"}
                          </p>
                        </div>
                        <div
                          className={`px-4 md:px-5 py-2 rounded-full border-2 font-medium shadow-md text-xs md:text-sm ${
                            getOutcomeColor(result.prediction?.outcome)
                          }`}
                        >
                          <AnimatedCounter value={result.prediction?.confidence || 0} />% Confidence
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs md:text-sm">
                          <span className="text-gray-600">Favorable Probability</span>
                          <span className="font-medium text-gray-900">
                            <AnimatedCounter value={result.prediction?.favorable_probability || 0} />%
                          </span>
                        </div>
                        <div className="h-4 md:h-5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${result.prediction?.favorable_probability || 0}%`,
                            }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={`h-full rounded-full shadow-md ${
                              (result.prediction?.favorable_probability || 0) >= 50
                                ? "bg-gradient-to-r from-green-500 to-green-600"
                                : "bg-gradient-to-r from-red-500 to-red-600"
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Explanation Text */}
                    <div className="pt-3 md:pt-4 border-t border-gray-200">
                      <div className="flex items-start gap-2 text-xs md:text-sm text-gray-600">
                        <FaInfoCircle className="text-indigo-600 mt-0.5 flex-shrink-0" />
                        <p>
                          Prediction is based on selected parameters and historical trends.
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Input Summary Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="mt-4 md:mt-6"
                >
                  <Card shadow="xl" className="p-5 md:p-6 rounded-2xl border border-gray-100">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                      Selected Parameters
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                      {Object.entries(formData).map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                          <span className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                            {formatFieldName(key)}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {value || "Not specified"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Predict;
