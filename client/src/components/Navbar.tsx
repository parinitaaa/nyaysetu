import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LogOut, User } from 'lucide-react';

export const Navbar = () => {
    const { isAuthenticated, user, login, logout } = useAuth();
    const { language, setLanguage, t } = useLanguage();

    const handleScroll = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="text-2xl font-bold text-slate-900">Nyay<span className="text-blue-600">Setu</span></Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <button onClick={() => handleScroll('features')} className="text-slate-600 hover:text-blue-600 font-medium transition-colors">{t.features}</button>
                        <button onClick={() => handleScroll('about')} className="text-slate-600 hover:text-blue-600 font-medium transition-colors">{t.about}</button>

                        <div id="lang-selector" className="flex items-center bg-slate-100 p-1 rounded-xl">
                            <button
                                onClick={() => setLanguage('en')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${language === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                EN
                            </button>
                            <button
                                onClick={() => setLanguage('hi')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${language === 'hi' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                HI
                            </button>
                        </div>

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2 text-slate-700">
                                    <User size={18} />
                                    <span className="font-medium">{user?.name}</span>
                                </div>
                                <button
                                    onClick={logout}
                                    className="flex items-center space-x-1 text-slate-600 hover:text-red-600 font-medium"
                                >
                                    <LogOut size={18} />
                                    <span>{t.logout}</span>
                                </button>
                            </div>
                        ) : (
                            <>
                                <button onClick={login} className="text-slate-600 hover:text-blue-600 font-medium text-left">{t.login}</button>
                                <Link to="/signup" className="px-5 py-2.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                                    {t.getStarted}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
