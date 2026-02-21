import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag as TagIcon, Search, Hash, ChevronRight, LayoutGrid, X } from 'lucide-react';
import Card from '../components/common/Card';
import PostCard from '../components/blog/PostCard';
import Button from '../components/common/Button';

// Mock Data
const ALL_TAGS = [
  "Frontend", "Performance", "Architecture", "Design", "Responsive", "Grid", 
  "Tailwind", "Node.js", "API", "Express", "AI", "Graph", "Python", "Docker", 
  "MERN", "Containerization", "TypeScript", "JavaScript", "React", "Next.js"
];

const ALL_POSTS = [
  {
    id: 1,
    title: "Understanding React Server Components",
    slug: "react-server-components",
    excerpt: "Deep dive into how RSCs work, their benefits for performance, and how they change the way we build React applications.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
    category: "React",
    tags: ["Frontend", "Performance", "Architecture"],
    readTime: "8 min",
    readTimeMin: 8,
    views: "1.2k",
    bookmarks: "15",
    publishedAt: "2024-02-01T10:00:00Z",
    author: { name: "Dhruv", avatar: "https://ui-avatars.com/api/?name=Dhruv&background=64FFDA&color=0A192F" }
  }
];

const TAG_METADATA = {
  "Frontend": { category: "Web", popularity: 0.9 },
  "Performance": { category: "Web", popularity: 0.7 },
  "Architecture": { category: "System", popularity: 0.8 },
  "Design": { category: "UI/UX", popularity: 0.6 },
  "Tailwind": { category: "CSS", popularity: 0.8 },
  "Node.js": { category: "Backend", popularity: 0.9 },
  "Express": { category: "Backend", popularity: 0.7 },
  "AI": { category: "Data Science", popularity: 0.8 },
  "TypeScript": { category: "Web", popularity: 0.95 },
  "React": { category: "Web", popularity: 1.0 },
  "Next.js": { category: "Web", popularity: 0.9 },
};

const CATEGORY_COLORS = {
  "Web": "border-electric-cyan/40 text-electric-cyan bg-electric-cyan/5",
  "Backend": "border-vibrant-purple/40 text-vibrant-purple bg-vibrant-purple/5",
  "System": "border-neon-pink/40 text-neon-pink bg-neon-pink/5",
  "UI/UX": "border-amber-400/40 text-amber-400 bg-amber-400/5",
  "Data Science": "border-indigo-400/40 text-indigo-400 bg-indigo-400/5",
};

