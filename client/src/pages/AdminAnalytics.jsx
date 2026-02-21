import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Settings, History, TrendingUp, TrendingDown, 
  Users, Eye, FileText, Globe, Shield, Zap, Search, 
  Download, Calendar, ChevronRight, ExternalLink
} from 'lucide-react';
import { 
  AreaChart, Area, PieChart, Pie, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell, CartesianGrid 
} from 'recharts';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { fetchAdminStats } from '../services/api';

// --- MOCK DATA ---
const ANALYTICS_DATA = [
  { name: 'Mon', views: 2400, unique: 1800, bounce: 45 },
  { name: 'Tue', views: 3200, unique: 2100, bounce: 42 },
  { name: 'Wed', views: 2800, unique: 1900, bounce: 48 },
  { name: 'Thu', views: 4500, unique: 2800, bounce: 38 },
  { name: 'Fri', views: 3800, unique: 2500, bounce: 40 },
  { name: 'Sat', views: 5200, unique: 3200, bounce: 35 },
  { name: 'Sun', views: 4800, unique: 2900, bounce: 37 },
];

const TRAFFIC_SOURCES = [
  { name: 'Direct', value: 400, color: '#2563EB' },
  { name: 'Search', value: 300, color: '#BD34FE' },
  { name: 'Social', value: 200, color: '#FF00A0' },
  { name: 'Referral', value: 100, color: '#3B82F6' },
];

const TOP_POSTS = [
  { title: "Mastering React Server Components", views: 12400, time: "4:30" },
  { title: "Advanced TypeScript Patterns", views: 8900, time: "5:15" },
  { title: "CSS Grid vs Flexbox in 2024", views: 7600, time: "3:45" },
  { title: "Deploying Node.js to Vercel", views: 5200, time: "6:20" },
  { title: "Understanding Database Indexes", views: 4800, time: "7:10" },
];

