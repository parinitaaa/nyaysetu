import { useEffect, useState, useMemo } from "react";
import { getCategories } from "../api/rightsApi";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import Card from "../components/Card";
import { motion, AnimatePresence } from "framer-motion";
import { FaShieldAlt, FaSearch } from "react-icons/fa";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

function RightsCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 🔥 SINGLE SOURCE OF TRUTH
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const q = searchQuery.toLowerCase().trim();

    return categories.filter(
      (cat) =>
        cat.title.toLowerCase().includes(q) ||
        (cat.description &&
          cat.description.toLowerCase().includes(q))
    );
  }, [categories, searchQuery]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSuggestionClick = (cat) => {
    setSearchQuery(cat.title);
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 pt-20 md:pt-24 pb-16 md:pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-12 space-y-8 md:space-y-10">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3 md:space-y-4"
          >
            <div className="flex justify-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
                <FaShieldAlt className="text-white text-xl md:text-2xl" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900">
                Explore Your Legal Rights
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base px-4">
                Browse categorized legal rights with simplified explanations
                and actionable guidance.
              </p>
            </div>
          </motion.div>

          {/* 🔍 Search Bar */}
          <div className="max-w-md mx-auto px-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />

              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Search rights by keyword..."
                className="w-full pl-10 pr-3 py-3 md:py-2 rounded-full bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base"
              />

              {/* 🔥 Live Suggestions */}
              <AnimatePresence>
                {searchQuery.trim() !== "" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg max-h-60 overflow-y-auto z-20 border border-gray-200"
                  >
                    {filteredResults.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No matching rights found
                      </div>
                    ) : (
                      <ul className="py-2">
                        {filteredResults.map((cat) => (
                          <li key={cat.slug}>
                            <button
                              type="button"
                              onClick={() => handleSuggestionClick(cat)}
                              className="w-full px-4 py-3 text-left text-sm text-gray-800 hover:bg-gray-100 transition-colors flex flex-col gap-0.5"
                            >
                              <span className="font-medium">
                                {cat.title}
                              </span>
                              {cat.description && (
                                <span className="text-xs text-gray-500 line-clamp-1">
                                  {cat.description}
                                </span>
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 📦 Categories Grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 gap-4 md:gap-6 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-24 md:h-28 bg-white rounded-2xl border border-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-sm md:text-base">
                No categories match your search.
              </p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid sm:grid-cols-2 gap-4 md:gap-6 mt-4"
            >
              {filteredResults.map((cat) => (
                <motion.div key={cat.slug} variants={itemVariants}>
                  <Link to={`/rights/${cat.slug}`}>
                    <Card
                      hover
                      shadow="xl"
                      className="h-full p-5 md:p-6 transition-transform duration-300"
                    >
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">
                        {cat.title}
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {cat.description}
                      </p>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

export default RightsCategories;