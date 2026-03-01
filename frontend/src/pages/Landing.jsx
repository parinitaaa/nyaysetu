import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { motion } from "framer-motion";
import {
  FaRobot,
  FaSearch,
  FaBook,
  FaGavel,
  FaFileAlt,
  FaCheckCircle,
} from "react-icons/fa";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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

function Landing() {
  return (
    <PageWrapper>
      <div className="min-h-screen">
        {/* Hero Section - Clean White Background */}
        <div className="bg-white py-20 md:py-32">
          <div className="max-w-6xl mx-auto px-4 md:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
                Legal Clarity.
                <span className="block mt-2">Powered by AI.</span>
              </h1>

              <p className="mt-4 md:mt-6 text-base md:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed px-4">
                NyaySetu bridges the gap between complex legal language and everyday
                understanding. Get instant AI-guided legal insights, explore your rights,
                and identify the correct legal category for your issue — all in one place.
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 md:mt-12 flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-4">
                <Link to="/chatbot" className="w-full sm:w-auto">
                  <Button variant="primary" fullWidth className="text-base px-8 py-4">
                    Ask the AI Assistant
                  </Button>
                </Link>
                <Link to="/rights" className="w-full sm:w-auto">
                  <Button variant="secondary" fullWidth className="text-base px-8 py-4">
                    Browse Legal Categories
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 md:px-12">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"
            >
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 text-center h-full hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  <FaGavel className="text-indigo-600 text-3xl md:text-4xl" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">
                  AI Legal Assistant
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Ask legal questions in plain language and receive structured, context-aware responses powered by retrieval-based AI.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 text-center h-full hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  <FaSearch className="text-indigo-600 text-3xl md:text-4xl" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">
                  Intelligent Case Classification
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Describe your issue and let our machine learning model identify the most relevant legal category within seconds.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 text-center h-full hover:-translate-y-1 hover:shadow-xl transition-all duration-300 sm:col-span-2 md:col-span-1"
              >
                <div className="flex justify-center mb-4">
                  <FaBook className="text-indigo-600 text-3xl md:text-4xl" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">
                  Structured Rights Explorer
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Browse legal rights organized by category, with simplified explanations and actionable guidance.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-white py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 md:px-12">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 mb-8 md:mb-12 text-center">
                How NyaySetu Works
              </h2>
              <div className="flex flex-col md:flex-row justify-center items-start gap-8 md:gap-12">
                {[
                  {
                    step: 1,
                    icon: FaFileAlt,
                    title: "Describe your issue",
                    description:
                      "Share your legal question or describe your situation in plain language",
                  },
                  {
                    step: 2,
                    icon: FaRobot,
                    title: "AI analyzes and retrieves relevant context",
                    description:
                      "Our AI searches through the legal knowledge base to find relevant information",
                  },
                  {
                    step: 3,
                    icon: FaCheckCircle,
                    title: "Receive clear legal guidance",
                    description:
                      "Get accurate, easy-to-understand legal guidance tailored to your needs",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, duration: 0.4 }}
                    className="flex flex-col items-center text-center max-w-xs mx-auto w-full"
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg font-bold mb-4">
                      {item.step}
                    </div>
                    <div className="mb-4">
                      <item.icon className="text-indigo-600 text-2xl md:text-3xl" />
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl text-center"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-3 md:mb-4">
                Take Control of Your Legal Awareness
              </h2>
              <p className="text-base md:text-lg text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
                Understand your rights with clarity and confidence.
              </p>
              <Link to="/chatbot" className="inline-block w-full sm:w-auto">
                <Button
  variant="primary"
  fullWidth
  className="px-8 py-4"
>
  Try the AI Chatbot
</Button>
              </Link>
            </motion.div>
          </div>
        </div>

        <Footer />
      </div>
    </PageWrapper>
  );
}

export default Landing;
