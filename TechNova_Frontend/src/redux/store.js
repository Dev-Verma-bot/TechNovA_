import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import loanReducer from './slices/loanSlice';
import riskReducer from './slices/riskSlice';
import fairnessReducer from './slices/fairnessSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        application: loanReducer,
        risk: riskReducer,
        fairness: fairnessReducer,
        dashboard: dashboardReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});
