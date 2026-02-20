import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null, // e.g. { id: 1, name: 'Admin', role: 'admin' }
    isAuthenticated: false,
    role: 'applicant', // 'admin' | 'applicant'
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.role = action.payload.role;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.role = 'applicant';
        }
    }
});

export const { login, logout } = authSlice.actions;

// Selector to derive auth state
export const selectAuth = (state) => state.auth;

export default authSlice.reducer;
