import React, { useState } from 'react';
import { 
  History, Download, Search as SearchIcon, 
  Trash2, RefreshCcw, Terminal, ChevronRight,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

// --- MOCK DATA ---
const LOGS_DATA = [
  { id: 1, admin: "Dhruv", action: "Deleted User", details: "bad_actor_99", ip: "192.168.1.45", time: "2 mins ago", type: "danger" },
  { id: 2, admin: "Sarah", action: "Approved Comment", details: "Post #124", ip: "172.16.25.12", time: "15 mins ago", type: "success" },
  { id: 3, admin: "Dhruv", action: "Modified Settings", details: "Security: Registration disabled", ip: "192.168.1.45", time: "1 hour ago", type: "warning" },
  { id: 4, admin: "Alex", action: "Created Post", details: "Next.js Authentication Guide", ip: "104.28.14.2", time: "3 hours ago", type: "info" },
  { id: 5, admin: "System", action: "Database Backup", details: "Auto-backup successful", ip: "127.0.0.1", time: "5 hours ago", type: "success" },
];

const AdminActivity = () => {
  const [filter, setFilter] = useState('all');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-heading font-black text-[#1E293B]">Audit <span className="gradient-text">Logs</span></h2>
          <p className="text-slate-gray text-sm mt-1">Platform-wide events and administrative action tracking</p>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
             <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-gray group-focus-within:text-electric-cyan transition-colors" size={16} />
             <input type="text" placeholder="Filter by event..." className="w-64 bg-black/5 border border-black/10 rounded-xl py-2 pl-12 pr-4 text-xs text-[#1E293B] focus:border-electric-cyan/50 outline-none transition-all" />
          </div>
          <Button variant="outline" icon={Download} size="sm">Export CSV</Button>
        </div>
      </div>

      <Card className="border-black/5 glass-card-dark overflow-hidden">
        <div className="p-6 border-b border-black/5 bg-white/[0.01] flex gap-4">
           {['All Events', 'Security', 'Content', 'Users', 'System'].map((f, i) => (
             <button 
               key={i}
               onClick={() => setFilter(f.toLowerCase().split(' ')[0])}
               className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all tracking-widest italic ${filter === f.toLowerCase().split(' ')[0] ? 'bg-electric-cyan text-[#1E293B]' : 'text-slate-gray hover:text-[#1E293B] hover:bg-black/5'}`}
             >
               {f}
             </button>
           ))}
        </div>
        <table className="w-full text-left">
          <thead className="bg-[#FEFBF6]/50 text-[9px] font-black uppercase tracking-widest text-slate-gray">
            <tr>
              <th className="px-8 py-4">Event Authority</th>
              <th className="px-8 py-4">Action Protocol</th>
              <th className="px-8 py-4">Descriptor</th>
              <th className="px-8 py-4">Network Identity</th>
              <th className="px-8 py-4 text-right">Chronology</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {LOGS_DATA.map(log => (
              <tr key={log.id} className="hover:bg-white/[0.02] transition-all group">
                <td className="px-8 py-5">
                   <div className="flex items-center gap-3">
                      <img src={`https://ui-avatars.com/api/?name=${log.admin}&background=2563EB&color=1E293B`} className="w-8 h-8 rounded-lg border border-black/10" />
                      <span className="text-xs font-bold text-[#1E293B] group-hover:text-electric-cyan transition-colors">{log.admin}</span>
                   </div>
                </td>
                <td className="px-8 py-5">
                   <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest italic border w-fit ${
                      log.type === 'danger' ? 'text-red-400 border-red-400/20 bg-red-400/5' : 
                      log.type === 'success' ? 'text-green-400 border-green-400/20 bg-green-400/5' : 
                      log.type === 'warning' ? 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5' : 
                      'text-blue-400 border-blue-400/20 bg-blue-400/5'
                   }`}>
                      {log.action}
                   </div>
                </td>
                <td className="px-8 py-5 text-xs text-slate-gray font-bold italic line-clamp-1">{log.details}</td>
                <td className="px-8 py-5 font-mono text-[10px] text-slate-gray/50">{log.ip}</td>
                <td className="px-8 py-5 text-right font-black text-[10px] text-slate-gray uppercase italic">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-8 text-center bg-white/[0.01] border-t border-black/5">
           <button className="text-xs font-black uppercase italic text-slate-gray hover:text-[#1E293B] transition-all flex items-center gap-2 mx-auto"><RefreshCcw size={14} className="animate-spin-slow" /> Synchronization active · Syncing live events</button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card className="p-8 border-black/5 glass-card-dark flex items-center justify-between group cursor-pointer hover:border-electric-cyan/20 transition-all">
            <div className="flex gap-4 items-center">
               <div className="p-3 bg-red-400/10 border border-red-400/20 text-red-400 rounded-2xl group-hover:scale-110 transition-transform"><Trash2 size={24} /></div>
               <div><h6 className="text-sm font-black text-[#1E293B] uppercase italic">Purge Log Vault</h6><p className="text-xs text-slate-gray">Permanently delete logs older than 90 days</p></div>
            </div>
            <ChevronRight className="text-slate-gray group-hover:text-[#1E293B]" />
         </Card>
         <Card className="p-8 border-black/5 glass-card-dark flex items-center justify-between group cursor-pointer hover:border-electric-cyan/20 transition-all">
            <div className="flex gap-4 items-center">
               <div className="p-3 bg-electric-cyan/10 border border-electric-cyan/20 text-electric-cyan rounded-2xl group-hover:scale-110 transition-transform"><Terminal size={24} /></div>
               <div><h6 className="text-sm font-black text-[#1E293B] uppercase italic">Real-time Stream</h6><p className="text-xs text-slate-gray">Activate high-frequency event monitoring</p></div>
            </div>
            <ChevronRight className="text-slate-gray group-hover:text-[#1E293B]" />
         </Card>
      </div>
    </div>
  );
};

export default AdminActivity;
