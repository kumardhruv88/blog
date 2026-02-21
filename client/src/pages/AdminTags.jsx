import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tag as TagIcon, Search, Plus, Trash2, 
  Combine, Hash, TrendingUp, BarChart,
  Edit, Filter, Check, X, MoreVertical,
  AlertTriangle, ArrowRight, CornerDownRight
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

// Mock Data
const ALL_TAGS = [
  { id: 1, name: "React", posts: 124, trend: 'up', slug: 'react', created: '2023-01-15' },
  { id: 2, name: "Node.js", posts: 89, trend: 'up', slug: 'node-js', created: '2023-02-20' },
  { id: 3, name: "CSS", posts: 56, trend: 'down', slug: 'css', created: '2023-03-10' },
  { id: 4, name: "AI", posts: 145, trend: 'up', slug: 'ai', created: '2023-11-05' },
  { id: 5, name: "TypeScript", posts: 78, trend: 'up', slug: 'typescript', created: '2023-06-12' },
  { id: 6, name: "Database", posts: 42, trend: 'down', slug: 'database', created: '2023-04-01' },
  { id: 7, name: "Cloud", posts: 67, trend: 'up', slug: 'cloud', created: '2023-08-15' },
  { id: 8, name: "Security", posts: 23, trend: 'up', slug: 'security', created: '2023-09-22' },
];

