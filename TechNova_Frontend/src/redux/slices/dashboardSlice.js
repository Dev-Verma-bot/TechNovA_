import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'dashboardState';

const baseInitialState = {
  profile: null,
  applications: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

const loadDashboardState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const saveDashboardState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
};

const clearDashboardState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
};

const snapshot = (state) => ({
  profile: state.profile,
  applications: state.applications,
  loading: state.loading,
  error: state.error,
  lastUpdated: state.lastUpdated,
});

const initialState = {
  ...baseInitialState,
  ...(loadDashboardState() || {}),
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardLoading: (state, action) => {
      state.loading = Boolean(action.payload);
      saveDashboardState(snapshot(state));
    },
    setDashboardError: (state, action) => {
      state.error = action.payload || null;
      saveDashboardState(snapshot(state));
    },
    setDashboardData: (state, action) => {
      const { profile, applications } = action.payload || {};
      if (profile !== undefined) state.profile = profile;
      if (Array.isArray(applications)) state.applications = applications;
      state.error = null;
      state.lastUpdated = Date.now();
      saveDashboardState(snapshot(state));
    },
    upsertDashboardApplication: (state, action) => {
      const app = action.payload;
      if (!app || !app._id) return;

      const index = state.applications.findIndex((item) => item._id === app._id);
      if (index >= 0) {
        state.applications[index] = { ...state.applications[index], ...app };
      } else {
        state.applications = [app, ...state.applications];
      }

      state.lastUpdated = Date.now();
      saveDashboardState(snapshot(state));
    },
    clearDashboard: () => {
      clearDashboardState();
      return baseInitialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase('auth/logout', () => {
      clearDashboardState();
      return baseInitialState;
    });
  },
});

export const {
  setDashboardLoading,
  setDashboardError,
  setDashboardData,
  upsertDashboardApplication,
  clearDashboard,
} = dashboardSlice.actions;

export const selectDashboard = (state) => state.dashboard || baseInitialState;

export default dashboardSlice.reducer;
