import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Plus, MoreVertical, Edit, Trash2, 
  ExternalLink, Eye, Bookmark, MessageSquare, 
  CheckCircle, Clock, AlertCircle, ChevronLeft, 
  ChevronRight, ArrowUpDown, Trash, LayoutGrid, List, X
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { fetchAdminPosts } from '../services/api';

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // list or grid
  
  // Detail Modal State
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const openPostDetail = (post) => {
    setSelectedPost(post);
    setIsDetailModalOpen(true);
  };

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchAdminPosts();
        setPosts(data.posts || data);

      } catch (error) {
        console.error('Error fetching admin posts:', error);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, []);

  const toggleSelect = (id) => {
    if (selectedPosts.includes(id)) {
      setSelectedPosts(selectedPosts.filter(i => i !== id));
    } else {
      setSelectedPosts([...selectedPosts, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts.map(p => p.id));
    }
  };

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.author?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="p-8 text-[#1E293B] uppercase font-black">Scanning Publication Grid...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-3xl font-heading font-black text-[#1E293B]">Content <span className="gradient-text">Management</span></h2>
           <p className="text-slate-gray text-sm mt-1">Review, edit, and moderate all platform publications</p>
        </div>
        <div className="flex gap-3">
           <Button icon={Plus}>Create New Post</Button>
        </div>
      </div>

      {/* --- FILTERS & BULK ACTIONS --- */}
      <Card className="p-4 bg-white/70 border-black/5 backdrop-blur-xl">
         <div className="flex flex-col xl:flex-row gap-6 items-center justify-between">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
               <div className="relative w-full sm:w-80 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-gray group-focus-within:text-electric-cyan transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search by title or author..."
                    className="w-full bg-black/5 border border-black/10 rounded-xl py-2.5 pl-12 pr-4 text-sm text-[#1E293B] focus:border-electric-cyan/50 outline-none transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
               
               <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                  <select className="bg-black/5 border border-black/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-gray outline-none focus:border-electric-cyan/50 transition-all cursor-pointer">
                     <option>All Status</option>
                     <option>Published</option>
                     <option>Draft</option>
                     <option>Scheduled</option>
                  </select>
                  <select className="bg-black/5 border border-black/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-gray outline-none focus:border-electric-cyan/50 transition-all cursor-pointer">
                     <option>All Categories</option>
                  </select>
               </div>
            </div>

            <div className="flex items-center gap-4 w-full xl:w-auto justify-between xl:justify-end">
               <AnimatePresence>
                  {selectedPosts.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-3 bg-red-400/10 border border-red-400/20 px-4 py-2 rounded-xl"
                    >
                       <span className="text-xs font-black text-red-400 uppercase tracking-widest">{selectedPosts.length} Selected</span>
                       <div className="w-px h-4 bg-red-400/20" />
                       <button className="text-red-400 hover:text-[#1E293B] transition-colors"><Trash size={16} /></button>
                       <button className="text-slate-gray hover:text-[#1E293B] transition-colors"><Edit size={16} /></button>
                    </motion.div>
                  )}
               </AnimatePresence>

               <div className="flex bg-black/5 p-1 rounded-xl border border-black/5">
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-electric-cyan text-[#1E293B] shadow-lg' : 'text-slate-gray hover:text-[#1E293B]'}`}
                  >
                     <List size={18} />
                  </button>
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-electric-cyan text-[#1E293B] shadow-lg' : 'text-slate-gray hover:text-[#1E293B]'}`}
                  >
                     <LayoutGrid size={18} />
                  </button>
               </div>
            </div>
         </div>
      </Card>

      {/* --- POSTS TABLE --- */}
      <Card className="overflow-hidden bg-white/60 border-black/5">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-black/5 border-b border-black/5 text-[10px] font-black uppercase tracking-widest text-slate-gray">
                  <tr>
                     <th className="px-6 py-4 w-12 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedPosts.length === filteredPosts.length}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded border-black/10 bg-black/5 text-electric-cyan focus:ring-offset-0 focus:ring-electric-cyan/20"
                        />
                     </th>
                     <th className="px-6 py-4">Title & Author</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4">Performance</th>
                     <th className="px-6 py-4">Date</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {filteredPosts.map(post => (
                    <motion.tr 
                      key={post.id}
                      layout
                      className={`group hover:bg-white/[0.02] transition-colors ${selectedPosts.includes(post.id) ? 'bg-electric-cyan/[0.03]' : ''}`}
                    >
                       <td className="px-6 py-6 text-center">
                          <input 
                            type="checkbox" 
                            checked={selectedPosts.includes(post.id)}
                            onChange={() => toggleSelect(post.id)}
                            className="w-4 h-4 rounded border-black/10 bg-black/5 text-electric-cyan focus:ring-offset-0 focus:ring-electric-cyan/20"
                          />
                       </td>
                       <td className="px-6 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-16 h-10 rounded-lg overflow-hidden border border-black/10 bg-black/5 flex-shrink-0 relative group/img">
                                <img src={post.cover_image_url || 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=200'} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500" alt="" />
                                <div className="absolute inset-0 bg-transparent group-hover/img:bg-electric-cyan/20 transition-all pointer-events-none" />
                             </div>
                             <div>
                                <h4 onClick={() => openPostDetail(post)} className="text-sm font-bold text-[#1E293B] group-hover:text-electric-cyan transition-colors line-clamp-1 cursor-pointer hover:underline underline-offset-4 decoration-electric-cyan/50">{post.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                   <Badge variant="outline" className="text-[9px] py-0 px-1 border-black/10 text-slate-gray">{post.category?.name || 'Uncategorized'}</Badge>
                                   <span className="text-[10px] text-slate-gray font-bold">• by {post.author?.name || 'Unknown'}</span>
                                </div>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-6 font-mono">
                          {post.status.toLowerCase() === 'published' && (
                             <div className="flex items-center gap-1.5 text-green-400 text-[10px] font-black uppercase tracking-widest">
                                <CheckCircle size={14} /> Published
                             </div>
                          )}
                          {post.status.toLowerCase() === 'draft' && (
                             <div className="flex items-center gap-1.5 text-slate-gray text-[10px] font-black uppercase tracking-widest">
                                <Clock size={14} /> Draft
                             </div>
                          )}
                          {(post.status.toLowerCase() === 'scheduled' || post.status.toLowerCase() === 'archived') && (
                             <div className="flex items-center gap-1.5 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                                <AlertCircle size={14} /> {post.status}
                             </div>
                          )}
                       </td>
                       <td className="px-6 py-6">
                          <div className="flex items-center gap-4">
                             <div className="flex items-center gap-1.5 text-slate-gray" title="Views">
                                <Eye size={14} /> <span className="text-xs font-black">{post.views >= 1000 ? (post.views/1000).toFixed(1)+'k' : post.views || 0}</span>
                             </div>
                             <div className="flex items-center gap-1.5 text-slate-gray" title="Bookmarks">
                                <Bookmark size={14} /> <span className="text-xs font-black">{post.bookmarks_count || 0}</span>
                             </div>
                             <div className="flex items-center gap-1.5 text-slate-gray" title="Comments">
                                <MessageSquare size={14} /> <span className="text-xs font-black">{post.comments_count || 0}</span>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <p className="text-xs font-bold text-[#1E293B]">{new Date(post.created_at).toLocaleDateString()}</p>
                          <p className="text-[10px] font-bold text-slate-gray uppercase tracking-widest mt-1">Created</p>
                       </td>
                       <td className="px-6 py-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                             <button className="p-2 text-slate-gray hover:text-electric-cyan hover:bg-electric-cyan/10 rounded-lg transition-all" title="Edit"><Edit size={16} /></button>
                             <button onClick={() => openPostDetail(post)} className="p-2 text-slate-gray hover:text-[#1E293B] hover:bg-black/5 rounded-lg transition-all" title="View"><ExternalLink size={16} /></button>
                             <div className="w-px h-4 bg-black/5 mx-1" />
                             <button className="p-2 text-slate-gray hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all" title="Delete"><Trash2 size={16} /></button>
                          </div>
                       </td>
                    </motion.tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* --- PAGINATION --- */}
         <div className="p-4 bg-white/[0.02] border-t border-black/5 flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-gray uppercase tracking-widest">Showing 5 of 1,247 posts</p>
            <div className="flex items-center gap-2">
               <button className="p-2 text-slate-gray hover:text-[#1E293B] disabled:opacity-20" disabled><ChevronLeft size={18} /></button>
               {[1, 2, 3, '...', 25].map((p, i) => (
                 <button key={i} className={`h-8 w-8 rounded-lg text-xs font-black transition-all ${p === 1 ? 'bg-electric-cyan text-[#1E293B] shadow-lg' : 'text-slate-gray hover:text-[#1E293B] hover:bg-black/5'}`}>
                    {p}
                 </button>
               ))}
               <button className="p-2 text-slate-gray hover:text-[#1E293B]"><ChevronRight size={18} /></button>
            </div>
         </div>
      </Card>

       <PostDetailModal 
         isOpen={isDetailModalOpen} 
         onClose={() => setIsDetailModalOpen(false)} 
         post={selectedPost} 
       />
    </div>
  );
};

// --- POST DETAIL MODAL ---
const PostDetailModal = ({ isOpen, onClose, post }) => {
  if (!post) return null;

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
            className="relative w-full max-w-6xl bg-[#F5F0EB] border border-black/10 rounded-3xl overflow-hidden shadow-2xl h-[90vh] flex flex-col"
          >
             {/* Header */}
             <div className="px-8 py-6 border-b border-black/5 flex items-start justify-between bg-white/[0.02]">
                <div className="flex-grow pr-8">
                   <div className="flex items-center gap-3 mb-3">
                      <Badge variant="outline" className={`text-[10px] py-0.5 px-2 border-black/10 ${post.status === 'Published' ? 'text-green-400 border-green-400/20' : 'text-slate-gray'}`}>
                         {post.status.toUpperCase()}
                      </Badge>
                      <span className="text-xs font-bold text-slate-gray flex items-center gap-1"><Clock size={12} /> Last updated: Today, 2:30 PM</span>
                   </div>
                   <h2 className="text-3xl font-heading font-black text-[#1E293B] leading-tight">{post.title}</h2>
                </div>
                <button onClick={onClose} className="p-2 bg-black/5 hover:bg-black/10 rounded-xl text-slate-gray hover:text-[#1E293B] transition-colors"><X size={20} /></button>
             </div>

             <div className="flex-grow flex min-h-0">
                {/* Main Content Preview */}
                <div className="flex-grow overflow-y-auto p-8 border-r border-black/5 no-scrollbar bg-[#FEFBF6]">
                   <div className="prose prose-invert prose-lg max-w-3xl mx-auto prose-headings:font-heading prose-headings:font-bold prose-pre:bg-[#112240] prose-pre:border prose-pre:border-black/10 prose-img:rounded-2xl">
                      <p className="lead text-xl text-slate-gray/80 font-medium mb-8">This is a simulated preview of the post content. In a real implementation, the full markdown content would be rendered here using ReactMarkdown.</p>
                      <h3>Introduction</h3>
                      <p>React Server Components represent a paradigm shift in how we build React applications. By moving component logic to the server, we can reduce bundle sizes and improve initial page loads.</p>
                       <div className="my-8">
                          <img src={post.cover_image_url || post.image} className="w-full rounded-2xl border border-black/10" alt="Preview" />
                          <p className="text-center text-xs text-slate-gray mt-2 italic">Featured Image Priority Display</p>
                       </div>
                       <h3>Summary</h3>
                       <p>{post.excerpt || 'No excerpt available for this post.'}</p>
                       <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>
                 </div>
 
                 {/* Sidebar Metadata & Analytics */}
                 <div className="w-80 bg-[#F5F0EB] flex-shrink-0 flex flex-col overflow-y-auto no-scrollbar">
                    {/* Author Profile */}
                    <div className="p-6 border-b border-black/5">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-gray mb-4">Author</h4>
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center font-bold text-[#1E293B]">
                             {post.author?.name?.[0] || '?'}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-[#1E293B]">{post.author?.name || 'Unknown'}</p>
                             <p className="text-xs text-slate-gray">@{post.author?.username || 'user'}</p>
                          </div>
                       </div>
                    </div>
 
                    {/* Quick Stats */}
                    <div className="p-6 border-b border-black/5 space-y-4">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-gray mb-2">Performance</h4>
                       <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-black/5 rounded-xl border border-black/5">
                             <p className="text-[10px] uppercase text-slate-gray font-bold">Views</p>
                             <p className="text-lg font-black text-[#1E293B] flex items-center gap-1">
                                {(post.views || 0).toLocaleString()} <span className="text-[10px] text-green-400">↑</span>
                             </p>
                          </div>
                          <div className="p-3 bg-black/5 rounded-xl border border-black/5">
                             <p className="text-[10px] uppercase text-slate-gray font-bold">Saves</p>
                             <p className="text-lg font-black text-[#1E293B]">{post.bookmarks_count || 0}</p>
                          </div>
                          <div className="p-3 bg-black/5 rounded-xl border border-black/5 col-span-2">
                             <p className="text-[10px] uppercase text-slate-gray font-bold">Comments</p>
                             <p className="text-lg font-black text-[#1E293B]">{post.comments_count || 0}</p>
                          </div>
                       </div>
                    </div>

                   {/* Metadata */}
                   <div className="p-6 space-y-6 flex-grow">
                      <div>
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-gray mb-2">Metadata</h4>
                         <div className="space-y-3">
                            <div>
                               <label className="text-xs text-slate-gray block mb-1">Category</label>
                               <Badge variant="outline" className="border-black/10 text-[#1E293B] bg-black/5">{post.category}</Badge>
                            </div>
                            <div>
                               <label className="text-xs text-slate-gray block mb-1">Tags</label>
                               <div className="flex flex-wrap gap-1">
                                  {['javascript', 'webdev', 'guide'].map(t => (
                                     <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-electric-cyan/10 text-electric-cyan font-bold border border-electric-cyan/20">#{t}</span>
                                  ))}
                               </div>
                            </div>
                            <div>
                               <label className="text-xs text-slate-gray block mb-1">Slug</label>
                               <code className="text-[10px] bg-black/5 px-2 py-1 rounded text-slate-gray font-mono block truncate">/blog/posts/mastering-react-server-components</code>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Actions */}
                   <div className="p-6 border-t border-black/5 bg-white/[0.02]">
                      <div className="grid grid-cols-2 gap-3">
                         <Button variant="outline" icon={ExternalLink} size="sm" className="w-full justify-center">View Live</Button>
                         <Button icon={Edit} size="sm" className="w-full justify-center">Edit Post</Button>
                         <Button variant="ghost" className="col-span-2 text-red-400 hover:bg-red-400/10 w-full justify-center" size="sm">Move to Trash</Button>
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

export default AdminPosts;
