import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
// import userReducer from './slices/userSlice'; // Empty file, optionally add later
import loanReducer from './slices/loanSlice';
// import adminReducer from './slices/adminSlice'; // Empty file, optionally add later
import riskReducer from './slices/riskSlice';
import fairnessReducer from './slices/fairnessSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        // user: userReducer,
        application: loanReducer,
        // admin: adminReducer,
        risk: riskReducer,
        fairness: fairnessReducer,
    },
    devTools: process.env.NODE_ENV !== 'production', // Automatically disabled in Prod
});
