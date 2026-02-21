import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { predictLoanService, submitLoanService } from '../../services/Operations';

// Redux
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import {
  selectApplication,
  updateFormData,
  nextStep,
  prevStep,
  submitApplicationStart,
  submitApplicationSuccess,
  submitApplicationFailure,
  resetApplication,
} from '../../redux/slices/loanSlice';
import { setDecisionData, setDecisionLoading } from '../../redux/slices/riskSlice';
import { upsertDashboardApplication } from '../../redux/slices/dashboardSlice';

const steps = [
  { id: 'personal', title: 'Personal Info' },
  { id: 'financial', title: 'Financial Profile' },
  { id: 'loan', title: 'Loan Details' },
];

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  readOnly = false,
  min,
  max,
  step,
}) => (
  <div className="mb-6">
    <label className="block text-[13px] font-[800] text-slate-700 mb-2 uppercase tracking-wide">{label}</label>
    <div className="relative">
      <input
        type={type}
        className={`w-full px-5 py-4 rounded-[12px] border ${error ? 'border-red-500 focus:ring-red-500' : 'border-[#e2e8f0] focus:border-primary-500 focus:ring-primary-500'} focus:ring-1 outline-none transition-all bg-[#f8fafc] focus:bg-white text-[#0f172a] font-[500] text-[15px] placeholder:text-slate-400`}
        placeholder={placeholder}
        value={value || ''}
        onChange={onChange}
        readOnly={readOnly}
        min={min}
        max={max}
        step={step}
        required={!readOnly}
      />
      {error && <p className="mt-2 text-[13px] font-[600] text-red-500">{error}</p>}
    </div>
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div className="mb-6">
    <label className="block text-[13px] font-[800] text-slate-700 mb-2 uppercase tracking-wide">{label}</label>
    <select
      className="w-full px-5 py-4 rounded-[12px] border border-[#e2e8f0] focus:border-primary-500 outline-none bg-[#f8fafc] focus:bg-white text-[#0f172a] font-[500] text-[15px] transition-all"
      value={value}
      onChange={onChange}
      required
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const LoanApplicationForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const applicationState = useAppSelector(selectApplication);
  const { formData = {}, currentStep = 0, submissionState = 'idle', error } = applicationState || {};

  const delta = currentStep > 0 ? 1 : -1;

  const handleChange = (field, value) => {
    dispatch(updateFormData({ [field]: value }));
  };

  const parseProbability = (value) => {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'string' && value.trim().endsWith('%')) {
      const num = Number(value.replace('%', '').trim());
      if (!Number.isFinite(num)) return null;
      return num / 100;
    }
    const num = Number(value);
    if (!Number.isFinite(num)) return null;
    if (num >= 0 && num <= 1) return num;
    if (num > 1 && num <= 100) return num / 100;
    return null;
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      dispatch(nextStep());
    } else {
      dispatch(submitApplicationStart());
      dispatch(setDecisionLoading(true));

      const rawPayload = {
        Age: Number(formData.Age),
        Income: Number(formData.Income),
        LoanAmount: Number(formData.LoanAmount),
        CreditScore: Number(formData.CreditScore),
        MonthsEmployed: Number(formData.MonthsEmployed),
        NumCreditLines: Number(formData.NumCreditLines),
        InterestRate: Number(formData.InterestRate),
        LoanTerm: Number(formData.LoanTerm),
        DTIRatio: Math.max(0, Math.min(1, Number(formData.DTIRatio))),
        Education: formData.Education,
        EmploymentType: formData.EmploymentType,
        MaritalStatus: formData.MaritalStatus,
        HasMortgage: formData.HasMortgage,
        HasDependents: formData.HasDependents,
        LoanPurpose: formData.LoanPurpose,
        HasCoSigner: formData.HasCoSigner,
      };

      const predictFieldOrder = [
        'Age',
        'Income',
        'LoanAmount',
        'CreditScore',
        'MonthsEmployed',
        'NumCreditLines',
        'InterestRate',
        'LoanTerm',
        'DTIRatio',
        'Education',
        'EmploymentType',
        'MaritalStatus',
        'HasMortgage',
        'HasDependents',
        'LoanPurpose',
        'HasCoSigner',
      ];

      const payload = predictFieldOrder.reduce((acc, key) => {
        acc[key] = rawPayload[key];
        return acc;
      }, {});

      const featureNameMap = {
        Age: 'Age',
        Income: 'Income',
        LoanAmount: 'Loan Amount',
        CreditScore: 'Credit Score',
        MonthsEmployed: 'Months Employed',
        NumCreditLines: 'Number of Credit Lines',
        InterestRate: 'Interest Rate',
        LoanTerm: 'Loan Term',
        DTIRatio: 'DTI Ratio',
        Education: 'Education',
        EmploymentType: 'Employment Type',
        MaritalStatus: 'Marital Status',
        HasMortgage: 'Has Mortgage',
        HasDependents: 'Has Dependents',
        LoanPurpose: 'Loan Purpose',
        HasCoSigner: 'Has Co-Signer',
      };

      const fallbackFeatureOrder = Object.keys(featureNameMap);
      const formatFeatureName = (rawName) => {
        if (featureNameMap[rawName]) return featureNameMap[rawName];
        const match = String(rawName).match(/^feature_(\d+)$/i);
        if (match) {
          const idx = Number(match[1]);
          const fallback = fallbackFeatureOrder[idx] || fallbackFeatureOrder[idx - 1];
          if (fallback) return featureNameMap[fallback];
        }
        return String(rawName).replace(/_/g, ' ');
      };

      try {
        const response = await predictLoanService(payload);
        const prediction = response.data?.prediction || {};
        const analysis = response.data?.analysis || {};

        const approvalProbability =
          parseProbability(prediction.probability_approval) ??
          (1 - (parseProbability(prediction.probability_default) ?? 1));
        const score = Math.round(300 + approvalProbability * 550);

        const backendStatus = String(analysis.status || '').toLowerCase();
        const mappedStatus =
          backendStatus === 'approved'
            ? 'approved'
            : backendStatus === 'rejected'
            ? 'declined'
            : 'manual';

        const riskCategory = String(prediction.risk_category || '').toLowerCase();
        const mappedCategory =
          riskCategory.includes('low')
            ? 'green'
            : riskCategory.includes('medium')
            ? 'yellow'
            : riskCategory.includes('high')
            ? 'red'
            : null;

        const riskSignals = analysis.risk_factors || {};
        const decreasingRisk = new Set(riskSignals.decreasing_risk || []);

        const topFeatures = Object.entries(prediction.feature_importance || {})
          .slice(0, 5)
          .map(([name, value], idx) => ({
            name: formatFeatureName(name),
            impact: idx < 2 ? 'high' : idx < 4 ? 'medium' : 'low',
            positive: decreasingRisk.has(name),
            description: `Model influence: ${Number(value).toFixed(2)}%`,
          }));

        const improvements = String(analysis.improvements_needed || '')
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .slice(0, 5)
          .map((line, idx) => ({
            title: `Recommendation ${idx + 1}`,
            description: line.replace(/^\d+[\).\s-]*/, ''),
          }));

        const token = localStorage.getItem('token');
        const submitPayload = {
          amount: Number(formData.LoanAmount),
          purpose: formData.LoanPurpose,
          tenureMonths: Number(formData.LoanTerm),
          monthlyIncome: Number(formData.Income),
          status: mappedStatus === 'declined' ? 'rejected' : 'pending',
          predictedScore: Number.isFinite(score) ? score : null,
          decisionStatus: mappedStatus,
          decisionCategory: mappedCategory,
          probabilityApproval: prediction.probability_approval,
          probabilityDefault: prediction.probability_default,
          riskCategory: prediction.risk_category || '',
          decisionMessage: analysis.message || '',
        };

        const loanSaveResponse = await submitLoanService(submitPayload, token);
        const savedLoan = loanSaveResponse?.data || null;

        if (savedLoan?._id) {
          dispatch(
            upsertDashboardApplication({
              ...savedLoan,
              predictedScore: submitPayload.predictedScore,
              decisionStatus: submitPayload.decisionStatus,
              decisionCategory: submitPayload.decisionCategory,
              probabilityApproval: submitPayload.probabilityApproval,
              probabilityDefault: submitPayload.probabilityDefault,
              riskCategory: submitPayload.riskCategory,
              decisionMessage: submitPayload.decisionMessage,
            })
          );
        }

        dispatch(submitApplicationSuccess());
        dispatch(
          setDecisionData({
            applicationId: savedLoan?._id || analysis.database_id || `APP-${Math.floor(Math.random() * 10000)}-X4`,
            score: Number.isFinite(score) ? score : 650,
            status: mappedStatus,
            category: mappedCategory,
            message: analysis.message || '',
            riskCategory: prediction.risk_category || '',
            probabilityApproval: prediction.probability_approval,
            probabilityDefault: prediction.probability_default,
            rejectionReasons: analysis.rejection_reasons || '',
            features: topFeatures.length
              ? topFeatures
              : [
                  {
                    name: 'Model Analysis',
                    impact: 'medium',
                    positive: true,
                    description: analysis.message || 'Prediction completed.',
                  },
                ],
            suggestions: improvements.length
              ? improvements
              : [
                  {
                    title: 'Application Summary',
                    description: analysis.message || 'Prediction completed successfully.',
                  },
                ],
          })
        );

        dispatch(resetApplication());
        navigate('/decision');
      } catch (apiError) {
        dispatch(
          submitApplicationFailure(
            apiError?.response?.data?.message ||
              apiError?.response?.data?.error ||
              apiError?.message ||
              'Prediction failed'
          )
        );
        dispatch(setDecisionLoading(false));
      }
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
        <div className="mb-12">
          <div className="flex items-center justify-between relative px-2">
            <div className="absolute left-0 top-1/2 -mt-px w-full h-0.5 bg-slate-100" />
            <div
              className="absolute left-0 top-1/2 -mt-px h-0.5 bg-primary-600 transition-all duration-500"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step, idx) => (
              <div key={step.id} className="relative flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors z-10 bg-white ${
                    idx < currentStep
                      ? 'border-primary-500 bg-primary-500 text-white'
                      : idx === currentStep
                      ? 'border-primary-600 text-primary-600 font-[800]'
                      : 'border-slate-200 text-slate-400 font-[800]'
                  }`}
                >
                  {idx < currentStep ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                </div>
                <span
                  className={`absolute -bottom-8 text-[11px] uppercase tracking-wider font-[800] whitespace-nowrap ${
                    idx === currentStep ? 'text-primary-600' : 'text-slate-400'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

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
                    <Input label="Age" type="number" value={formData.Age} onChange={(e) => handleChange('Age', e.target.value)} />
                  </div>
                  <Input label="Income" type="number" value={formData.Income} onChange={(e) => handleChange('Income', e.target.value)} />
                  <Input label="LoanAmount" type="number" value={formData.LoanAmount} onChange={(e) => handleChange('LoanAmount', e.target.value)} />
                  <Input label="CreditScore" type="number" value={formData.CreditScore} onChange={(e) => handleChange('CreditScore', e.target.value)} />
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <Input label="MonthsEmployed" type="number" value={formData.MonthsEmployed} onChange={(e) => handleChange('MonthsEmployed', e.target.value)} />
                  <Input label="NumCreditLines" type="number" value={formData.NumCreditLines} onChange={(e) => handleChange('NumCreditLines', e.target.value)} />
                  <Input label="InterestRate" type="number" value={formData.InterestRate} onChange={(e) => handleChange('InterestRate', e.target.value)} />
                  <Input label="LoanTerm" type="number" value={formData.LoanTerm} onChange={(e) => handleChange('LoanTerm', e.target.value)} />
                  <Input
                    label="DTIRatio"
                    type="number"
                    min={0}
                    max={1}
                    step="0.01"
                    value={formData.DTIRatio}
                    onChange={(e) => handleChange('DTIRatio', e.target.value)}
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <SelectField
                    label="Education"
                    value={formData.Education}
                    onChange={(e) => handleChange('Education', e.target.value)}
                    options={[
                      { label: 'Select Education', value: '' },
                      { label: 'High School', value: 'High School' },
                      { label: "Bachelor's", value: "Bachelor's" },
                      { label: "Master's", value: "Master's" },
                      { label: 'PhD', value: 'PhD' },
                    ]}
                  />
                  <SelectField
                    label="EmploymentType"
                    value={formData.EmploymentType}
                    onChange={(e) => handleChange('EmploymentType', e.target.value)}
                    options={[
                      { label: 'Select Employment Type', value: '' },
                      { label: 'Full-time', value: 'Full-time' },
                      { label: 'Self-employed', value: 'Self-employed' },
                      { label: 'Unemployed', value: 'Unemployed' },
                    ]}
                  />
                  <SelectField
                    label="MaritalStatus"
                    value={formData.MaritalStatus}
                    onChange={(e) => handleChange('MaritalStatus', e.target.value)}
                    options={[
                      { label: 'Select Marital Status', value: '' },
                      { label: 'Unmarried', value: 'Unmarried' },
                      { label: 'Married', value: 'Married' },
                      { label: 'Divorced', value: 'Divorced' },
                    ]}
                  />
                  <SelectField
                    label="HasMortgage"
                    value={formData.HasMortgage}
                    onChange={(e) => handleChange('HasMortgage', e.target.value)}
                    options={[
                      { label: 'Select', value: '' },
                      { label: 'No', value: 'No' },
                      { label: 'Yes', value: 'Yes' },
                    ]}
                  />
                  <SelectField
                    label="HasDependents"
                    value={formData.HasDependents}
                    onChange={(e) => handleChange('HasDependents', e.target.value)}
                    options={[
                      { label: 'Select', value: '' },
                      { label: 'No', value: 'No' },
                      { label: 'Yes', value: 'Yes' },
                    ]}
                  />
                  <SelectField
                    label="LoanPurpose"
                    value={formData.LoanPurpose}
                    onChange={(e) => handleChange('LoanPurpose', e.target.value)}
                    options={[
                      { label: 'Select Loan Purpose', value: '' },
                      { label: 'Home', value: 'Home' },
                      { label: 'Education', value: 'Education' },
                      { label: 'Auto', value: 'Auto' },
                      { label: 'Business', value: 'Business' },
                      { label: 'Other', value: 'Other' },
                    ]}
                  />
                  <SelectField
                    label="HasCoSigner"
                    value={formData.HasCoSigner}
                    onChange={(e) => handleChange('HasCoSigner', e.target.value)}
                    options={[
                      { label: 'Select', value: '' },
                      { label: 'No', value: 'No' },
                      { label: 'Yes', value: 'Yes' },
                    ]}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

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
        {error && <p className="mt-4 text-sm font-semibold text-red-600 text-right">{error}</p>}
      </div>
    </div>
  );
};

export default LoanApplicationForm;
