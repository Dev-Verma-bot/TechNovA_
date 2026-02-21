import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, ArrowRight, CheckCircle2, User, Eye, EyeOff, Phone } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { sendSignupOtpService } from '../services/Operations';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        otp: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [otpMessage, setOtpMessage] = useState('');
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendOtp = async () => {
        setSubmitError('');
        setOtpMessage('');

        if (!formData.email) {
            setSubmitError('Enter email first to send OTP.');
            return;
        }

        try {
            setIsSendingOtp(true);
            const response = await sendSignupOtpService({ email: formData.email });
            const message = response?.data?.message || 'OTP sent to your email.';
            const devOtp = response?.data?.devOtp;

            if (devOtp) {
                setFormData((prev) => ({ ...prev, otp: String(devOtp) }));
                setOtpMessage(`${message} (Local OTP auto-filled)`);
            } else {
                setOtpMessage(message);
            }
        } catch (err) {
            setSubmitError(err?.response?.data?.message || 'Failed to send OTP.');
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');

        const payload = {
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            email: formData.email,
            password: formData.password,
            otp: formData.otp,
        };

        if (!payload.name) {
            setIsSubmitting(false);
            setSubmitError('Name is required.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setIsSubmitting(false);
            setSubmitError('Passwords do not match.');
            return;
        }
        if (!payload.otp) {
            setIsSubmitting(false);
            setSubmitError('OTP is required.');
            return;
        }
        const result = await register(payload);
        setIsSubmitting(false);

        if (!result.ok) {
            setSubmitError('Registration failed. Please check your details.');
            return;
        }

        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl opacity-60 translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-5xl bg-white rounded-[24px] shadow-card border border-slate-100 flex flex-col md:flex-row-reverse overflow-hidden relative z-10"
            >
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-8 text-center md:text-left text-slate-900">
                        <Link to="/" className="inline-flex items-center gap-2 mb-8 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                                <Shield className="w-6 h-6 text-primary-600 fill-white z-10" />
                                <div className="absolute inset-0 bg-primary-50 rounded-full scale-110 -z-0 group-hover:bg-primary-100 transition-colors"></div>
                            </div>
                            <span className="text-[18px] font-extrabold tracking-tight">CredNova</span>
                        </Link>
                        <h2 className="text-3xl font-[900] tracking-tight mb-2">Create an account</h2>
                        <p className="text-slate-500 font-medium text-[15px]">Start modernizing your credit decisions today.</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[12px] text-[15px] font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 000-0000"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[12px] text-[15px] font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[12px] text-[15px] font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-400"
                                />
                            </div>

                            <div className="mt-2">
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={isSendingOtp}
                                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold disabled:opacity-70"
                                >
                                    {isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">OTP</label>
                            <input
                                type="text"
                                name="otp"
                                value={formData.otp}
                                onChange={handleChange}
                                placeholder="Enter 6-digit OTP"
                                required
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[12px] text-[15px] font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-400"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a strong password"
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

                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    required
                                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-[12px] text-[15px] font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-4">
                            {otpMessage && (
                                <p className="mb-2 text-sm font-semibold text-green-600">{otpMessage}</p>
                            )}
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
                                        Create Account <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-[14px] font-medium text-slate-500">
                        Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:text-primary-700">Sign in instead</Link>
                    </p>
                </div>

                <div className="hidden md:flex w-1/2 bg-slate-900 p-12 relative flex-col justify-between overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-slate-900 z-0"></div>
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-600 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/4 pointer-events-none z-0"></div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/20 text-primary-300 text-[11px] font-[800] uppercase tracking-wider mb-8 border border-primary-500/30 backdrop-blur-md">
                            <Shield className="w-3.5 h-3.5" />
                            Secure Onboarding
                        </div>
                        <h3 className="text-3xl font-[900] tracking-tight text-white mb-6 leading-snug">
                            Join the future of fair and unbiased lending.
                        </h3>
                        <p className="text-[15px] font-medium text-slate-300 leading-relaxed max-w-md mb-8">
                            Get complete access to our Explainable AI underwriting dashboard and start processing loans with unparalleled transparency.
                        </p>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <div className="mt-1 bg-success/20 p-1 rounded-full text-success">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white mb-1">Instant Model Sandbox</h4>
                                <p className="text-xs font-medium text-slate-400">Test dummy data immediately without integration overhead.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <div className="mt-1 bg-primary-500/20 p-1 rounded-full text-primary-400">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white mb-1">API Documentation</h4>
                                <p className="text-xs font-medium text-slate-400">Access developer keys to deploy AI scoring at scale.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;

