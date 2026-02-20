import { useState } from "react";
import { useDispatch } from "react-redux";
import { login as loginAction, logout as logoutAction } from "../redux/slices/authSlice";
import { loginService, signupService } from "../services/Operations";
import { getProfileService } from "../services/Operations/userService";

export const useAuth = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const response = await loginService({ email, password });
      const { token, userId, role, name, email: responseEmail } = response.data || {};

      const user = {
        id: userId,
        email: responseEmail || email,
        name: name,
        role: role || "user",
      };

      localStorage.setItem("token", token || "cookie-auth");
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(loginAction(user));
      return { ok: true, user };
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
      return { ok: false };
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    setError("");
    try {
      await signupService(payload);
      return { ok: true };
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
      return { ok: false };
    } finally {
      setLoading(false);
    }
  };

  const hydrateProfile = async () => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (!token || !savedUser) return;

    try {
      const response = await getProfileService(token);
      const profile = response.data;
      const base = JSON.parse(savedUser);
      const merged = {
        ...base,
        id: profile?._id || base.id,
        name: profile?.name || base.name,
        email: profile?.email || base.email,
        role: profile?.role || base.role,
      };
      localStorage.setItem("user", JSON.stringify(merged));
      dispatch(loginAction(merged));
    } catch (err) {
      // no-op: keep existing local auth state
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logoutAction());
  };

  return { login, register, hydrateProfile, logout, loading, error };
};
