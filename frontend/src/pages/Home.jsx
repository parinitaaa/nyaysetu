import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaBalanceScale, FaRobot, FaSearch, FaShieldAlt, 
  FaArrowRight, FaCheckCircle, FaUserTie 
} from 'react-icons/fa';
import PageWrapper from '../components/PageWrapper';
import Card from '../components/Card';
import Button from '../components/Button';

const FeatureCard = ({ icon: Icon, title, description, link, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="h-full"
  >
    <Link to={link} className="block h-full">
      <Card className="h-full group hover:border-indigo-500/50 transition-all duration-500">
        <div className="space-y-6">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-[0_0_20px_rgba(79,70,229,0.1)]">
            <Icon size={28} />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-black text-white tracking-tight leading-none group-hover:text-indigo-400 transition-colors">
              {title}
            </h3>
            <p className="text-gray-500 font-medium leading-relaxed">
              {description}
            </p>
          </div>
          <div className="pt-4 flex items-center text-indigo-400 text-xs font-black uppercase tracking-widest group-hover:text-white transition-colors">
            <span>Get Started</span>
            <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </Card>
    </Link>
  </motion.div>
);

const Home = () => {
  return (
    <PageWrapper>
      <div className="space-y-32 pb-32">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
          {/* Animated Background Elements */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[150px] animate-pulse delay-700" />
          
          <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center space-y-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span>Next-Gen Legal Intelligence</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white">
                Empowering Justice <br />
                <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  Through AI
                </span>
              </h1>
              
              <p className="text-gray-400 text-lg md:text-2xl max-w-2xl mx-auto font-medium leading-relaxed">
                NyaySetu bridges the gap between law and technology, providing instant legal analysis, outcome predictions, and expert guidance.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link to="/analyzer">
                <Button className="px-10 py-5 text-lg shadow-[0_0_30px_rgba(79,70,229,0.4)]">
                  ANALYZE DOCUMENT
                </Button>
              </Link>
              <Link to="/predict">
                <Button variant="secondary" className="px-10 py-5 text-lg">
                  PREDICT OUTCOME
                </Button>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="pt-12 flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-700"
            >
              {['Trusted by 10k+ users', '1M+ Precedents Analyzed', 'Verified Legal Partners'].map((badge, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <FaCheckCircle className="text-indigo-500" />
                  <span className="text-xs font-black uppercase tracking-widest text-white">{badge}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-xs font-black text-indigo-500 uppercase tracking-[0.4em]">Our Ecosystem</h2>
            <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight">Legal Tools Redefined</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={FaShieldAlt}
              title="Doc Analyzer"
              description="Upload any legal contract for instant risk assessment and simplified clause-by-clause analysis."
              link="/analyzer"
              delay={0.1}
            />
            <FeatureCard 
              icon={FaRobot}
              title="Legal AI Assistant"
              description="Get instant answers to your legal queries from our advanced AI trained on Indian Penal Code."
              link="/chatbot"
              delay={0.2}
            />
            <FeatureCard 
              icon={FaBalanceScale}
              title="Outcome Predictor"
              description="Predict the likely outcome of your case based on state, court type, and historical data patterns."
              link="/predict"
              delay={0.3}
            />
            <FeatureCard 
              icon={FaSearch}
              title="Knowledge Base"
              description="Explore your rights as an Indian citizen with simplified explanations and action plans."
              link="/rights"
              delay={0.4}
            />
            <FeatureCard 
              icon={FaUserTie}
              title="Expert Connect"
              description="Find and connect with verified legal professionals based on your city and specific legal needs."
              link="/lawyers"
              delay={0.5}
            />
            <FeatureCard 
              icon={FaBalanceScale}
              title="Case Search"
              description="Search through millions of Indian court judgments and legal precedents instantly."
              link="/cases"
              delay={0.6}
            />
          </div>
        </section>

        {/* Call to Action */}
        <section className="max-w-5xl mx-auto px-6">
          <Card className="p-12 md:p-20 text-center relative overflow-hidden bg-gradient-to-br from-indigo-600/20 to-cyan-600/20 border-indigo-500/30">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter">
                Ready to transform your <br /> legal experience?
              </h2>
              <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto font-medium">
                Join thousands of users who trust NyaySetu for their legal needs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/chatbot">
                  <Button className="px-12 py-4">ASK AI ASSISTANT</Button>
                </Link>
                <Link to="/lawyers">
                  <Button variant="secondary" className="px-12 py-4">BROWSE LAWYERS</Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </PageWrapper>
  );
};

export default Home;
