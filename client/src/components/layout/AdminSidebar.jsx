import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3, FileText, Users, FolderTree, Tag, MessageSquare, 
  Settings, History, Globe, LogOut, ChevronLeft, ChevronRight,
  LayoutDashboard
} from 'lucide-react';

const AdminSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: FileText, label: 'Posts', path: '/admin/posts', badge: 1247 },
    { icon: Users, label: 'Users', path: '/admin/users', badge: 342 },
    { icon: FolderTree, label: 'Categories', path: '/admin/categories' },
    { icon: Tag, label: 'Tags', path: '/admin/tags' },
    { icon: MessageSquare, label: 'Comments', path: '/admin/comments', badge: 12 },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
    { icon: History, label: 'Activity Logs', path: '/admin/logs' },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-white/70 backdrop-blur-3xl border-r border-black/5 transition-all duration-300 z-50 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-[250px]'
      }`}
    >
      {/* Brand Logo */}
      <div className="h-20 flex items-center px-6 border-b border-black/5 relative">
        <Link to="/" className="flex items-center gap-3 group">
           <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(100,255,218,0.3)]">
             <Trophy size={18} className="text-[#1E293B]" />
           </div>
           {!isCollapsed && (
             <span className="font-heading font-black text-xl tracking-tighter text-[#1E293B]">
                Admin<span className="text-electric-cyan">Control</span>
             </span>
           )}
        </Link>
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-electric-cyan text-[#1E293B] rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-grow py-8 px-3 space-y-2 overflow-y-auto no-scrollbar">
         {menuItems.map((item) => (
           <NavLink
             key={item.path}
             to={item.path}
             end={item.path === '/admin'}
             className={({ isActive }) => `
               flex items-center gap-4 px-4 py-3 rounded-xl transition-all relative group
               ${isActive 
                 ? 'bg-electric-cyan/10 text-electric-cyan' 
                 : 'text-slate-gray hover:text-[#1E293B] hover:bg-black/5'
               }
             `}
           >
             {({ isActive }) => (
               <>
                 {isActive && (
                   <motion.div 
                     layoutId="sidebar-active"
                     className="absolute left-0 top-2 bottom-2 w-1 bg-electric-cyan rounded-full shadow-[0_0_10px_#2563EB]" 
                   />
                 )}
                 <item.icon size={20} className={isActive ? 'scale-110' : 'group-hover:scale-110 transition-transform'} />
                 {!isCollapsed && (
                   <div className="flex-grow flex items-center justify-between">
                      <span className="font-bold text-sm tracking-tight">{item.label}</span>
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${isActive ? 'bg-electric-cyan text-[#1E293B]' : 'bg-black/10 text-slate-gray'}`}>
                           {item.badge > 999 ? (item.badge/1000).toFixed(1)+'k' : item.badge}
                        </span>
                      )}
                   </div>
                 )}
                 {isCollapsed && item.badge && (
                   <span className="absolute top-2 right-2 w-2 h-2 bg-neon-pink rounded-full border border-[#F5F0EB]" />
                 )}
               </>
             )}
           </NavLink>
         ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-black/5 space-y-2">
         <Link to="/" className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-gray hover:text-electric-cyan hover:bg-black/5 transition-all">
            <Globe size={20} />
            {!isCollapsed && <span className="font-bold text-sm">Back to Site</span>}
         </Link>
         <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/5 transition-all">
            <LogOut size={20} />
            {!isCollapsed && <span className="font-bold text-sm">Sign Out</span>}
         </button>
      </div>
    </aside>
  );
};

// Simple Icon fallback for Trophy
const Trophy = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

export default AdminSidebar;
