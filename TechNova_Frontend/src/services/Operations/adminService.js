import { apiConnector } from "../ApiConnect";
import { authEndpoints } from "../Apis";
import { setToken, setUser, setLoading } from "../../redux/slices/authSlice";

export function login(email, password, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", authEndpoints.LOGIN_API, { email, password });
      
      if (!response.data.success) throw new Error(response.data.message);

      dispatch(setToken(response.data.token));
      dispatch(setUser(response.data.user));
      localStorage.setItem("token", JSON.stringify(response.data.token));
      navigate("/dashboard");
    } catch (error) {
      console.log("LOGIN ERROR:", error);
    }
    dispatch(setLoading(false));
  };
}