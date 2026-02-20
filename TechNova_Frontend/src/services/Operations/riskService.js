import { apiConnector } from "../ApiConnect";
import { riskEndpoints } from "../Apis";

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

export const getRiskAnalysisService = (loanId, token) => {
  const endpoint = riskEndpoints.GET_RISK_ANALYSIS.replace(":loanId", loanId);
  return apiConnector("GET", endpoint, null, authHeaders(token));
};
