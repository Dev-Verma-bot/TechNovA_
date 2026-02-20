import { useState } from "react";
import {
  submitLoanService,
  getUserLoansService,
  getLoanDetailsService,
} from "../services/Operations";

export const useLoan = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const withToken = () => localStorage.getItem("token");

  const submitLoan = async (payload) => {
    setLoading(true);
    setError("");
    try {
      const response = await submitLoanService(payload, withToken());
      return { ok: true, data: response.data };
    } catch (err) {
      setError(err?.response?.data?.message || "Loan submission failed");
      return { ok: false, data: null };
    } finally {
      setLoading(false);
    }
  };

  const getMyLoans = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getUserLoansService(withToken());
      return { ok: true, data: response.data || [] };
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch loans");
      return { ok: false, data: [] };
    } finally {
      setLoading(false);
    }
  };

  const getLoanDetails = async (loanId) => {
    setLoading(true);
    setError("");
    try {
      const response = await getLoanDetailsService(loanId, withToken());
      return { ok: true, data: response.data };
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch loan details");
      return { ok: false, data: null };
    } finally {
      setLoading(false);
    }
  };

  return { submitLoan, getMyLoans, getLoanDetails, loading, error };
};
