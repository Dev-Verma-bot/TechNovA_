import { apiConnector } from "../ApiConnect";
import { adminEndpoints } from "../Apis";

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

export const getAllApplicationsService = (token) => {
  return apiConnector("GET", adminEndpoints.GET_ALL_APPS, null, authHeaders(token));
};

export const approveRejectService = (applicationId, payload, token) => {
  const endpoint = adminEndpoints.APPROVE_REJECT.replace(":id", applicationId);
  return apiConnector("PATCH", endpoint, payload, authHeaders(token));
};

export const getAdminFairnessMetricsService = (token) => {
  return apiConnector(
    "GET",
    adminEndpoints.GET_FAIRNESS_METRICS,
    null,
    authHeaders(token)
  );
};
