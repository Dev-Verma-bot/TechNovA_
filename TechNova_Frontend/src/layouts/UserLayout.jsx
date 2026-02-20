import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1 flex flex-col w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;
