import { useEffect, useState, useMemo } from "react";
import { getCategories } from "../api/rightsApi";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import Card from "../components/Card";
import Skeleton from "../components/Skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { FaShieldAlt, FaSearch, FaChevronRight } from "react-icons/fa";

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
      duration: 0.5,
      ease: [0.23, 1, 0.32, 1]
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

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase().trim();
    return categories.filter(
      (cat) =>
        cat.title.toLowerCase().includes(q) ||
        (cat.description && cat.description.toLowerCase().includes(q))
    );
  }, [categories, searchQuery]);

  return (
    <PageWrapper>
      <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-6xl mx-auto space-y-12">

        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex p-4 bg-indigo-500/10 rounded-3xl text-indigo-400 mb-2"
          >
            <FaShieldAlt size={32} />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-tighter">
            Legal Knowledge Base
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
            Browse simplified legal rights and actionable guidance for every Indian citizen.
          </p>
        </div>

        {/* 🔍 Search Bar */}
        <div className="max-w-xl mx-auto">
          <div className="relative group">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors z-10" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rights by keyword (e.g. 'Women', 'Police', 'Property')..."
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium placeholder:text-gray-600"
            />
          </div>
        </div>

        {/* 📦 Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-[2.5rem]" />
            ))}
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-[2.5rem]">
            <FaSearch className="mx-auto text-gray-700 mb-4" size={48} />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
              No categories match your search
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredResults.map((cat) => (
              <motion.div key={cat.slug} variants={itemVariants}>
                <Link to={`/rights/${cat.slug}`} className="h-full block">
                  <Card className="h-full group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all" />
                    <div className="space-y-4">
                      <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Legal Category</div>
                      <h2 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors">
                        {cat.title}
                      </h2>
                      <p className="text-gray-500 text-sm leading-relaxed font-medium line-clamp-3">
                        {cat.description}
                      </p>
                      <div className="pt-4 flex items-center text-indigo-400 text-[10px] font-black uppercase tracking-widest group-hover:text-white transition-colors">
                        <span>View Rights</span>
                        <FaChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
}
export default RightsCategories;