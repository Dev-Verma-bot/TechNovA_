import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    profile: null,        // Detailed profile info (address, phone, etc.)
    preferences: {
        notifications: true,
        theme: 'light',
    },
    activityLogs: [],     // History of user actions
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Sets the full profile (usually called after a separate API fetch)
        setProfile: (state, action) => {
            state.profile = action.payload;
        },
        // Updates specific fields in the profile
        updateProfileDetails: (state, action) => {
            if (state.profile) {
                state.profile = { ...state.profile, ...action.payload };
            }
        },
        setPreferences: (state, action) => {
            state.preferences = { ...state.preferences, ...action.payload };
        },
        clearUserData: () => initialState,
    },
    // extraReducers allows the userSlice to respond to actions from the authSlice
    extraReducers: (builder) => {
        // When the user logs out via authSlice, we should clear the user profile too
        builder.addCase('auth/logout', (state) => {
            return initialState;
        });
    }
});

export const {
    setProfile,
    updateProfileDetails,
    setPreferences,
    clearUserData
} = userSlice.actions;

export const selectUserProfile = (state) => state.user.profile;
export const selectUserPreferences = (state) => state.user.preferences;

export default userSlice.reducer;