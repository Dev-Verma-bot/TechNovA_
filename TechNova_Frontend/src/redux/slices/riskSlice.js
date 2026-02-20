import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    applicationId: null,
    score: null,
    category: null, // 'green' | 'yellow' | 'red'
    status: null, // 'approved' | 'manual' | 'declined'
    features: [],
    suggestions: [],
    isLoading: false,
};

const decisionSlice = createSlice({
    name: 'decision',
    initialState,
    reducers: {
        setDecisionData: (state, action) => {
            const { applicationId, score, features, suggestions } = action.payload;
            state.applicationId = applicationId;
            state.score = score;

            // Auto-calculate risk category and approval status based on business logic
            if (score >= 750) {
                state.category = 'green';
                state.status = 'approved';
            } else if (score >= 600) {
                state.category = 'yellow';
                state.status = 'manual';
            } else {
                state.category = 'red';
                state.status = 'declined';
            }

            state.features = features || [];
            state.suggestions = suggestions || [];
            state.isLoading = false;
        },
        setDecisionLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        resetDecision: () => initialState,
    }
});

export const { setDecisionData, setDecisionLoading, resetDecision } = decisionSlice.actions;

export const selectDecision = (state) => state.decision;

export default decisionSlice.reducer;
