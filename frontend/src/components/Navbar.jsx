import { Link, useLocation } from "react-router-dom";
import { FaBalanceScale } from "react-icons/fa";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import Button from "./Button";

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

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { to: "/predict", label: "Predict Case Outcome" },
    { to: "/rights", label: "Explore Your Legal Rights" },
    { to: "/chatbot", label: "AI Legal Assistant" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/70 backdrop-blur-md shadow-sm"
          : "bg-white/70 backdrop-blur-md shadow-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl md:text-2xl font-bold text-indigo-600 hover:scale-105 transition-transform"
          >
            <FaBalanceScale />
            <span className="hidden sm:inline">NyaySetu</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative group"
              >
                <span
                  className={`transition-colors ${
                    location.pathname === link.to
                      ? "text-indigo-600 font-semibold"
                      : "text-gray-800 hover:text-indigo-600"
                  }`}
                >
                  {link.label}
                </span>
                <span
                  className={`absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full ${
                    location.pathname === link.to ? "w-full" : ""
                  }`}
                />
              </Link>
            ))}
            <Link to="/chatbot">
              <Button variant="primary" className="ml-4 px-4 py-2 text-sm">
                Ask AI
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-800 hover:text-indigo-600 transition-colors p-2 -mr-2 touch-manipulation"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <HiX className="w-6 h-6" />
            ) : (
              <HiMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-3 px-2 rounded-lg transition-colors min-h-[44px] flex items-center ${
                    location.pathname === link.to
                      ? "text-indigo-600 font-semibold bg-indigo-50"
                      : "text-gray-800 hover:text-indigo-600 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/chatbot" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" fullWidth className="mt-2">
                  Ask AI
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