const AdminAnalytics = () => {
  const [range, setRange] = useState('7d');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStats = async () => {
      try {
        const data = await fetchAdminStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    getStats();
  }, []);

  if (loading) return <div className="p-8 text-[#1E293B] uppercase font-black tracking-widest animate-pulse">Initializing Neural Data Stream...</div>;

  const metrics = [
    { label: 'Total Views', value: stats?.totalViews || '0', trend: stats?.trends?.views || '+12.5%', icon: Eye, color: 'text-electric-cyan' },
    { label: 'Total Users', value: stats?.totalUsers || '0', trend: stats?.trends?.users || '+8.2%', icon: Users, color: 'text-vibrant-purple' },
    { label: 'Total Posts', value: stats?.totalPosts || '0', trend: stats?.trends?.posts || '+5.1%', icon: FileText, color: 'text-blue-400' },
    { label: 'Total Comments', value: stats?.totalComments || '0', trend: stats?.trends?.comments || 'N/A', icon: Zap, color: 'text-yellow-400' },

    { label: 'Conv. Rate', value: '2.4%', trend: '+0.8%', icon: TrendingUp, color: 'text-neon-pink' },
    { label: 'Active Now', value: 'Live', trend: 'Live', icon: Globe, color: 'text-electric-cyan' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-heading font-black text-[#1E293B]">Site <span className="gradient-text">Intelligence</span></h2>
          <p className="text-slate-gray text-sm mt-1">Deep analysis of traffic, content performance, and user growth</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-black/5 p-1 rounded-xl border border-black/5">
             {['7d', '30d', '90d', 'All'].map(r => (
               <button 
                 key={r}
                 onClick={() => setRange(r)}
                 className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${range === r ? 'bg-electric-cyan text-[#1E293B]' : 'text-slate-gray hover:text-[#1E293B]'}`}
               >
                 {r}
               </button>
             ))}
          </div>
          <Button variant="outline" icon={Download} size="sm">Export Report</Button>
        </div>
      </div>

      {/* Global Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((m, i) => (
          <Card key={i} className="p-4 border-black/5 glass-card-dark relative overflow-hidden group">
            <div className={`p-2 w-fit rounded-lg bg-black/5 border border-black/10 mb-2 ${m.color}`}><m.icon size={16} /></div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-gray">{m.label}</p>
            <h4 className="text-xl font-black text-[#1E293B] mt-1">{m.value}</h4>
            <div className={`text-[8px] font-bold mt-2 flex items-center gap-1 ${m.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
              {m.trend} <span className="text-slate-gray/50 font-normal underline">vs last {range}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Traffic Chart */}
        <Card className="lg:col-span-2 p-8 border-black/5 glass-card-dark">
          <div className="flex justify-between items-center mb-10">
            <div>
               <h4 className="text-lg font-black text-[#1E293B] uppercase italic">Traffic Trajectory</h4>
               <p className="text-xs text-slate-gray">Engagement metrics mapped over time</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-electric-cyan" /><span className="text-[10px] uppercase font-black text-slate-gray">Page Views</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-vibrant-purple" /><span className="text-[10px] uppercase font-black text-slate-gray">Uniques</span></div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANALYTICS_DATA}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/><stop offset="95%" stopColor="#2563EB" stopOpacity={0}/></linearGradient>
                  <linearGradient id="uniqueGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#BD34FE" stopOpacity={0.2}/><stop offset="95%" stopColor="#BD34FE" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4A5568', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#4A5568', fontSize: 10, fontWeight: 'bold'}} />
                <Tooltip contentStyle={{backgroundColor: '#F5F0EB', border: '1px solid #ffffff10', borderRadius: '12px'}} itemStyle={{fontSize: '12px', fontWeight: 'bold'}} />
                <Area type="monotone" dataKey="views" stroke="#2563EB" strokeWidth={3} fill="url(#viewsGrad)" />
                <Area type="monotone" dataKey="unique" stroke="#BD34FE" strokeWidth={3} fill="url(#uniqueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Traffic Sources */}
        <Card className="p-8 border-black/5 glass-card-dark flex flex-col">
          <h4 className="text-lg font-black text-[#1E293B] uppercase italic mb-8">Acquisition Sources</h4>
          <div className="h-64 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={TRAFFIC_SOURCES} innerRadius={60} outerRadius={80} paddingAngle={10} dataKey="value">
                  {TRAFFIC_SOURCES.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: '#F5F0EB', border: '1px solid #ffffff10', borderRadius: '12px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-8 flex-grow">
            {TRAFFIC_SOURCES.map(source => (
              <div key={source.name} className="flex items-center justify-between p-3 border border-black/5 rounded-xl bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: source.color }} />
                  <span className="text-xs font-bold text-[#1E293B] uppercase tracking-widest">{source.name}</span>
                </div>
                <span className="text-xs font-black text-slate-gray">{Math.round(source.value / 10)}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Content Analytics */}
      <Card className="border-black/5 glass-card-dark overflow-hidden">
        <div className="p-6 border-b border-black/5 flex justify-between items-center bg-white/[0.01]">
          <h4 className="text-sm font-black text-[#1E293B] uppercase tracking-widest">Post Performance Matrix</h4>
          <button className="text-[10px] font-black uppercase text-electric-cyan hover:underline">View Deep Reports</button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-[#FEFBF6]/50 text-[9px] font-black uppercase tracking-widest text-slate-gray">
            <tr>
              <th className="px-8 py-4">Article Identifier</th>
              <th className="px-8 py-4 text-center">Impressions</th>
              <th className="px-8 py-4 text-center">Velocity</th>
              <th className="px-8 py-4 text-center">Retention</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {TOP_POSTS.map((post, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-all">
                <td className="px-8 py-5 flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center font-black ${i === 0 ? 'text-yellow-400' : 'text-slate-gray'}`}>{i+1}</div>
                  <span className="text-xs font-bold text-[#1E293B] group-hover:text-electric-cyan transition-colors">{post.title}</span>
                </td>
                <td className="px-8 py-5 text-center font-mono text-xs text-[#1E293B]">{post.views.toLocaleString()}</td>
                <td className="px-8 py-5 text-center">
                   <div className="w-24 h-1.5 bg-black/5 rounded-full overflow-hidden mx-auto">
                      <div className="h-full bg-electric-cyan" style={{ width: `${80 - i*15}%` }} />
                   </div>
                </td>
                <td className="px-8 py-5 text-center font-mono text-xs text-slate-gray">{post.time}</td>
                <td className="px-8 py-5 text-right"><button className="p-2 hover:bg-black/10 rounded-lg text-slate-gray hover:text-[#1E293B] transition-all"><ExternalLink size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
