import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRightsByCategory } from "../api/rightsApi";
import PageWrapper from "../components/PageWrapper";
import Card from "../components/Card";
import Button from "../components/Button";
import Skeleton from "../components/Skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaGavel, FaChevronRight } from "react-icons/fa";

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
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.23, 1, 0.32, 1]
    },
  },
};

function RightsByCategory() {
  const { category_slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRightsByCategory(category_slug)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category_slug]);

  const formatCategoryName = () => {
    if (data?.category) return data.category;
    return category_slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <PageWrapper>
      <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-5xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-gray-500"
        >
          <Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link>
          <FaChevronRight className="text-[8px]" />
          <Link to="/rights" className="hover:text-indigo-400 transition-colors">Rights</Link>
          <FaChevronRight className="text-[8px]" />
          <span className="text-indigo-400">{formatCategoryName()}</span>
        </motion.nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter capitalize">
              {formatCategoryName()}
            </h1>
            <div className="flex items-center space-x-2">
              <span className="w-12 h-1 bg-indigo-500 rounded-full" />
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                {data?.rights?.length || 0} Fundamental Rights
              </p>
            </div>
          </motion.div>

          <Link to="/rights">
            <Button variant="secondary" className="group">
              <FaArrowLeft className="inline mr-2 group-hover:-translate-x-1 transition-transform" />
              ALL CATEGORIES
            </Button>
          </Link>
        </div>

        {/* Rights List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-[2rem]" />
            ))}
          </div>
        ) : !data.rights || data.rights.length === 0 ? (
          <div className="text-center py-24 bg-white/5 border border-dashed border-white/10 rounded-[2.5rem]">
            <FaGavel className="mx-auto text-gray-700 mb-4" size={48} />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
              No rights available in this category
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6"
          >
            {data.rights.map((right) => (
              <motion.div key={right.slug} variants={itemVariants}>
                <Link to={`/rights/${category_slug}/${right.slug}`}>
                  <Card className="group relative overflow-hidden p-8 hover:bg-white/[0.07] transition-all">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="space-y-3 flex-1">
                        <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Section / Act</div>
                        <h2 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors">
                          {right.title}
                        </h2>
                        {right.summary && (
                          <p className="text-gray-500 text-base font-medium line-clamp-2">
                            {right.summary}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center text-indigo-400 group-hover:text-white transition-colors">
                        <span className="text-[10px] font-black uppercase tracking-widest mr-3 opacity-0 group-hover:opacity-100 transition-opacity">Read Full Explanation</span>
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-indigo-500/50 group-hover:bg-indigo-600 transition-all">
                          <FaChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
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

export default RightsByCategory;


