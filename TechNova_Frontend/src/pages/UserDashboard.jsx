import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, CheckCircle2, Clock, AlertCircle, PlayCircle } from 'lucide-react';
import { getProfileService, getUserLoansService } from '../services/Operations';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import {
  selectDashboard,
  setDashboardLoading,
  setDashboardError,
  setDashboardData,
} from '../redux/slices/dashboardSlice';

const scoreLabel = (score) => {
  if (!Number.isFinite(score)) return 'Unknown';
  if (score >= 750) return 'Excellent';
  if (score >= 700) return 'Good';
  if (score >= 650) return 'Fair';
  return 'Needs Work';
};

const parseScoreFromLoan = (loan) => {
  const direct = loan?.predictedScore;
  if (direct !== null && direct !== undefined && direct !== '' && Number.isFinite(Number(direct))) {
    return Number(direct);
  }

  const prob = loan?.probabilityApproval;
  if (prob !== null && prob !== undefined && prob !== '') {
    let p = null;
    if (typeof prob === 'string' && prob.trim().endsWith('%')) {
      const num = Number(prob.replace('%', '').trim());
      if (Number.isFinite(num)) p = num / 100;
    } else {
      const num = Number(prob);
      if (Number.isFinite(num)) {
        if (num >= 0 && num <= 1) p = num;
        else if (num > 1 && num <= 100) p = num / 100;
      }
    }

    if (p !== null) {
      return Math.round(300 + p * 550);
    }
  }

  return null;
};

const deriveUiStatus = (loan) => {
  const raw = String(loan?.status || '').toLowerCase();
  if (raw === 'approved' || raw === 'rejected' || raw === 'pending') {
    return raw;
  }
  const decision = String(loan?.decisionStatus || '').toLowerCase();
  if (decision === 'declined') return 'rejected';
  return 'pending';
};

