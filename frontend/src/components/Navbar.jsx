import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/analyzer", label: "Analyzer" },
    { to: "/predict", label: "Outcome" },
    { to: "/rights", label: "Rights" },
    { to: "/lawyers", label: "Lawyers" },
    { to: "/cases", label: "Cases" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? "bg-[#0a0f1e]/80 backdrop-blur-xl border-b border-white/10 py-4" : "bg-transparent py-6"
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 group"
          >
            <div className="relative">
              <span className="text-3xl">⚖️</span>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent bg-[length:200%_auto] group-hover:animate-gradient leading-none">
                NyaySetu
              </span>
              <span className="text-[9px] font-black tracking-widest text-indigo-500 uppercase mt-1">Live AI Platform</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative py-2 text-sm font-bold uppercase tracking-widest transition-all"
              >
                <span className={`transition-colors duration-300 ${
                  location.pathname === link.to ? "text-indigo-400" : "text-gray-400 hover:text-white"
                }`}>
                  {link.label}
                </span>
                {location.pathname === link.to && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                  />
                )}
              </Link>
            ))}
            <Link to="/chatbot">
              <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:scale-105 active:scale-95">
                ASK AI
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-400 hover:text-white transition-colors p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-72 bg-[#0a0f1e]/95 backdrop-blur-2xl border-l border-white/10 z-[60] flex flex-col p-8 space-y-8 md:hidden"
          >
            <div className="flex justify-between items-center">
              <span className="text-xl font-black text-indigo-400 uppercase tracking-widest">Navigation</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-white">
                <HiX size={24} />
              </button>
            </div>
            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-xl font-bold transition-all ${
                    location.pathname === link.to ? "text-indigo-400 pl-4 border-l-2 border-indigo-500" : "text-gray-400 hover:text-white pl-0"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/chatbot" onClick={() => setIsMobileMenuOpen(false)} className="pt-4">
                <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest">
                  ASK AI NOW
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
