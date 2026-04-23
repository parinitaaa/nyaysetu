import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRightsByCategory } from "../api/rightsApi";
import PageWrapper from "../components/PageWrapper";
import Card from "../components/Card";
import Button from "../components/Button";
import { motion } from "framer-motion";
import { FaArrowLeft, FaGavel } from "react-icons/fa";

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

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 pt-20 md:pt-24 pb-16 md:pb-20">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-12 space-y-6">
            <div className="h-6 w-40 bg-white/60 rounded-full animate-pulse" />
            <div className="h-8 w-64 bg-white/70 rounded-full animate-pulse" />
            <div className="space-y-4 mt-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 md:h-24 bg-white/60 rounded-2xl border border-gray-100 animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (!data) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 pt-20 md:pt-24 pb-16 md:pb-20">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-12">
            <p className="text-gray-600 text-sm md:text-base">Category not found.</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 pt-20 md:pt-24 pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-12 space-y-6 md:space-y-8">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs md:text-sm text-gray-500 flex flex-wrap items-center gap-1"
          >
            <Link to="/" className="hover:text-indigo-600">
              Home
            </Link>
            <span>/</span>
            <Link to="/rights" className="hover:text-indigo-600">
              Rights
            </Link>
            <span>/</span>
            <span className="text-gray-700">{formatCategoryName()}</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link to="/rights">
              <Button variant="ghost" className="flex items-center gap-2 mt-2">
                <FaArrowLeft />
                Back to Categories
              </Button>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900">
              {formatCategoryName()}
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              {data.rights?.length || 0} rights available
            </p>
          </motion.div>

          {/* Rights List */}
          {!data.rights || data.rights.length === 0 ? (
            <div className="text-center py-12">
              <FaGavel className="text-gray-400 text-3xl md:text-4xl mx-auto mb-4" />
              <p className="text-gray-600 text-sm md:text-base">No rights available in this category.</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3 md:space-y-4"
            >
              {data.rights.map((right) => (
                <motion.div key={right.slug} variants={itemVariants}>
                  <Link to={`/rights/${category_slug}/${right.slug}`}>
                    <Card
                      hover
                      shadow="xl"
                      className="p-5 md:p-6 transition-transform duration-300"
                    >
                      <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                        {right.title}
                      </h2>
                      {right.summary && (
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {right.summary}
                        </p>
                      )}
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

export default RightsByCategory;
