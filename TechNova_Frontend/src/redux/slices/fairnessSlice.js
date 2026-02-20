import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    metrics: [
        { name: 'Demographic Parity Ratio', value: '0.96', target: '> 0.80', status: 'pass' },
        { name: 'Equal Opportunity Rate', value: '1.02', target: '0.90 - 1.10', status: 'pass' },
        { name: 'Predictive Equality', value: '0.98', target: '0.90 - 1.10', status: 'pass' },
        { name: 'Average Odds Difference', value: '0.04', target: '< 0.10', status: 'pass' },
    ],
    demographics: [
        { group: 'Demographic A', approvals: 84, target: 85, rejections: 16 },
        { group: 'Demographic B', approvals: 82, target: 85, rejections: 18 },
        { group: 'Demographic C', approvals: 86, target: 85, rejections: 14 },
        { group: 'Demographic D', approvals: 79, target: 85, rejections: 21 },
    ],
    alerts: [],
};

const fairnessSlice = createSlice({
    name: 'fairness',
    initialState,
    reducers: {
        updateMetrics: (state, action) => {
            // Allow modifying fairness metrics from external events or backend payload
            state.metrics = action.payload;
        },
        updateDemographics: (state, action) => {
            state.demographics = action.payload;
        },
        addAlert: (state, action) => {
            state.alerts.push(action.payload);
        }
    }
});

export const { updateMetrics, updateDemographics, addAlert } = fairnessSlice.actions;

export const selectFairness = (state) => state.fairness;

export default fairnessSlice.reducer;
