import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin, FaBalanceScale } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0a0f1e] border-t border-white/10 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">⚖️</span>
            <span className="text-2xl font-black text-white tracking-tighter">NyaySetu</span>
          </div>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">
            Revolutionizing legal access in India through cutting-edge AI and human-centric design.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-indigo-400 hover:bg-white/10 transition-all"><FaGithub /></a>
            <a href="#" className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-indigo-400 hover:bg-white/10 transition-all"><FaTwitter /></a>
            <a href="#" className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-indigo-400 hover:bg-white/10 transition-all"><FaLinkedin /></a>
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Platform</h4>
          <ul className="space-y-4 text-gray-500 text-sm font-bold">
            <li><Link to="/analyzer" className="hover:text-indigo-400 transition-colors">Doc Analyzer</Link></li>
            <li><Link to="/predict" className="hover:text-indigo-400 transition-colors">Outcome Predictor</Link></li>
            <li><Link to="/chatbot" className="hover:text-indigo-400 transition-colors">AI Assistant</Link></li>
            <li><Link to="/cases" className="hover:text-indigo-400 transition-colors">Case Search</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Knowledge</h4>
          <ul className="space-y-4 text-gray-500 text-sm font-bold">
            <li><Link to="/rights" className="hover:text-indigo-400 transition-colors">Your Rights</Link></li>
            <li><Link to="/lawyers" className="hover:text-indigo-400 transition-colors">Find Lawyers</Link></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Legal Blog</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Help Center</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Subscribe</h4>
          <p className="text-gray-500 text-sm mb-4">Get the latest legal tech updates.</p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Email" 
              className="bg-white/5 border border-white/10 rounded-l-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 w-full"
            />
            <button className="bg-indigo-600 px-4 py-3 rounded-r-xl text-white hover:bg-indigo-700 transition-all">
              Join
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">
          © 2026 NyaySetu Platform. All Rights Reserved.
        </p>
        <div className="flex space-x-8 text-[10px] font-black uppercase tracking-widest text-gray-600">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
