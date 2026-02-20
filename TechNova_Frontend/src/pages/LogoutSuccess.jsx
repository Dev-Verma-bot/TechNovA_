import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const LogoutSuccess = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16 bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-sm p-10 text-center"
      >
        <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 mx-auto mb-5 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
          Logout Successful
        </h1>
        <p className="text-slate-600 mb-8">
          You have been logged out successfully.
        </p>

        <Link
          to="/login"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 transition-colors"
        >
          Back to Login <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
};

export default LogoutSuccess;
