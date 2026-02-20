import { apiConnector } from "../ApiConnect";
import { loanEndpoints } from "../Apis";

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

export const submitLoanService = (payload, token) => {
  return apiConnector(
    "POST",
    loanEndpoints.SUBMIT_LOAN_API,
    payload,
    authHeaders(token)
  );
};

export const getUserLoansService = (token) => {
  return apiConnector("GET", loanEndpoints.GET_USER_LOANS, null, authHeaders(token));
};

export const getLoanDetailsService = (loanId, token) => {
  const endpoint = loanEndpoints.GET_LOAN_DETAILS.replace(":id", loanId);
  return apiConnector("GET", endpoint, null, authHeaders(token));
};
