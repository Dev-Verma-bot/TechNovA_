import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sliders, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';

const WhatIfSimulator = () => {
   const [income, setIncome] = useState(75000);
   const [debt, setDebt] = useState(25000);
   const [creditHistory, setCreditHistory] = useState(5);
   const [recentInquiries, setRecentInquiries] = useState(2);
   
   const [score, setScore] = useState(720);
   const [decision, setDecision] = useState('approved');
   const [isCalculating, setIsCalculating] = useState(false);

   useEffect(() => {
      setIsCalculating(true);
      const timer = setTimeout(() => {
         // Mock algorithm for demonstration
         let baseScore = 600;
         baseScore += (income / 1000) * 1.5;
         baseScore -= (debt / 1000) * 2;
         baseScore += creditHistory * 15;
         baseScore -= recentInquiries * 10;
         
         const finalScore = Math.min(Math.max(Math.round(baseScore), 300), 850);
         setScore(finalScore);
         setDecision(finalScore >= 680 ? 'approved' : finalScore >= 600 ? 'manual' : 'declined');
         setIsCalculating(false);
      }, 600);

      return () => clearTimeout(timer);
   }, [income, debt, creditHistory, recentInquiries]);

   const scoreColor = score >= 750 ? 'text-success' : score >= 680 ? 'text-primary-600' : score >= 600 ? 'text-warning' : 'text-danger';
   const scoreBg = score >= 750 ? 'bg-success/10 border-success/20' : score >= 680 ? 'bg-primary-50 border-primary-200' : score >= 600 ? 'bg-warning/10 border-warning/20' : 'bg-danger/10 border-danger/20';

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-12">
      <div className="mb-10 text-center">
         <h1 className="text-3xl font-extrabold text-slate-900 mb-4 flex items-center justify-center gap-3">
            <Sliders className="w-8 h-8 text-primary-600" /> What-If Simulator
         </h1>
         <p className="text-slate-500 font-medium max-w-2xl mx-auto">
            Interactive AI model testing. Adjust the parameters below to instantly see how different financial profiles affect the NovaCredit decision engine.
         </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Controls Panel */}
         <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-8 border-b-2 border-slate-100 pb-2 uppercase tracking-wider">Input Parameters</h3>
            
            <div className="space-y-8">
               <div>
                  <div className="flex justify-between mb-2">
                     <label className="text-sm font-bold text-slate-700">Annual Income</label>
                     <span className="text-sm font-semibold text-primary-700 bg-primary-50 px-3 py-1 rounded-full">INR {income.toLocaleString('en-IN')}</span>
                  </div>
                  <input 
                     type="range" 
                     min="20000" 
                     max="200000" 
                     step="1000" 
                     value={income} 
                     onChange={(e) => setIncome(Number(e.target.value))}
                     className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 font-medium mt-2">
                     <span>INR 20k</span>
                     <span>INR 200k+</span>
                  </div>
               </div>

               <div>
                  <div className="flex justify-between mb-2">
                     <label className="text-sm font-bold text-slate-700">Total Existing Debt</label>
                     <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">INR {debt.toLocaleString('en-IN')}</span>
                  </div>
                  <input 
                     type="range" 
                     min="0" 
                     max="100000" 
                     step="1000" 
                     value={debt} 
                     onChange={(e) => setDebt(Number(e.target.value))}
                     className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 font-medium mt-2">
                     <span>INR 0</span>
                     <span>INR 100k+</span>
                  </div>
               </div>

               <div>
                  <div className="flex justify-between mb-2">
                     <label className="text-sm font-bold text-slate-700">Credit History (Years)</label>
                     <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">{creditHistory} years</span>
                  </div>
                  <input 
                     type="range" 
                     min="0" 
                     max="20" 
                     step="1" 
                     value={creditHistory} 
                     onChange={(e) => setCreditHistory(Number(e.target.value))}
                     className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 font-medium mt-2">
                     <span>New to Credit</span>
                     <span>20+ Years</span>
                  </div>
               </div>

               <div>
                  <div className="flex justify-between mb-2">
                     <label className="text-sm font-bold text-slate-700">Recent Inquiries (Last 6 Months)</label>
                     <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">{recentInquiries}</span>
                  </div>
                  <input 
                     type="range" 
                     min="0" 
                     max="10" 
                     step="1" 
                     value={recentInquiries} 
                     onChange={(e) => setRecentInquiries(Number(e.target.value))}
                     className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 font-medium mt-2">
                     <span>0</span>
                     <span>10+</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Result Panel */}
         <div className="lg:col-span-5 bg-slate-900 rounded-2xl border border-slate-800 shadow-float p-8 text-white relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
               <AlertTriangle className="w-64 h-64" />
            </div>

            <h3 className="text-lg font-bold text-slate-300 mb-8 border-b-2 border-slate-800 pb-2 uppercase tracking-wider relative z-10 flex items-center justify-between">
               Live AI Projection
               {isCalculating && <RefreshCw className="w-5 h-5 text-primary-400 animate-spin" />}
            </h3>

            <div className="flex-1 flex flex-col items-center justify-center relative z-10">
               <motion.div 
                  key={score}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', bounce: 0.5 }}
                  className="text-center"
               >
                  <p className="text-sm text-slate-400 font-semibold uppercase tracking-widest mb-4">Estimated Score</p>
                  <div className="text-8xl tabular-nums font-black tracking-tighter mb-8 drop-shadow-md">
                     {score}
                  </div>
               </motion.div>

               <motion.div
                  key={decision}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`w-full p-6 rounded-xl border-2 flex items-center gap-4 ${
                     decision === 'approved' ? 'bg-success/20 border-success/40' : 
                     decision === 'manual' ? 'bg-warning/20 border-warning/40' : 
                     'bg-danger/20 border-danger/40'
                  }`}
               >
                  <div className={`p-3 rounded-full ${
                     decision === 'approved' ? 'bg-success text-white' : 
                     decision === 'manual' ? 'bg-warning text-slate-900' : 
                     'bg-danger text-white'
                  }`}>
                     {decision === 'approved' ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                  </div>
                  <div>
                     <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">Projected Outcome</p>
                     <p className="text-xl font-bold uppercase tracking-wider">
                        {decision === 'approved' ? 'Auto-Approved' : decision === 'manual' ? 'Manual Review' : 'Auto-Declined'}
                     </p>
                  </div>
               </motion.div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default WhatIfSimulator;
