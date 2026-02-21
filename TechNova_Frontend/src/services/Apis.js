const BASE_URL =
  import.meta.env.VITE_APP_BASE_URL || "http://localhost:5000/api/v1";
const PREDICT_BASE_URL =
  import.meta.env.VITE_PREDICT_BASE_URL || "http://localhost:8000";

/* ---------------- AUTH ---------------- */
export const authEndpoints = {
  LOGIN_API: `${BASE_URL}/auth/login`,
  SIGNUP_API: `${BASE_URL}/auth/signup`,
  SIGNUP_SEND_OTP_API: `${BASE_URL}/auth/signup/send-otp`,
  FORGOT_PASSWORD_SEND_OTP_API: `${BASE_URL}/auth/forgot-password/send-otp`,
  RESET_PASSWORD_API: `${BASE_URL}/auth/reset-password`,
};

/* ---------------- USER ---------------- */
export const userEndpoints = {
  GET_PROFILE: `${BASE_URL}/user/profile`,
  UPDATE_PROFILE: `${BASE_URL}/user/update`,
};

/* ---------------- LOAN ---------------- */
export const loanEndpoints = {
  SUBMIT_LOAN_API: `${BASE_URL}/loan/apply`,
  GET_USER_LOANS: `${BASE_URL}/loan/my-applications`,
  GET_LOAN_DETAILS: `${BASE_URL}/loan/details/:id`,
};

/* ---------------- RISK ---------------- */
export const riskEndpoints = {
  GET_RISK_ANALYSIS: `${BASE_URL}/risk/analysis/:loanId`,
};

/* ---------------- ADMIN ---------------- */
export const adminEndpoints = {
  GET_ALL_APPS: `${BASE_URL}/admin/all-loans`,
  APPROVE_REJECT: `${BASE_URL}/admin/update-status/:id`,
  GET_FAIRNESS_METRICS: `${BASE_URL}/admin/fairness-metrics`,
};

/* ---------------- FAIRNESS ---------------- */
export const fairnessEndpoints = {
  FAIRNESS_STATS: `${BASE_URL}/fairness/report`,
};

/* ---------------- ML PREDICT ---------------- */
export const predictEndpoints = {
  PREDICT_API: `${PREDICT_BASE_URL}/api/predict`,
};
