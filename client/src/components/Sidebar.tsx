import React from 'react';
import { Scale, Upload, MessageSquare, Shield, Clock, ThumbsUp, LogOut, LayoutDashboard, Menu, X, Search, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload Analysis', href: '/upload', icon: Upload },
    { name: 'Law Search', href: '/search', icon: Search },
    { name: 'Find Lawyers', href: '/lawyers', icon: Users },
    { name: 'AI Chatbot', href: '/chatbot', icon: MessageSquare },
    { name: 'Rights Education', href: '/rights', icon: Shield },
    { name: 'Case History', href: '/history', icon: Clock },
    { name: 'Feedback', href: '/feedback', icon: ThumbsUp },
];

export const Sidebar = () => {
    const location = useLocation();
    const { logout, user } = useAuth();
    const [isOpen, setIsOpen] = React.useState(true);

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-slate-200"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className={`
        fixed left-0 top-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 z-40
        ${isOpen ? 'w-64' : 'w-20'}
      `}>
                <div className="flex flex-col h-full p-4">
                    <div className="px-3 mb-8 pt-4">
                        {isOpen ? (
                            <Link to="/" className="text-2xl font-bold text-slate-900 block truncate">
                                Nyay<span className="text-blue-600">Setu</span>
                            </Link>
                        ) : (
                            <Link to="/" className="flex justify-center">
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                    <Scale size={20} />
                                </div>
                            </Link>
                        )}
                    </div>
                    <div className="space-y-2 flex-1">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`
                    flex items-center space-x-3 p-3 rounded-xl font-medium transition-all group
                    ${isActive
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                            : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'}
                  `}
                                >
                                    <item.icon size={22} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'} />
                                    {isOpen && <span className="text-sm">{item.name}</span>}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-4">
                        <div className={`flex items-center ${isOpen ? 'space-x-3' : 'justify-center'} p-2`}>
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
                                {user?.name?.[0]}
                            </div>
                            {isOpen && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                                    <p className="text-xs text-slate-500 truncate">Free Plan</p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={logout}
                            className={`
                w-full flex items-center ${isOpen ? 'space-x-3 px-3' : 'justify-center'} py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all
              `}
                        >
                            <LogOut size={22} />
                            {isOpen && <span className="text-sm font-bold">Logout</span>}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
