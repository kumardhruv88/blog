import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Check, X, ShieldAlert, Trash2, 
  Search, Filter, ExternalLink, User, Clock, 
  MoreVertical, ShieldCheck, Flag, Reply, Mail,
  Calendar, ChevronDown, CheckCircle2
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

// Mock Data
const ALL_COMMENTS = [
  { 
    id: 1, 
    author: { name: "Sarah Jenkins", username: "sjenkins", email: "sarah@tech.com", avatar: "https://ui-avatars.com/api/?name=Sarah+Jenkins&background=BD34FE&color=ffffff" },
    post: { title: "Understanding React Server Components", image: "/api/placeholder/400/320" },
    content: "Great article! This really helped clarify the distinction between client and server hydration. One question: how does this impact initial load time for heavy interactive islands?", 
    status: "Pending", 
    time: "5 mins ago",
    date: "2023-11-20"
  },
  { 
    id: 2, 
    author: { name: "Bad Actor", username: "spammer99", email: "spam@bot.com", avatar: "https://ui-avatars.com/api/?name=Bad+Actor&background=000000&color=ffffff" },
    post: { title: "Mastering TypeScript Generics", image: "/api/placeholder/400/320" },
    content: "Buy cheap tokens at scam-link.com! Best prices on the web. Don't miss out on this amazing opportunity to get rich quick.", 
    status: "Spam", 
    time: "12 mins ago",
    date: "2023-11-20"
  },
  { 
    id: 3, 
    author: { name: "Marcus Chen", username: "mchen", email: "marcus@dev.net", avatar: "https://ui-avatars.com/api/?name=Marcus+Chen&background=00F0FF&color=1E293B" },
    post: { title: "Next-Gen CSS Features", image: "/api/placeholder/400/320" },
    content: "Is there any performance overhead when using group-hover in Tailwind with extreme nesting? I've noticed some jitter on mobile devices.", 
    status: "Approved", 
    time: "45 mins ago",
    date: "2023-11-19"
  },
  {
    id: 4,
    author: { name: "Alex Riviera", username: "arivera", email: "alex@design.io", avatar: "https://ui-avatars.com/api/?name=Alex+Riviera&background=FF3366&color=ffffff" },
    post: { title: "The Future of AI in Design", image: "/api/placeholder/400/320" },
    content: "This is a fascinating perspective. I agree that AI will function more as a copilot than a replacement. The human element of empathy is irreplaceable.",
    status: "Approved",
    time: "2 hours ago",
    date: "2023-11-19"
  }
];

