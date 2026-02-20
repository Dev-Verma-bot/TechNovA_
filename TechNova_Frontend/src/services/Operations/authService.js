import { apiConnector } from "../ApiConnect";
import { authEndpoints } from "../Apis";

export const loginService = (payload) => {
  return apiConnector("POST", authEndpoints.LOGIN_API, payload);
};

export const sendSignupOtpService = (payload) => {
  return apiConnector("POST", authEndpoints.SIGNUP_SEND_OTP_API, payload);
};

export const signupService = (payload) => {
  return apiConnector("POST", authEndpoints.SIGNUP_API, payload);
};

export const sendForgotPasswordOtpService = (payload) => {
  return apiConnector("POST", authEndpoints.FORGOT_PASSWORD_SEND_OTP_API, payload);
};

export const resetPasswordService = (payload) => {
  return apiConnector("POST", authEndpoints.RESET_PASSWORD_API, payload);
};