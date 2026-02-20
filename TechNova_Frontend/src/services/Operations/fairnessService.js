import { apiConnector } from "../ApiConnect";
import { fairnessEndpoints } from "../Apis";

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

export const getFairnessStatsService = (token) => {
  return apiConnector(
    "GET",
    fairnessEndpoints.FAIRNESS_STATS,
    null,
    authHeaders(token)
  );
};
