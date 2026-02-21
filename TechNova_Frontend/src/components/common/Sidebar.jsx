import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Scale, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Bias & Fairness', href: '/admin/fairness', icon: Scale },
        { name: 'Logout', href: '#logout', icon: LogOut, action: 'logout' },
    ];

    return (
        <aside className="w-64 flex-shrink-0 bg-slate-900 flex flex-col items-stretch text-slate-300 transition-all duration-300 border-r border-slate-800">
            <div className="h-16 flex items-center px-6 gap-2">
                <div className="relative flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary-500 fill-white z-10" />
                    <div className="absolute inset-0 bg-primary-900 rounded-full scale-110 -z-0"></div>
                </div>
                <span className="text-lg font-bold tracking-tight text-white">
                    FairLoan <span className="text-primary-400 font-normal">Admin</span>
                </span>
            </div>

            <nav className="flex-1 mt-6 px-3 space-y-1">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <button
                            key={item.name}
                            type="button"
                            onClick={() => {
                                if (item.action === 'logout') {
                                    logout();
                                    navigate('/logout-success');
                                    return;
                                }
                                navigate(item.href);
                            }}
                            className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-slate-800 text-white shadow-sm' : 'hover:bg-slate-800/50 hover:text-white'
                                }`}
                        >
                            <item.icon className={`flex-shrink-0 mr-3 h-5 w-5 ${isActive ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                            {item.name}
                        </button>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-slate-800 m-3 rounded-xl bg-slate-800/30">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                        AD
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">Admin User</p>
                        <p className="text-xs text-slate-400 truncate">admin@fairloan.ai</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
