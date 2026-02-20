import { createSlice } from '@reduxjs/toolkit';

const getStoredUser = () => {
    try {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        return null;
    }
};

const getStoredToken = () => {
    try {
        return localStorage.getItem('token');
    } catch (error) {
        return null;
    }
};

const storedUser = getStoredUser();
const storedToken = getStoredToken();

const initialState = {
    user: storedUser,
    isAuthenticated: Boolean(storedUser && storedToken),
    role: storedUser?.role || 'user', // 'admin' | 'user'
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
            state.role = 'user';
        }
    }
});

export const { login, logout } = authSlice.actions;

// Selector to derive auth state
export const selectAuth = (state) => state.auth;

export default authSlice.reducer;
