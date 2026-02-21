import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0EB] text-[#1E293B] font-body selection:bg-electric-cyan/20 selection:text-white">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      
      <Footer />

      {/* Background Gradients */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-blue-200/30 rounded-full blur-[120px] opacity-30 animate-blob" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-purple-200/20 rounded-full blur-[120px] opacity-30 animate-blob animation-delay-2000" />
      </div>
    </div>
  );
};

export default UserLayout;
