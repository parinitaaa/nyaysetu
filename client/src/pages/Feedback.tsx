import React, { useState } from 'react';
import { Star, Send, CheckCircle2, Shield, Smile } from 'lucide-react';

export const Feedback = () => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return;

        setIsSubmitting(true);
        // Simulate API submission
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
        }, 1500);
    };

    if (submitted) {
        return (
            <div className="max-w-xl mx-auto py-20 animate-in zoom-in-95 duration-500">
                <div className="glass-card rounded-[3rem] p-12 text-center border border-blue-100 shadow-2xl shadow-blue-50">
                    <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">We Hear You!</h2>
                    <p className="text-slate-600 text-lg leading-relaxed font-medium mb-8">
                        Thank you for helping us democratize legal info. Your feedback fuels our mission to make law accessible for everyone.
                    </p>
                    <button
                        onClick={() => setSubmitted(false)}
                        className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-xl"
                    >
                        Submit Another Feedback
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold text-slate-900">Your Opinion Matters</h1>
                <p className="text-slate-600 max-w-lg mx-auto text-lg leading-relaxed">
                    How was your experience with NyaySetu? Tell us how we can improve India's legal companion.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 bg-white p-12 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                            <Shield className="text-blue-600" size={20} />
                            <span>Why give feedback?</span>
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <div className="shrink-0 w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                                <p className="text-sm text-slate-600 font-medium">Help refine our AI accuracy for regional languages.</p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="shrink-0 w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                                <p className="text-sm text-slate-600 font-medium">Request new legally protected rights to be added.</p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="shrink-0 w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                                <p className="text-sm text-slate-600 font-medium">Suggest improvements for Indian law terminology.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center space-x-3 text-slate-400">
                            <Smile size={20} />
                            <span className="text-xs font-bold uppercase tracking-widest italic">Join 500+ users today</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">
                    <div className="space-y-4">
                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Rate your experience</label>
                        <div className="flex justify-between items-center p-6 bg-slate-50 rounded-[2rem] border border-slate-200/50 group">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onMouseEnter={() => !rating && setRating(s)}
                                    onMouseLeave={() => !rating && setRating(0)}
                                    onClick={() => setRating(s)}
                                    className={`transition-all transform ${s <= rating ? 'text-blue-600 scale-125' : 'text-slate-300'}`}
                                >
                                    <Star size={36} fill={s <= rating ? 'currentColor' : 'none'} strokeWidth={2.5} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Your Comments</label>
                        <textarea
                            rows={5}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="What specifically did you like or want improved?"
                            className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium leading-relaxed"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={rating === 0 || isSubmitting}
                        className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50 flex items-center justify-center space-x-3 active:scale-95"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center space-x-2">
                                <span className="animate-pulse">Saving Feedback...</span>
                            </span>
                        ) : (
                            <>
                                <Send size={20} />
                                <span>Submit Feedback</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