const AdminComments = () => {
  const [comments, setComments] = useState(ALL_COMMENTS);
  const [selectedComments, setSelectedComments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Detail Modal
  const [selectedComment, setSelectedComment] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Bulk Actions
  const toggleSelect = (id) => {
    if (selectedComments.includes(id)) {
      setSelectedComments(selectedComments.filter(i => i !== id));
    } else {
      setSelectedComments([...selectedComments, id]);
    }
  };

  const handleBulkAction = (action) => {
    // Implement bulk logic here
    console.log(`Bulk action: ${action} on`, selectedComments);
    setSelectedComments([]);
  };

  const openCommentDetail = (comment) => {
    setSelectedComment(comment);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-3xl font-heading font-black text-[#1E293B]">Moderate <span className="gradient-text">Discussion</span></h2>
           <p className="text-slate-gray text-sm mt-1">Review, approve, or remove user-generated content</p>
        </div>
        <div className="flex gap-3">
           <Badge className="bg-orange-400/10 text-orange-400 border-orange-400/20 font-black px-4 py-2 rounded-xl">12 PENDING</Badge>
        </div>
      </div>

      {/* Filters Bar */}
      <Card className="p-4 bg-white/70 border-black/5 backdrop-blur-xl">
         <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            {/* Search & Bulk */}
            <div className="flex items-center gap-4 w-full lg:w-auto">
               <div className="relative flex-grow lg:w-80 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-gray group-focus-within:text-electric-cyan transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search content, authors..."
                    className="w-full bg-black/5 border border-black/10 rounded-xl py-2.5 pl-12 pr-4 text-xs text-[#1E293B] focus:border-electric-cyan/50 outline-none transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
               
               {selectedComments.length > 0 && (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4">
                     <span className="text-xs font-bold text-[#1E293B] bg-electric-cyan/10 px-3 py-1.5 rounded-lg border border-electric-cyan/20">
                        {selectedComments.length} Selected
                     </span>
                     <select 
                       onChange={(e) => handleBulkAction(e.target.value)}
                       className="bg-black/10 border border-black/10 rounded-xl px-4 py-2.5 text-xs font-black text-[#1E293B] outline-none focus:border-electric-cyan/50 cursor-pointer"
                     >
                        <option value="">Bulk Actions...</option>
                        <option value="approve">Approve Selected</option>
                        <option value="spam">Mark as Spam</option>
                        <option value="delete">Delete Selected</option>
                     </select>
                  </div>
               )}
            </div>

            {/* Faceted Filters */}
            <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar pb-2 lg:pb-0">
               <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-black/5 border border-black/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-gray outline-none focus:border-electric-cyan/50 transition-all cursor-pointer min-w-[120px]"
               >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Spam">Spam</option>
               </select>

               <select className="bg-black/5 border border-black/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-gray outline-none focus:border-electric-cyan/50 transition-all cursor-pointer min-w-[140px]">
                  <option>All Posts</option>
                  <option>React Server Components</option>
                  <option>Mastering TypeScript</option>
               </select>

               <select className="bg-black/5 border border-black/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-gray outline-none focus:border-electric-cyan/50 transition-all cursor-pointer min-w-[120px]">
                  <option>All Dates</option>
                  <option>Today</option>
                  <option>Last 7 Days</option>
               </select>

               <button className="p-2.5 bg-black/5 border border-black/10 rounded-xl text-slate-gray hover:text-[#1E293B]" title="Sort Order">
                  <Filter size={16} />
               </button>
            </div>
         </div>
      </Card>

      {/* --- COMMENTS TABLE --- */}
      <Card className="overflow-hidden bg-white/60 border-black/5">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead className="bg-black/5 text-[10px] font-black uppercase tracking-widest text-slate-gray">
                  <tr>
                     <th className="px-6 py-4 w-12 text-center border-b border-black/5">
                        <input 
                          type="checkbox" 
                          checked={selectedComments.length === comments.length && comments.length > 0}
                          onChange={() => setSelectedComments(selectedComments.length === comments.length ? [] : comments.map(c => c.id))}
                          className="w-4 h-4 rounded border-black/10 bg-black/5 text-electric-cyan focus:ring-offset-0 focus:ring-electric-cyan/20 cursor-pointer"
                        />
                     </th>
                     <th className="px-6 py-4 border-b border-black/5 w-1/3">Comment</th>
                     <th className="px-6 py-4 border-b border-black/5">Post</th>
                     <th className="px-6 py-4 border-b border-black/5">Author Info</th>
                     <th className="px-6 py-4 border-b border-black/5">Status</th>
                     <th className="px-6 py-4 border-b border-black/5 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {comments.map(comment => (
                    <tr key={comment.id} className={`group hover:bg-white/[0.02] transition-colors ${selectedComments.includes(comment.id) ? 'bg-electric-cyan/[0.03]' : ''}`}>
                       {/* Checkbox */}
                       <td className="px-6 py-6 text-center align-top pt-8">
                          <input 
                            type="checkbox" 
                            checked={selectedComments.includes(comment.id)}
                            onChange={() => toggleSelect(comment.id)}
                            className="w-4 h-4 rounded border-black/10 bg-black/5 text-electric-cyan focus:ring-offset-0 focus:ring-electric-cyan/20 cursor-pointer mt-1"
                          />
                       </td>

                       {/* Comment Content */}
                       <td className="px-6 py-6 align-top">
                          <div className="flex gap-4">
                             <img src={comment.author.avatar} alt="" className="w-8 h-8 rounded-lg border border-black/10 flex-shrink-0" />
                             <div className="min-w-0">
                                <h4 onClick={() => openCommentDetail(comment)} className="text-sm font-bold text-[#1E293B] hover:text-electric-cyan cursor-pointer transition-colors mb-2">{comment.author.name}</h4>
                                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-2">"{comment.content}"</p>
                                <button onClick={() => openCommentDetail(comment)} className="text-[10px] font-bold text-electric-cyan hover:underline decoration-electric-cyan/50 underline-offset-4">Read full comment</button>
                             </div>
                          </div>
                       </td>

                       {/* Post Context */}
                       <td className="px-6 py-6 align-top">
                          <div className="flex gap-3 max-w-[200px]">
                             <div className="w-10 h-10 rounded-lg bg-black/5 border border-black/10 overflow-hidden flex-shrink-0">
                                {/* Using placeholder mock image */}
                                <div className="w-full h-full bg-gradient-to-br from-electric-cyan/20 to-vibrant-purple/20" />
                             </div>
                             <div>
                                <p className="text-xs font-bold text-[#1E293B] line-clamp-2 hover:text-electric-cyan cursor-pointer">{comment.post.title}</p>
                                <span className="text-[10px] text-slate-gray mt-1 block">ID: #{comment.id + 200}</span>
                             </div>
                          </div>
                       </td>

                       {/* Author Info */}
                       <td className="px-6 py-6 align-top">
                          <div className="space-y-1">
                             <div className="flex items-center gap-2 text-xs text-slate-gray">
                                <User size={12} /> @{comment.author.username}
                             </div>
                             <div className="flex items-center gap-2 text-xs text-slate-gray/70">
                                <Mail size={12} /> {comment.author.email}
                             </div>
                             <div className="flex items-center gap-2 text-xs text-slate-gray/70 mt-3 pt-3 border-t border-black/5">
                                <Clock size={12} /> {comment.time}
                             </div>
                          </div>
                       </td>

                       {/* Status */}
                       <td className="px-6 py-6 align-top pt-8">
                          {comment.status === 'Pending' && <Badge className="bg-orange-400/10 text-orange-400 border-orange-400/20">Pending</Badge>}
                          {comment.status === 'Approved' && <Badge className="bg-green-400/10 text-green-400 border-green-400/20">Approved</Badge>}
                          {comment.status === 'Spam' && <Badge className="bg-red-400/10 text-red-400 border-red-400/20">Spam</Badge>}
                       </td>

                       {/* Actions */}
                       <td className="px-6 py-6 align-top pt-8 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             {comment.status === 'Pending' && (
                                <button className="p-2 bg-green-400/10 text-green-400 hover:bg-green-400 hover:text-[#1E293B] rounded-lg transition-all" title="Approve">
                                   <Check size={14} />
                                </button>
                             )}
                             <button className="p-2 text-slate-gray hover:text-[#1E293B] hover:bg-black/5 rounded-lg transition-all" title="Reply">
                                <Reply size={14} />
                             </button>
                             <button className="p-2 text-slate-gray hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all" title="Mark Spam">
                                <ShieldAlert size={14} />
                             </button>
                             <button className="p-2 text-slate-gray hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all" title="Delete">
                                <Trash2 size={14} />
                             </button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
         
         <div className="p-4 bg-white/[0.02] border-t border-black/5 flex justify-center">
            <button className="text-[10px] font-black text-slate-gray uppercase tracking-widest hover:text-[#1E293B] transition-all">Load more comments</button>
         </div>
      </Card>

      {/* --- COMMENT DETAIL MODAL --- */}
      <AnimatePresence>
        {isDetailModalOpen && selectedComment && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDetailModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
             <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
               className="relative w-full max-w-2xl bg-[#F5F0EB] border border-black/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
             >
                {/* Modal Header */}
                <div className="px-8 py-6 border-b border-black/5 flex items-center justify-between bg-white/[0.02]">
                   <div>
                      <h3 className="text-xl font-heading font-black text-[#1E293B]">Review Comment</h3>
                      <p className="text-slate-gray text-xs mt-1 flex items-center gap-2">
                         Posted in <span className="text-electric-cyan">{selectedComment.post.title}</span>
                      </p>
                   </div>
                   <button onClick={() => setIsDetailModalOpen(false)} className="p-2 bg-black/5 hover:bg-black/10 rounded-xl text-slate-gray hover:text-[#1E293B] transition-colors"><X size={20} /></button>
                </div>

                {/* Modal Content */}
                <div className="p-8 overflow-y-auto">
                   <div className="flex gap-4 mb-8">
                      <img src={selectedComment.author.avatar} className="w-12 h-12 rounded-xl border border-black/10" alt="" />
                      <div>
                         <h4 className="text-[#1E293B] font-bold text-lg">{selectedComment.author.name}</h4>
                         <div className="flex items-center gap-4 text-xs text-slate-gray mt-1">
                            <span className="flex items-center gap-1.5"><User size={12} /> @{selectedComment.author.username}</span>
                            <span className="flex items-center gap-1.5"><Calendar size={12} /> Joined 2 months ago</span>
                         </div>
                      </div>
                   </div>

                   <div className="bg-black/5 border border-black/10 rounded-2xl p-6 relative mb-8">
                       <QuoteIcon className="absolute top-6 right-6 text-[#1E293B]/5" size={48} />
                       <div className="relative z-10 text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {selectedComment.content}
                       </div>
                       <div className="mt-4 pt-4 border-t border-black/5 flex items-center gap-2 text-xs text-slate-gray font-mono">
                          <Clock size={12} /> Posted {selectedComment.time} ({selectedComment.date})
                       </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="justify-center border-green-500/20 text-green-400 hover:bg-green-500 hover:text-[#1E293B]" icon={Check}>Approve & Publish</Button>
                      <Button variant="outline" className="justify-center border-red-500/20 text-red-400 hover:bg-red-500 hover:text-[#1E293B]" icon={ShieldAlert}>Mark as Spam</Button>
                   </div>
                   
                   <div className="mt-4">
                      <Button variant="ghost" className="w-full justify-center text-slate-gray hover:text-[#1E293B]" icon={Reply}>Reply as Admin</Button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper Icon
const QuoteIcon = ({ className, size }) => (
   <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.01697 21L5.01697 18C5.01697 16.8954 5.9124 16 7.01697 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H6.01697C5.46468 8 5.01697 8.44772 5.01697 9V11C5.01697 11.5523 4.56925 12 4.01697 12H3.01697V5H13.017V15C13.017 18.3137 10.3307 21 7.01697 21H5.01697Z" />
   </svg>
);

export default AdminComments;
