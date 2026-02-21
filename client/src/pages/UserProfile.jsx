import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Link as LinkIcon, Calendar, Github, 
  Linkedin, Twitter, Globe, Mail, FileText, 
  Eye, Bookmark, Users, Star, ChevronRight,
  TrendingUp, Code2, Cpu, Palette, Search,
  Edit3, Camera, Settings, Lock, X, CheckCircle2, Send, Trash2, BarChart3,
  Heart, MessageSquare, Share2, MoreHorizontal, ExternalLink, Shield, Bell,
  Briefcase, GraduationCap, Zap, Award
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area
} from 'recharts';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import PostCard from '../components/blog/PostCard';
import { fetchUserProfile, fetchUserPosts, fetchUserStats } from '../services/api';

const CountUp = ({ end, duration = 2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let frameId = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      const numericEnd = typeof end === 'string' && end.includes('k') 
        ? parseFloat(end.replace('k', '')) * 1000 
        : parseInt(end || 0);
      
      const current = Math.floor(progress * numericEnd);
      setCount(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [end, duration]);

  const displayValue = typeof end === 'string' && end.includes('k')
    ? (count / 1000).toFixed(1) + 'k'
    : count;

  return <span>{displayValue}</span>;
};

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [scrollY, setScrollY] = useState(0);
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [socialModal, setSocialModal] = useState({ isOpen: false, type: 'followers' }); // 'followers' or 'following'
  const [mediaModal, setMediaModal] = useState({ isOpen: false, type: 'avatar' }); // 'avatar' or 'cover'

  useEffect(() => {
    const getProfileData = async () => {
      try {
        setLoading(true);
        const userData = await fetchUserProfile(username);
        setUser(userData);
        
        const [userPosts, userStats] = await Promise.all([
          fetchUserPosts(userData.id),
          fetchUserStats(userData.id)
        ]);
        
        setPosts(userPosts);
        setStats(userStats);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (username) getProfileData();

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [username]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEFBF6]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-electric-cyan border-t-transparent rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FEFBF6] text-[#1E293B]">
      <h1 className="text-4xl font-black mb-4">User Not Found</h1>
      <Button onClick={() => navigate('/blog')}>Back to Blog</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FEFBF6] selection:bg-electric-cyan selection:text-[#1E293B]">
      {/* Parallax Hero Header */}
      <div className="relative h-[350px] md:h-[450px] overflow-hidden group/cover">
        <motion.div 
          style={{ y: scrollY * 0.4 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={user.cover_image_url || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920"} 
            className="w-full h-full object-cover brightness-50"
            alt="Cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FEFBF6] via-transparent to-[#FEFBF6]/40" />
        </motion.div>
        
        {/* Cover Actions */}
        <div className="absolute top-8 right-8 z-20 flex gap-4 opacity-0 group-hover/cover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover/cover:translate-y-0">
           <button onClick={() => setMediaModal({ isOpen: true, type: 'cover' })} className="p-3.5 rounded-2xl bg-black/40 backdrop-blur-xl border border-black/10 text-[#1E293B] hover:bg-black/60 transition-all shadow-2xl">
              <Camera size={20} />
           </button>
           <button className="p-3.5 rounded-2xl bg-black/40 backdrop-blur-xl border border-black/10 text-[#1E293B] hover:bg-black/60 transition-all shadow-2xl" onClick={() => setIsEditModalOpen(true)}>
              <Edit3 size={20} />
           </button>
        </div>

        {/* Floating Particles/Glow */}
        <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-[#FEFBF6] to-transparent pointer-events-none" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-24 md:-mt-32 pb-24">
        <div className="flex flex-col md:flex-row gap-8 items-end md:items-start lg:items-center">
           {/* Profile Avatar */}
           <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 100 }} className="relative shrink-0 group/avatar">
              <div className="absolute inset-0 bg-gradient-brand rounded-[48px] blur-[30px] opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative">
                <img src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.name}&background=2563EB&color=1E293B&size=256`} className="w-40 h-40 md:w-56 md:h-56 rounded-[48px] border-4 border-[#FEFBF6] relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#F5F0EB] object-cover" alt={user.name} />
                <button className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 rounded-[48px] opacity-0 group-hover/avatar:opacity-100 transition-all backdrop-blur-[4px] border border-black/10">
                   <div className="flex flex-col items-center gap-2">
                      <Camera size={32} className="text-[#1E293B]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#1E293B]">Change Picture</span>
                   </div>
                </button>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 border-4 border-[#FEFBF6] rounded-full z-20 shadow-lg shadow-green-500/20" title="Available for collaboration" />
              </div>
           </motion.div>

           <div className="flex-grow space-y-6 pt-4 md:pt-10">
              <div className="space-y-2">
                 <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap items-center gap-4">
                    <h1 className="text-4xl md:text-6xl font-heading font-black text-[#1E293B] tracking-tighter">{user.name}</h1>
                    <div className="flex gap-2">
                       <Badge className="bg-electric-cyan/10 text-electric-cyan border-electric-cyan/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em]">Verified Hub</Badge>
                       <Badge className="bg-vibrant-purple/10 text-vibrant-purple border-vibrant-purple/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em]">Pro Architect</Badge>
                    </div>
                 </motion.div>
                 <p className="text-xl font-mono text-electric-cyan/60 font-medium">@{user.username}</p>
              </div>

              <div className="flex flex-wrap gap-8 text-[11px] font-black uppercase tracking-[0.15em] text-slate-gray">
                 {user.location && <div className="flex items-center gap-2.5 bg-black/5 px-4 py-2 rounded-xl border border-black/5"><MapPin size={16} className="text-vibrant-purple" /> {user.location}</div>}
                 {user.website && <a href={user.website} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 bg-black/5 px-4 py-2 rounded-xl border border-black/5 hover:text-[#1E293B] hover:border-electric-cyan/30 transition-all"><Globe size={16} className="text-electric-cyan" /> {user.website.replace('https://', '')}</a>}
                 <div className="flex items-center gap-2.5 bg-black/5 px-4 py-2 rounded-xl border border-black/5"><Calendar size={16} className="text-neon-pink" /> Node Established {new Date(user.created_at).getFullYear()}</div>
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                 <div className="flex -space-x-3 mr-4 cursor-pointer" onClick={() => setSocialModal({ isOpen: true, type: 'followers' })}>
                    {[1, 2, 3, 4].map(i => (
                       <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-10 h-10 rounded-full border-2 border-[#FEFBF6] shadow-xl" />
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-[#FEFBF6] bg-[#F5F0EB] flex items-center justify-center text-[10px] font-black text-electric-cyan shadow-xl">+{stats?.followers_count || 124}</div>
                 </div>
                 <Button icon={Users} className="px-10 py-4 shadow-xl shadow-blue-500/20 relative group overflow-hidden">
                    <span className="relative z-10">Connect Node</span>
                    <div className="absolute inset-0 bg-gradient-brand opacity-0 group-hover:opacity-100 transition-opacity" />
                 </Button>
                 <Button variant="outline" icon={Share2} className="p-4 border-black/10 hover:border-black/20 transition-all"><span className="hidden sm:inline ml-2">Broadcast</span></Button>
              </div>
           </div>
        </div>

        {/* Global Analytics Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 mb-20">
           {[
             { label: 'Published Units', value: stats?.posts_count || 0, icon: FileText, color: 'text-electric-cyan', bg: 'bg-electric-cyan/10', trend: '+12%' },
             { label: 'Network Reach', value: stats?.topics_covered || 42, icon: Globe, color: 'text-vibrant-purple', bg: 'bg-vibrant-purple/10', trend: 'Global' },
             { label: 'Retention Time', value: `${stats?.reading_time || 0}m`, icon: Clock, color: 'text-neon-pink', bg: 'bg-neon-pink/10', trend: 'Engaged' },
             { label: 'Logic Snippets', value: stats?.code_snippets || 156, icon: Code2, color: 'text-orange-400', bg: 'bg-orange-400/10', trend: 'Verified' },
           ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card key={i} className="p-8 glass-card border-black/5 group hover:border-black/10 transition-all relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
                   <div className="flex items-center justify-between mb-6">
                      <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform shadow-lg`}><Icon size={24} /></div>
                      <span className="text-[10px] font-black text-slate-gray uppercase tracking-tighter bg-black/5 px-3 py-1.5 rounded-lg border border-black/5">{stat.trend}</span>
                   </div>
                   <h4 className="text-4xl font-heading font-black text-[#1E293B] tabular-nums"><CountUp end={stat.value} /></h4>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-gray mt-4">{stat.label}</p>
                </Card>
              );
            })}
        </div>

        {/* Tab Navigation System */}
         <div className="flex border-b border-black/5 mb-12 sticky top-20 bg-[#F5F0EB]/80 backdrop-blur-2xl z-20 -mx-4 px-8 overflow-x-auto no-scrollbar scroll-smooth">
            {[
               { id: 'posts', label: 'Knowledge Base', icon: FileText, count: posts.length },
               { id: 'drafts', label: 'Work In Progress', icon: Pencil, count: 3 },
               { id: 'bookmarks', label: 'Archived Logic', icon: Bookmark, count: 24 },
               { id: 'about', label: 'Core Manifest', icon: User, count: null },
            ].map(tab => (
              <button 
                 key={tab.id} 
                 onClick={() => setActiveTab(tab.id)} 
                 className={`px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] relative transition-all flex items-center gap-3 whitespace-nowrap group ${activeTab === tab.id ? 'text-[#1E293B]' : 'text-slate-gray hover:text-[#1E293B]'}`}
              >
                 <span className="flex items-center gap-3">
                   {tab.label}
                 </span>
                 {tab.count !== null && (
                   <span className={`text-[9px] px-2 py-0.5 rounded-full font-black transition-all ${activeTab === tab.id ? 'bg-electric-cyan text-[#1E293B] shadow-[0_0_10px_rgba(37,99,235,0.3)]' : 'bg-black/5 text-slate-gray group-hover:bg-black/10 group-hover:text-[#1E293B]'}`}>
                     {tab.count}
                   </span>
                 )}
                 {activeTab === tab.id && (
                   <motion.div layoutId="profile-tab-glow" className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-brand shadow-[0_0_20px_#2563EB]" />
                 )}
              </button>
            ))}
         </div>

        {/* Dynamic Content Renderer */}
        <AnimatePresence mode="wait">
           <motion.div key={activeTab} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4, ease: "easeOut" }} className="min-h-[600px]">
              {activeTab === 'posts' && (
                <div className="space-y-12">
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
                      {posts.map(post => (<PostCard key={post.id} post={{...post, author: user}} />))}
                      {posts.length === 0 && (
                        <div className="col-span-full py-40 text-center glass-card-dark border-dashed border-black/10 rounded-[40px]">
                           <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto text-slate-gray/30 mb-6"><FileText size={40} /></div>
                           <p className="text-slate-gray font-black uppercase tracking-widest text-sm">No knowledge units deployed yet.</p>
                           <Button variant="ghost" className="mt-6 text-[10px]" onClick={() => navigate('/create-post')}>Draft first article</Button>
                        </div>
                      )}
                   </div>
                </div>
              )}

              {activeTab === 'about' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                   <div className="lg:col-span-2 space-y-16">
                      {/* Bio Section */}
                      <section className="relative">
                         <div className="flex items-center gap-4 mb-8">
                            <div className="w-1.5 h-8 bg-electric-cyan rounded-full" />
                            <h3 className="text-2xl font-heading font-black text-[#1E293B]">Objective & Mission</h3>
                         </div>
                         <Card className="p-10 glass-card-dark border-black/5 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-electric-cyan/5 blur-[80px] rounded-full" />
                            <div className={`prose prose-invert max-w-none text-slate-gray leading-relaxed text-lg transition-all duration-700 ${!isBioExpanded ? 'max-h-48 overflow-hidden' : ''}`}>
                               <p className="italic leading-[1.8] tracking-wide text-[#1E293B]/90">
                                  {user.bio || "This user's core philosophy and mission profile are currently encrypted. Check back once their digital footprint expands."}
                               </p>
                               {!isBioExpanded && <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F5F0EB] to-transparent" />}
                            </div>
                            {(user.bio && user.bio.length > 300) && (
                              <button onClick={() => setIsBioExpanded(!isBioExpanded)} className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-electric-cyan hover:text-[#1E293B] transition-all flex items-center gap-2 group/btn">
                                {isBioExpanded ? 'Minimize Manifest' : 'Read Complete Philosophy'}
                                <ChevronRight size={14} className={`transition-transform duration-300 ${isBioExpanded ? 'rotate-90' : 'group-hover/btn:translate-x-1'}`} />
                              </button>
                            )}
                         </Card>
                      </section>

                      {/* Technical Specialization */}
                      <section>
                         <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                               <div className="w-1.5 h-8 bg-vibrant-purple rounded-full" />
                               <h3 className="text-2xl font-heading font-black text-[#1E293B]">Arsenal & Stack</h3>
                            </div>
                            <button className="text-[10px] font-black uppercase tracking-widest text-slate-gray hover:text-[#1E293B] transition-colors border-b border-black/10 pb-1">Refine Stack</button>
                         </div>
                         <div className="space-y-10">
                            {[
                               { category: "Frontend Core", skills: [
                                  { name: "React System", type: "Core", color: "text-electric-cyan", icon: Code2, value: 95 },
                                  { name: "Tailwind", type: "Aesthetics", color: "text-pink-400", icon: Palette, value: 85 }
                               ]},
                               { category: "Backend & Logic", skills: [
                                  { name: "Node Engine", type: "Backend", color: "text-green-400", icon: Cpu, value: 75 },
                                  { name: "TypeScript", type: "Logic", color: "text-blue-500", icon: Shield, value: 90 }
                               ]},
                               { category: "Infrastructure & Data", skills: [
                                  { name: "PostgreSQL", type: "Storage", color: "text-orange-400", icon: Lock, value: 65 },
                                  { name: "Cloud Native", type: "Infra", color: "text-vibrant-purple", icon: Globe, value: 55 }
                               ]}
                            ].map((group, idx) => (
                               <div key={idx} className="space-y-6">
                                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-gray px-1 flex items-center gap-3">
                                     {group.category} <div className="flex-grow h-px bg-black/5" />
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     {group.skills.map((skill, i) => {
                                        const Icon = skill.icon;
                                        return (
                                          <Card key={i} className="p-6 glass-card border-black/5 hover:border-white/15 transition-all group relative overflow-hidden">
                                             <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                                             <div className="flex items-center gap-5">
                                                <div className={`${skill.color} p-4 rounded-2xl bg-black/5 group-hover:scale-110 transition-transform shadow-lg`}><Icon size={24} /></div>
                                                <div className="flex-grow min-w-0">
                                                   <div className="flex items-center justify-between mb-2">
                                                      <span className="text-sm font-bold text-[#1E293B] truncate">{skill.name}</span>
                                                      <span className="text-[10px] font-mono text-electric-cyan font-bold">{skill.value}%</span>
                                                   </div>
                                                   <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                                                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.value}%` }} transition={{ duration: 1, delay: i * 0.1 }} className={`h-full bg-current ${skill.color} shadow-[0_0_10px_currentColor]`} />
                                                   </div>
                                                </div>
                                             </div>
                                          </Card>
                                        );
                                     })}
                                  </div>
                               </div>
                            ))}
                         </div>
                      </section>

                      {/* Evolution Roadmap */}
                      <section>
                         <div className="flex items-center gap-4 mb-8">
                            <div className="w-1.5 h-8 bg-neon-pink rounded-full" />
                            <h3 className="text-2xl font-heading font-black text-[#1E293B]">Growth Trajectory</h3>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                               { goal: "Quantum Computing Logic", progress: 65, color: "bg-electric-cyan" },
                               { goal: "Decentralized Auth Prototypes", progress: 85, color: "bg-vibrant-purple" },
                               { goal: "Low-Level Rust Optimizations", progress: 40, color: "bg-neon-pink" },
                               { goal: "Advanced AI Pattern Recognition", progress: 55, color: "bg-orange-500" },
                            ].map((g, i) => (
                               <Card key={i} className="p-8 glass-card-dark border-black/5 hover:border-black/10 transition-all group overflow-hidden relative">
                                  <div className="absolute top-0 right-0 w-2 h-full bg-black/5 group-hover:bg-black/10 transition-colors" />
                                  <div className="flex items-center justify-between mb-4">
                                     <span className="text-sm font-black text-[#1E293B] uppercase tracking-wider">{g.goal}</span>
                                     <span className="text-xs font-mono font-bold text-electric-cyan">{g.progress}%</span>
                                  </div>
                                  <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                                     <motion.div initial={{ width: 0 }} whileInView={{ width: `${g.progress}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className={`h-full ${g.color} shadow-[0_0_15px_currentColor]`} />
                                  </div>
                               </Card>
                            ))}
                         </div>
                      </section>
                   </div>
                   
                   <aside className="space-y-12">
                      <Card className="p-10 glass-card-dark border-black/5 relative overflow-hidden group">
                         <div className="absolute inset-0 bg-gradient-to-br from-electric-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                         <h3 className="text-xs font-black text-[#1E293B] uppercase tracking-[0.3em] mb-10 pb-4 border-b border-black/5">Neural Contacts</h3>
                         <div className="space-y-6">
                            {[
                               { label: 'GitHub Network', link: user.github_url, icon: Github, color: 'text-[#1E293B]' },
                               { label: 'Twitter Node', link: user.twitter_url, icon: Twitter, icon: Twitter, color: 'text-[#1DA1F2]' },
                               { label: 'LinkedIn Link', link: user.linkedin_url, icon: Linkedin, color: 'text-[#0A66C2]' },
                               { label: 'Signal Transmission', link: `mailto:${user.email}`, icon: Send, color: 'text-electric-cyan' },
                            ].map((social, i) => {
                               const Icon = social.icon;
                               return (
                                 <a key={i} href={social.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group/social p-4 rounded-2xl bg-white/[0.02] border border-black/5 hover:border-black/10 hover:bg-black/5 transition-all">
                                    <div className="flex items-center gap-4">
                                       <Icon size={20} className={`${social.color} opacity-60 group-hover/social:opacity-100 transition-opacity`} />
                                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-gray group-hover/social:text-[#1E293B] transition-colors">{social.label}</span>
                                    </div>
                                    <ExternalLink size={14} className="text-slate-gray opacity-0 group-hover/social:opacity-100 transition-all translate-x-2 group-hover/social:translate-x-0" />
                                 </a>
                               );
                            })}
                         </div>
                      </Card>

                      <Card className="p-10 glass-card border-black/5">
                         <h3 className="text-xs font-black text-[#1E293B] uppercase tracking-[0.3em] mb-10 pb-4 border-b border-black/5">Certification Vault</h3>
                         <div className="space-y-4">
                            {[
                               { name: "Senior Architect", issuer: "AWS Cluster", status: "Active", icon: Award },
                               { name: "Logic Mastery", issuer: "Google Nodes", status: "Verified", icon: Zap },
                            ].map((cert, i) => (
                               <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-black/5 border border-black/5 group hover:border-electric-cyan/20 transition-all">
                                  <div className="p-2.5 rounded-xl bg-electric-cyan/10 text-electric-cyan"><cert.icon size={20} /></div>
                                  <div>
                                     <p className="text-xs font-black text-[#1E293B] uppercase tracking-widest">{cert.name}</p>
                                     <p className="text-[9px] font-bold text-slate-gray mt-1 uppercase">{cert.issuer} • {cert.status}</p>
                                  </div>
                               </div>
                            ))}
                         </div>
                         <Button variant="ghost" className="w-full mt-8 text-[9px] font-black uppercase tracking-widest py-4 border border-black/5 hover:bg-black/5">View Credentials</Button>
                      </Card>

                      {/* Micro Contribution Heatmap (Small Version) */}
                      <Card className="p-8 glass-card-dark border-black/5">
                         <h3 className="text-xs font-black text-[#1E293B] uppercase tracking-[0.3em] mb-8">Activity Pulse</h3>
                          <div className="flex gap-2 flex-wrap pb-4">
                             {Array.from({ length: 42 }).map((_, i) => (
                                <div key={i} className={`w-[11px] h-[11px] rounded-[2px] ${Math.random() > 0.7 ? (Math.random() > 0.5 ? 'bg-electric-cyan' : 'bg-electric-cyan/40') : 'bg-black/5'} transition-all hover:scale-150 cursor-help relative group/pulse`}>
                                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-[#FEFBF6] text-[8px] text-[#1E293B] rounded-lg border border-black/10 opacity-0 group-hover/pulse:opacity-100 whitespace-nowrap z-50 pointer-events-none shadow-2xl">
                                      Signal: Cycle {i+1} • Stable
                                   </div>
                                </div>
                             ))}
                          </div>
                         <div className="flex items-center justify-between mt-6 text-[8px] font-black uppercase tracking-widest text-slate-gray">
                            <span>Last 6 Weeks</span>
                            <span className="text-electric-cyan">86 Units Deployed</span>
                         </div>
                      </Card>
                   </aside>
                </div>
              )}

              {activeTab === 'bookmarks' && (
                <div className="space-y-12">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                     <div className="space-y-2">
                        <h3 className="text-3xl font-heading font-black text-[#1E293B] tracking-tight">Archived <span className="gradient-text">Intelligence</span></h3>
                        <p className="text-slate-gray text-xs font-black uppercase tracking-widest">A curated archive of high-value logic units.</p>
                     </div>
                     <div className="relative flex-grow max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-gray w-4 h-4" />
                        <input type="text" placeholder="Search archive..." className="w-full bg-[#F5F0EB] border border-black/10 rounded-2xl py-3.5 pl-12 pr-6 text-xs text-[#1E293B] focus:border-electric-cyan outline-none transition-all shadow-inner" />
                     </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                      {posts.slice(0, 3).map(post => (
                        <div key={post.id} className="group relative">
                           <PostCard post={{...post, author: user}} />
                           <button className="absolute top-6 right-6 z-20 p-3 rounded-2xl bg-black/60 backdrop-blur-xl border border-black/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-400 hover:text-[#1E293B] shadow-2xl">
                              <Heart size={18} fill="currentColor" />
                           </button>
                        </div>
                      ))}
                      {posts.length === 0 && (
                        <div className="col-span-full py-40 text-center glass-card-dark border-dashed border-black/10 rounded-[40px]">
                           <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto text-slate-gray/30 mb-6"><Bookmark size={40} /></div>
                           <p className="text-slate-gray font-black uppercase tracking-widest text-sm">No units bookmarked in this node.</p>
                        </div>
                      )}
                   </div>
                </div>
              )}

              {activeTab === 'drafts' && (
                <div className="space-y-12">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                     <div className="space-y-2">
                        <h3 className="text-3xl font-heading font-black text-[#1E293B] tracking-tight">Active <span className="gradient-text">Workstreams</span></h3>
                        <p className="text-slate-gray text-xs font-black uppercase tracking-widest">In-progress thought patterns awaiting deployment.</p>
                     </div>
                     <Button icon={Plus} onClick={() => navigate('/create-post')}>Initiate Workstream</Button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {[1, 2].map(i => (
                        <Card key={i} className="p-8 glass-card border-black/5 group hover:border-white/15 transition-all relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
                           <div className="flex items-center justify-between mb-8">
                              <Badge className="bg-black/5 text-slate-gray border-black/5 px-3 py-1 text-[9px] font-black uppercase tracking-widest">In Progress</Badge>
                              <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button className="text-slate-gray hover:text-[#1E293B] transition-colors"><Edit3 size={16} /></button>
                                 <button className="text-slate-gray hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                              </div>
                           </div>
                           <h4 className="text-xl font-heading font-black text-[#1E293B] group-hover:text-electric-cyan transition-colors mb-4 line-clamp-1">Prototypes for Decentralized {i === 1 ? 'Compute' : 'Storage'}</h4>
                           <div className="flex items-center justify-between mt-auto pt-6 border-t border-black/5">
                              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-gray">
                                 <Clock size={14} /> 2 days ago
                              </div>
                              <div className="text-[10px] font-mono text-electric-cyan font-bold">{i === 1 ? '75%' : '40%'} Ready</div>
                           </div>
                        </Card>
                      ))}
                   </div>
                </div>
              )}
           </motion.div>
        </AnimatePresence>
      </div>

      {/* Profile Edit Overlay Interface (Placeholder) */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#F5F0EB]/90 backdrop-blur-2xl" onClick={() => setIsEditModalOpen(false)} />
             <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-[#F5F0EB] border border-black/10 w-full max-w-4xl p-10 rounded-[48px] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-brand shadow-[0_0_15px_rgba(37,99,235,0.4)]" />
                <div className="flex items-center justify-between mb-12">
                   <div>
                      <h2 className="text-3xl font-heading font-black text-[#1E293B]">Modify Profile <span className="gradient-text">Manifest</span></h2>
                      <p className="text-slate-gray text-sm mt-1 font-bold">Update your presence across the neural network.</p>
                   </div>
                   <button onClick={() => setIsEditModalOpen(false)} className="p-4 rounded-2xl bg-black/5 text-slate-gray hover:text-[#1E293B] hover:bg-black/10 transition-all"><X size={24} /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-8">
                      <div className="space-y-3">
                         <label className="text-[11px] font-black uppercase tracking-widest text-slate-gray px-1">Display Descriptor</label>
                         <input type="text" defaultValue={user.name} className="w-full bg-[#FEFBF6] border border-black/10 rounded-2xl py-4 px-6 text-sm text-[#1E293B] focus:border-electric-cyan focus:ring-1 focus:ring-electric-cyan outline-none transition-all shadow-inner" />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[11px] font-black uppercase tracking-widest text-slate-gray px-1">Geographic Node</label>
                         <input type="text" defaultValue={user.location} className="w-full bg-[#FEFBF6] border border-black/10 rounded-2xl py-4 px-6 text-sm text-[#1E293B] focus:border-electric-cyan focus:ring-1 focus:ring-electric-cyan outline-none transition-all shadow-inner" />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[11px] font-black uppercase tracking-widest text-slate-gray px-1">Portal URL (Website)</label>
                         <input type="text" defaultValue={user.website} className="w-full bg-[#FEFBF6] border border-black/10 rounded-2xl py-4 px-6 text-sm text-[#1E293B] focus:border-electric-cyan focus:ring-1 focus:ring-electric-cyan outline-none transition-all shadow-inner" />
                      </div>
                   </div>
                   <div className="space-y-8">
                      <div className="space-y-3">
                         <label className="text-[11px] font-black uppercase tracking-widest text-slate-gray px-1">Philosophy / Bio</label>
                         <textarea defaultValue={user.bio} rows={8} className="w-full bg-[#FEFBF6] border border-black/10 rounded-2xl py-4 px-6 text-sm text-[#1E293B] focus:border-electric-cyan focus:ring-1 focus:ring-electric-cyan outline-none transition-all resize-none shadow-inner leading-relaxed" />
                      </div>
                   </div>
                </div>

                <div className="mt-12 pt-10 border-t border-black/5 flex flex-wrap justify-between items-center gap-6">
                   <div className="flex gap-4">
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1">Auto-Save Enabled</Badge>
                      <Badge className="bg-black/5 text-slate-gray border-black/5 px-3 py-1">V2.4 Profile Schema</Badge>
                   </div>
                   <div className="flex gap-4">
                      <Button variant="ghost" onClick={() => setIsEditModalOpen(false)} className="px-8 font-black uppercase tracking-widest text-[11px]">Abort Changes</Button>
                      <Button className="px-10 py-4 shadow-[0_0_20px_rgba(37,99,235,0.2)]">Synchronize Manifest</Button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;
