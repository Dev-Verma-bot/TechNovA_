import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

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
                <Link to="/login" className="inline-flex items-center justify-center px-5 py-[9px] text-[13px] font-bold text-white bg-primary-500 rounded-md hover:bg-primary-600 transition-colors shadow-sm">
                    Get Started
                </Link>
            </div>
        </header>
    );
};

export default Navbar;
