import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GripVertical, Plus, Edit, Trash2, Copy, 
  ExternalLink, Search, Filter, Hash, MoreVertical,
  Check, X
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

// Mock Data
const INITIAL_CATEGORIES = [
  { id: 1, name: "React", slug: "react", description: "All things React, from hooks to Server Components.", posts: 45, order: 1, color: "#2563EB" },
  { id: 2, name: "Backend", slug: "backend", description: "Server-side logic, APIs, and microservices architecture.", posts: 32, order: 2, color: "#BD34FE" },
  { id: 3, name: "AI & ML", slug: "ai-ml", description: "Deep learning, neural networks, and prompt engineering.", posts: 28, order: 3, color: "#FF3366" },
  { id: 4, name: "Design", slug: "design", description: "UI/UX principles, CSS wizardry, and accessibility.", posts: 19, order: 4, color: "#00F0FF" }
];

const AdminCategories = () => {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const openModal = (category = null) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-3xl font-heading font-black text-[#1E293B]">Platform <span className="gradient-text">Taxonomy</span></h2>
           <p className="text-slate-gray text-sm mt-1">Organize your content structure and homepage navigation</p>
        </div>
        <Button icon={Plus} onClick={() => openModal()}>Add Category</Button>
      </div>

      {/* --- CATEGORIES LIST --- */}
      <Card className="overflow-hidden bg-white/60 border-black/5">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-black/5 border-b border-black/5 text-[10px] font-black uppercase tracking-widest text-slate-gray">
                  <tr>
                     <th className="px-6 py-4 w-12">Order</th>
                     <th className="px-6 py-4">Category</th>
                     <th className="px-6 py-4">Slug</th>
                     <th className="px-6 py-4">Description</th>
                     <th className="px-6 py-4 text-center">Posts</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {categories.map((cat, index) => (
                    <motion.tr 
                      key={cat.id}
                      layout
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                       <td className="px-6 py-6">
                          <div className="flex items-center gap-3">
                             <div className="p-1.5 text-slate-gray/30 group-hover:text-electric-cyan cursor-grab active:cursor-grabbing transition-colors">
                                <GripVertical size={18} />
                             </div>
                             <span className="text-xs font-black text-slate-gray">{cat.order}</span>
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <div className="flex items-center gap-3">
                             <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.2)]" style={{ backgroundColor: cat.color }} />
                             <span className="text-sm font-bold text-[#1E293B] group-hover:text-electric-cyan transition-colors">{cat.name}</span>
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <div className="flex items-center gap-2 group/slug">
                             <code className="text-[10px] font-mono text-slate-gray bg-black/5 py-0.5 px-2 rounded">/{cat.slug}</code>
                             <button className="text-slate-gray opacity-0 group-hover/slug:opacity-100 hover:text-[#1E293B] transition-all"><Copy size={12} /></button>
                          </div>
                       </td>
                       <td className="px-6 py-6 max-w-xs">
                          <p className="text-xs text-slate-gray line-clamp-1 italic">{cat.description}</p>
                       </td>
                       <td className="px-6 py-6 text-center">
                          <Badge variant="outline" className="text-[10px] font-black text-slate-gray border-black/10 group-hover:border-electric-cyan/30 group-hover:text-[#1E293B] transition-all">
                             {cat.posts}
                          </Badge>
                       </td>
                       <td className="px-6 py-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                             <button onClick={() => openModal(cat)} className="p-2 text-slate-gray hover:text-[#1E293B] hover:bg-black/5 rounded-lg transition-all" title="Edit"><Edit size={16} /></button>
                             <button className="p-2 text-slate-gray hover:text-[#1E293B] hover:bg-black/5 rounded-lg transition-all" title="View"><ExternalLink size={16} /></button>
                             <div className="w-px h-4 bg-black/5 mx-1" />
                             <button className="p-2 text-slate-gray hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all" title="Delete"><Trash2 size={16} /></button>
                          </div>
                       </td>
                    </motion.tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Card>

      {/* --- ADD/EDIT MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-[#F5F0EB]/80 backdrop-blur-sm"
               onClick={() => setIsModalOpen(false)}
             />
             <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0, y: 20 }}
               className="relative w-full max-w-xl bg-[#F5F0EB] border border-black/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-64 h-64 bg-electric-cyan/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10">
                   <h3 className="text-2xl font-heading font-black mb-1">{editingCategory ? 'Edit' : 'Create'} <span className="gradient-text">Category</span></h3>
                   <p className="text-sm text-slate-gray mb-8">Define how posts are grouped across the platform.</p>

                   <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-gray uppercase tracking-widest ml-1">Category Name</label>
                            <input type="text" defaultValue={editingCategory?.name} placeholder="e.g. Next.js" className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3 text-sm focus:border-electric-cyan/50 outline-none transition-all" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-gray uppercase tracking-widest ml-1">Slug</label>
                            <input type="text" defaultValue={editingCategory?.slug} placeholder="next-js" className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3 text-sm focus:border-electric-cyan/50 outline-none transition-all" />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-gray uppercase tracking-widest ml-1">Description</label>
                         <textarea rows="3" defaultValue={editingCategory?.description} placeholder="Short description for the category page..." className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3 text-sm focus:border-electric-cyan/50 outline-none transition-all resize-none" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-gray uppercase tracking-widest ml-1">Icon (Lucide)</label>
                            <div className="flex gap-2">
                               <div className="p-3 bg-black/5 border border-black/10 rounded-xl text-electric-cyan">
                                  <Hash size={20} />
                               </div>
                               <input type="text" defaultValue="Hash" className="flex-grow bg-black/5 border border-black/10 rounded-xl px-4 py-2 text-sm focus:border-electric-cyan/50 outline-none transition-all" />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-gray uppercase tracking-widest ml-1">Theme Color</label>
                            <div className="flex gap-3">
                               <input type="color" defaultValue={editingCategory?.color || "#2563EB"} className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer p-0" />
                               <input type="text" defaultValue={editingCategory?.color || "#2563EB"} className="flex-grow bg-black/5 border border-black/10 rounded-xl px-4 py-2 text-sm font-mono focus:border-electric-cyan/50 outline-none transition-all uppercase" />
                            </div>
                         </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-black/5">
                         <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-gray hover:text-[#1E293B] font-bold text-xs uppercase tracking-widest transition-colors">Cancel</button>
                         <Button icon={Check}>Save Changes</Button>
                      </div>
                   </form>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCategories;