const Tags = () => {
  const { tag } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLetter, setActiveLetter] = useState("All");

  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const filteredTags = useMemo(() => {
    return ALL_TAGS.filter(t => {
      const matchesSearch = t.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLetter = activeLetter === "All" || t.toUpperCase().startsWith(activeLetter);
      return matchesSearch && matchesLetter;
    });
  }, [searchQuery, activeLetter]);

  const tagPosts = useMemo(() => {
    if (!tag) return [];
    return ALL_POSTS.filter(p => p.tags.includes(tag));
  }, [tag]);

  const relatedTags = useMemo(() => {
    if (!tag) return [];
    const currentCat = TAG_METADATA[tag]?.category;
    if (!currentCat) return ALL_TAGS.filter(t => t !== tag).slice(0, 5);
    return ALL_TAGS.filter(t => t !== tag && TAG_METADATA[t]?.category === currentCat).slice(0, 6);
  }, [tag]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Tags Hero Section */}
      <section className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-heading font-extrabold text-white mb-4"
        >
          Explore by <span className="gradient-text">Topic</span>
        </motion.h1>
        <p className="text-slate-gray text-lg max-w-2xl mx-auto">
          Discover specialized technical content across a wide range of web development and software engineering disciplines.
        </p>
      </section>

      {/* Interactive Controls */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        {/* Search & Filter Bar */}
        <div className="flex-grow space-y-6">
           {/* Search Box */}
           <div className="relative glass-card border-white/10 h-14 flex items-center px-6">
              <Search className="text-slate-gray" size={20} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tags..."
                className="flex-grow bg-transparent border-none outline-none text-white px-4 font-medium"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-slate-gray hover:text-white"><X size={18} /></button>
              )}
           </div>

           {/* Alphabet Filter */}
           <div className="flex flex-wrap gap-2 justify-center">
              <button 
                onClick={() => setActiveLetter("All")}
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${activeLetter === "All" ? 'gradient-brand text-deep-code-blue' : 'bg-white/5 text-slate-gray hover:bg-white/10'}`}
              >
                All
              </button>
              {ALPHABET.map(l => (
                <button 
                  key={l}
                  onClick={() => setActiveLetter(l)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${activeLetter === l ? 'gradient-brand text-deep-code-blue' : 'bg-white/5 text-slate-gray hover:bg-white/10'}`}
                >
                  {l}
                </button>
              ))}
           </div>
        </div>
      </div>

      <div className="mb-20">
        <motion.div 
          layout
          className="flex flex-wrap gap-4 justify-center items-center max-w-5xl mx-auto"
        >
          <AnimatePresence>
            {filteredTags.map((t) => {
              const meta = TAG_METADATA[t] || { popularity: 0.5, category: "Web" };
              const isSelected = tag === t;
              
              // Adaptive Sizing (Lines 2337-2340)
              const fontSize = isSelected ? 'text-lg' : meta.popularity > 0.8 ? 'text-base' : 'text-sm';
              const padding = isSelected ? 'px-8 py-3' : meta.popularity > 0.8 ? 'px-6 py-2.5' : 'px-4 py-2';
              const colorClasses = isSelected 
                ? 'bg-electric-cyan border-electric-cyan text-deep-code-blue font-black shadow-[0_0_25px_rgba(100,255,218,0.5)]' 
                : `${CATEGORY_COLORS[meta.category] || 'bg-white/5 border-white/10 text-slate-gray'} hover:border-white/40 hover:text-white`;

              return (
                <motion.div
                  key={t}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ y: -4, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link to={`/tags/${t}`}>
                    <button className={`${padding} ${fontSize} rounded-full border transition-all flex items-center gap-2 group font-bold tracking-tight ${colorClasses}`}>
                      <Hash size={isSelected ? 18 : 14} className={isSelected ? 'text-deep-code-blue' : 'opacity-40 group-hover:opacity-100 transition-opacity'} />
                      {t}
                    </button>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Tag-Specific Results */}
      <AnimatePresence mode="wait">
        {tag && (
          <motion.div 
            key={tag}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="border-t border-white/10 pt-16"
          >
             <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                   <div className="p-4 rounded-2xl bg-gradient-brand shadow-lg">
                      <TagIcon className="text-deep-code-blue" size={32} />
                   </div>
                   <div>
                      <h2 className="text-4xl font-heading font-extrabold text-white mb-1">#{tag}</h2>
                      <p className="text-slate-gray font-medium">Found 24 posts tagged with this topic</p>
                   </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-slate-gray bg-white/5 px-4 py-2 rounded-xl">
                    <LayoutGrid size={16} />
                    <span>View: Grid</span>
                  </div>
                </div>
             </div>

             {/* Related Tags (Line 2321) */}
             {relatedTags.length > 0 && (
               <div className="mb-12 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-gray mb-6">Explore related topics</h3>
                  <div className="flex flex-wrap gap-3">
                     {relatedTags.map(rt => (
                       <Link key={rt} to={`/tags/${rt}`}>
                         <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-gray hover:border-electric-cyan/40 hover:text-white transition-all">
                           #{rt}
                         </button>
                       </Link>
                     ))}
                  </div>
               </div>
             )}

             {/* Results Grid */}
             {tagPosts.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {tagPosts.map(p => <PostCard key={p.id} post={p} />)}
               </div>
             ) : (
               <div className="text-center py-20 glass-card bg-white/[0.02] border-white/5">
                 <p className="text-slate-gray italic mb-4">No content found for this tag yet.</p>
                 <Button onClick={() => navigate('/tags')}>Clear Filter</Button>
               </div>
             )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tags;
