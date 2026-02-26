import { Github, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">NyaySetu</h2>
                    <p className="text-slate-400">Simplifying legal access for every Indian citizen.</p>
                </div>

                <div className="flex justify-center space-x-6 mb-8">
                    <Github className="w-6 h-6 cursor-pointer hover:text-white" />
                    <Twitter className="w-6 h-6 cursor-pointer hover:text-white" />
                    <Linkedin className="w-6 h-6 cursor-pointer hover:text-white" />
                </div>

                <div className="pt-8 border-t border-slate-800 text-sm">
                    © {new Date().getFullYear()} NyaySetu. All rights reserved.
                </div>
            </div>
        </footer>
    );
};
