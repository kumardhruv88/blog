import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, FileText, Users, FolderTree, Tag, MessageSquare, 
  Settings, History, Globe, LogOut, ChevronLeft, ChevronRight, 
  Search, Bell, MoreVertical, ShieldAlert
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#FEFBF6] text-[#1E293B] flex overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />

      {/* Main Content */}
      <div className={`flex-grow h-screen overflow-y-auto transition-all duration-300 ${isSidebarCollapsed ? 'pl-20' : 'pl-[250px]'}`}>
        {/* Admin Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-black/5 px-8 h-20 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <h1 className="text-xl font-heading font-black tracking-tight">
                 {location.pathname.split('/').pop().charAt(0).toUpperCase() + location.pathname.split('/').pop().slice(1) || 'Dashboard'}
              </h1>
              <div className="h-4 w-px bg-black/10" />
              <p className="text-xs font-bold text-slate-gray">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
           </div>

           <div className="flex items-center gap-6">
              <div className="relative group hidden md:block">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-gray group-focus-within:text-electric-cyan transition-colors" size={16} />
                 <input 
                   type="text" 
                   placeholder="Quick search..."
                   className="bg-black/5 border border-black/5 rounded-xl py-2 pl-10 pr-4 text-xs outline-none focus:border-electric-cyan/50 transition-all w-64"
                 />
              </div>
              
              <div className="flex items-center gap-3">
                 <button className="p-2.5 bg-black/5 rounded-xl text-slate-gray hover:text-[#1E293B] transition-all relative">
                    <Bell size={20} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-neon-pink rounded-full border-2 border-[#F5F0EB]" />
                 </button>
                 <div className="h-10 w-px bg-black/10" />
                 <div className="flex items-center gap-3 pl-2">
                    <div className="text-right">
                       <p className="text-sm font-bold leading-none">Admin User</p>
                       <p className="text-[10px] font-black text-electric-cyan uppercase tracking-widest mt-1">Super Admin</p>
                    </div>
                    <img 
                      src="https://ui-avatars.com/api/?name=Admin&background=2563EB&color=1E293B" 
                      className="w-10 h-10 rounded-xl border border-electric-cyan/30"
                      alt="Admin"
                    />
                 </div>
              </div>
           </div>
        </header>

        {/* Content Area */}
        <main className="p-8 pb-16">
           <Outlet />
        </main>
      </div>

      {/* Access Warning (if non-admin tries to sneak in - implementation logic placeholder) */}
      <div className="hidden">
         <ShieldAlert size={48} />
         <h1>403 - Forbidden</h1>
      </div>
    </div>
  );
};

export default AdminLayout;
