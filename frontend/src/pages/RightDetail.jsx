import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSingleRight } from "../api/rightsApi";
import PageWrapper from "../components/PageWrapper";
import Card from "../components/Card";
import Button from "../components/Button";
import { motion } from "framer-motion";
import { FaArrowLeft, FaExclamationTriangle, FaPhone, FaCheckCircle } from "react-icons/fa";

function Section({ title, children }) {
  if (!children) return null;

  return (
    <Card shadow="xl" className="p-5 md:p-6 space-y-3 md:space-y-4">
      <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2 md:pb-3">
        {title}
      </h2>
      <div className="text-gray-700 leading-relaxed text-sm md:text-base">{children}</div>
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

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 pt-20 md:pt-24 pb-16 md:pb-20">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-12 space-y-6">
            <div className="h-6 w-48 bg-white/60 rounded-full animate-pulse" />
            <div className="h-10 w-3/4 bg-white/70 rounded-full animate-pulse" />
            <div className="space-y-4 mt-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-24 md:h-28 bg-white/60 rounded-2xl border border-gray-100 animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (!right) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 pt-20 md:pt-24 pb-16 md:pb-20">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-12">
            <p className="text-gray-600 text-sm md:text-base">Right not found.</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const getSeverityColor = (severity) => {
    if (!severity) return "bg-indigo-100 text-indigo-800";
    const lower = severity.toLowerCase();
    if (lower.includes("high") || lower.includes("critical")) {
      return "bg-red-100 text-red-800";
    }
    if (lower.includes("medium")) {
      return "bg-yellow-100 text-yellow-800";
    }
    return "bg-green-100 text-green-800";
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 pt-20 md:pt-24 pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-12 space-y-5 md:space-y-6">
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
            <Link
              to={`/rights/${category_slug}`}
              className="hover:text-indigo-600"
            >
              {formatCategoryName()}
            </Link>
            <span>/</span>
            <span className="text-gray-700 truncate max-w-[150px] md:max-w-none">{right.title}</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link to={`/rights/${category_slug}`}>
              <Button variant="ghost" className="flex items-center gap-2 mt-2">
                <FaArrowLeft />
                Back to Category
              </Button>
            </Link>
          </motion.div>

          {/* Title Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card shadow="2xl" className="p-6 md:p-8 space-y-3 md:space-y-4 rounded-2xl border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 md:gap-4">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 flex-1">
                  {right.title}
                </h1>
                {right.severity && (
                  <span
                    className={`px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-medium shadow-md self-start ${getSeverityColor(
                      right.severity
                    )}`}
                  >
                    {right.severity}
                  </span>
                )}
              </div>
              {right.summary && (
                <p className="text-base md:text-lg text-gray-600 leading-relaxed border-t border-gray-200 pt-3 md:pt-4">
                  {right.summary}
                </p>
              )}
            </Card>
          </motion.div>

          {/* Plain Explanation */}
          {right.plainExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Section title="Plain Explanation">
                {right.plainExplanation.whatItMeans && (
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                        What It Means
                      </h3>
                      <p className="text-gray-700 text-sm md:text-base">{right.plainExplanation.whatItMeans}</p>
                    </div>
                    {right.plainExplanation.whyItMatters && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                          Why It Matters
                        </h3>
                        <p className="text-gray-700 text-sm md:text-base">
                          {right.plainExplanation.whyItMatters}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Section>
            </motion.div>
          )}

          {/* Who Can Use */}
          {right.whoCanUseThisRight && right.whoCanUseThisRight.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Section title="Who Can Use This Right">
                <ul className="space-y-2">
                  {right.whoCanUseThisRight.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <FaCheckCircle className="text-indigo-600 mt-1 flex-shrink-0" />
                      <span className="text-sm md:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            </motion.div>
          )}

          {/* Violations */}
          {right.whatConstitutesViolation &&
            right.whatConstitutesViolation.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Section title="What Constitutes Violation">
                  <ul className="space-y-2">
                    {right.whatConstitutesViolation.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <FaExclamationTriangle className="text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-sm md:text-base">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              </motion.div>
            )}

          {/* Reliefs */}
          {right.reliefsAvailable && right.reliefsAvailable.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Section title="Reliefs Available">
                <ul className="space-y-2">
                  {right.reliefsAvailable.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm md:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            </motion.div>
          )}

          {/* Steps */}
          {right.stepByStepAction && right.stepByStepAction.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Section title="Step-by-Step Action Plan">
                <ol className="space-y-3 md:space-y-4">
                  {right.stepByStepAction.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 md:gap-4 border-l-2 border-indigo-200 pl-3 md:pl-4">
                      <span className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center font-semibold shadow-lg text-sm md:text-base">
                        {i + 1}
                      </span>
                      <span className="pt-1 md:pt-2 text-sm md:text-base">{step}</span>
                    </li>
                  ))}
                </ol>
              </Section>
            </motion.div>
          )}

          {/* Related Rights */}
          {right.relatedRights && right.relatedRights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <Section title="Related Rights">
                <ul className="space-y-2">
                  {right.relatedRights.map((item, i) => (
                    <li key={i} className="text-gray-700 text-sm md:text-base">
                      {typeof item === "string" ? item : item.title || ""}
                    </li>
                  ))}
                </ul>
              </Section>
            </motion.div>
          )}

          {/* Emergency Contacts */}
          {right.emergencyContacts && right.emergencyContacts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card shadow="xl" className="p-5 md:p-6 bg-red-50 border-2 border-red-200">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2 mb-3 md:mb-4">
                  <FaPhone className="text-red-600" />
                  Emergency Contacts
                </h2>
                <div className="space-y-3">
                  {right.emergencyContacts.map((contact, i) => (
                    <div
                      key={i}
                      className="bg-white p-3 md:p-4 rounded-xl border-2 border-red-200 shadow-md"
                    >
                      <strong className="text-gray-900 block mb-1 text-sm md:text-base">
                        {contact.service}
                      </strong>
                      <a
                        href={`tel:${contact.number}`}
                        className="text-indigo-600 hover:underline font-medium text-sm md:text-base"
                      >
                        {contact.number}
                      </a>
                    </div>
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
