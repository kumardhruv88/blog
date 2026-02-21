import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, UserPlus, MoreVertical, Shield, ShieldAlert, 
  Trash2, Mail, ExternalLink, Ban, CheckCircle2, 
  ChevronLeft, ChevronRight, User as UserIcon, UserCheck, 
  UserMinus, MessageSquare, Newspaper, X, Clock, Calendar, MapPin, Link as LinkIcon, Heart
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { fetchAdminUsers } from '../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Detail Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const openUserDetail = (user) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return <Badge className="bg-gradient-brand text-[#1E293B] border-none">Admin</Badge>;
      case 'moderator':
        return <Badge className="bg-blue-400/10 text-blue-400 border-blue-400/20">Mod</Badge>;
      default:
        return <Badge variant="outline" className="text-slate-gray border-black/10">User</Badge>;
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchAdminUsers();
        setUsers(data.users || data);

      } catch (error) {
        console.error('Error fetching admin users:', error);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  const toggleSelect = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(i => i !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="p-8 text-[#1E293B] uppercase font-black">Decrypting Member Archive...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-3xl font-heading font-black text-[#1E293B]">Member <span className="gradient-text">Directory</span></h2>
           <p className="text-slate-gray text-sm mt-1">Manage user roles, permissions, and account status</p>
        </div>
        <Button icon={UserPlus}>Add New user</Button>
      </div>

      {/* --- FILTERS --- */}
      <Card className="p-4 bg-white/70 border-black/5 backdrop-blur-xl">
         <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative w-full lg:w-96 group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-gray group-focus-within:text-electric-cyan transition-colors" size={18} />
               <input 
                 type="text" 
                 placeholder="Search by name, email or username..."
                 className="w-full bg-black/5 border border-black/10 rounded-xl py-2.5 pl-12 pr-4 text-sm text-[#1E293B] focus:border-electric-cyan/50 outline-none transition-all"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
         </div>
      </Card>

      {/* --- USERS TABLE --- */}
      <Card className="overflow-hidden bg-white/60 border-black/5">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-black/5 border-b border-black/5 text-[10px] font-black uppercase tracking-widest text-slate-gray">
                  <tr>
                     <th className="px-6 py-4 w-12 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedUsers.length === filteredUsers.length}
                          onChange={() => setSelectedUsers(selectedUsers.length === filteredUsers.length ? [] : filteredUsers.map(u => u.id))}
                          className="w-4 h-4 rounded border-black/10 bg-black/5 text-electric-cyan focus:ring-offset-0 focus:ring-electric-cyan/20"
                        />
                     </th>
                     <th className="px-6 py-4">Identity</th>
                     <th className="px-6 py-4">Permissions</th>
                     <th className="px-6 py-4">Activity</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className={`group hover:bg-white/[0.02] transition-colors ${selectedUsers.includes(user.id) ? 'bg-electric-cyan/[0.03]' : ''}`}>
                       <td className="px-6 py-6 text-center">
                          <input 
                            type="checkbox" 
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleSelect(user.id)}
                            className="w-4 h-4 rounded border-black/10 bg-black/5 text-electric-cyan focus:ring-offset-0 focus:ring-electric-cyan/20"
                          />
                       </td>
                       <td className="px-6 py-6">
                          <div className="flex items-center gap-4">
                             <img src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.name}&background=2563EB&color=1E293B`} className="w-10 h-10 rounded-xl border border-black/10 shadow-lg" alt="" />
                             <div className="min-w-0">
                                <p onClick={() => openUserDetail(user)} className="text-sm font-bold text-[#1E293B] group-hover:text-electric-cyan transition-colors cursor-pointer hover:underline underline-offset-4 decoration-electric-cyan/50">{user.name}</p>
                                <p className="text-[10px] font-mono text-slate-gray mt-1 flex items-center gap-1.5">
                                   <UserIcon size={10} /> @{user.username}
                                </p>
                                <p className="text-[10px] text-slate-gray/50 font-bold mt-0.5">{user.email}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-6 font-mono">
                          {getRoleBadge(user.role)}
                       </td>
                       <td className="px-6 py-6">
                          <div className="space-y-2">
                             <div className="flex items-center gap-2 text-[10px] font-black text-slate-gray uppercase tracking-tighter">
                                <Newspaper size={12} className="text-electric-cyan" /> {user.posts?.length || 0} Posts Published
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          {user.status === 'Active' ? (
                            <div className="flex items-center gap-1.5 text-green-400 text-[10px] font-black uppercase tracking-widest">
                               <CheckCircle2 size={14} /> Active
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-red-400 text-[10px] font-black uppercase tracking-widest">
                               <ShieldAlert size={14} /> {user.status || 'Restricted'}
                            </div>
                          )}
                          <p className="text-[10px] font-bold text-slate-gray mt-1">Joined {new Date(user.created_at).toLocaleDateString()}</p>
                       </td>
                       <td className="px-6 py-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                             <button onClick={() => openUserDetail(user)} className="p-2 text-slate-gray hover:text-electric-cyan hover:bg-electric-cyan/10 rounded-lg transition-all" title="User Profile"><UserCheck size={16} /></button>
                             <button className="p-2 text-slate-gray hover:text-[#1E293B] hover:bg-black/5 rounded-lg transition-all" title="Send Email"><Mail size={16} /></button>
                             <div className="w-px h-4 bg-black/5 mx-1" />
                             {user.status === 'Active' ? (
                               <button className="p-2 text-slate-gray hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all" title="Ban User"><Ban size={16} /></button>
                             ) : (
                               <button className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-all" title="Unban User"><UserPlus size={16} /></button>
                             )}
                             <button className="p-2 text-slate-gray hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all" title="Delete User"><Trash2 size={16} /></button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>

         <div className="p-4 bg-white/[0.02] border-t border-black/5 flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-gray uppercase tracking-widest">Showing 5 of 342 users</p>
            <div className="flex items-center gap-2">
               <button className="p-2 text-slate-gray hover:text-[#1E293B] disabled:opacity-20" disabled><ChevronLeft size={18} /></button>
               <button className="h-8 w-8 rounded-lg text-xs font-black bg-electric-cyan text-[#1E293B] shadow-lg">1</button>
               <button className="h-8 w-8 rounded-lg text-xs font-black text-slate-gray hover:text-[#1E293B] hover:bg-black/5 transition-all">2</button>
               <button className="h-8 w-8 rounded-lg text-xs font-black text-slate-gray hover:text-[#1E293B] hover:bg-black/5 transition-all">3</button>
               <button className="p-2 text-slate-gray hover:text-[#1E293B]"><ChevronRight size={18} /></button>
            </div>
         </div>
       </Card>

       <UserDetailModal 
         isOpen={isDetailModalOpen} 
         onClose={() => setIsDetailModalOpen(false)} 
         user={selectedUser} 
       />
    </div>
  );
};

// --- USER DETAIL MODAL ---
const UserDetailModal = ({ isOpen, onClose, user }) => {
  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.95, opacity: 0, y: 20 }} 
            className="relative w-full max-w-5xl bg-[#F5F0EB] border border-black/10 rounded-3xl overflow-hidden shadow-2xl h-[85vh] flex flex-col"
          >
             {/* Header */}
             <div className="px-8 py-8 border-b border-black/5 flex items-start justify-between bg-white/[0.02] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-electric-cyan via-vibrant-purple to-electric-cyan opacity-50" />
                <div className="flex items-center gap-6 relative z-10">
                   <div className="w-20 h-20 rounded-2xl border-2 border-electric-cyan/30 shadow-[0_0_20px_rgba(37,99,235,0.15)] overflow-hidden">
                      <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                   </div>
                   <div>
                      <div className="flex items-center gap-3 mb-1">
                         <h2 className="text-3xl font-heading font-black text-[#1E293B]">{user.name}</h2>
                         {user.role === 'Admin' && <Badge className="bg-gradient-brand text-[#1E293B] font-black border-none px-2 py-0.5">ADMIN</Badge>}
                         {user.role === 'Moderator' && <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 font-black px-2 py-0.5">MOD</Badge>}
                      </div>
                      <div className="flex items-center gap-4 text-slate-gray text-sm">
                         <span className="flex items-center gap-1.5"><UserIcon size={14} /> @{user.username}</span>
                         <span className="flex items-center gap-1.5"><Calendar size={14} /> Joined {user.joined}</span>
                         <span className="flex items-center gap-1.5 text-green-400"><CheckCircle2 size={14} /> Active now</span>
                      </div>
                   </div>
                </div>
                <button onClick={onClose} className="p-2 bg-black/5 hover:bg-black/10 rounded-xl text-slate-gray hover:text-[#1E293B] transition-colors"><X size={24} /></button>
             </div>

             <div className="flex-grow flex min-h-0 bg-[#FEFBF6]">
                {/* Main Content */}
                <div className="flex-grow overflow-y-auto p-8 no-scrollbar space-y-8">
                   {/* Stats Grid */}
                   <div className="grid grid-cols-3 gap-4">
                      <div className="p-5 bg-[#F5F0EB] rounded-2xl border border-black/5">
                         <div className="flex items-center gap-3 mb-2 text-slate-gray">
                            <Newspaper size={18} className="text-electric-cyan" />
                            <span className="text-xs font-black uppercase tracking-widest">Posts</span>
                         </div>
                         <p className="text-3xl font-black text-[#1E293B]">{user.posts}</p>
                      </div>
                      <div className="p-5 bg-[#F5F0EB] rounded-2xl border border-black/5">
                         <div className="flex items-center gap-3 mb-2 text-slate-gray">
                            <MessageSquare size={18} className="text-vibrant-purple" />
                            <span className="text-xs font-black uppercase tracking-widest">Comments</span>
                         </div>
                         <p className="text-3xl font-black text-[#1E293B]">156</p>
                      </div>
                      <div className="p-5 bg-[#F5F0EB] rounded-2xl border border-black/5">
                         <div className="flex items-center gap-3 mb-2 text-slate-gray">
                            <Heart size={18} className="text-red-400" />
                            <span className="text-xs font-black uppercase tracking-widest">Likes Received</span>
                         </div>
                         <p className="text-3xl font-black text-[#1E293B]">2.4k</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-8">
                      {/* Personal Info */}
                      <div className="space-y-4">
                         <h3 className="text-sm font-black text-slate-gray uppercase tracking-widest flex items-center gap-2">
                            <UserCheck size={16} /> Personal Details
                         </h3>
                         <div className="bg-[#F5F0EB] rounded-2xl border border-black/5 p-6 space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-black/5">
                               <span className="text-slate-gray text-sm">Email Address</span>
                               <span className="text-[#1E293B] font-medium flex items-center gap-2">{user.email} <Badge className="text-[9px] bg-green-400/10 text-green-400 border-none">VERIFIED</Badge></span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-black/5">
                               <span className="text-slate-gray text-sm">Location</span>
                               <span className="text-[#1E293B] font-medium flex items-center gap-1"><MapPin size={14} className="text-slate-gray" /> San Francisco, CA</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-black/5">
                               <span className="text-slate-gray text-sm">Website</span>
                               <a href="#" className="text-electric-cyan font-medium flex items-center gap-1 hover:underline"><LinkIcon size={14} /> portfolio.dev</a>
                            </div>
                            <div className="flex justify-between items-center py-2">
                               <span className="text-slate-gray text-sm">Last Login</span>
                               <span className="text-[#1E293B] font-medium">2 hours ago</span>
                            </div>
                         </div>
                      </div>

                      {/* Recent Activity */}
                      <div className="space-y-4">
                         <h3 className="text-sm font-black text-slate-gray uppercase tracking-widest flex items-center gap-2">
                            <Clock size={16} /> Recent Activity
                         </h3>
                         <div className="bg-[#F5F0EB] rounded-2xl border border-black/5 p-6 relative">
                            <div className="absolute left-9 top-8 bottom-8 w-px bg-black/10" />
                            <div className="space-y-6">
                               {[1, 2, 3].map((i) => (
                                  <div key={i} className="flex gap-4 relative">
                                     <div className="w-6 h-6 rounded-full bg-[#F5F0EB] border-2 border-electric-cyan z-10 flex-shrink-0" />
                                     <div>
                                        <p className="text-sm text-[#1E293B] font-medium">Published a new post "React Patterns"</p>
                                        <p className="text-xs text-slate-gray mt-1">2 hours ago</p>
                                     </div>
                                  </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Sidebar Actions */}
                <div className="w-72 bg-[#F5F0EB] border-l border-black/5 p-6 space-y-6">
                   <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-gray mb-3">Account Actions</h4>
                      <div className="space-y-3">
                         <Button icon={Mail} variant="outline" size="sm" className="w-full justify-center">Send Email</Button>
                         <Button icon={Shield} variant="outline" size="sm" className="w-full justify-center">Change Role</Button>
                         <Button icon={UserIcon} variant="outline" size="sm" className="w-full justify-center">View Public Profile</Button>
                      </div>
                   </div>

                   <div className="pt-6 border-t border-black/5">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-3">Danger Zone</h4>
                      <div className="space-y-3">
                         <Button icon={Ban} variant="ghost" size="sm" className="w-full justify-center text-red-400 hover:bg-red-400/10">Ban User</Button>
                         <Button icon={Trash2} variant="ghost" size="sm" className="w-full justify-center text-red-400 hover:bg-red-400/10">Delete Account</Button>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdminUsers;
