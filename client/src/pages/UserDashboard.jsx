import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, BookOpen, Heart, Settings, LogOut, Edit3, Plus, 
  BarChart3, FileText, Eye, Bookmark, TrendingUp, Clock, 
  MoreVertical, Edit, Copy, Trash2, ExternalLink, Download,
  CheckCircle, Clock as ClockIcon, AlertCircle, Search as SearchIcon, Calendar,
  Globe, Github, Linkedin, Twitter, Mail, Lock, Bell, Shield, Palette, Camera, X, Users, Star,
  ChevronRight, Code2, Cpu, Zap
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
  ComposedChart, Legend
} from 'recharts';
import { useUser, useAuth } from '@clerk/clerk-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { fetchUserProfile, fetchUserPosts, fetchUserStats, deletePost, setAuthToken } from '../services/api';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchParams] = useSearchParams();
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { getToken } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [settingsTab, setSettingsTab] = useState('Profile');
  const [bookmarkSearch, setBookmarkSearch] = useState('');
  const [bookmarkSort, setBookmarkSort] = useState('Recently Bookmarked');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
     const tab = searchParams.get('tab');
     if (tab) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    const getData = async () => {
      if (!isClerkLoaded || !clerkUser) return;

      try {
        setLoading(true);
        const token = await getToken();
        setAuthToken(token);
        
        const identifier = clerkUser.username || clerkUser.primaryEmailAddress?.emailAddress;
        
        const profile = await fetchUserProfile(identifier);
        setUser(profile);
        
        const [userPosts, userStats] = await Promise.all([
          fetchUserPosts(profile.id),
          fetchUserStats(profile.id)
        ]);
        
        setPosts(userPosts);
        setStats(userStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (isClerkLoaded) {
      if (clerkUser) {
        getData();
      } else {
        setLoading(false);
      }
    }
  }, [clerkUser, isClerkLoaded]);

  const handleDelete = async () => {
    try {
      const token = await getToken();
      setAuthToken(token);
      await Promise.all(selectedPosts.map(id => deletePost(id)));
      setPosts(prev => prev.filter(p => !selectedPosts.includes(p.id)));
      setSelectedPosts([]);
      setIsDeleting(false);
    } catch (error) {
      console.error('Error deleting posts:', error);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEFBF6]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-electric-cyan border-t-transparent rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]" />
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3 },
    { id: 'posts', label: 'My Posts', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1500px] mx-auto bg-[#FEFBF6]">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-72 flex-shrink-0 space-y-6">
          <Card className="p-8 text-center border-black/5 bg-white/60 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-brand opacity-[0.03]" />
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-brand rounded-full blur-[15px] opacity-20 group-hover:opacity-40 transition-opacity" />
              <img src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name}&background=2563EB&color=1E293B`} alt={user?.name} className="w-24 h-24 rounded-full border-2 border-electric-cyan p-1 relative z-10" />
            </div>
            <h2 className="text-xl font-heading font-black text-[#1E293B]">{user?.name}</h2>
            <p className="text-electric-cyan text-xs font-mono mt-1 uppercase tracking-widest">@{user?.username}</p>
          </Card>

          <nav className="space-y-1.5">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button 
                  key={tab.id} 
                  id={`dashboard-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)} 
                  className={`w-full flex items-center justify-between gap-3 px-6 py-4 rounded-2xl transition-all relative group overflow-hidden ${activeTab === tab.id ? 'text-[#1E293B]' : 'text-slate-gray hover:text-[#1E293B] hover:bg-black/5'}`}
                >
                  <div className="flex items-center gap-3 z-10">
                    <Icon size={20} className={activeTab === tab.id ? 'text-electric-cyan' : 'group-hover:text-[#1E293B] transition-colors'} />
                    <span className="font-black text-xs uppercase tracking-widest">{tab.label}</span>
                  </div>
                  {activeTab === tab.id && (
                    <motion.div layoutId="nav-glow" className="absolute left-0 w-1 h-1/2 bg-electric-cyan rounded-full shadow-[0_0_10px_#2563EB]" />
                  )}
                  {activeTab === tab.id && <motion.div layoutId="tab-bg" className="absolute inset-0 bg-black/5" />}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-grow min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-10">
              {activeTab === 'overview' && (
                <div className="space-y-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h2 className="text-4xl font-heading font-black text-[#1E293B] tracking-tight">
                        Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>!
                      </h2>
                      <p className="text-slate-gray text-sm mt-1.5 flex items-center gap-2 font-bold">
                        <TrendingUp size={16} className="text-electric-cyan" />
                        {stats?.streak > 0 
                          ? `Keep your ${stats.streak}-day writing streak alive!` 
                          : "Ready to document your next big tech breakthrough?"}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <Button variant="outline" icon={Settings} onClick={() => setActiveTab('settings')} className="border-black/10">Manage</Button>
                      <Button icon={Plus} onClick={() => navigate('/create-post')} className="shadow-[0_0_20px_rgba(37,99,235,0.2)]">New Post</Button>
                    </div>
                  </div>

                  {/* Post Status Carousel */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {[
                       { status: 'published', label: 'Live Units', count: posts.filter(p => p.status === 'published').length, color: 'text-electric-cyan', bg: 'bg-electric-cyan/10', icon: Globe },
                       { status: 'draft', label: 'Incubating', count: posts.filter(p => p.status === 'draft').length, color: 'text-vibrant-purple', bg: 'bg-vibrant-purple/10', icon: Edit3 },
                       { status: 'scheduled', label: 'Queued', count: posts.filter(p => p.status === 'scheduled').length, color: 'text-neon-pink', bg: 'bg-neon-pink/10', icon: Calendar },
                     ].map((item, i) => (
                       <div key={i} className="group relative cursor-pointer" onClick={() => setActiveTab('posts')}>
                          <div className="absolute inset-0 bg-gradient-brand opacity-0 group-hover:opacity-[0.03] transition-opacity rounded-[32px]" />
                          <div className="p-8 glass-card border-black/5 group-hover:border-black/20 transition-all rounded-[32px] flex items-center justify-between">
                             <div className="flex items-center gap-5">
                                <div className={`p-4 rounded-2xl ${item.bg} ${item.color}`}>
                                   <item.icon size={24} />
                                </div>
                                <div className="min-w-0">
                                   <p className="text-3xl font-heading font-black text-[#1E293B]">{item.count}</p>
                                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-gray mt-1">{item.label}</p>
                                </div>
                             </div>
                             <ChevronRight size={20} className="text-slate-gray group-hover:text-[#1E293B] transition-all transform group-hover:translate-x-1" />
                          </div>
                       </div>
                     ))}
                  </div>

                  {/* Stat Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: 'Published Posts', value: stats?.posts_count || 0, trend: '+2 this month', icon: FileText, color: 'text-electric-cyan', bg: 'bg-electric-cyan/10' },
                      { label: 'Topics Covered', value: stats?.topics_covered || 0, trend: 'Unique tags', icon: BookOpen, color: 'text-vibrant-purple', bg: 'bg-vibrant-purple/10' },
                      { label: 'Reading Time', value: `${stats?.reading_time || 0}m`, trend: 'Total engagement', icon: Clock, color: 'text-neon-pink', bg: 'bg-neon-pink/10' },
                      { label: 'Code Snippets', value: stats?.code_snippets || 0, trend: 'Shared logic', icon: Code2, color: 'text-orange-400', bg: 'bg-orange-400/10' },
                    ].map((stat, i) => {
                      const Icon = stat.icon;
                      return (
                        <Card key={i} className="p-7 glass-card-dark border-black/5 relative group hover:border-black/10 transition-all">
                          <div className={`p-3.5 rounded-2xl w-fit ${stat.bg} ${stat.color} mb-5 group-hover:scale-110 transition-transform`}>
                            <Icon size={24} />
                          </div>
                          <div className="flex items-end justify-between">
                            <h4 className="text-4xl font-heading font-black text-[#1E293B] tabular-nums">{stat.value}</h4>
                            <span className="text-[10px] text-electric-cyan font-black uppercase tracking-tighter bg-electric-cyan/10 px-2 py-1 rounded-md mb-1">{stat.trend}</span>
                          </div>
                          <p className="text-[10px] uppercase font-black tracking-widest text-slate-gray mt-3">{stat.label}</p>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Centered Heatmap */}
                  <Card className="p-10 glass-card-dark border-black/5 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-electric-cyan/5 blur-[100px] rounded-full pointer-events-none" />
                     <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6 relative z-10">
                        <div className="flex items-center gap-4">
                           <div className="p-3.5 rounded-2xl bg-electric-cyan/10 text-electric-cyan shadow-lg shadow-electric-cyan/5">
                              <Calendar size={24} />
                           </div>
                           <div>
                              <h3 className="text-xl font-heading font-black text-[#1E293B]">Neural Writing Pulse</h3>
                              <p className="text-[10px] text-slate-gray font-black uppercase tracking-widest mt-1 opacity-60">Consistency log for the last 90 cycles</p>
                           </div>
                        </div>
                        <div className="flex gap-12">
                           <div className="text-center">
                              <p className="text-3xl font-heading font-black text-[#1E293B]">{stats?.streak || 7}</p>
                              <p className="text-[9px] text-electric-cyan font-black uppercase tracking-widest mt-1">Active Streak</p>
                           </div>
                           <div className="text-center">
                              <p className="text-3xl font-heading font-black text-[#1E293B]">42</p>
                              <p className="text-[9px] text-vibrant-purple font-black uppercase tracking-widest mt-1">Peak Milestone</p>
                           </div>
                        </div>
                     </div>
                     
                     <div className="relative mb-10">
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6 justify-center">
                            {Array.from({ length: 15 }).map((_, weekIndex) => (
                              <div key={weekIndex} className="flex flex-col gap-2">
                                {Array.from({ length: 7 }).map((_, dayIndex) => {
                                  const intensity = Math.random() > 0.7 ? (Math.random() > 0.5 ? 2 : 1) : 0;
                                  const colors = ['bg-black/5', 'bg-electric-cyan/30', 'bg-electric-cyan shadow-[0_0_15px_rgba(100,255,218,0.6)]'];
                                  const activities = intensity === 2 ? ['Logic Deployed', 'Sync Commited'] : intensity === 1 ? ['Signal Logged'] : [];
                                  return (
                                    <div key={dayIndex} className={`w-4 h-4 rounded-[3px] ${colors[intensity]} transition-all hover:scale-125 cursor-help relative group/day z-10`}>
                                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-[#F5F0EB] text-[10px] text-[#1E293B] rounded-xl border border-black/10 opacity-0 group-hover/day:opacity-100 whitespace-nowrap z-50 pointer-events-none shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
                                         <div className="font-black mb-1 flex items-center gap-2">
                                            {intensity === 0 ? <ClockIcon size={10} className="text-slate-gray" /> : <Zap size={10} className="text-electric-cyan" />}
                                            {intensity === 0 ? 'Quiet Period' : `${intensity} System Operations`}
                                         </div>
                                         <div className="text-slate-gray font-mono mb-1">Cycle ID: 2026-02-{weekIndex * 7 + dayIndex + 1}</div>
                                         {activities.length > 0 && (
                                           <div className="pt-1 border-t border-black/5 space-y-1">
                                              {activities.map((a, idx) => (
                                                <div key={idx} className="flex items-center gap-1.5 text-electric-cyan/70">
                                                   <div className="w-1 h-1 rounded-full bg-electric-cyan" />
                                                   {a}
                                                </div>
                                              ))}
                                           </div>
                                         )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-between mt-6 px-10">
                           <div className="flex items-center gap-3 text-[9px] text-slate-gray font-black uppercase tracking-[0.2em]">
                              <span>Low Activity</span>
                              <div className="flex gap-1.5 p-1.5 bg-black/5 rounded-lg border border-black/5">
                                 <div className="w-2.5 h-2.5 bg-black/5 rounded-[1px]" />
                                 <div className="w-2.5 h-2.5 bg-electric-cyan/30 rounded-[1px]" />
                                 <div className="w-2.5 h-2.5 bg-electric-cyan rounded-[1px]" />
                              </div>
                              <span>Max Intensity</span>
                           </div>
                           <p className="text-[9px] text-slate-gray font-black uppercase tracking-[0.3em] bg-black/5 px-4 py-2 rounded-full border border-black/5">90-Day Neural Pulse: Stable</p>
                        </div>
                     </div>

                     <div className="pt-10 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="w-full md:w-1/2 space-y-4">
                           <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-gray">
                              <span className="flex items-center gap-2"><Star size={12} className="text-neon-pink" /> Monthly Engagement Goal</span>
                              <span className="text-[#1E293B]">75%</span>
                           </div>
                           <div className="h-2.5 w-full bg-black/5 rounded-full overflow-hidden p-0.5 border border-black/5">
                              <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-gradient-brand rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]" />
                           </div>
                        </div>
                        <div className="flex gap-4 shrink-0">
                           <Button variant="ghost" className="px-8 py-4 bg-black/5 border border-black/5 hover:border-electric-cyan/20 text-[9px] font-black uppercase tracking-widest" icon={Download} onClick={() => alert('Exporting writing log to CSV...')}>Export Writing Log</Button>
                           <Button variant="ghost" className="px-5 py-4 bg-black/5 border border-black/5 hover:border-black/10" icon={ExternalLink} onClick={() => window.open('https://github.com/settings/profile', '_blank')}></Button>
                        </div>
                     </div>
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Wide Activity Timeline */}
                    <Card className="lg:col-span-3 p-10 glass-card-dark border-black/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-electric-cyan/5 blur-[60px] rounded-full" />
                      <div className="flex items-center justify-between mb-10 relative z-10">
                        <h3 className="text-xl font-heading font-black text-[#1E293B] flex items-center gap-3">
                          <ClockIcon size={22} className="text-electric-cyan" /> Recent Activity
                        </h3>
                        <button className="text-[10px] font-black uppercase tracking-widest text-slate-gray hover:text-[#1E293B] transition-colors">Archive</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        {(stats?.recent_activity || [
                          { type: 'publish', title: 'Understanding Transformers', date: '2 hours ago', icon: Cpu, color: 'text-electric-cyan', badge: 'Logic Deployed' },
                          { type: 'bookmark', title: 'React Performance Tips', date: '5 hours ago', icon: Bookmark, color: 'text-neon-pink', badge: 'Node Saved' },
                          { type: 'security', title: 'MFA Configuration Updated', date: '1 day ago', icon: Shield, color: 'text-green-400', badge: 'Protocol Sync' },
                        ]).map((act, i) => {
                          const Icon = act.icon;
                          return (
                            <div key={i} className="flex gap-5 group cursor-pointer p-6 rounded-[32px] bg-white/[0.02] border border-black/5 hover:border-black/10 hover:bg-white/[0.04] transition-all">
                              <div className={`w-14 h-14 rounded-2xl bg-black/5 flex items-center justify-center text-slate-gray group-hover:${act.color} group-hover:bg-black/10 transition-all duration-300 border border-black/5 shrink-0`}>
                                <Icon size={22} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-[#1E293B] group-hover:text-electric-cyan transition-colors line-clamp-1">{act.title}</p>
                                <p className="text-[10px] text-slate-gray mt-1.5 font-black uppercase tracking-widest opacity-60">
                                  {act.badge}
                                </p>
                                <p className={`text-[10px] ${act.color} opacity-60 mt-1 font-mono`}>{act.date}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'posts' && (
                <div className="space-y-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <h2 className="text-3xl font-heading font-black text-[#1E293B] tracking-tight">Manage Your <span className="gradient-text">Posts</span></h2>
                    <div className="flex gap-3">
                      {selectedPosts.length > 0 && (
                        <div className="flex gap-2 animate-in slide-in-from-right-4 duration-300">
                           <Button variant="outline" className="text-[#1E293B] border-black/10" icon={Edit}>Status</Button>
                           <Button variant="outline" className="text-red-400 border-red-400/20 hover:bg-red-400/10" icon={Trash2} onClick={() => setIsDeleting(true)}>
                              Delete ({selectedPosts.length})
                           </Button>
                        </div>
                      )}
                      <Button icon={Plus} onClick={() => navigate('/create-post')}>New Article</Button>
                    </div>
                  </div>

                  <Card className="overflow-hidden glass-card-dark border-black/5 shadow-2xl">
                    <div className="p-6 border-b border-black/5 bg-white/[0.01] flex flex-wrap gap-4 items-center justify-between">
                      <div className="relative flex-grow max-w-lg">
                        <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-gray w-4 h-4" />
                        <input type="text" placeholder="Search by title or category..." className="w-full bg-[#FEFBF6] border border-black/10 rounded-2xl py-3.5 pl-14 pr-6 text-sm text-[#1E293B] focus:border-electric-cyan focus:ring-1 focus:ring-electric-cyan outline-none transition-all shadow-inner" />
                      </div>
                      <div className="flex gap-3">
                        <select className="bg-[#FEFBF6] border border-black/10 rounded-xl py-3 px-5 text-[10px] font-black uppercase tracking-widest text-slate-gray outline-none focus:border-electric-cyan cursor-pointer transition-all">
                          <option>Filter: All Posts</option>
                          <option>Published</option>
                          <option>Drafts</option>
                          <option>Scheduled</option>
                        </select>
                        <select className="bg-[#FEFBF6] border border-black/10 rounded-xl py-3 px-5 text-[10px] font-black uppercase tracking-widest text-slate-gray outline-none focus:border-electric-cyan cursor-pointer transition-all">
                          <option>Sort: Newest</option>
                          <option>Most Viewed</option>
                          <option>Most Bookmarked</option>
                        </select>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-white/[0.03] text-[10px] uppercase tracking-widest font-black text-slate-gray">
                          <tr>
                            <th className="px-8 py-5 w-12">
                              <input type="checkbox" onChange={(e) => setSelectedPosts(e.target.checked ? posts.map(p => p.id) : [])} checked={selectedPosts.length === posts.length && posts.length > 0} className="rounded-md border-black/10 bg-[#FEFBF6] text-electric-cyan focus:ring-electric-cyan w-4 h-4 cursor-pointer" />
                            </th>
                            <th className="px-8 py-5">Article details</th>
                            <th className="px-8 py-5 text-center">Engagement</th>
                            <th className="px-8 py-5">Status</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {posts.map(post => (
                            <tr key={post.id} className={`group hover:bg-white/[0.02] transition-colors ${selectedPosts.includes(post.id) ? 'bg-electric-cyan/[0.03]' : ''}`}>
                                <td className="px-8 py-8">
                                  <input type="checkbox" checked={selectedPosts.includes(post.id)} onChange={(e) => setSelectedPosts(prev => e.target.checked ? [...prev, post.id] : prev.filter(id => id !== post.id))} className="rounded-md border-black/10 bg-[#FEFBF6] text-electric-cyan focus:ring-electric-cyan w-4 h-4 cursor-pointer" />
                                </td>
                                <td className="px-8 py-8">
                                  <div className="flex items-center gap-5">
                                    <div className="w-16 h-12 rounded-xl bg-black/5 overflow-hidden border border-black/5 shadow-lg group-hover:border-black/20 transition-all">
                                      <img src={post.cover_image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=200"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div>
                                      <p className="font-bold text-base text-[#1E293B] group-hover:text-electric-cyan transition-colors line-clamp-1">{post.title}</p>
                                      <div className="flex items-center gap-3 mt-1.5">
                                         <span className="text-[9px] font-black uppercase tracking-widest text-slate-gray">{post.category || 'Tech'}</span>
                                         <span className="w-1 h-1 rounded-full bg-black/10" />
                                         <span className="text-[9px] font-mono text-slate-gray uppercase italic">Updated {new Date(post.updated_at).toLocaleDateString()}</span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-8 py-8">
                                  <div className="flex items-center justify-center gap-6 text-slate-gray">
                                    <div className="flex flex-col items-center gap-1"><Eye size={16} className="text-electric-cyan/60" /> <span className="text-xs font-mono font-bold text-[#1E293B]">{post.views || 0}</span></div>
                                    <div className="flex flex-col items-center gap-1"><Bookmark size={16} className="text-neon-pink/60" /> <span className="text-xs font-mono font-bold text-[#1E293B]">{post.bookmarks || 0}</span></div>
                                  </div>
                                </td>
                                <td className="px-8 py-8">
                                   <Badge variant={post.status === 'published' ? 'success' : 'secondary'} className="px-3 py-1 text-[9px] font-black uppercase tracking-widest">
                                      {post.status}
                                   </Badge>
                                </td>
                                <td className="px-8 py-8 text-right">
                                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                                    <button onClick={() => navigate(`/edit-post/${post.id}`)} className="p-2.5 text-slate-gray hover:text-[#1E293B] bg-black/5 hover:bg-black/10 rounded-xl border border-black/5 transition-all"><Edit size={16} /></button>
                                    <button onClick={() => { setSelectedPosts([post.id]); setIsDeleting(true); }} className="p-2.5 text-slate-gray hover:text-red-400 bg-black/5 hover:bg-black/10 rounded-xl border border-black/5 transition-all"><Trash2 size={16} /></button>
                                  </div>
                                </td>
                            </tr>
                          ))}
                          {posts.length === 0 && (
                             <tr>
                                <td colSpan={5} className="py-24 text-center">
                                   <div className="space-y-4">
                                      <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto text-slate-gray opacity-20"><FileText size={32} /></div>
                                      <p className="text-slate-gray font-bold uppercase tracking-widest text-xs">No articles found in your vault</p>
                                      <Button variant="ghost" className="text-[10px]" onClick={() => navigate('/create-post')}>Draft your first one</Button>
                                   </div>
                                </td>
                             </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <h2 className="text-3xl font-heading font-black text-[#1E293B] tracking-tight">Advanced <span className="gradient-text">Insights</span></h2>
                    <div className="flex gap-4">
                      <select className="bg-[#F5F0EB] border border-black/10 rounded-xl py-3 px-5 text-[10px] font-black uppercase tracking-widest text-slate-gray outline-none focus:border-electric-cyan">
                         <option>Last 7 Days</option>
                         <option>Last 30 Days</option>
                         <option>Last 90 Days</option>
                         <option>Lifetime</option>
                      </select>
                      <Button variant="secondary" icon={Download} className="border-black/5" onClick={() => alert('Generating full analytics report (PDF)...')}>Full Report</Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                     {[
                       { label: 'Net Views', value: '12.4k', trend: '+24%', color: 'text-electric-cyan', icon: Eye },
                       { label: 'Articles', value: stats?.posts_count || 0, trend: '+4', color: 'text-vibrant-purple', icon: FileText },
                       { label: 'Saves', value: stats?.bookmarks_count || 156, trend: '+12%', color: 'text-neon-pink', icon: Bookmark },
                       { label: 'Read Time', value: '4.2m', trend: '-2%', color: 'text-orange-400', icon: Clock },
                     ].map((s, i) => {
                        const Icon = s.icon;
                        return (
                          <Card key={i} className="p-8 glass-card border-black/5 hover:border-black/10 transition-all group">
                             <div className="flex items-center justify-between mb-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-gray">{s.label}</p>
                                <Icon size={14} className={`${s.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
                             </div>
                             <div className="flex items-end justify-between">
                                <h4 className={`text-4xl font-heading font-black text-[#1E293B] tabular-nums`}>{s.value}</h4>
                                <span className={`text-[10px] font-black ${s.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'} mb-1.5`}>{s.trend}</span>
                             </div>
                          </Card>
                        );
                     })}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Views Velocity vs Engagement Correlation */}
                    <Card className="lg:col-span-2 p-10 glass-card-dark border-black/5 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-96 h-96 bg-vibrant-purple/5 blur-[120px] rounded-full" />
                      <div className="flex items-center justify-between mb-10 relative z-10">
                        <div>
                          <h3 className="text-xl font-heading font-black text-[#1E293B]">Engagement Correlation</h3>
                          <p className="text-[10px] text-slate-gray font-black uppercase tracking-widest mt-1">Cross-referencing traffic vs value signals</p>
                        </div>
                        <div className="flex gap-4">
                           <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full bg-electric-cyan" />
                             <span className="text-[10px] text-slate-gray uppercase font-bold">Views</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full bg-neon-pink" />
                             <span className="text-[10px] text-slate-gray uppercase font-bold">Bookmarks</span>
                           </div>
                        </div>
                      </div>
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={[
                            { date: 'Jan 28', views: 400, bookmarks: 24 },
                            { date: 'Jan 29', views: 300, bookmarks: 18 },
                            { date: 'Jan 30', views: 600, bookmarks: 45 },
                            { date: 'Jan 31', views: 800, bookmarks: 62 },
                            { date: 'Feb 01', views: 500, bookmarks: 38 },
                            { date: 'Feb 02', views: 900, bookmarks: 74 },
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                            <XAxis dataKey="date" stroke="#8892B0" fontSize={10} axisLine={false} tickLine={false} />
                            <YAxis yAxisId="left" stroke="#8892B0" fontSize={10} axisLine={false} tickLine={false} />
                            <YAxis yAxisId="right" orientation="right" stroke="#8892B0" fontSize={10} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#FEFBF6', border: '1px solid #ffffff10', borderRadius: '16px' }} />
                            <Area yAxisId="left" type="monotone" dataKey="views" fill="#2563EB" stroke="#2563EB" fillOpacity={0.05} strokeWidth={2} />
                            <Line yAxisId="right" type="monotone" dataKey="bookmarks" stroke="#E11D48" strokeWidth={3} dot={{ r: 4, fill: '#E11D48', strokeWidth: 2, stroke: '#FEFBF6' }} />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    <Card className="p-10 glass-card-dark border-black/5 shadow-2xl relative overflow-hidden">
                      <div className="flex items-center justify-between mb-10">
                        <h3 className="text-lg font-black uppercase tracking-widest text-[#1E293B]">Views Velocity</h3>
                        <div className="flex gap-1.5">
                           {['24h', '7d', '30d'].map(g => (
                             <button key={g} className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all ${g === '7d' ? 'bg-electric-cyan text-[#1E293B] shadow-[0_0_10px_rgba(37,99,235,0.3)]' : 'bg-black/5 text-slate-gray hover:text-[#1E293B]'}`}>{g}</button>
                           ))}
                        </div>
                      </div>
                      <div className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={[
                            { date: 'Jan 28', views: 400 },
                            { date: 'Jan 29', views: 300 },
                            { date: 'Jan 30', views: 600 },
                            { date: 'Jan 31', views: 800 },
                            { date: 'Feb 01', views: 500 },
                            { date: 'Feb 02', views: 900 },
                          ]}>
                            <defs>
                              <linearGradient id="colorViewsDashboard" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis dataKey="date" stroke="#8892B0" fontSize={10} axisLine={false} tickLine={false} />
                            <YAxis stroke="#8892B0" fontSize={10} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#FEFBF6', border: '1px solid #2563EB20', borderRadius: '16px', padding: '12px' }} itemStyle={{ color: '#2563EB', fontSize: '12px', fontWeight: 'bold' }} />
                            <Area type="monotone" dataKey="views" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorViewsDashboard)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    <Card className="p-10 glass-card-dark border-black/5 shadow-2xl relative overflow-hidden">
                      <h3 className="text-lg font-black uppercase tracking-widest text-[#1E293B] mb-10">Traffic Distribution</h3>
                      <div className="h-[320px] flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Search', value: 45 },
                                { name: 'Direct', value: 25 },
                                { name: 'Social', value: 20 },
                                { name: 'Referral', value: 10 },
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={70}
                              outerRadius={100}
                              paddingAngle={10}
                              dataKey="value"
                              stroke="none"
                            >
                              {[
                                '#2563EB', // Cyan
                                '#8B5CF6', // Purple
                                '#E11D48', // Pink
                                '#3B82F6'  // Blue
                              ].map((color, index) => (
                                <Cell key={`cell-${index}`} fill={color} className="hover:opacity-80 transition-opacity cursor-pointer" />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#FEFBF6', border: 'none', borderRadius: '12px', color: '#fff' }} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                          <p className="text-3xl font-black text-[#1E293B] tracking-tight">2.4k</p>
                          <p className="text-[10px] text-slate-gray uppercase font-black tracking-widest mt-1">Total Hits</p>
                        </div>
                      </div>
                      <div className="flex justify-center gap-6 mt-6">
                         {['Search', 'Direct', 'Social', 'Referral'].map((src, i) => (
                            <div key={src} className="flex items-center gap-2">
                               <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ['#2563EB', '#8B5CF6', '#E11D48', '#3B82F6'][i] }} />
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-gray">{src}</span>
                            </div>
                         ))}
                      </div>
                    </Card>
                  </div>

                  <Card className="p-10 glass-card-dark border-black/5 shadow-2xl overflow-hidden">
                    <h3 className="text-lg font-black uppercase tracking-widest text-[#1E293B] mb-10">Popular Domains</h3>
                    <div className="h-[340px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'Engines', views: 4000 },
                          { name: 'Core Dev', views: 3000 },
                          { name: 'Back-end', views: 2000 },
                          { name: 'Deploy', views: 2780 },
                          { name: 'Sec-Ops', views: 1890 },
                        ]} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" horizontal={false} />
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" stroke="#8892B0" fontSize={10} width={100} axisLine={false} tickLine={false} fontWeight="bold" />
                          <Tooltip cursor={{fill: '#ffffff03'}} contentStyle={{ backgroundColor: '#FEFBF6', border: '1px solid #2563EB10', borderRadius: '12px' }} />
                          <Bar dataKey="views" radius={[0, 6, 6, 0]} barSize={24}>
                             {[
                               '#2563EB', '#8B5CF6', '#E11D48', '#3B82F6', '#10B981'
                             ].map((color, index) => (
                               <Cell key={`cell-${index}`} fill={color} />
                             ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'bookmarks' && (
                <div className="space-y-10">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-black/5">
                    <div>
                        <h2 className="text-3xl font-heading font-black text-[#1E293B] tracking-tight">Access <span className="gradient-text">My Bookmarks</span></h2>
                        <p className="text-slate-gray text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                           <Bookmark size={12} className="text-neon-pink" /> 23 nodes secured in vault
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="relative">
                           <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-gray w-3.5 h-3.5" />
                           <input 
                              id="bookmark-search-input"
                              type="text" 
                              placeholder="Search vault..." 
                              value={bookmarkSearch}
                              onChange={(e) => setBookmarkSearch(e.target.value)}
                              className="bg-[#F5F0EB] border border-black/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#1E293B] focus:border-electric-cyan outline-none transition-all w-48 focus:w-64 shadow-inner" 
                           />
                        </div>
                        <select 
                           id="bookmark-sort-select"
                           value={bookmarkSort}
                           onChange={(e) => setBookmarkSort(e.target.value)}
                           className="bg-[#F5F0EB] border border-black/10 rounded-xl py-2.5 px-4 text-[9px] font-black uppercase tracking-widest text-slate-gray outline-none focus:border-electric-cyan cursor-pointer transition-all"
                        >
                           <option>Recently Bookmarked</option>
                           <option>Oldest First</option>
                           <option>Title (A-Z)</option>
                           <option>Reading Time</option>
                        </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {posts.slice(0, 6).filter(p => p.title.toLowerCase().includes(bookmarkSearch.toLowerCase())).map(post => {
                        const CategoryIcon = post.category_icon || Code2;
                        return (
                          <div key={post.id} className="group relative">
                             <div className="p-5 glass-card-dark border-black/5 rounded-[40px] hover:border-black/10 transition-all shadow-2xl bg-gradient-to-br from-white/[0.01] to-transparent flex flex-col h-full">
                                <div className="aspect-[16/10] rounded-[30px] overflow-hidden mb-6 relative border border-black/5">
                                   <img src={post.cover_image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                   <div className="absolute top-4 left-4">
                                      <Badge className="bg-black/60 backdrop-blur-xl border-black/10 text-[#1E293B] flex items-center gap-2 px-3 py-1.5 text-[9px]"><CategoryIcon size={12} className="text-electric-cyan" /> {post.category || 'Technology'}</Badge>
                                   </div>
                                </div>
                                <h4 className="text-lg font-heading font-black text-[#1E293B] group-hover:text-electric-cyan transition-colors line-clamp-2 mb-4 leading-tight">{post.title}</h4>
                                <div className="mt-auto">
                                   <div className="flex items-center justify-between pt-5 border-t border-black/5">
                                      <div className="flex items-center gap-3">
                                         <img src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name}`} className="w-6 h-6 rounded-full border border-black/20 shadow-lg" />
                                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-gray group-hover:text-[#1E293B] transition-colors">@{user?.username}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 text-slate-gray">
                                         <Clock size={12} />
                                         <span className="text-[10px] font-mono font-bold tracking-tighter">{post.reading_time || 5} MIN</span>
                                      </div>
                                   </div>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                                      <Button variant="ghost" className="w-full py-3 bg-black/5 border border-black/5 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-black/10 hover:border-electric-cyan/20" onClick={() => navigate(`/posts/${post.id}`)}>Review Unit</Button>
                                      <Button variant="ghost" className="w-full py-3 bg-black/5 border border-black/5 text-[9px] font-black uppercase tracking-widest rounded-xl text-red-500 hover:bg-red-500/10 hover:border-red-500/20" icon={Trash2}>Purge</Button>
                                   </div>
                                </div>
                             </div>
                             <div className="absolute -top-1 -right-1 z-20 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none">
                                <div className="bg-neon-pink p-3.5 rounded-2xl shadow-[0_0_20px_rgba(247,37,133,0.4)] text-[#1E293B]">
                                   <Heart size={20} fill="white" />
                                </div>
                             </div>
                          </div>
                        );
                     })}
                  </div>
                  
                  {posts.length > 6 && (
                    <div className="flex justify-center mt-12">
                       <Button variant="ghost" className="px-12 py-5 rounded-2xl border border-black/5 text-slate-gray font-black uppercase tracking-[0.3em] text-[10px] hover:text-[#1E293B] hover:border-black/20 transition-all bg-white/[0.01]">Search Further In Archive</Button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-10">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-black/5">
                      <h2 className="text-3xl font-heading font-black text-[#1E293B] tracking-tight">System <span className="gradient-text">Configuration</span></h2>
                      <div className="flex bg-black/5 p-1 rounded-2xl border border-black/5">
                         {['Profile', 'Account', 'Notifications', 'Privacy', 'Editor'].map(tab => (
                            <button 
                               key={tab} 
                               id={`settings-subtab-${tab.toLowerCase()}`}
                               onClick={() => setSettingsTab(tab)}
                               className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${settingsTab === tab ? 'bg-electric-cyan text-[#1E293B] shadow-[0_0_15px_rgba(100,255,218,0.3)]' : 'text-slate-gray hover:text-[#1E293B]'}`}
                            >
                               {tab}
                            </button>
                         ))}
                      </div>
                   </div>

                   <Card className="p-10 glass-card-dark border-black/5 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-80 h-80 bg-electric-cyan/5 blur-[100px] rounded-full pointer-events-none" />
                      
                      <AnimatePresence mode="wait">
                         <motion.div 
                            key={settingsTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                         >
                            {settingsTab === 'Profile' && (
                               <div className="max-w-3xl space-y-10 relative z-10">
                                  <div className="flex flex-col md:flex-row items-center gap-10">
                                     <div className="relative group cursor-pointer shrink-0">
                                        <div className="absolute inset-0 bg-gradient-brand rounded-full blur-[15px] opacity-0 group-hover:opacity-40 transition-opacity" />
                                        <img src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name}&background=2563EB&color=1E293B`} className="w-32 h-32 rounded-full border-2 border-black/10 relative z-10 p-1" />
                                        <div className="absolute inset-0 z-20 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[2px] border border-black/20">
                                           <div className="flex flex-col items-center gap-1">
                                              <Camera size={24} className="text-[#1E293B]" />
                                              <span className="text-[8px] font-black uppercase text-[#1E293B] tracking-widest whitespace-nowrap">Upload Sync</span>
                                           </div>
                                        </div>
                                     </div>
                                     <div className="flex-grow">
                                        <div className="aspect-[21/9] w-full bg-black/5 rounded-3xl border border-black/10 relative overflow-hidden group/cover cursor-pointer">
                                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-all backdrop-blur-sm z-10">
                                              <span className="text-[9px] font-black uppercase text-[#1E293B] tracking-[0.3em]">Update Cover Module</span>
                                           </div>
                                           {user?.cover_image && <img src={user.cover_image} className="w-full h-full object-cover" />}
                                           <div className="absolute bottom-3 right-3 text-[8px] font-mono text-slate-gray/60 uppercase">Recommended: 1200x480</div>
                                        </div>
                                     </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                     <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-gray flex items-center gap-2 px-1">
                                           <User size={12} className="text-electric-cyan" /> Full Entity Name
                                        </label>
                                        <input type="text" defaultValue={user?.name} className="w-full bg-[#FEFBF6] border border-black/10 rounded-2xl py-4 px-6 text-sm text-[#1E293B] focus:border-electric-cyan outline-none transition-all shadow-inner" />
                                     </div>
                                     <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-gray flex items-center justify-between px-1">
                                           <span className="flex items-center gap-2"><Users size={12} className="text-vibrant-purple" /> User Identifier</span>
                                           <span className="text-green-400 text-[9px] lowercase flex items-center gap-1"><CheckCircle size={10} /> available</span>
                                        </label>
                                        <input type="text" defaultValue={user?.username} className="w-full bg-[#FEFBF6] border border-black/10 rounded-2xl py-4 px-6 text-sm text-[#1E293B] focus:border-electric-cyan outline-none transition-all shadow-inner" />
                                     </div>
                                  </div>

                                  <div className="space-y-3">
                                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-gray flex items-center justify-between px-1">
                                        <span className="flex items-center gap-2"><FileText size={12} className="text-neon-pink" /> Neural Bio (Markdown support)</span>
                                        <span className="text-[9px] font-mono text-slate-gray">428 / 500</span>
                                     </label>
                                     <textarea defaultValue={user?.bio} rows={4} className="w-full bg-[#FEFBF6] border border-black/10 rounded-2xl py-4 px-6 text-sm text-[#1E293B] focus:border-electric-cyan outline-none transition-all resize-none shadow-inner leading-relaxed" />
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                     {[ 
                                       { icon: Github, label: 'GitHub', value: 'kumardhruv88' },
                                       { icon: Linkedin, label: 'LinkedIn', value: 'dhruv-kumar' },
                                       { icon: Twitter, label: 'Twitter', value: 'cyber_dhruv' },
                                       { icon: Code2, label: 'Dev.to', value: 'dhruv' }
                                     ].map((social, i) => (
                                       <div key={i} className="space-y-3">
                                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-gray flex items-center gap-2">
                                             <social.icon size={11} className="text-slate-gray" /> {social.label}
                                          </label>
                                          <input type="text" defaultValue={social.value} className="w-full bg-[#FEFBF6] border border-black/10 rounded-xl py-3 px-4 text-xs text-[#1E293B] focus:border-electric-cyan outline-none transition-all" />
                                       </div>
                                     ))}
                                  </div>

                                  <div className="pt-8 border-t border-black/5 flex justify-end">
                                     <Button className="px-12 py-4 shadow-[0_0_25px_rgba(100,255,218,0.2)]">Synchronize Changes</Button>
                                  </div>
                               </div>
                            )}

                            {settingsTab === 'Account' && (
                               <div className="max-w-3xl space-y-12 relative z-10">
                                  <div className="space-y-10">
                                     <div className="flex items-center justify-between group p-6 rounded-[28px] bg-white/[0.02] border border-black/5">
                                        <div className="flex items-center gap-5">
                                           <div className="w-12 h-12 bg-electric-cyan/10 rounded-2xl flex items-center justify-center text-electric-cyan">
                                              <Mail size={22} />
                                           </div>
                                           <div>
                                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-gray mb-1">Authenticated Email</p>
                                              <p className="text-[#1E293B] font-bold">{clerkUser?.primaryEmailAddress?.emailAddress}</p>
                                           </div>
                                        </div>
                                        <Button variant="outline" className="text-[9px] py-2.5 bg-black/5 border-black/10">Modify Securely</Button>
                                     </div>

                                     <div className="flex items-center justify-between group p-6 rounded-[28px] bg-white/[0.02] border border-black/5">
                                        <div className="flex items-center gap-5">
                                           <div className="w-12 h-12 bg-vibrant-purple/10 rounded-2xl flex items-center justify-center text-vibrant-purple">
                                              <Lock size={22} />
                                           </div>
                                           <div>
                                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-gray mb-1">Encrypted Access</p>
                                              <p className="text-[#1E293B]/40 font-mono text-sm uppercase tracking-tighter">••••••••••••••••</p>
                                           </div>
                                        </div>
                                        <Button variant="outline" className="text-[9px] py-2.5 bg-black/5 border-black/10">Rotate Cipher</Button>
                                     </div>

                                     <div className="flex items-center justify-between group p-6 rounded-[28px] bg-white/[0.02] border border-black/5">
                                        <div className="flex items-center gap-5">
                                           <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500">
                                              <Shield size={22} />
                                           </div>
                                           <div>
                                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-gray mb-1">Two-Factor Auth</p>
                                              <p className="text-[#1E293B] font-bold">Enabled via Authenticator</p>
                                           </div>
                                        </div>
                                        <div className="h-6 w-12 bg-electric-cyan rounded-full p-1 cursor-pointer">
                                           <div className="h-4 w-4 bg-deep-code-blue rounded-full float-right" />
                                        </div>
                                     </div>
                                  </div>

                                  <div className="space-y-6">
                                     <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-gray px-1">Linked Protocols</h5>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                          { provider: 'Google', icon: BarChart3, email: 'dhruv@gmail.com', status: 'Connected' },
                                          { provider: 'GitHub', icon: Github, email: 'kumardhruv88', status: 'Connected' }
                                        ].map(link => (
                                          <div key={link.provider} className="flex items-center justify-between p-5 rounded-2xl bg-[#091420] border border-black/5">
                                             <div className="flex items-center gap-4">
                                                <link.icon size={20} className="text-[#1E293B]/60" />
                                                <div>
                                                   <p className="text-xs font-bold text-[#1E293B] leading-none">{link.provider}</p>
                                                   <p className="text-[9px] text-slate-gray mt-1">{link.email}</p>
                                                </div>
                                             </div>
                                             <button className="text-[9px] font-black text-red-500/60 hover:text-red-500 uppercase tracking-widest">Detach</button>
                                          </div>
                                        ))}
                                     </div>
                                  </div>

                                  <div className="pt-10 border-t border-red-500/10">
                                     <div className="p-8 rounded-3xl bg-red-500/[0.02] border border-red-500/10 space-y-5">
                                        <div>
                                           <h5 className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Danger Zone: Data Termination</h5>
                                           <p className="text-slate-gray text-[10px] leading-relaxed">System-wide purge of all log entries, interactions, and neural associations. This operation is irreversible.</p>
                                        </div>
                                        <Button variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-500/10 text-[9px] py-3 uppercase tracking-widest w-full md:w-auto" onClick={() => setIsDeleting(true)}>Execute Account Purge</Button>
                                     </div>
                                  </div>
                               </div>
                            )}

                            {settingsTab === 'Notifications' && (
                               <div className="max-w-3xl space-y-10 relative z-10">
                                  <div className="space-y-8">
                                     <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-gray px-1">Neural Transmissions (Email)</h5>
                                     <div className="space-y-4">
                                        {[
                                          { label: 'Signal Intercepts', desc: 'Alert me when someone joins a post discussion', type: 'Comment' },
                                          { label: 'Vault Additions', desc: 'Notify when a post is secured in a bookmark', type: 'Bookmark' },
                                          { label: 'System Analytics', desc: 'Receive weekly neural performance reports', type: 'Summary' },
                                          { label: 'Entity Follows', desc: 'Alert when a new entity begins tracking', type: 'Follow' },
                                          { label: 'Knowledge Base', desc: 'Receive the TechScribe evolution newsletter', type: 'Newsletter' }
                                        ].map(sub => (
                                          <div key={sub.type} className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.01] border border-black/5 hover:bg-white/[0.02] transition-all">
                                             <div className="space-y-1">
                                                <p className="text-xs font-bold text-[#1E293B]">{sub.label}</p>
                                                <p className="text-[10px] text-slate-gray font-medium">{sub.desc}</p>
                                             </div>
                                             <div className="h-6 w-12 bg-black/10 rounded-full p-1 cursor-pointer hover:bg-white/20 transition-all relative">
                                                <div className="h-4 w-4 bg-slate-gray rounded-full" />
                                             </div>
                                          </div>
                                        ))}
                                     </div>
                                  </div>

                                  <div className="space-y-6 pt-10 border-t border-black/5">
                                     <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-gray px-1">Sync Frequency</h5>
                                     <div className="flex flex-wrap gap-4">
                                        {['Instant Transmission', 'Daily Pulse', 'Weekly Digest'].map(freq => (
                                          <label key={freq} className="flex-grow flex items-center justify-center gap-3 p-5 rounded-2xl bg-[#091420] border border-black/5 cursor-pointer hover:border-electric-cyan/20 transition-all group">
                                             <div className={`w-4 h-4 rounded-full border-2 ${freq === 'Daily Pulse' ? 'border-electric-cyan bg-electric-cyan' : 'border-black/10 group-hover:border-black/20'}`} />
                                             <span className={`text-[10px] font-black uppercase tracking-widest ${freq === 'Daily Pulse' ? 'text-[#1E293B]' : 'text-slate-gray'}`}>{freq}</span>
                                          </label>
                                        ))}
                                     </div>
                                  </div>
                               </div>
                            )}

                            {settingsTab === 'Privacy' && (
                               <div className="max-w-3xl space-y-12 relative z-10">
                                  <div className="space-y-8">
                                     <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-gray px-1">Entity Visibility Status</h5>
                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                          { label: 'Public Vector', desc: 'Visible to all entities', icon: Globe },
                                          { label: 'Stealth Mode', desc: 'Encrypted from archives', icon: Shield },
                                          { label: 'Unlisted Node', desc: 'Direct link access only', icon: Lock }
                                        ].map((mode, i) => (
                                          <div key={i} className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col items-center text-center gap-4 ${i === 0 ? 'bg-electric-cyan/5 border-electric-cyan/20' : 'bg-white/[0.01] border-black/5 hover:border-black/10'}`}>
                                             <mode.icon size={24} className={i === 0 ? 'text-electric-cyan' : 'text-slate-gray'} />
                                             <div>
                                                <p className={`text-[10px] font-black uppercase tracking-widest ${i === 0 ? 'text-[#1E293B]' : 'text-slate-gray'}`}>{mode.label}</p>
                                                <p className="text-[9px] text-slate-gray mt-1.5 leading-tight">{mode.desc}</p>
                                             </div>
                                          </div>
                                        ))}
                                     </div>
                                  </div>

                                  <div className="space-y-6 pt-10 border-t border-black/5">
                                     <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-gray px-1">Data Indexing & Sharing</h5>
                                     <div className="space-y-4">
                                        {[
                                          { label: 'Public Email Exposure', warn: true },
                                          { label: 'Search Engine Archive Permissions', warn: false },
                                          { label: 'Activity Feed Broadcasting', warn: false }
                                        ].map(toggle => (
                                          <div key={toggle.label} className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.01] border border-black/5">
                                             <div className="flex items-center gap-3">
                                                <span className="text-xs font-bold text-[#1E293B]">{toggle.label}</span>
                                                {toggle.warn && <AlertCircle size={12} className="text-orange-400" />}
                                             </div>
                                             <div className="h-6 w-12 bg-black/5 rounded-full p-1 cursor-pointer border border-black/5">
                                                <div className="h-4 w-4 bg-slate-gray/40 rounded-full" />
                                             </div>
                                          </div>
                                        ))}
                                     </div>
                                  </div>
                               </div>
                            )}

                            {settingsTab === 'Editor' && (
                               <div className="max-w-3xl space-y-12 relative z-10">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                     <div className="space-y-10">
                                        <div className="space-y-4">
                                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-gray px-1">Default Deployment Mode</label>
                                           <div className="grid grid-cols-2 gap-3">
                                              {['Markdown', 'Rich Text'].map(m => (
                                                <button key={m} className={`py-4 rounded-2xl border text-[9px] font-black uppercase tracking-widest transition-all ${m === 'Markdown' ? 'bg-electric-cyan text-[#1E293B] border-electric-cyan' : 'bg-black/5 text-slate-gray border-black/10 hover:border-black/20'}`}>{m}</button>
                                              ))}
                                           </div>
                                        </div>

                                        <div className="space-y-4">
                                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-gray px-1">Autosave Frequency</label>
                                           <select className="w-full bg-[#FEFBF6] border border-black/10 rounded-2xl py-4 px-6 text-xs text-[#1E293B] outline-none focus:border-electric-cyan">
                                              <option>30 Seconds</option>
                                              <option>1 Minute</option>
                                              <option>5 Minutes</option>
                                           </select>
                                        </div>

                                        <div className="space-y-4">
                                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-gray px-1">Visual Theme Archive</label>
                                           <div className="flex flex-wrap gap-2">
                                              {['VS Code', 'Dracula', 'Nord', 'Monokai'].map(theme => (
                                                <button key={theme} className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${theme === 'Dracula' ? 'bg-vibrant-purple text-[#1E293B] border-vibrant-purple' : 'bg-black/5 text-slate-gray border-black/10 hover:border-vibrant-purple/20'}`}>{theme}</button>
                                              ))}
                                           </div>
                                        </div>
                                     </div>

                                     <div className="space-y-10">
                                        <div className="p-8 rounded-[32px] bg-[#FEFBF6] border border-black/10 font-mono text-xs text-[#1E293B]/40 space-y-2 relative group overflow-hidden">
                                           <div className="absolute top-4 right-4 text-[9px] font-black uppercase text-electric-cyan opacity-40 group-hover:opacity-100 transition-opacity tracking-widest">Syntax Preview</div>
                                           <p className="text-electric-cyan"><span className="text-vibrant-purple">const</span> deploy = () ={">"} {'{'}</p>
                                           <p className="pl-4">console.<span className="text-neon-pink">log</span>(<span className="text-orange-400">"Nexus Online"</span>);</p>
                                           <p>{'}'}</p>
                                        </div>

                                        <div className="space-y-6">
                                           <div className="flex items-center justify-between px-1">
                                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-gray">Text Module Scale</span>
                                              <span className="text-[#1E293B] font-mono text-xs font-bold">16px</span>
                                           </div>
                                           <input type="range" className="w-full accent-electric-cyan" min="12" max="24" defaultValue="16" />
                                        </div>

                                        <div className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.01] border border-black/5">
                                           <span className="text-[10px] font-black uppercase tracking-widest text-[#1E293B]">Line Number Metadata</span>
                                           <div className="h-6 w-12 bg-black/5 rounded-full p-1 cursor-pointer border border-black/5">
                                              <div className="h-4 w-4 bg-slate-gray/40 rounded-full" />
                                           </div>
                                        </div>
                                     </div>
                                  </div>
                               </div>
                            )}
                         </motion.div>
                      </AnimatePresence>

                      <div className="mt-12 pt-8 border-t border-black/5 flex items-center justify-between">
                         <div className="flex items-center gap-3 text-[10px] text-slate-gray font-black uppercase tracking-widest opacity-40">
                            <ClockIcon size={14} /> Last Sync: 2 minutes ago
                         </div>
                         <div className="flex gap-4">
                            <Button variant="ghost" className="px-8 text-[9px] font-black uppercase tracking-[0.2em] border border-black/5 hover:bg-black/5">Revert Modules</Button>
                            <Button className="px-10 py-4 shadow-[0_0_20px_rgba(37,99,235,0.2)]">Commit Configuration</Button>
                         </div>
                      </div>
                   </Card>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
         {isDeleting && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#F5F0EB]/90 backdrop-blur-2xl">
               <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#F5F0EB] border-2 border-red-500/20 p-12 rounded-[48px] max-w-lg w-full text-center shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                  <div className="w-24 h-24 bg-red-500/10 rounded-[36px] flex items-center justify-center mx-auto mb-10 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                     <AlertCircle size={48} className="text-red-500" />
                  </div>
                  <div className="space-y-4 mb-10">
                    <h3 className="text-3xl font-heading font-black text-[#1E293B]">Critical Confirmation</h3>
                    <p className="text-sm text-slate-gray leading-relaxed font-bold">This operation will execute a system-wide purge of the selected data assets. Type <span className="text-red-500 font-mono">DELETE</span> below to unlock authorization.</p>
                  </div>
                  
                  <input 
                    type="text" 
                    placeholder="CONFIRMATION_STRING" 
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full bg-[#FEFBF6] border-2 border-black/5 rounded-2xl py-5 px-6 text-sm text-[#1E293B] text-center font-mono focus:border-red-500/40 outline-none transition-all mb-8 shadow-inner placeholder:opacity-20"
                  />

                  <div className="flex gap-4">
                     <Button variant="ghost" onClick={() => { setIsDeleting(false); setDeleteConfirmText(''); }} className="flex-grow py-5 rounded-[24px] font-black uppercase tracking-widest text-[10px] bg-black/5 border border-black/10 hover:bg-black/10">Abort Protocol</Button>
                     <Button 
                        className={`flex-grow py-5 rounded-[24px] font-black uppercase tracking-widest text-[10px] transition-all ${deleteConfirmText === 'DELETE' ? 'bg-red-500 text-[#1E293B] shadow-[0_0_30px_rgba(239,68,68,0.4)]' : 'bg-red-500/10 text-red-500/40 cursor-not-allowed border border-red-500/10'}`} 
                        onClick={() => { if(deleteConfirmText === 'DELETE') handleDelete(); }}
                        disabled={deleteConfirmText !== 'DELETE'}
                     >
                        Confirm Purge
                     </Button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default UserDashboard;
