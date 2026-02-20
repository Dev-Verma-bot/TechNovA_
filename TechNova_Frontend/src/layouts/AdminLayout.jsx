import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import { Search, Bell } from 'lucide-react';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex-shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <div className="flex-1 flex items-center max-w-md relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3" />
            <input type="text" placeholder="Search applications, ID, or name..." className="w-full pl-10 pr-4 py-2 border-0 outline-none focus:ring-0 text-sm text-slate-900 placeholder:text-slate-400 bg-transparent" />
          </div>

          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-slate-600 relative transition-colors p-2 rounded-full hover:bg-slate-100">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-danger ring-2 ring-white"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
