import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, ArrowRight, CheckCircle2, Building2, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const location = useLocation();
    const [loginMode, setLoginMode] = useState(location.state?.mode || 'applicant');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        if (location.state?.mode) {
            setLoginMode(location.state.mode);
        }
    }, [location.state?.mode]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');
        const result = await login(email, password);
        setIsSubmitting(false);

        if (!result.ok) {
            setSubmitError('Invalid email or password.');
            return;
        }

        if (result.user.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl opacity-60 translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-5xl bg-white rounded-[24px] shadow-card border border-slate-100 flex flex-col md:flex-row overflow-hidden relative z-10"
            >
                {/* Left Side: Login Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-10 text-center md:text-left text-slate-900">
                        <Link to="/" className="inline-flex items-center gap-2 mb-8 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                                <Shield className="w-6 h-6 text-primary-600 fill-white z-10" />
                                <div className="absolute inset-0 bg-primary-50 rounded-full scale-110 -z-0 group-hover:bg-primary-100 transition-colors"></div>
                            </div>
                            <span className="text-[18px] font-extrabold tracking-tight">CredNova</span>
                        </Link>
                        <h2 className="text-3xl font-[900] tracking-tight mb-2">
                            {loginMode === 'admin' ? 'Admin Login' : 'Welcome back'}
                        </h2>
                        <p className="text-slate-500 font-medium text-[15px]">
                            {loginMode === 'admin' ? 'Sign in to access the administrator panel.' : 'Sign in to your account to continue.'}
                        </p>
                    </div>

                    {/* Login Mode Toggle on the Form */}
                    <div className="flex items-center p-1 bg-slate-100 rounded-xl mb-6">
                        <button
                            type="button"
                            onClick={() => setLoginMode('applicant')}
                            className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${loginMode === 'applicant' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Applicant
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginMode('admin')}
                            className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${loginMode === 'admin' ? 'bg-white shadow-sm text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Administrator
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[12px] text-[15px] font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-400"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center mb-2">
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Password</label>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                        className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-[12px] text-[15px] font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            {submitError && (
                                <p className="mb-3 text-sm font-semibold text-red-600">{submitError}</p>
                            )}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 text-white rounded-[12px] text-[15px] font-bold shadow-soft hover:bg-primary-700 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:pointer-events-none"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Sign in to Dashboard <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {loginMode !== 'admin' && (
                        <p className="mt-8 text-center text-[14px] font-medium text-slate-500">
                            Don't have an account? <Link to="/register" className="text-primary-600 font-bold hover:text-primary-700">Sign Up</Link>
                        </p>
                    )}

                    {/* Hint */}
                    <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                        <Shield className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                        <p className="text-[12px] font-medium text-slate-500 leading-relaxed">
                            Login now uses your backend API and routes based on the user role returned by the server.
                        </p>
                    </div>
                </div>

                {/* Right Side: Visual Context */}
                <div className="hidden md:flex w-1/2 bg-[#0b1121] p-12 relative flex-col justify-between overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                        <svg viewBox="0 0 100 100" className="w-full h-full fill-white" preserveAspectRatio="xMidYMid slice">
                            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <circle cx="2" cy="2" r="1"></circle>
                            </pattern>
                            <rect width="100" height="100" fill="url(#grid)"></rect>
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-[11px] font-[800] uppercase tracking-wider mb-8 border border-white/20 backdrop-blur-md">
                            <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                            Enterprise Grade Security
                        </div>
                        <h3 className="text-3xl font-[900] tracking-tight text-white mb-6 leading-snug">
                            Trusted by top financial institutions globally.
                        </h3>
                        <p className="text-[15px] font-medium text-slate-400 leading-relaxed max-w-md mb-8">
                            Experience fully transparent, XAI-driven risk decisioning with SOC2 & GDPR compliant data pipelines.
                        </p>
                    </div>

                    <div className="relative z-10 w-full max-w-sm bg-white/10 backdrop-blur-md rounded-[20px] p-6 border border-white/10 shadow-2xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-[15px]">Bank of Americas</h4>
                                <p className="text-success text-[12px] font-bold">System Status: Operable</p>
                            </div>
                        </div>
                        <div className="space-y-4 text-[13px] font-medium text-slate-300">
                            <div className="flex justify-between items-center py-2 border-b border-white/10">
                                <span>Active Decisions</span>
                                <span className="text-white font-bold">14,293</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/10">
                                <span>Explanation Render Time</span>
                                <span className="text-white font-bold">24 ms</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span>Model Bias Flag</span>
                                <span className="text-white font-bold inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-md">None Detected</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;

