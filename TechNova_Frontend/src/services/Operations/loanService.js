import { apiConnector } from "../ApiConnect";
import { loanEndpoints } from "../Apis";
import { setLoanData, setRiskScore } from "../../redux/slices/loanSlice";

export function applyLoan(formData, token) {
  return async (dispatch) => {
    try {
      const response = await apiConnector(
        "POST", 
        loanEndpoints.APPLY_LOAN_API, 
        formData, 
        { Authorization: `Bearer ${token}` }
      );
      
      dispatch(setLoanData(response.data.loan));
      dispatch(setRiskScore(response.data.riskAnalysis));
    } catch (error) {
      console.log("LOAN APPLICATION ERROR:", error);
    }
  };
}