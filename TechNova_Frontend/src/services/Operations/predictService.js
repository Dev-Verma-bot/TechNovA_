import { apiConnector } from "../ApiConnect";
import { predictEndpoints } from "../Apis";

export const predictLoanService = (payload) => {
  return apiConnector("POST", predictEndpoints.PREDICT_API, payload, null, null, {
    credentials: "omit",
  });
};
