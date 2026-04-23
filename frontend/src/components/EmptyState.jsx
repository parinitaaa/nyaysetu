import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({ icon: Icon, title, description, actionText, onAction }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 px-6 stagger-in">
    <div className="p-8 bg-white/5 rounded-[2.5rem] text-gray-600 border border-white/10 shadow-2xl">
      <Icon size={64} />
    </div>
    <div className="space-y-2">
      <h3 className="text-3xl font-black text-gray-300 tracking-tight">{title}</h3>
      <p className="text-gray-500 max-w-md mx-auto font-medium">{description}</p>
    </div>
    {actionText && (
      <button 
        onClick={onAction}
        className="px-8 py-3 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-[0_0_20px_rgba(79,70,229,0.2)]"
      >
        {actionText}
      </button>
    )}
  </div>
);

export default EmptyState;