const UserDashboard = () => {
  const dispatch = useAppDispatch();
  const { profile, applications, loading } = useAppSelector(selectDashboard);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const loadDashboard = async () => {
      dispatch(setDashboardLoading(true));
      dispatch(setDashboardError(null));

      try {
        const [profileRes, loansRes] = await Promise.all([
          getProfileService(token),
          getUserLoansService(token),
        ]);

        const loans = Array.isArray(loansRes?.data)
          ? loansRes.data
          : Array.isArray(loansRes?.data?.loans)
          ? loansRes.data.loans
          : [];

        dispatch(
          setDashboardData({
            profile: profileRes?.data || null,
            applications: loans,
          })
        );
      } catch (err) {
        dispatch(setDashboardError(err?.response?.data?.message || 'Failed to load dashboard'));
      } finally {
        dispatch(setDashboardLoading(false));
      }
    };

    loadDashboard();
    const intervalId = setInterval(loadDashboard, 10000);
    return () => clearInterval(intervalId);
  }, [dispatch]);

  const normalizedApplications = useMemo(() => {
    return (applications || []).slice(0, 5).map((loan) => ({
      id: loan._id,
      amount: `INR ${Number(loan.amount || 0).toLocaleString('en-IN')}`,
      status: deriveUiStatus(loan),
      date: loan.createdAt ? new Date(loan.createdAt).toLocaleDateString() : '--',
      score: Number.isFinite(parseScoreFromLoan(loan)) ? parseScoreFromLoan(loan) : '--',
    }));
  }, [applications]);

  const dashboardStats = useMemo(() => {
    const scored = (applications || [])
      .map((item) => parseScoreFromLoan(item))
      .filter((value) => Number.isFinite(value));

    const latestScore = scored.length ? scored[0] : null;
    const averageScore = scored.length
      ? Math.round(scored.reduce((sum, value) => sum + value, 0) / scored.length)
      : null;

    const statusList = (applications || []).map((item) => deriveUiStatus(item));
    const pendingCount = statusList.filter((status) => status === 'pending').length;
    const acceptedCount = statusList.filter((status) => status === 'approved').length;
    const rejectedCount = statusList.filter((status) => status === 'rejected').length;

    return {
      latestScore,
      averageScore,
      pendingCount,
      acceptedCount,
      rejectedCount,
      totalApplications: (applications || []).length,
      scoreText: scoreLabel(latestScore),
    };
  }, [applications]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-success/10 text-success border-success/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'rejected':
        return 'bg-danger/10 text-danger border-danger/20';
      default:
        return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-slate-50 py-12 px-6 lg:px-12">
      <div className="max-w-[1200px] mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-[900] text-slate-900 tracking-tight mb-2">
              Welcome back, {profile?.name || 'User'}!
            </h1>
            <p className="text-slate-500 font-medium">
              Here is a summary of your loan applications and credit profile.
            </p>
          </div>
          <Link
            to="/apply"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl text-sm font-bold shadow-soft hover:bg-primary-700 hover:-translate-y-0.5 transition-all"
          >
            <FileText className="w-4 h-4" />
            New Application
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-[800] text-slate-900">Recent Applications</h2>
                <span className="text-sm font-semibold text-slate-400">Showing latest {normalizedApplications.length}</span>
              </div>

              <div className="space-y-4">
                {normalizedApplications.map((app, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          app.status === 'approved' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                        }`}
                      >
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{app.id}</h4>
                        <p className="text-xs font-medium text-slate-500">Submitted on {app.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{app.amount}</p>
                        <p className="text-xs font-medium text-slate-500">Credit Score: {app.score}</p>
                      </div>
                      <div
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {getStatusIcon(app.status)}
                        {app.status}
                      </div>
                    </div>
                  </div>
                ))}

                {!loading && normalizedApplications.length === 0 && (
                  <div className="text-center py-12 rounded-2xl border border-dashed border-slate-200">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-700 mb-1">No applications yet</h3>
                    <p className="text-sm text-slate-500 mb-4">You haven't submitted any loan applications.</p>
                    <Link to="/apply" className="text-sm font-bold text-primary-600">
                      Start an application &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 gap-4"
            >
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[24px] p-8 text-white relative overflow-hidden group hover:shadow-lg transition-all cursor-pointer">
                <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                <PlayCircle className="w-8 h-8 text-white/80 mb-6" />
                <h3 className="text-lg font-bold mb-2">What-If Simulator</h3>
                <p className="text-sm text-indigo-100 font-medium leading-relaxed mb-6">
                  Curious how a new credit card or an expanded credit line impacts your score? Simulate it instantly.
                </p>
                <Link
                  to="/simulator"
                  className="inline-flex items-center text-sm font-bold text-white hover:text-indigo-100 transition-colors"
                >
                  Open Simulator <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>

            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-8">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Credit Snapshot</h3>

              <div className="space-y-4">
                <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden flex">
                  <div className="bg-danger h-2.5 rounded-l-full" style={{ width: '20%' }}></div>
                  <div className="bg-warning h-2.5" style={{ width: '40%' }}></div>
                  <div className="bg-success h-2.5 rounded-r-full" style={{ width: '40%' }}></div>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>300</span>
                  <span>850</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-500">Average Score</span>
                  <span className="font-bold text-slate-900">{dashboardStats.averageScore ?? '--'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-500">Accepted</span>
                  <span className="font-bold text-success">{dashboardStats.acceptedCount}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-500">Rejected</span>
                  <span className="font-bold text-danger">{dashboardStats.rejectedCount}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-500">Pending</span>
                  <span className="font-bold text-slate-900">{dashboardStats.pendingCount}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-500">Total Applications</span>
                  <span className="font-bold text-slate-900">{dashboardStats.totalApplications}</span>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 rounded-[24px] border border-primary-100 p-8 text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-primary-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Profile connected</h4>
              <p className="text-sm font-medium text-slate-600 mb-6 leading-relaxed">
                Signed in as {profile?.email || 'your account'}. Dashboard metrics now come from stored backend applications.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
