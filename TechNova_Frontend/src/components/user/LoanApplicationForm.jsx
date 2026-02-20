import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Redux
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import {
  selectApplication,
  updateFormData,
  nextStep,
  prevStep,
  submitApplicationStart,
  submitApplicationSuccess
} from '../../redux/slices/loanSlice';
import { setDecisionData, setDecisionLoading } from '../../redux/slices/riskSlice';

const steps = [
  { id: 'personal', title: 'Personal Info' },
  { id: 'financial', title: 'Financial Profile' },
  { id: 'loan', title: 'Loan Details' },
];

const Input = ({ label, type = 'text', placeholder, value, onChange, error }) => (
  <div className="mb-6">
    <label className="block text-[13px] font-[800] text-slate-700 mb-2 uppercase tracking-wide">{label}</label>
    <div className="relative">
      <input
        type={type}
        className={`w-full px-5 py-4 rounded-[12px] border ${error ? 'border-red-500 focus:ring-red-500' : 'border-[#e2e8f0] focus:border-primary-500 focus:ring-primary-500'} focus:ring-1 outline-none transition-all bg-[#f8fafc] focus:bg-white text-[#0f172a] font-[500] text-[15px] placeholder:text-slate-400`}
        placeholder={placeholder}
        value={value || ''}
        onChange={onChange}
      />
      {error && <p className="mt-2 text-[13px] font-[600] text-red-500">{error}</p>}
    </div>
  </div>
);

const LoanApplicationForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // 1. Get Auth State - We only need the user object now (authentication check is handled by parent)
  const { user } = useAppSelector((state) => state.auth);

  // 2. Get Application State
  const applicationState = useAppSelector(selectApplication);

  // Destructure with defaults to ensure we don't crash if loanSlice is resetting
  const { formData = {}, currentStep = 0, submissionState = 'idle' } = applicationState || {};

  const delta = currentStep > 0 ? 1 : -1;

  const handleChange = (field, value) => {
    dispatch(updateFormData({ [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      dispatch(nextStep());
    } else {
      dispatch(submitApplicationStart());
      dispatch(setDecisionLoading(true));
      navigate('/decision');

      setTimeout(() => {
        dispatch(submitApplicationSuccess());

        const income = Number(formData.income) || 0;
        const debtAmount = Number(formData.loanAmount) || 0;
        let baseScore = 600;
        baseScore += (income / 1000) * 1.5;
        baseScore -= (debtAmount / 1000) * 2;

        const finalScore = Math.min(Math.max(Math.round(baseScore), 300), 850);

        dispatch(setDecisionData({
          applicationId: `APP-${Math.floor(Math.random() * 10000)}-X4`,
          score: finalScore,
          features: [
            { name: 'Income to Debt Ratio', impact: 'high', positive: income > debtAmount * 2, description: income > debtAmount * 2 ? 'Your current income comfortably covers existing debts.' : 'Your requested loan poses a high ratio strain.' },
            { name: 'Credit History Length', impact: 'medium', positive: true, description: 'A long, established credit history shows a consistent pattern.' },
          ],
          suggestions: [
            { title: 'Reduce Credit Card Balances', description: 'Lowering your credit utilization could boost your score further.' }
          ]
        }));
      }, 1500);
    }
  };

  const handlePrev = () => dispatch(prevStep());

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-[36px] font-[900] text-[#0f172a] mb-4 tracking-tight">Loan Application</h1>
        <p className="text-[16px] text-slate-500 font-[500] flex justify-center items-center gap-2">
          <Shield className="w-5 h-5 text-[#10b981]" />
          Welcome back, {user?.name || 'User'}! Your session is secured with bank-grade encryption.
        </p>
      </div>

      <div className="p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-[#e2e8f0] bg-white rounded-[24px] border relative">
        {/* Progress Tracker */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative px-2">
            <div className="absolute left-0 top-1/2 -mt-px w-full h-0.5 bg-slate-100" />
            <div
              className="absolute left-0 top-1/2 -mt-px h-0.5 bg-primary-600 transition-all duration-500"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step, idx) => (
              <div key={step.id} className="relative flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors z-10 bg-white ${idx < currentStep ? 'border-primary-500 bg-primary-500 text-white' :
                  idx === currentStep ? 'border-primary-600 text-primary-600 font-[800]' : 'border-slate-200 text-slate-400 font-[800]'
                  }`}>
                  {idx < currentStep ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                </div>
                <span className={`absolute -bottom-8 text-[11px] uppercase tracking-wider font-[800] whitespace-nowrap ${idx === currentStep ? 'text-primary-600' : 'text-slate-400'}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="relative min-h-[350px] mt-10">
          <AnimatePresence mode="wait" custom={delta}>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: delta * 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -delta * 20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="First Name" value={formData.firstName} onChange={(e) => handleChange('firstName', e.target.value)} />
                    <Input label="Last Name" value={formData.lastName} onChange={(e) => handleChange('lastName', e.target.value)} />
                  </div>
                  <Input label="Email Address" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <Input label="Annual Income ($)" type="number" value={formData.income} onChange={(e) => handleChange('income', e.target.value)} />
                  <div className="mb-6">
                    <label className="block text-[13px] font-[800] text-slate-700 mb-2 uppercase tracking-wide">Employment Status</label>
                    <select
                      className="w-full px-5 py-4 rounded-[12px] border border-[#e2e8f0] focus:border-primary-500 outline-none bg-[#f8fafc] focus:bg-white text-[#0f172a] font-[500] text-[15px] transition-all"
                      value={formData.employmentStatus}
                      onChange={(e) => handleChange('employmentStatus', e.target.value)}
                    >
                      <option value="employed">Employed Full-Time</option>
                      <option value="self-employed">Self-Employed</option>
                      <option value="unemployed">Unemployed</option>
                    </select>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <Input label="Requested Loan Amount ($)" type="number" value={formData.loanAmount} onChange={(e) => handleChange('loanAmount', e.target.value)} />
                  <Input label="Primary Purpose" placeholder="Debt consolidation, Home repair..." value={formData.purpose} onChange={(e) => handleChange('purpose', e.target.value)} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="mt-14 flex items-center justify-between border-t border-slate-100 pt-8">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0 || submissionState === 'submitting'}
            className="flex items-center text-[15px] font-[800] text-slate-500 hover:text-slate-700 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Back
          </button>

          <button
            onClick={handleNext}
            disabled={submissionState === 'submitting'}
            className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-[12px] text-[16px] font-[800] transition-all flex items-center shadow-md shadow-primary-500/20"
          >
            {submissionState === 'submitting' ? 'Processing...' : currentStep === steps.length - 1 ? 'Submit Application' : 'Continue'}
            {currentStep !== steps.length - 1 && <ChevronRight className="w-5 h-5 ml-2" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationForm;