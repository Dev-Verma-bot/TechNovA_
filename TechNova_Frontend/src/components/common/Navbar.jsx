import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, UserCircle2, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useAppSelector } from '../../hooks/useAppDispatch';
import { selectAuth } from '../../redux/slices/authSlice';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
    const { isAuthenticated, user } = useAppSelector(selectAuth);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const initials = useMemo(() => {
        const name = user?.name || user?.email || 'U';
        return name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() || '')
            .join('');
    }, [user]);

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate('/logout-success');
    };

    const handleGoDashboard = () => {
        setMenuOpen(false);
        if (user?.role === 'admin') {
            navigate('/admin');
            return;
        }
        navigate('/dashboard');
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-slate-100 lg:px-12 px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
                <div className="relative flex items-center justify-center">
                    <Shield className="w-7 h-7 text-primary-600 fill-white z-10 transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-primary-50 rounded-full scale-110 -z-0 group-hover:bg-primary-100 transition-colors"></div>
                </div>
                <span className="text-[20px] font-extrabold tracking-tight text-[#111827]">
                    CredNova
                </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-[14px] font-semibold text-slate-500">
                <Link to="/simulator" className="hover:text-slate-900 transition-colors">Simulator</Link>
                <Link to="/privacy-policy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
                <Link to="/about" className="hover:text-slate-900 transition-colors">About</Link>
            </nav>

            <div className="flex items-center gap-6">
                {isAuthenticated ? (
                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen((prev) => !prev)}
                            className="inline-flex items-center gap-3 px-2 py-1.5 border border-transparent rounded-full hover:bg-slate-50 transition-all focus:ring-2 focus:ring-primary-500/20"
                        >
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-soft flex items-center justify-center text-sm font-extrabold tracking-wide">
                                {initials || <UserCircle2 className="w-5 h-5" />}
                            </div>
                            <div className="hidden sm:flex flex-col items-start pr-1">
                                <p className="text-[14px] font-bold text-slate-800 leading-none mb-1">
                                    {user?.name || 'Profile'}
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${user?.role === 'admin' ? 'bg-amber-500' : 'bg-success'}`}></span>
                                    <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.08em] leading-none">
                                        {user?.role === 'user' ? 'Applicant' : (user?.role || 'Applicant')}
                                    </p>
                                </div>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-slate-400 ml-1 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                                <div className="px-4 py-3 border-b border-slate-100">
                                    <p className="text-sm font-semibold text-slate-900 truncate">
                                        {user?.name || 'User'}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
                                </div>
                                <button
                                    onClick={handleGoDashboard}
                                    className="w-full px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login" className="inline-flex items-center justify-center px-5 py-[9px] text-[13px] font-bold text-white bg-primary-500 rounded-md hover:bg-primary-600 transition-colors shadow-sm">
                        Get Started
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Navbar;

