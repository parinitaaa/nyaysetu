import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Predict from './pages/Predict';
import RightsCategories from './pages/RightsCategories';
import RightsByCategory from './pages/RightsByCategory';
import RightDetail from './pages/RightDetail';
import Chatbot from './pages/Chatbot';
import Analyzer from './pages/Analyzer';
import Lawyers from './pages/Lawyers';
import Cases from './pages/Cases';
import { ToastProvider } from './context/ToastContext';
import { AnimatePresence } from 'framer-motion';

// --- Error Boundary ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0a0f1e] text-white text-center">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-3xl font-black mb-2 tracking-tighter">Something went wrong</h2>
          <p className="text-gray-500 mb-8 max-w-md font-medium">The application encountered an unexpected error. Our engineers have been notified.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-8 py-3 bg-indigo-600 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-indigo-500/30"
          >
            Refresh App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    // Persistent sessionId for analysis history
    let storedId = localStorage.getItem('nyaysetu_session');
    if (!storedId) {
      storedId = crypto.randomUUID();
      localStorage.setItem('nyaysetu_session', storedId);
    }
    setSessionId(storedId);
  }, []);

  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-[#0a0f1e] text-gray-200 selection:bg-indigo-500/30 selection:text-indigo-200">
            {/* Ambient Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[120px]" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/5 rounded-full blur-[150px]" />
            </div>

            <Navbar />
            
            <main className="relative z-10">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/predict" element={<Predict />} />
                  <Route path="/rights" element={<RightsCategories />} />
                  <Route path="/rights/:category_slug" element={<RightsByCategory />} />
                  <Route path="/rights/:category_slug/:right_slug" element={<RightDetail />} />
                  <Route path="/chatbot" element={<Chatbot sessionId={sessionId} />} />
                  <Route path="/analyzer" element={<Analyzer sessionId={sessionId} />} />
                  <Route path="/lawyers" element={<Lawyers />} />
                  <Route path="/cases" element={<Cases />} />
                  
                  {/* Fallback */}
                  <Route path="*" element={<Home />} />
                </Routes>
              </AnimatePresence>
            </main>

            <Footer />
          </div>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
