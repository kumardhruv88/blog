import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Users, MessageSquare, Eye, TrendingUp,
  AlertCircle
} from 'lucide-react';
import { 
  AreaChart, Area, ResponsiveContainer
} from 'recharts';
import Card from '../components/common/Card';

// --- MOCK DATA ---
const ACTIVITY_LOGS = [
  { id: 1, user: 'Dhruv', desc: 'published "Advanced React Pattern"', time: '2 mins ago', icon: FileText, color: 'text-electric-cyan' },
  { id: 2, user: 'Sarah', desc: 'joined the community', time: '15 mins ago', icon: Users, color: 'text-green-400' },
  { id: 3, user: 'Alex', desc: 'commented on "Next.js 15 Guide"', time: '1 hour ago', icon: MessageSquare, color: 'text-vibrant-purple' },
  { id: 4, user: 'System', desc: 'Large traffic surge detected', time: '2 hours ago', icon: AlertCircle, color: 'text-neon-pink' },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-8 min-h-screen animate-in fade-in duration-500">
      <DashboardView />
    </div>
  );
};

const DashboardView = () => (
   <div className="space-y-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Total Posts', value: '1,247', trend: '+23 this week', icon: FileText, color: 'text-electric-cyan' },
           { label: 'Total Users', value: '342', trend: '+8 this month', icon: Users, color: 'text-vibrant-purple' },
           { label: 'Views Today', value: '8,543', trend: '+12% from yesterday', icon: Eye, color: 'text-green-400' },
           { label: 'Total Comments', value: '1,923', trend: '12 pending', icon: MessageSquare, color: 'text-neon-pink' },
         ].map((stat, i) => (
           <Card key={i} className="p-6 glass-card-dark border-white/5 group relative overflow-hidden">
             <div className={`p-3 w-fit rounded-2xl bg-white/5 border border-white/10 ${stat.color} mb-4`}><stat.icon size={20} /></div>
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-gray mb-1">{stat.label}</p>
             <h3 className="text-3xl font-black text-white">{stat.value}</h3>
             <p className="text-[10px] font-bold text-slate-gray mt-4">{stat.trend}</p>
             <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform duration-700 pointer-events-none">
                <stat.icon size={100} />
             </div>
           </Card>
         ))}
      </div>

      {/* Analytics & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <Card className="lg:col-span-2 p-8 glass-card-dark border-white/5 overflow-hidden">
            <h4 className="text-lg font-black text-white mb-8 flex items-center gap-3">
               <TrendingUp className="text-electric-cyan" size={20} /> Content Velocity
            </h4>
            <div className="h-72 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[{v:10},{v:15},{v:12},{v:22},{v:18},{v:30},{v:25},{v:35}]}>
                     <defs>
                        <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#64FFDA" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#64FFDA" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <Area type="monotone" dataKey="v" stroke="#64FFDA" strokeWidth={3} fill="url(#colorV)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </Card>

         <Card className="p-8 glass-card-dark border-white/5">
            <h4 className="text-lg font-black text-white mb-8">System Activity</h4>
            <div className="space-y-6">
               {ACTIVITY_LOGS.map(log => (
                  <div key={log.id} className="flex gap-4 group">
                     <div className={`p-2 rounded-lg bg-white/5 ${log.color} group-hover:scale-110 transition-all`}>
                        <log.icon size={14} />
                     </div>
                     <div>
                        <p className="text-[11px] text-white">
                           <span className="font-bold">{log.user}</span> {log.desc}
                        </p>
                        <span className="text-[9px] text-slate-gray">{log.time}</span>
                     </div>
                  </div>
               ))}
            </div>
         </Card>
      </div>
   </div>
);

export default AdminDashboard;
