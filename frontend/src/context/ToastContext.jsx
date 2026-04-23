import React, { useState, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ x: 100, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 100, opacity: 0, scale: 0.8 }}
              className={`pointer-events-auto px-8 py-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 border backdrop-blur-2xl ${
                toast.type === 'success' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                toast.type === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                'bg-indigo-500/20 border-indigo-500/50 text-indigo-400'
              }`}
            >
              <div className="text-xl">
                {toast.type === 'success' && <FaCheckCircle />}
                {toast.type === 'error' && <FaExclamationCircle />}
                {toast.type === 'info' && <FaInfoCircle />}
              </div>
              <span className="font-bold text-sm tracking-tight">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
