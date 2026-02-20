import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// Auth Wrapper & Hooks
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

// Common Components
import Loader from './components/common/Loader';
import CustomCursor from './components/common/CustomCursor';

// Lazy loading components for performance optimization
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));
const About = lazy(() => import('./pages/About'))
const LogoutSuccess = lazy(() => import('./pages/LogoutSuccess'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));

// User Components
const LoanApplicationForm = lazy(() => import('./components/user/LoanApplicationForm'));
const RiskResultCard = lazy(() => import('./components/user/RiskResultCard'));
const WhatIfSimulator = lazy(() => import('./components/user/WhatIfSimulator'));

// Admin Components
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const FairnessReport = lazy(() => import('./components/admin/FairnessReport'));

function App() {
  const { hydrateProfile } = useAuth();

  useEffect(() => {
    // Automatically fetch real user DB data (e.g. name) if a valid token exists
    hydrateProfile();
  }, []);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <CustomCursor />
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* --- USER LAYOUT SECTION --- */}
          <Route element={<UserLayout />}>
            {/* Public Routes: Accessible by everyone */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout-success" element={<LogoutSuccess />} />
            <Route path="/simulator" element={<WhatIfSimulator />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />

            {/* Protected User Routes */}
            <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/apply" element={<LoanApplicationForm />} />
              <Route path="/decision" element={<RiskResultCard />} />

            </Route>

            {/* 404 Catch-all for UserLayout */}
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* --- ADMIN LAYOUT SECTION --- */}
          {/* Protected Admin Routes: Strictly require 'admin' role */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/fairness" element={<FairnessReport />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
