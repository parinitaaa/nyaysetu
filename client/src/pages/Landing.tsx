import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Shield, MessageSquare, Scale, Upload, Search, ThumbsUp, Sparkles, Loader2, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { mockLegalText, mockStats } from '../services/mockData';

export const Landing = () => {
    const { isAuthenticated } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [showTooltip, setShowTooltip] = useState(false);

    const handleAuthorizedNavigation = (path: string) => {
        if (isAuthenticated) {
            navigate(path);
        } else {
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 3000);
            navigate('/login');
        }
    };

    return (
        <div className="bg-white scroll-smooth">
            {/* Tooltip Overlay */}
            {showTooltip && (
                <div className="fixed top-20 right-4 z-[100] animate-bounce">
                    <div className="bg-slate-900 text-white px-4 py-2 rounded-lg shadow-2xl flex items-center space-x-2 border border-slate-700">
                        <Info size={16} className="text-blue-400" />
                        <span className="text-sm font-medium">Please login to access this feature</span>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-20 lg:pt-32 lg:pb-32">
                <FadeIn>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold mb-8 animate-pulse">
                            <Sparkles size={16} />
                            <span>AI-Powered Legal Revolution</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                            {t.heroTitle.split(',')[0]}, <span className="gradient-text">{t.heroTitle.split(',')[1] || t.heroTitle.split(' ')[1]}</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10">
                            {t.heroSubtitle}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button
                                onClick={() => handleAuthorizedNavigation('/upload')}
                                className="px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center shadow-xl shadow-blue-200 active:scale-95"
                            >
                                Upload Document <Upload className="ml-2 w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleAuthorizedNavigation('/chatbot')}
                                className="px-8 py-4 border-2 border-slate-200 text-slate-900 rounded-full text-lg font-bold hover:bg-slate-50 transition-all flex items-center justify-center active:scale-95"
                            >
                                Try Legal Chatbot <MessageSquare className="ml-2 w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </FadeIn>

                {/* Background blobs */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10"></div>
            </section>

            {/* Interactive Demo Section */}
            <section className="py-24 bg-white border-y border-slate-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeIn>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">See How It Works</h2>
                            <p className="text-slate-600">Watch our AI turn complex legalese into plain English instantly.</p>
                        </div>
                    </FadeIn>

                    <FadeIn>
                        <div className="glass-card rounded-3xl p-8 border border-blue-100 relative overflow-hidden">
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Complex Legal jargon</h4>
                                    <div className="p-4 bg-slate-50 rounded-xl text-slate-700 font-serif leading-relaxed italic">
                                        {mockLegalText.original}
                                    </div>
                                </div>

                                <DemoInteraction />
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FadeIn>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Intelligent Feature Suite</h2>
                            <p className="text-slate-600 text-lg">Every tool crafted to empower the common citizen.</p>
                        </div>
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Upload className="w-8 h-8 text-blue-600" />}
                            title="Document Analysis"
                            description="Get jargon-free summaries in seconds. Simply upload and understand."
                            onAction={() => navigate('/upload')}
                        />
                        <FeatureCard
                            icon={<MessageSquare className="w-8 h-8 text-blue-600" />}
                            title="AI Legal Chatbot"
                            description="Context-aware answers based on the latest Indian laws."
                            onAction={() => navigate('/chatbot')}
                        />
                        <FeatureCard
                            icon={<Shield className="w-8 h-8 text-blue-600" />}
                            title="Rights Education"
                            description="Learn about fundamental rights and how to protect them."
                            onAction={() => navigate('/rights')}
                        />
                        <FeatureCard
                            icon={<Scale className="w-8 h-8 text-blue-600" />}
                            title="BNS/BSB Search"
                            description="Searchable database of the new Indian Penal codes (BNS)."
                            onAction={() => navigate('/summary')}
                        />
                        <FeatureCard
                            icon={<Search className="w-8 h-8 text-blue-600" />}
                            title="Find Lawyers"
                            description="Connect with rated legal professionals for deeper consultations."
                            onAction={() => navigate('/history')}
                        />
                        <FeatureCard
                            icon={<ThumbsUp className="w-8 h-8 text-blue-600" />}
                            title="Multilingual Support"
                            description="Available in Hindi, English, and 12+ regional languages."
                            onAction={() => navigate('/rights', { state: { openLanguage: true } })}
                        />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        {mockStats.map((stat, idx) => (
                            <FadeIn key={idx} delay={idx * 200}>
                                <div>
                                    <StatCounter value={stat.value} suffix={stat.suffix} />
                                    <p className="text-slate-400 font-medium mt-2">{stat.label}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]"></div>
                </div>
            </section>

            {/* Footer is handled by MainLayout */}
        </div>
    );
};

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entries[0].target);
            }
        });

        if (domRef.current) observer.observe(domRef.current);

        return () => {
            if (domRef.current) observer.unobserve(domRef.current);
        };
    }, []);

    return (
        <div
            ref={domRef}
            className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

const StatCounter = ({ value, suffix }: { value: number, suffix: string }) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setIsVisible(true);
        });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let start = 0;
        const end = value;
        const duration = 2000;
        const increment = end / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [isVisible, value]);

    return (
        <div ref={ref} className="text-5xl font-extrabold text-blue-400">
            {count.toLocaleString()}{suffix}
        </div>
    );
};

const DemoInteraction = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleSimplify = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsDone(true);
        }, 2000);
    };

    return (
        <div>
            {!isDone ? (
                <button
                    onClick={handleSimplify}
                    disabled={isLoading}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-800 transition-colors disabled:opacity-70"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin" />
                            <span>Analyzing Legal Semantics...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles size={18} />
                            <span>Simplify This Text</span>
                        </>
                    )}
                </button>
            ) : (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <h4 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3 flex items-center">
                        <CheckCircle2 size={12} className="mr-1" /> Simplified Version
                    </h4>
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-900 leading-relaxed font-medium">
                        {mockLegalText.simplified}
                    </div>
                    <button
                        onClick={() => setIsDone(false)}
                        className="mt-4 text-sm font-semibold text-slate-500 hover:text-slate-700 underline underline-offset-4"
                    >
                        Try another example
                    </button>
                </div>
            )}
        </div>
    );
};

const FeatureCard = ({ icon, title, description, onAction }: any) => (
    <FadeIn>
        <div
            onClick={onAction}
            className="p-8 bg-white rounded-3xl border border-slate-100 hover:border-blue-200 transition-all hover:shadow-2xl hover:shadow-blue-100 group cursor-pointer relative overflow-hidden"
        >
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{description}</p>

            <div className="mt-6 flex items-center text-blue-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                Learn More <ArrowRight className="ml-2 w-4 h-4" />
            </div>
        </div>
    </FadeIn>
);

import { CheckCircle2 } from 'lucide-react';
