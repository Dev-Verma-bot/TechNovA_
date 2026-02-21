import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Scale, Brain, CircleCheck, ShieldCheck } from 'lucide-react';

const principles = [
  {
    icon: Eye,
    title: 'Absolute Transparency',
    description:
      'Every decision made by our AI is accompanied by a human-readable explanation of why the credit was approved or denied.',
  },
  {
    icon: Scale,
    title: 'Unbiased Fairness',
    description:
      'Our models are rigorously audited to ensure zero demographic disparity, focusing purely on creditworthiness and intent.',
  },
  {
    icon: Brain,
    title: 'Deep Explainability',
    description:
      'Moving beyond black-box models to feature-importance maps that help borrowers understand how to improve their scores.',
  },
];

const team = [
  { name: 'Vinil', role: 'AI Product Lead' },
  { name: 'Mandeep', role: 'ML Engineer' },
  { name: 'Tanveer', role: 'Risk Analyst' },
  { name: 'Dev', role: 'Backend Architect' },
  { name: 'Aryan', role: 'Frontend Engineer' },
];

const About = () => {
  return (
    <div className="w-full bg-[#f4f6f8] text-slate-900">
      <section className="px-6 md:px-12 lg:px-20 py-20 md:py-28 text-center bg-[#f4f6f8]">
        <h1 className="text-[42px] md:text-[64px] leading-[1.05] tracking-tight font-black text-[#0f172a]">
          Trust through <span className="text-[#1a73e8]">Transparency</span>
        </h1>
        <p className="max-w-3xl mx-auto mt-6 text-[20px] leading-relaxed text-slate-600 font-medium">
          Bridging the gap between advanced neural networks and human-readable credit decisions. Our mission is to democratize lending through explainable AI.
        </p>

      </section>

      <section className="px-6 md:px-12 lg:px-20 py-16 bg-[#eef2f6] border-y border-slate-200/70">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {principles.map((item) => (
            <article key={item.title} className="rounded-2xl bg-transparent p-1">
              <div className="w-11 h-11 rounded-xl bg-[#dce8f7] flex items-center justify-center mb-5">
                <item.icon className="w-5 h-5 text-[#1a73e8]" />
              </div>
              <h3 className="text-[32px] leading-tight md:text-[30px] lg:text-[34px] font-black tracking-tight mb-4 text-[#0f172a]">
                {item.title}
              </h3>
              <p className="text-[17px] text-slate-600 leading-relaxed font-medium">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-20 py-20 bg-[#f4f6f8]">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="bg-[#edf1f5] border border-slate-200 rounded-2xl p-8 h-full">
            <h3 className="text-[42px] font-black tracking-tight text-[#0f172a]">Our Impact</h3>
            <p className="text-slate-500 font-medium mt-2 mb-7 text-[17px]">
              How users became successful with our explainable credit guidance.
            </p>

            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">
              <svg viewBox="0 0 260 260" className="w-[230px] h-[230px]" role="img" aria-label="User success pie chart">
                <circle cx="130" cy="130" r="98" fill="#dbeafe" />
                <path d="M130 130 L130 32 A98 98 0 1 1 45.13 179 Z" fill="#1a73e8" />
                <path d="M130 130 L45.13 179 A98 98 0 0 1 130 32 Z" fill="#93c5fd" />
                <circle cx="130" cy="130" r="52" fill="#edf1f5" />
                <text x="130" y="126" textAnchor="middle" fill="#0f172a" fontSize="26" fontWeight="800">74%</text>
                <text x="130" y="150" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="700">SUCCESS RATE</text>
              </svg>

              <div className="w-full space-y-4">
                <div className="flex items-center justify-between bg-[#f5f8fc] rounded-xl px-4 py-3 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-[#1a73e8]" />
                    <span className="text-slate-700 font-semibold">Improved Credit Outcome</span>
                  </div>
                  <span className="font-black text-[#0f172a]">74%</span>
                </div>
                <div className="flex items-center justify-between bg-[#f5f8fc] rounded-xl px-4 py-3 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-[#93c5fd]" />
                    <span className="text-slate-700 font-semibold">In Progress</span>
                  </div>
                  <span className="font-black text-[#0f172a]">26%</span>
                </div>
                <p className="text-sm text-slate-500 font-medium pt-1">
                  Based on user journeys that followed personalized recommendations from our AI decision engine.
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-[#d7e5fb] bg-gradient-to-br from-[#f8fbff] via-[#f2f7ff] to-[#eef4ff] p-6 md:p-7 shadow-[0_14px_36px_rgba(26,115,232,0.10)]">
            <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-[#1a73e8]/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-[#60a5fa]/20 blur-3xl" />

            <div className="relative z-10">
              <p className="inline-flex rounded-full bg-[#e6f0ff] px-4 py-1.5 text-[12px] uppercase tracking-[0.2em] text-[#1a73e8] font-extrabold mb-5">
                Technical Rigor
              </p>
              <h3 className="text-[34px] md:text-[40px] leading-[1.12] font-black tracking-tight text-[#0f172a] mb-5">
                Model Accuracy Meets Ethical Integrity
              </h3>

              <div className="flex flex-col md:flex-row md:items-start gap-5 mb-7">
                <div className="relative w-[96px] h-[96px] shrink-0">
                  <div className="absolute inset-0 rounded-full bg-[conic-gradient(#1a73e8_0deg,#1a73e8_346deg,#d8e6fb_346deg,#d8e6fb_360deg)]" />
                  <div className="absolute inset-[9px] rounded-full bg-white shadow-inner flex items-center justify-center">
                    <span className="text-[30px] leading-none font-black text-[#0f172a]">96%</span>
                  </div>
                </div>
                <p className="text-slate-700 text-[17px] md:text-[18px] leading-relaxed font-medium">
                  Our proprietary <span className="font-extrabold text-[#0f172a]">Insight Engine</span> maintains high predictive precision while reducing decision latency by <span className="font-extrabold text-[#0f172a]">40%</span> compared to legacy banking systems.
                </p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-[16px] md:text-[17px] font-medium text-slate-800 bg-white/70 border border-slate-200 rounded-xl px-4 py-2.5">
                  <CircleCheck className="w-5 h-5 mt-1 text-[#1a73e8] shrink-0" />
                  Continuous retraining on real-world credit feedback loops.
                </li>
                <li className="flex items-start gap-3 text-[16px] md:text-[17px] font-medium text-slate-800 bg-white/70 border border-slate-200 rounded-xl px-4 py-2.5">
                  <CircleCheck className="w-5 h-5 mt-1 text-[#1a73e8] shrink-0" />
                  Automated bias detection for over 40 demographic features.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-20 py-20 bg-[#edf1f5] border-y border-slate-200/70">
        <div className="max-w-[1280px] mx-auto text-center">
          <h2 className="text-[54px] leading-tight font-black tracking-tight text-[#0f172a]">Meet the Experts</h2>
          <p className="text-[18px] font-medium text-slate-500 mt-3">
            Combining decades of experience in high-finance and machine learning.
          </p>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
            {team.map((member) => (
              <article key={member.name} className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 text-white flex items-center justify-center text-xl font-extrabold shadow-sm">
                  {member.name
                    .split(' ')
                    .filter((token) => token !== 'Dr.')
                    .map((token) => token[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <h4 className="mt-4 text-[24px] font-black tracking-tight text-[#0f172a]">{member.name}</h4>
                <p className="mt-1 text-xs uppercase tracking-wider font-semibold text-slate-500">{member.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-20 py-16 bg-[#f4f6f8]">
        <div className="max-w-[1280px] mx-auto border-t border-slate-200 pt-12 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 text-[#0f172a] mb-4">
              <ShieldCheck className="w-5 h-5 text-[#1a73e8]" />
              <span className="text-xl font-black tracking-tight">CrediLogic</span>
            </div>
            <p className="text-slate-500 text-[15px] leading-relaxed font-medium">
              Setting the global standard for ethical credit scoring through transparency and innovative machine learning models.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-slate-500 font-extrabold mb-4">Technology</h4>
            <ul className="space-y-3 text-[15px] text-slate-700 font-medium">
              <li>Explainability API</li>
              <li>Risk Scoring</li>
              <li>Data Security</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-slate-500 font-extrabold mb-4">Legal & Privacy</h4>
            <ul className="space-y-3 text-[15px] text-slate-700 font-medium">
              <li>GDPR Compliance</li>
              <li>Fair Credit Act</li>
              <li><Link to="/privacy-policy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-slate-500 font-extrabold mb-4">Connect</h4>
            <ul className="space-y-3 text-[15px] text-slate-700 font-medium">
              <li>Contact Support</li>
              <li>LinkedIn</li>
              <li>Twitter (X)</li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto mt-10 pt-6 border-t border-slate-200 text-sm text-slate-500 flex flex-col md:flex-row justify-between gap-2">
          <p>© 2026 CrediLogic AI Solutions. All rights reserved.</p>
          <p>SSL Encrypted · FINRA Compliant</p>
        </div>

        <div className="max-w-[1280px] mx-auto mt-8 text-center">
          <Link
            to="/apply"
            className="inline-flex items-center justify-center rounded-xl bg-[#1a73e8] px-7 py-3 text-white font-bold hover:bg-[#1557b0] transition-colors"
          >
            Start Loan Application
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
