import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    formData: {
        Age: '',
        Income: '',
        LoanAmount: '',
        CreditScore: '',
        MonthsEmployed: '',
        NumCreditLines: '',
        InterestRate: '',
        LoanTerm: '',
        DTIRatio: '',
        Education: '',
        EmploymentType: '',
        MaritalStatus: '',
        HasMortgage: '',
        HasDependents: '',
        LoanPurpose: '',
        HasCoSigner: '',
    },
    currentStep: 0,
    submissionState: 'idle', // 'idle' | 'submitting' | 'success' | 'failed'
    error: null,
};

const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        // Action to safely update just parts of the form
        updateFormData: (state, action) => {
            state.formData = { ...state.formData, ...action.payload };
        },
        setCurrentStep: (state, action) => {
            state.currentStep = action.payload;
        },
        nextStep: (state) => {
            state.currentStep += 1;
        },
        prevStep: (state) => {
            if (state.currentStep > 0) state.currentStep -= 1;
        },
        // Async lifecycles manual handlers (could be extraReducers with createAsyncThunk)
        submitApplicationStart: (state) => {
            state.submissionState = 'submitting';
            state.error = null;
        },
        submitApplicationSuccess: (state) => {
            state.submissionState = 'success';
        },
        submitApplicationFailure: (state, action) => {
            state.submissionState = 'failed';
            state.error = action.payload;
        },
        resetApplication: () => initialState,
    }
});

export const {
    updateFormData, setCurrentStep, nextStep, prevStep,
    submitApplicationStart, submitApplicationSuccess, submitApplicationFailure, resetApplication
} = applicationSlice.actions;

// Memoized selector for the form
export const selectApplication = (state) => state.application;

export default applicationSlice.reducer;
