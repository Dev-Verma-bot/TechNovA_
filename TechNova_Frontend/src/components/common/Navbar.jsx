import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, UserCircle2, LogOut, ChevronDown } from 'lucide-react';
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

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-slate-100 lg:px-12 px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
                {/* Replicating the FairLoan AI shield logo from screenshot */}
                <div className="relative flex items-center justify-center">
                    <Shield className="w-7 h-7 text-primary-600 fill-white z-10 transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-primary-50 rounded-full scale-110 -z-0 group-hover:bg-primary-100 transition-colors"></div>
                </div>
                <span className="text-[20px] font-extrabold tracking-tight text-[#111827]">
                    FairLoan AI
                </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-[14px] font-semibold text-slate-500">
                <Link to="#solutions" className="hover:text-slate-900 transition-colors">Solutions</Link>
                <Link to="#compliance" className="hover:text-slate-900 transition-colors">Compliance</Link>
                <Link to="/about" className="hover:text-slate-900 transition-colors">About</Link>
            </nav>

            <div className="flex items-center gap-6">
                {isAuthenticated ? (
                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen((prev) => !prev)}
                            className="inline-flex items-center gap-3 px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center">
                                {initials || <UserCircle2 className="w-4 h-4" />}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-[13px] font-semibold text-slate-900 leading-tight">
                                    {user?.name || 'Profile'}
                                </p>
                                <p className="text-[11px] text-slate-500 uppercase tracking-wider">
                                    {user?.role || 'user'}
                                </p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-slate-500" />
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
