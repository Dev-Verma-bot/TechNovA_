import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldAlert, Info, TrendingUp, ArrowRight, LoaderCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Redux
import { useAppSelector } from '../../hooks/useAppDispatch';
import { selectDecision } from '../../redux/slices/riskSlice';

const CircularProgress = ({ value, color, delay = 0 }) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const step = value / 50;
      const interval = setInterval(() => {
        current += step;
        if (current >= value) {
          setAnimatedValue(value);
          clearInterval(interval);
        } else {
          setAnimatedValue(Math.floor(current));
        }
      }, 20);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [value, delay]);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedValue / 1000) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-40 h-40 transform -rotate-90">
        <circle
          cx="80"
          cy="80"
          r={radius}
          className="text-slate-100"
          strokeWidth="12"
          stroke="currentColor"
          fill="transparent"
        />
        <motion.circle
          cx="80"
          cy="80"
          r={radius}
          className={`${color} drop-shadow-sm`}
          strokeWidth="12"
           strokeDasharray={circumference}
           strokeDashoffset={strokeDashoffset}
           strokeLinecap="round"
           stroke="currentColor"
           fill="transparent"
           initial={{ strokeDashoffset: circumference }}
           animate={{ strokeDashoffset }}
           transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
         <span className="text-4xl font-extrabold text-slate-900 tracking-tighter tabular-nums">{animatedValue}</span>
         <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 mt-1">Score</span>
      </div>
    </div>
  );
};

const DecisionResult = () => {
    const { status, score, category, features, suggestions, applicationId, isLoading } = useAppSelector(selectDecision);
    const navigate = useNavigate();

    // Redirect to apply if user somehow hits this page manually without score
    useEffect(() => {
      if (!isLoading && score === null) {
          navigate('/apply');
      }
    }, [isLoading, score, navigate]);

   
   if (isLoading) {
     return (
       <div className="max-w-6xl mx-auto w-full px-4 py-32 flex flex-col items-center justify-center min-h-[50vh]">
         <LoaderCircle className="w-12 h-12 text-primary-500 animate-spin mb-4" />
         <h2 className="text-xl font-bold text-slate-900 mb-2">Analyzing Profile...</h2>
         <p className="text-slate-500">NovaCredit AI is securely evaluating your application.</p>
       </div>
     );
   }

   if (score === null) return null; // Avoid render errors immediately before route redirect
   
   const scoreColor = category === 'green' ? 'text-success' : category === 'yellow' ? 'text-warning' : 'text-danger';
   const scoreBg = category === 'green' ? 'bg-success/10' : category === 'yellow' ? 'bg-warning/10' : 'bg-danger/10';

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-8 lg:py-12">
      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="mb-10"
      >
         <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2">Decision Summary</h1>
         <p className="text-slate-500">Application #{applicationId || 'N/A'}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Result Card */}
         <div className="lg:col-span-1 flex flex-col gap-8">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.5, delay: 0.2 }}
               className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col items-center text-center relative overflow-hidden"
            >
               <div className={`absolute top-0 left-0 w-full h-1.5 ${scoreBg.replace('/10', '')}`} />
               
               <div className="mb-6 mt-4">
                  <CircularProgress value={score} color={scoreColor} delay={0.5} />
               </div>

               {status === 'approved' && (
                  <>
                     <div className="inline-flex items-center justify-center p-2 bg-success/10 text-success rounded-full mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                     </div>
                     <h2 className="text-2xl font-bold text-slate-900 mb-2">Congratulations!</h2>
                     <p className="text-slate-600 mb-6 font-medium">You are eligible to repay this loan.</p>
                  </>
               )}
               {status === 'manual' && (
                  <>
                     <div className="inline-flex items-center justify-center p-2 bg-warning/10 text-warning rounded-full mb-4">
                        <Info className="w-8 h-8" />
                     </div>
                     <h2 className="text-2xl font-bold text-slate-900 mb-2">Under Review</h2>
                     <p className="text-slate-600 mb-6 font-medium">Your profile requires manual verification.</p>
                  </>
               )}
               {status === 'declined' && (
                  <>
                     <div className="inline-flex items-center justify-center p-2 bg-danger/10 text-danger rounded-full mb-4">
                        <ShieldAlert className="w-8 h-8" />
                     </div>
                     <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Declined</h2>
                     <p className="text-slate-600 mb-6 font-medium">Unfortunately, we cannot approve this right now.</p>
                  </>
               )}
            </motion.div>

            {/* Improvement Suggestions */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, delay: 0.6 }}
               className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
            >
               <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-primary-600" />
                  <h3 className="text-lg font-bold text-slate-900">AI Advisory</h3>
               </div>
               <div className="space-y-4">
                  {suggestions.map((sug, idx) => (
                     <div key={idx} className="flex gap-4 items-start p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="w-8 h-8 shrink-0 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">
                           {idx + 1}
                        </div>
                        <div>
                           <h4 className="text-sm font-semibold text-slate-900 mb-1">{sug.title}</h4>
                           <p className="text-xs text-slate-500 leading-relaxed">{sug.description}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </motion.div>
         </div>

         {/* Explainable AI Panel */}
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 flex flex-col gap-8"
         >
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm h-full">
               <div className="flex items-center justify-between mb-8">
                  <div>
                     <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        Explainable AI Analysis
                     </h2>
                     <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
                        <Info className="w-4 h-4" /> Understanding exactly how your score was calculated.
                     </p>
                  </div>
                  <Link to="/report" className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors border border-primary-100">
                     View Full Report <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
               </div>

               <div className="space-y-8">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Feature Importance Influence</h3>
                  <div className="space-y-6">
                     {features.map((feature, idx) => (
                        <div key={idx} className="group">
                           <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                 {feature.positive ? <CheckCircle2 className="w-4 h-4 text-success" /> : <ShieldAlert className="w-4 h-4 text-warning" />}
                                 {feature.name}
                              </span>
                              <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-600 uppercase tracking-widest">{feature.impact} impact</span>
                           </div>
                           <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                              <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: feature.impact === 'high' ? '85%' : feature.impact === 'medium' ? '55%' : '20%' }}
                                 transition={{ duration: 1, delay: 0.8 + (idx * 0.2) }}
                                 className={`h-full ${feature.positive ? 'bg-success' : 'bg-warning'}`}
                              />
                           </div>
                           <p className="text-xs text-slate-500 mt-2 font-medium max-w-xl group-hover:text-slate-700 transition-colors">
                              {feature.description}
                           </p>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="mt-8 pt-6 border-t border-slate-100 sm:hidden">
                  <Link to="/report" className="inline-flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors">
                     View Full Report
                  </Link>
               </div>
            </div>
         </motion.div>
      </div>
    </div>
  );
};

export default DecisionResult;