const AdminTags = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('most-used');

  // Modals State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeTag, setActiveTag] = useState(null); // Tag being edited/deleted/merged source

  // Handlers
  const handleEdit = (tag) => {
    setActiveTag(tag);
    setIsEditModalOpen(true);
  };

  const handleDelete = (tag) => {
    setActiveTag(tag);
    setIsDeleteModalOpen(true);
  };

  const handleMerge = (sourceTag) => {
    setActiveTag(sourceTag); // actively selected source
    setIsMergeModalOpen(true);
  };

  const toggleSelect = (id) => {
    if (selectedTags.includes(id)) {
      setSelectedTags(selectedTags.filter(i => i !== id));
    } else {
      setSelectedTags([...selectedTags, id]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-3xl font-heading font-black text-[#1E293B]">Targeted <span className="gradient-text">Keywords</span></h2>
           <p className="text-slate-gray text-sm mt-1">Monitor tag popularity, merge duplicates, and clean taxonomy</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" icon={Combine} disabled={selectedTags.length < 2} onClick={() => setIsMergeModalOpen(true)}>Merge Selected</Button>
           <Button icon={Plus}>Add Tag</Button>
        </div>
      </div>

      {/* --- TAG CLOUD OVERVIEW --- */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         <Card className="lg:col-span-3 p-8 glass-card border-black/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-electric-cyan/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <h3 className="text-xs font-black text-slate-gray uppercase tracking-widest mb-6 flex items-center gap-2">
               <TrendingUp size={14} className="text-electric-cyan" /> Popularity Cloud
            </h3>
            <div className="flex flex-wrap gap-4 items-center justify-center">
               {ALL_TAGS.map(tag => (
                 <motion.button 
                   key={tag.id}
                   whileHover={{ scale: 1.1, y: -2 }}
                   className={`px-4 py-2 rounded-xl transition-all font-bold border ${tag.posts > 100 ? 'bg-electric-cyan/10 border-electric-cyan/30 text-electric-cyan text-lg' : 'bg-black/5 border-black/10 text-slate-gray text-sm hover:text-[#1E293B]'}`}
                 >
                    #{tag.name}
                    <span className="ml-2 text-[10px] opacity-40 font-black">{tag.posts}</span>
                 </motion.button>
               ))}
            </div>
         </Card>
         
         <Card className="p-8 glass-card border-black/5 bg-gradient-to-br from-vibrant-purple/10 to-transparent">
            <h3 className="text-xs font-black text-slate-gray uppercase tracking-widest mb-6">Total Tags</h3>
            <div className="text-5xl font-heading font-black text-[#1E293B] mb-2">1,482</div>
            <p className="text-xs font-bold text-slate-gray leading-relaxed mb-6">Your taxonomy has grown by <span className="text-green-400">12%</span> this month.</p>
            <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: '65%' }}
                 className="h-full bg-electric-cyan shadow-[0_0_10px_#2563EB]" 
               />
            </div>
            <p className="text-[10px] font-black text-slate-gray uppercase tracking-widest mt-2">Database utilization</p>
         </Card>
      </section>

      {/* --- TAGS TABLE --- */}
      <Card className="overflow-hidden bg-white/60 border-black/5">
         <div className="p-6 border-b border-black/5 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80 group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-gray group-focus-within:text-electric-cyan transition-colors" size={18} />
               <input 
                 type="text" 
                 placeholder="Search tags..."
                 className="w-full bg-black/5 border border-black/10 rounded-xl py-2 pl-12 pr-4 text-xs text-[#1E293B] focus:border-electric-cyan/50 outline-none transition-all"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
            <div className="flex items-center gap-4">
               <select 
                 value={sortOrder}
                 onChange={(e) => setSortOrder(e.target.value)}
                 className="bg-black/5 border border-black/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-gray outline-none focus:border-electric-cyan/50 transition-all cursor-pointer"
               >
                  <option value="most-used">Most Used</option>
                  <option value="least-used">Least Used</option>
                  <option value="alphabetical">Alphabetical (A-Z)</option>
                  <option value="newest">Newest</option>
               </select>
            </div>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-black/5 text-[10px] font-black uppercase tracking-widest text-slate-gray">
                  <tr>
                     <th className="px-6 py-4 w-12 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedTags.length === ALL_TAGS.length}
                          onChange={() => setSelectedTags(selectedTags.length === ALL_TAGS.length ? [] : ALL_TAGS.map(t => t.id))}
                          className="w-4 h-4 rounded border-black/10 bg-black/5 text-electric-cyan focus:ring-offset-0 focus:ring-electric-cyan/20"
                        />
                     </th>
                     <th className="px-6 py-4">Tag Name</th>
                     <th className="px-6 py-4">Associated Posts</th>
                     <th className="px-6 py-4">Trend</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {ALL_TAGS.map(tag => (
                    <tr key={tag.id} className={`group hover:bg-white/[0.02] transition-colors ${selectedTags.includes(tag.id) ? 'bg-electric-cyan/[0.03]' : ''}`}>
                       <td className="px-6 py-6 text-center">
                          <input 
                            type="checkbox" 
                            checked={selectedTags.includes(tag.id)}
                            onChange={() => toggleSelect(tag.id)}
                            className="w-4 h-4 rounded border-black/10 bg-black/5 text-electric-cyan focus:ring-offset-0 focus:ring-electric-cyan/20"
                          />
                       </td>
                       <td className="px-6 py-6">
                          <div className="font-bold text-[#1E293B] group-hover:text-electric-cyan transition-colors">#{tag.name}</div>
                          <code className="text-[10px] text-slate-gray bg-black/5 px-1.5 rounded mt-1 inline-block">/{tag.slug}</code>
                       </td>
                       <td className="px-6 py-6">
                          <div className="flex items-center gap-2">
                             <span className="text-sm font-black text-[#1E293B]">{tag.posts}</span>
                             <span className="text-[10px] font-bold text-slate-gray uppercase tracking-widest">Articles</span>
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          {tag.trend === 'up' ? (
                             <div className="flex items-center gap-1 text-green-400 text-xs font-black">
                                <TrendingUp size={14} /> +12%
                             </div>
                          ) : (
                             <div className="flex items-center gap-1 text-red-400 text-xs font-black">
                                <BarChart size={14} className="rotate-180" /> -5%
                             </div>
                          )}
                       </td>
                       <td className="px-6 py-6 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => handleEdit(tag)} className="p-2 text-slate-gray hover:text-[#1E293B] hover:bg-black/5 rounded-lg transition-all" title="Edit"><Edit size={16} /></button>
                             <button onClick={() => handleMerge(tag)} className="p-2 text-slate-gray hover:text-[#1E293B] hover:bg-black/5 rounded-lg transition-all" title="Merge"><Combine size={16} /></button>
                             <button onClick={() => handleDelete(tag)} className="p-2 text-slate-gray hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all" title="Delete"><Trash2 size={16} /></button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
         
         <div className="p-4 bg-white/[0.02] border-t border-black/5 flex justify-center">
            <button className="text-[10px] font-black text-slate-gray uppercase tracking-widest hover:text-[#1E293B] transition-all">Load more tags</button>
         </div>
      </Card>

      {/* --- EDIT MODAL --- */}
      <AnimatePresence>
        {isEditModalOpen && activeTag && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
               className="relative w-full max-w-md bg-[#F5F0EB] border border-black/10 rounded-2xl p-6 shadow-2xl"
             >
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-lg font-heading font-black text-[#1E293B]">Edit Tag</h3>
                   <button onClick={() => setIsEditModalOpen(false)}><X size={20} className="text-slate-gray hover:text-[#1E293B]" /></button>
                </div>
                
                <div className="space-y-4">
                   <div>
                      <label className="text-xs font-bold text-slate-gray uppercase tracking-widest block mb-1.5">Tag Name</label>
                      <input type="text" defaultValue={activeTag.name} className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3 text-[#1E293B] focus:border-electric-cyan/50 outline-none" />
                   </div>
                   <div>
                      <label className="text-xs font-bold text-slate-gray uppercase tracking-widest block mb-1.5">Slug</label>
                      <input type="text" defaultValue={activeTag.slug} className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3 text-slate-gray font-mono text-sm focus:border-electric-cyan/50 outline-none" />
                   </div>
                </div>

                <div className="flex gap-3 mt-8">
                   <Button variant="ghost" onClick={() => setIsEditModalOpen(false)} className="flex-1 justify-center">Cancel</Button>
                   <Button className="flex-1 justify-center">Save Changes</Button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MERGE MODAL --- */}
      <AnimatePresence>
        {isMergeModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMergeModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
               className="relative w-full max-w-lg bg-[#F5F0EB] border border-black/10 rounded-2xl p-6 shadow-2xl"
             >
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-lg font-heading font-black text-[#1E293B] flex items-center gap-2"><Combine size={20} className="text-electric-cyan" /> Merge Tags</h3>
                   <button onClick={() => setIsMergeModalOpen(false)}><X size={20} className="text-slate-gray hover:text-[#1E293B]" /></button>
                </div>

                <div className="p-4 bg-black/5 rounded-xl border border-black/10 mb-6 space-y-4">
                   <div className="flex items-center justify-between">
                      <div>
                         <p className="text-[10px] font-black text-slate-gray uppercase tracking-widest mb-1">Source Tag</p>
                         <div className="font-bold text-[#1E293B] text-lg">#{activeTag ? activeTag.name : selectedTags.length + ' Selected'}</div>
                      </div>
                      <ArrowRight size={20} className="text-slate-gray opacity-50" />
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-gray uppercase tracking-widest mb-1">Destination</p>
                         <div className="font-bold text-electric-cyan text-lg">???</div>
                      </div>
                   </div>
                </div>
                
                <div className="space-y-4">
                   <div>
                      <label className="text-xs font-bold text-slate-gray uppercase tracking-widest block mb-1.5">Select Destination Tag</label>
                      <select className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3 text-[#1E293B] focus:border-electric-cyan/50 outline-none appearance-none">
                         <option>Choose a tag...</option>
                         {ALL_TAGS.filter(t => t.id !== (activeTag?.id)).map(t => (
                            <option key={t.id} value={t.id}>#{t.name}</option>
                         ))}
                      </select>
                   </div>
                   <p className="text-xs text-slate-gray flex items-start gap-2 bg-yellow-400/5 p-3 rounded-lg border border-yellow-400/10">
                      <AlertTriangle size={14} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                      This action will update all posts using the source tag to the destination tag. The source tag will be permanently deleted.
                   </p>
                </div>

                <div className="flex gap-3 mt-8">
                   <Button variant="ghost" onClick={() => setIsMergeModalOpen(false)} className="flex-1 justify-center">Cancel</Button>
                   <Button className="flex-1 justify-center">Confirm Merge</Button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- DELETE MODAL --- */}
      <AnimatePresence>
        {isDeleteModalOpen && activeTag && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
               className="relative w-full max-w-sm bg-[#F5F0EB] border border-black/10 rounded-2xl p-6 shadow-2xl text-center"
             >
                <div className="w-16 h-16 bg-red-400/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-400/20">
                   <Trash2 size={32} className="text-red-400" />
                </div>
                <h3 className="text-xl font-heading font-black text-[#1E293B] mb-2">Delete Tag?</h3>
                <p className="text-slate-gray text-sm mb-6">
                   Are you sure you want to delete <span className="text-[#1E293B] font-bold">#{activeTag.name}</span>? This will remove the tag from <span className="text-[#1E293B] font-bold">{activeTag.posts} posts</span>.
                </p>

                <div className="flex gap-3">
                   <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} className="flex-1 justify-center">Cancel</Button>
                   <Button className="flex-1 justify-center text-red-400 hover:bg-red-400/10 bg-red-400/5 border-red-400/20">Delete Forever</Button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminTags;
