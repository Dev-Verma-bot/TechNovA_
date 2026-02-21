import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Globe, Target, Share2 } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#0b1121] text-white pt-16 pb-8">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 border-b border-slate-800 pb-12 mb-8">
                <div className="md:col-span-4 lg:col-span-5 pr-8">
                    <div className="flex items-center gap-2 mb-8 group">
                        <div className="relative flex items-center justify-center">
                            <Shield className="w-7 h-7 text-primary-600 fill-white z-10 transition-transform group-hover:scale-105" />
                            <div className="absolute inset-0 bg-primary-500 rounded-full scale-110 -z-0 group-hover:bg-primary-600 transition-colors"></div>
                        </div>
                        <span className="text-[20px] font-extrabold tracking-tight text-white">
                            CredNova
                        </span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed mb-6 font-medium max-w-sm">
                        Empowering financial institutions with transparent, fair, and faster credit decisioning powered by explainable artificial intelligence.
                    </p>
                    <div className="flex items-center gap-4 text-slate-400">
                        <Globe className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                        <Target className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                        <Share2 className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                    </div>
                </div>

                <div className="md:col-span-2 lg:col-span-2">
                    <h3 className="font-bold text-white mb-6 text-xs tracking-wider uppercase">Product</h3>
                    <ul className="space-y-4 text-sm font-medium text-slate-400">
                        <li><Link to="/apply" className="hover:text-white transition-colors">Credit Scoring</Link></li>
                        <li><Link to="/simulator" className="hover:text-white transition-colors">Risk Analysis</Link></li>
                        <li><a href="#" className="hover:text-white transition-colors">XAI Module</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
                    </ul>
                </div>

                <div className="md:col-span-2 lg:col-span-2">
                    <h3 className="font-bold text-white mb-6 text-xs tracking-wider uppercase">Company</h3>
                    <ul className="space-y-4 text-sm font-medium text-slate-400">
                        <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                    </ul>
                </div>

                <div className="md:col-span-2 lg:col-span-2">
                    <h3 className="font-bold text-white mb-6 text-xs tracking-wider uppercase">Support</h3>
                    <ul className="space-y-4 text-sm font-medium text-slate-400">
                        <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                    </ul>
                </div>

                <div className="md:col-span-2 lg:col-span-1">
                    <h3 className="font-bold text-white mb-6 text-xs tracking-wider uppercase">Privacy Policy</h3>
                    <ul className="space-y-4 text-sm font-medium text-slate-400">
                        <li><a href="#" className="hover:text-white transition-colors">SOC2 Type II</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">FCRA</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Fair Lending</a></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center text-[13px] font-[500] text-slate-500 mt-10">
                © {new Date().getFullYear()} CredNova Systems Inc. All rights reserved. Decisions are made using proprietary explainable neural networks.
            </div>
        </footer>
    );
};

export default Footer;

