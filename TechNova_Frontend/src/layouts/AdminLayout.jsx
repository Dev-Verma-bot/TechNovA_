import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex-shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <div />
          <div />
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
