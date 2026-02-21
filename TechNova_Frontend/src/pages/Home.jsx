import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, Zap, ChevronRight, CheckCircle2, Building2, Shield, Leaf, Layout, ArrowRight, BarChart3, Activity, Info, Scale, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppDispatch';

const Home = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth || {});

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="flex flex-col items-center w-full px-0 bg-slate-50 overflow-hidden">

      {/* 1. Hero Section */}
      <section className="w-full relative px-6 md:px-12 lg:px-24 min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden bg-white py-12 lg:py-0">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#eff6ff] rounded-full blur-[120px] opacity-70 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#eff6ff] rounded-full blur-[100px] opacity-70 translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

        <div className="w-full max-w-[1150px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr,460px] gap-12 lg:gap-16 items-center relative z-10">

          {/* Hero Content (Left) */}
          <motion.div variants={container} initial="hidden" animate="show" className="max-w-xl">
            <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f0f4ff] text-[#1a73e8] text-[11px] font-[800] uppercase tracking-wider mb-6 border border-primary-100/30">
              <ShieldCheck className="w-4 h-4 text-[#1a73e8]" />
              Next-Gen Credit Scoring
            </motion.div>

            <motion.h1 variants={item} className="text-[56px] sm:text-[64px] lg:text-[76px] xl:text-[88px] font-[900] tracking-[-0.03em] text-[#0f172a] mb-6 leading-[1.05]">
              Fairer Loans <br className="hidden lg:block" /> through <span className="text-[#1a73e8]">Explainable</span> <br className="hidden lg:block" /> <span className="text-[#1a73e8]">AI</span>
            </motion.h1>

            <motion.p variants={item} className="text-[17px] sm:text-[20px] text-slate-500 mb-10 max-w-[500px] font-[500] leading-[1.6]">
              Move beyond black-box credit scoring. Our platform provides transparent, regulatory-compliant loan decisions in seconds.
            </motion.p>

            <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/apply" className="group relative inline-flex items-center justify-center px-8 py-[18px] text-[16px] font-[800] text-white bg-[#1a73e8] rounded-[12px] hover:bg-[#1557b0] transition-all shadow-[0_8px_20px_rgba(26,115,232,0.25)] w-full sm:w-auto">
                Apply for a Loan
                <ArrowRight className="ml-2 w-5 h-5 transition-transform" />
              </Link>
              {!isAuthenticated && (
                <Link to="/login" className="inline-flex items-center justify-center px-8 py-[18px] text-[16px] font-[800] text-[#0f172a] bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#f1f5f9] rounded-[12px] transition-all w-full sm:w-auto">
                  Request a Demo
                </Link>
              )}
            </motion.div>
          </motion.div>

          {/* Hero Visual (Right) - Inspired by image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full flex items-center justify-center mt-8 lg:mt-0"
          >
            {/* Main Floating Card */}
            <div className="relative w-full bg-white rounded-[24px] p-8 lg:p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-[#f1f5f9] z-10 mx-auto">
              <div className="flex justify-between items-center mb-8">
                <span className="text-[12px] font-[800] text-slate-500 uppercase tracking-widest">Analysis Engine</span>
                <div className="flex bg-[#f0f4ff] rounded-full h-2 w-10 overflow-hidden">
                  <div className="w-[60%] h-full bg-[#1a73e8] rounded-full"></div>
                </div>
              </div>

              <div className="flex items-center gap-6 mb-10">
                <div className="w-[64px] h-[64px] rounded-[16px] bg-[#f0f4ff] flex items-center justify-center shrink-0">
                  <BarChart3 className="w-8 h-8 text-[#1a73e8]" />
                </div>
                <div>
                  <h4 className="text-[36px] font-[900] text-[#0f172a] leading-none mb-2">Score: 742</h4>
                  <p className="text-[14px] font-[800] text-[#10b981]">
                    Decision: Approved
                  </p>
                </div>
              </div>

              <div className="space-y-0 text-[14px] mb-12">
                <div className="flex justify-between items-center py-4 border-t border-slate-50">
                  <div className="flex items-center gap-3 font-[500] text-slate-600">
                    <Info className="w-[15px] h-[15px] text-slate-300" /> On-time payment history
                  </div>
                  <span className="font-[800] text-[#10b981]">+42 pts</span>
                </div>
                <div className="flex justify-between items-center py-4 border-t border-slate-50">
                  <div className="flex items-center gap-3 font-[500] text-slate-600">
                    <Info className="w-[15px] h-[15px] text-slate-300" /> Credit utilization ratio
                  </div>
                  <span className="font-[800] text-[#10b981]">+15 pts</span>
                </div>
                <div className="flex justify-between items-center py-4 border-t border-slate-50">
                  <div className="flex items-center gap-3 font-[500] text-slate-400">
                    <Info className="w-[15px] h-[15px] text-slate-200" /> Account age impact
                  </div>
                  <span className="font-[800] text-slate-300">-5 pts</span>
                </div>
              </div>

              {/* Decorative Chart */}
              <div className="flex items-end h-[80px] gap-1.5 -mx-4 -mb-4 px-4 bg-[#f8fafc]/50 rounded-b-[24px] pt-4 border-t border-slate-50 overflow-hidden">
                <div className="w-full bg-[#93c5fd] rounded-t-[4px] h-[35%]"></div>
                <div className="w-full bg-[#60a5fa] rounded-t-[4px] h-[55%]"></div>
                <div className="w-full bg-[#60a5fa] rounded-t-[4px] h-[65%]"></div>
                <div className="w-full bg-[#1a73e8] rounded-t-[4px] h-[100%] shadow-[0_0_20px_rgba(26,115,232,0.5)] z-10 relative"></div>
                <div className="w-full bg-[#3b82f6] rounded-t-[4px] h-[75%]"></div>
                <div className="w-full bg-[#60a5fa] rounded-t-[4px] h-[60%]"></div>
              </div>
            </div>

            {/* Small accent floating circle */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 w-[120px] h-[120px] bg-[#f0f4ff]/90 backdrop-blur-md rounded-full border border-white shadow-[0_20px_40px_rgba(0,0,0,0.06)] flex items-center justify-center z-20"
            >
              <Landmark className="w-12 h-12 text-[#1a73e8]" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. Trusted By Banner */}
      <section className="w-full bg-[#f8fafc] border-y border-slate-100 py-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <p className="text-[12px] font-[800] text-slate-500 tracking-[0.2em] mb-10 uppercase">Trusted by industry leaders & regulators</p>
          <div className="flex flex-wrap justify-center gap-10 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2.5 text-slate-700 font-[800] text-[18px]"><Building2 className="w-6 h-6" /> GLOBAL BANK</div>
            <div className="flex items-center gap-2.5 text-slate-700 font-[800] text-[18px]"><Shield className="w-6 h-6" /> FEDERAL REG</div>
            <div className="flex items-center gap-2.5 text-slate-700 font-[800] text-[18px]"><Leaf className="w-6 h-6" /> NEOFIN</div>
            <div className="flex items-center gap-2.5 text-slate-700 font-[800] text-[18px]"><Layout className="w-6 h-6" /> PRIME CAP</div>
            <div className="flex items-center gap-2.5 text-slate-700 font-[800] text-[18px]"><ShieldCheck className="w-6 h-6" /> TRUSTCO</div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section className="w-full bg-white py-24 pb-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-[36px] lg:text-[44px] font-[900] text-[#0f172a] mb-6 tracking-tight">
            Transparent Decisions, Unbiased Growth
          </h2>
          <p className="text-[18px] text-slate-500 max-w-2xl mx-auto font-[500] mb-20 leading-relaxed">
            Our XAI engine ensures every loan decision is fair, explainable, and fully compliant with global banking standards.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-6xl mx-auto">
            {[
              {
                icon: Activity,
                title: 'Regulatory Compliant',
                description: 'Built for GDPR and FCRA standards with automated audit trails and model validation reporting.'
              },
              {
                icon: Scale, // We added Scale to the imports
                title: 'Eliminate Bias',
                description: 'Fair lending practices powered by transparent data models that remove hidden socioeconomic biases.'
              },
              {
                icon: Zap,
                title: 'Instant Clarity',
                description: 'Applicants receive clear, actionable reasons for every credit decision instantly, increasing trust and retention.'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                className="p-8 rounded-[20px] bg-white border border-[#e2e8f0] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all"
              >
                <div className="w-12 h-12 rounded-[12px] bg-[#eff6ff] flex items-center justify-center mb-6">
                  <feature.icon className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="text-[20px] font-[800] text-[#0f172a] mb-4">{feature.title}</h3>
                <p className="text-[15px] text-slate-500 font-[500] leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Explainability Detail Section */}
      <section className="w-full bg-[#f8fafc] py-24 overflow-hidden border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Visual Demo Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="w-full max-w-[500px] bg-white rounded-[24px] p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-[#f1f5f9] mx-auto">

              {/* Mock user header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 font-[800] flex items-center justify-center text-[15px]">JD</div>
                <div>
                  <h4 className="text-[16px] font-[800] text-slate-900 leading-tight">John Doe</h4>
                  <p className="text-[13px] text-slate-400 font-[500]">Applicant ID: #44892</p>
                </div>
              </div>

              <p className="text-[12px] font-[800] text-slate-400 tracking-widest uppercase mb-6">Reasoning Model Output</p>

              <div className="space-y-6 mb-8">
                <div>
                  <div className="flex justify-between text-[13px] font-[800] mb-2">
                    <span className="text-[#0f172a]">Credit Utilization</span>
                    <span className="text-[#10b981]">High Positive Impact</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-[#10b981] rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[13px] font-[800] mb-2">
                    <span className="text-[#0f172a]">Length of History</span>
                    <span className="text-primary-500">Medium Positive Impact</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[60%] h-full bg-primary-500 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[13px] font-[800] mb-2">
                    <span className="text-[#0f172a]">Recent Inquiries</span>
                    <span className="text-slate-400">Neutral</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[20%] h-full bg-slate-300 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-[#ecfdf5] rounded-[16px] text-[14px] text-[#059669] font-[500] italic leading-relaxed">
                "The decision to approve was primarily driven by your consistent debt-to-income ratio (15%) and an flawless 48-month payment streak."
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <h2 className="text-[36px] lg:text-[44px] font-[900] text-[#0f172a] mb-6 tracking-tight leading-[1.15]">
              Decisions you can actually <br /> defend.
            </h2>
            <p className="text-[18px] text-slate-500 mb-10 font-[500] leading-relaxed">
              Traditional AI is a black box. Our XAI framework reveals the 'Why' behind every approval or denial, providing legally required adverse action reasons automatically.
            </p>

            <ul className="space-y-6 mb-12">
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#10b981] shrink-0 mt-0.5" />
                <span className="text-slate-600 font-[500] text-[17px]">Automatic generation of Adverse Action Notices.</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#10b981] shrink-0 mt-0.5" />
                <span className="text-slate-600 font-[500] text-[17px]">Explainable feature importance for every individual score.</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#10b981] shrink-0 mt-0.5" />
                <span className="text-slate-600 font-[500] text-[17px]">Bias detection tools to ensure equitable lending.</span>
              </li>
            </ul>

            <Link to="/simulator" className="inline-flex items-center text-[17px] text-primary-600 font-[800] hover:text-primary-700 transition-colors">
              Learn more about our XAI Engine <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </motion.div>

        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="w-full bg-[#1877F2] relative overflow-hidden py-24 lg:py-32 flex justify-center text-center">
        {/* Wave Graphic Overlay loosely matching image visual */}
        <div className="absolute bottom-0 left-0 w-full h-[500px] pointer-events-none opacity-20">
          <svg viewBox="0 0 1440 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
            <path d="M0,250 C320,500 420,-100 1440,300 L1440,500 L0,500 Z" stroke="white" strokeWidth="2" fill="none" />
            <path d="M0,350 C420,100 820,400 1440,200 L1440,500 L0,500 Z" stroke="white" strokeWidth="2" fill="none" opacity="0.5" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center">
          <h2 className="text-[40px] lg:text-[52px] font-[900] text-white mb-8 tracking-tight">
            Ready to modernize your credit scoring?
          </h2>
          <div className="inline-flex items-center px-6 py-2.5 bg-white/20 rounded-full text-white text-[16px] font-[500] mb-12 backdrop-blur-sm">
            Join 50+ financial institutions using CredNova
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;

