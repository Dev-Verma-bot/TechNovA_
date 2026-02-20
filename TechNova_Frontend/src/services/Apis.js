const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:5000/api/v1";

// Auth Endpoints
export const authEndpoints = {
    LOGIN_API: BASE_URL + "/auth/login",
    SIGNUP_API: BASE_URL + "/auth/signup",
    RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
};

// Loan/Application Endpoints
export const loanEndpoints = {
    SUBMIT_LOAN_API: BASE_URL + "/loan/apply",
    GET_USER_LOANS: BASE_URL + "/loan/my-applications",
    GET_LOAN_DETAILS: BASE_URL + "/loan/details",
};

// Admin/Risk Endpoints
export const adminEndpoints = {
    GET_ALL_APPS: BASE_URL + "/admin/all-loans",
    FAIRNESS_STATS: BASE_URL + "/admin/fairness-metrics",
};