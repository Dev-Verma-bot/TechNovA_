import { apiConnector } from "../ApiConnect";
import { userEndpoints } from "../Apis";

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

export const getProfileService = (token) => {
  return apiConnector("GET", userEndpoints.GET_PROFILE, null, authHeaders(token));
};

export const updateProfileService = (payload, token) => {
  return apiConnector(
    "PUT",
    userEndpoints.UPDATE_PROFILE,
    payload,
    authHeaders(token)
  );
};
