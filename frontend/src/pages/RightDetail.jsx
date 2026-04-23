import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSingleRight } from "../api/rightsApi";
import PageWrapper from "../components/PageWrapper";
import Card from "../components/Card";
import Button from "../components/Button";
import Skeleton from "../components/Skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaExclamationTriangle, FaPhone, FaCheckCircle, FaChevronRight, FaInfoCircle } from "react-icons/fa";

function Section({ title, icon: Icon, children }) {
  if (!children) return null;

  return (
    <Card className="p-8 space-y-6">
      <h2 className="text-sm font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-3">
        {Icon && <Icon size={18} className="opacity-50" />}
        {title}
      </h2>
      <div className="text-gray-400 leading-relaxed font-medium text-base md:text-lg">{children}</div>
    </Card>
  );
}

function RightDetail() {
  const { category_slug, right_slug } = useParams();
  const [right, setRight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSingleRight(category_slug, right_slug)
      .then(setRight)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category_slug, right_slug]);

  const formatCategoryName = () => {
    if (right?.category) return right.category;
    return category_slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getSeverityBadge = (severity) => {
    if (!severity) return null;
    const lower = severity.toLowerCase();
    const color = (lower.includes("high") || lower.includes("critical")) ? 'red' :
      lower.includes("medium") ? 'orange' : 'green';

    return (
      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-${color}-500/20 text-${color}-400 border border-${color}-500/30 shadow-[0_0_15px_rgba(0,0,0,0.1)]`}>
        {severity}
      </span>
    );
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-48 w-full rounded-[2.5rem]" />
          <Skeleton className="h-64 w-full rounded-[2.5rem]" />
          <Skeleton className="h-40 w-full rounded-[2.5rem]" />
        </div>
      </PageWrapper>
    );
  }

  if (!right) {
    return (
      <PageWrapper>
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
          <FaExclamationTriangle className="text-red-500 mb-6" size={64} />
          <h1 className="text-3xl font-black text-white">Right Not Found</h1>
          <p className="text-gray-500 mt-2 mb-8">The legal right you are looking for does not exist in our database.</p>
          <Link to="/rights">
            <Button>Back to Knowledge Base</Button>
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto space-y-8">
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
          <Link to={`/rights/${category_slug}`} className="hover:text-indigo-400 transition-colors">{formatCategoryName()}</Link>
          <FaChevronRight className="text-[8px]" />
          <span className="text-indigo-400 truncate max-w-[150px]">{right.title}</span>
        </motion.nav>

        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="relative overflow-hidden p-8 md:p-12 border-indigo-500/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />

            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Fundamental Legal Right</div>
                {getSeverityBadge(right.severity)}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none">
                {right.title}
              </h1>

              {right.summary && (
                <p className="text-xl md:text-2xl text-gray-400 font-medium leading-relaxed border-t border-white/5 pt-8">
                  {right.summary}
                </p>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <Link to={`/rights/${category_slug}`}>
            <Button variant="secondary" className="group">
              <FaArrowLeft className="inline mr-2 group-hover:-translate-x-1 transition-transform" />
              BACK TO {formatCategoryName().toUpperCase()}
            </Button>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8">
          {/* Plain Explanation */}
          {right.plainExplanation && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Section title="Analysis & Significance" icon={FaInfoCircle}>
                <div className="space-y-8">
                  {right.plainExplanation.whatItMeans && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Scope & Meaning</h3>
                      <p className="text-gray-300">{right.plainExplanation.whatItMeans}</p>
                    </div>
                  )}
                  {right.plainExplanation.whyItMatters && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Why it matters to you</h3>
                      <p className="text-gray-300 italic">"{right.plainExplanation.whyItMatters}"</p>
                    </div>
                  )}
                </div>
              </Section>
            </motion.div>
          )}

          {/* Who Can Use */}
          {right.whoCanUseThisRight && right.whoCanUseThisRight.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Section title="Eligible Citizens" icon={FaCheckCircle}>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {right.whoCanUseThisRight.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-indigo-500/30 transition-all">
                      <FaCheckCircle className="text-indigo-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-300 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            </motion.div>
          )}

          {/* Violations */}
          {right.whatConstitutesViolation && right.whatConstitutesViolation.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Section title="Signs of Violation" icon={FaExclamationTriangle}>
                <ul className="space-y-4">
                  {right.whatConstitutesViolation.map((item, i) => (
                    <li key={i} className="flex items-start gap-4 p-5 bg-red-500/5 rounded-2xl border border-red-500/10 group hover:border-red-500/30 transition-all">
                      <div className="w-8 h-8 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaExclamationTriangle size={14} />
                      </div>
                      <span className="text-gray-300 font-medium pt-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            </motion.div>
          )}

          {/* Step-by-Step Action */}
          {right.stepByStepAction && right.stepByStepAction.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Section title="Action Plan & Recourse" icon={FaChevronRight}>
                <div className="space-y-6 relative">
                  <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-indigo-500/10" />
                  {right.stepByStepAction.map((step, i) => (
                    <div key={i} className="flex items-start gap-6 group relative z-10">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#0a0f1e] border-2 border-indigo-500 text-white rounded-full flex items-center justify-center font-black shadow-[0_0_20px_rgba(79,70,229,0.2)] group-hover:bg-indigo-600 transition-all">
                        {i + 1}
                      </div>
                      <div className="pt-3 pb-8 flex-1 border-b border-white/5 group-last:border-0">
                        <p className="text-gray-300 font-bold text-lg leading-relaxed">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            </motion.div>
          )}

          {/* Emergency Contacts */}
          {right.emergencyContacts && right.emergencyContacts.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="p-8 bg-red-500/10 border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
                <h2 className="text-sm font-black text-red-400 uppercase tracking-[0.2em] flex items-center gap-3 mb-8">
                  <FaPhone size={18} />
                  Emergency & Legal Support
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {right.emergencyContacts.map((contact, i) => (
                    <a
                      key={i}
                      href={`tel:${contact.number}`}
                      className="bg-black/40 p-6 rounded-2xl border border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10 transition-all flex flex-col items-center text-center group"
                    >
                      <div className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2 opacity-50 group-hover:opacity-100">{contact.service}</div>
                      <div className="text-2xl font-black text-white group-hover:scale-105 transition-transform">{contact.number}</div>
                    </a>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

export default RightDetail;

