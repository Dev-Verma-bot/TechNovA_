import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Activity, ArrowRight, CheckCircle2, Clock, AlertCircle, PlayCircle } from 'lucide-react';

const UserDashboard = () => {
    // Mock data for the demonstration
    const recentApplications = [
        { id: 'APP-8921A', amount: '$45,000', status: 'approved', date: 'Oct 12, 2023', score: 742 },
        { id: 'APP-7643B', amount: '$12,500', status: 'pending', date: 'Oct 24, 2023', score: '--' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-success/10 text-success border-success/20';
            case 'pending': return 'bg-warning/10 text-warning border-warning/20';
            case 'rejected': return 'bg-danger/10 text-danger border-danger/20';
            default: return 'bg-slate-100 text-slate-500 border-slate-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <CheckCircle2 className="w-4 h-4" />;
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'rejected': return <AlertCircle className="w-4 h-4" />;
            default: return null;
        }
    }

    return (
        <div className="flex-1 bg-slate-50 py-12 px-6 lg:px-12">
            <div className="max-w-[1200px] mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-[900] text-slate-900 tracking-tight mb-2">Welcome back, John!</h1>
                        <p className="text-slate-500 font-medium">Here is a summary of your loan applications and credit profile.</p>
                    </div>
                    <Link to="/apply" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl text-sm font-bold shadow-soft hover:bg-primary-700 hover:-translate-y-0.5 transition-all">
                        <FileText className="w-4 h-4" />
                        New Application
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content Area: Applications */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-8"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-[800] text-slate-900">Recent Applications</h2>
                                <Link to="/applications" className="text-sm font-bold text-primary-600 hover:text-primary-700">View All</Link>
                            </div>

                            <div className="space-y-4">
                                {recentApplications.map((app, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${app.status === 'approved' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{app.id}</h4>
                                                <p className="text-xs font-medium text-slate-500">Submitted on {app.date}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                            <div className="text-right">
                                                <p className="font-bold text-slate-900">{app.amount}</p>
                                                <p className="text-xs font-medium text-slate-500">Credit Score: {app.score}</p>
                                            </div>
                                            <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${getStatusColor(app.status)}`}>
                                                {getStatusIcon(app.status)}
                                                {app.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {recentApplications.length === 0 && (
                                    <div className="text-center py-12 rounded-2xl border border-dashed border-slate-200">
                                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                        <h3 className="font-bold text-slate-700 mb-1">No applications yet</h3>
                                        <p className="text-sm text-slate-500 mb-4">You haven't submitted any loan applications.</p>
                                        <Link to="/apply" className="text-sm font-bold text-primary-600">Start an application &rarr;</Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Quick Tools */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[24px] p-8 text-white relative overflow-hidden group hover:shadow-lg transition-all cursor-pointer">
                                <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                                <PlayCircle className="w-8 h-8 text-white/80 mb-6" />
                                <h3 className="text-lg font-bold mb-2">What-If Simulator</h3>
                                <p className="text-sm text-indigo-100 font-medium leading-relaxed mb-6">
                                    Curious how a new credit card or an expanded credit line impacts your score? Simulate it instantly.
                                </p>
                                <Link to="/simulator" className="inline-flex items-center text-sm font-bold text-white hover:text-indigo-100 transition-colors">
                                    Open Simulator <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </div>

                            <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-8 flex flex-col justify-between">
                                <div>
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                                        <Activity className="w-5 h-5 text-slate-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Transparency Report</h3>
                                    <p className="text-sm text-slate-500 font-medium mb-4">
                                        Download a full breakdown of why previous decisions were made using our XAI Engine.
                                    </p>
                                </div>
                                <button className="text-left text-sm font-bold text-primary-600 hover:text-primary-700">Request Report &rarr;</button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Sidebar: Profile Snapshot */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-8">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Credit Snapshot</h3>

                            <div className="flex items-end gap-3 mb-8">
                                <span className="text-5xl font-[900] text-slate-900 leading-none">742</span>
                                <span className="text-sm font-bold text-success mb-1 flex items-center gap-1">
                                    Good
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden flex">
                                    <div className="bg-danger h-2.5 rounded-l-full" style={{ width: '20%' }}></div>
                                    <div className="bg-warning h-2.5" style={{ width: '40%' }}></div>
                                    <div className="bg-success h-2.5 rounded-r-full" style={{ width: '40%' }}></div>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-slate-400">
                                    <span>300</span>
                                    <span>850</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-50 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-slate-500">Payment History</span>
                                    <span className="font-bold text-success">Excellent (100%)</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-slate-500">Credit Utilization</span>
                                    <span className="font-bold text-warning">Fair (32%)</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-slate-500">Derogatory Marks</span>
                                    <span className="font-bold text-success">Good (0)</span>
                                </div>
                            </div>
                        </div>

                        {/* Educational Promo */}
                        <div className="bg-primary-50 rounded-[24px] border border-primary-100 p-8 text-center">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-primary-600">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-slate-900 mb-2">Build your credit safely</h4>
                            <p className="text-sm font-medium text-slate-600 mb-6 leading-relaxed">
                                Understanding our XAI models can help you optimize your profile for future loans.
                            </p>
                            <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm w-full">
                                Read Guide
                            </button>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
