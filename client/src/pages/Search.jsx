import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, Clock, FileText, Tag as TagIcon, Folder, User, ChevronRight, Filter, Bookmark, Eye, Calendar, Clock as ClockIcon, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import PostCard from '../components/blog/PostCard';
import { fetchPosts } from '../services/api';

const TRENDING_SEARCHES = ["Micro-frontend Architecture", "React Server Components", "Deployment with Docker", "CSS Grid Mastery", "AI in DevOps"];

const Search = () => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState(["Tailwind CSS", "React Server Components"]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Relevance");
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    const getInitialPosts = async () => {
      try {
        setLoading(true);
        const data = await fetchPosts();
        setAllPosts(data.posts || data);

      } catch (error) {
        console.error('Error fetching initial posts for search:', error);
      } finally {
        setLoading(false);
      }
    };
    getInitialPosts();
    inputRef.current?.focus();
  }, []);

  const suggestions = useMemo(() => {
    if (!query.trim()) return { posts: [], tags: [], categories: [], authors: [] };
    
    const lowerQuery = query.toLowerCase();
    
    return {
      posts: allPosts.filter(p => p.title.toLowerCase().includes(lowerQuery)).slice(0, 3),
      tags: Array.from(new Set(allPosts.flatMap(p => p.tags?.map(t => t.tag.name) || []))).filter(t => t.toLowerCase().includes(lowerQuery)).slice(0, 5),
      categories: Array.from(new Set(allPosts.map(p => p.category?.name))).filter(c => c?.toLowerCase().includes(lowerQuery)).slice(0, 3),
      authors: Array.from(new Set(allPosts.map(p => p.author?.name))).filter(a => a?.toLowerCase().includes(lowerQuery)).slice(0, 3)
    };
  }, [query, allPosts]);

  const totalSuggestions = useMemo(() => {
    if (!query.trim()) return [];
    return [
      ...suggestions.posts.map(p => ({ type: 'post', data: p })),
      ...suggestions.tags.map(t => ({ type: 'tag', data: t })),
      ...suggestions.categories.map(c => ({ type: 'category', data: c })),
      ...suggestions.authors.map(a => ({ type: 'author', data: a }))
    ];
  }, [suggestions]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, totalSuggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0) {
        const item = totalSuggestions[selectedIndex];
        if (item.type === 'post') window.location.href = `/blog/${item.data.slug}`;
        else handleSearch(item.data.name || item.data);
      } else {
        handleSearch(query);
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (typeof searchTerm !== 'string') return;
    setQuery(searchTerm);
    setSelectedIndex(-1);
    if (!recentSearches.includes(searchTerm)) {
      setRecentSearches([searchTerm, ...recentSearches].slice(0, 5));
    }
  };

  const removeRecent = (term) => {
    setRecentSearches(recentSearches.filter(t => t !== term));
  };

  const highlightMatch = (text, match) => {
    if (!match) return text;
    const parts = text.split(new RegExp(`(${match})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === match.toLowerCase() 
        ? <span key={i} className="text-electric-cyan font-bold bg-electric-cyan/10 px-0.5 rounded">{part}</span> 
        : part
    );
  };

  const results = useMemo(() => {
    if (!query.trim()) return [];
    let filtered = allPosts.filter(p => {
      const tagNames = p.tags?.map(t => t.tag.name) || [];
      const categoryName = p.category?.name || "";
      return p.title.toLowerCase().includes(query.toLowerCase()) || 
             p.excerpt?.toLowerCase().includes(query.toLowerCase()) ||
             tagNames.some(t => t.toLowerCase().includes(query.toLowerCase())) ||
             categoryName.toLowerCase().includes(query.toLowerCase())
    });

    if (activeFilter !== "All") {
      filtered = filtered.filter(p => p.category?.name === activeFilter);
    }

    if (selectedSort === "Latest") {
      filtered = [...filtered].sort((a, b) => new Date(b.published_at || b.created_at) - new Date(a.published_at || a.created_at));
    } else if (selectedSort === "Most Viewed") {
      filtered = [...filtered].sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    return filtered;
  }, [query, activeFilter, selectedSort, allPosts]);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;
  const totalPages = Math.ceil(results.length / postsPerPage);
  const currentResults = results.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  const categoriesAvailable = useMemo(() => {
    return ["All", ...new Set(allPosts.map(p => p.category?.name).filter(Boolean))];
  }, [allPosts]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="relative z-50 mb-16 max-w-[700px] mx-auto">
        <motion.div className={clsx("relative glass-card-dark transition-all duration-500 overflow-hidden", isFocused ? "ring-2 ring-electric-cyan/50 shadow-[0_0_30px_rgba(100,255,218,0.2)]" : "border-black/10")}>
          <div className="flex items-center h-16 px-6">
            <SearchIcon className={clsx("transition-colors duration-300", isFocused ? "text-electric-cyan" : "text-slate-gray")} size={24} />
            <input 
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search posts, tags, categories, authors..."
              className="flex-grow bg-transparent border-none outline-none text-xl text-[#1E293B] px-4 placeholder:text-slate-gray/50 font-medium"
            />
            {query && <button onClick={() => { setQuery(""); setCurrentPage(1); }} className="text-slate-gray hover:text-[#1E293B] p-1"><X size={20} /></button>}
          </div>

          <AnimatePresence>
            {isFocused && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-black/10 bg-[#F5F0EB]/95 backdrop-blur-xl overflow-hidden">
                {!query.trim() ? (
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <section>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-gray/60 font-black mb-6 flex items-center gap-2"><Clock size={12} className="text-electric-cyan" /> Recent Searches</p>
                        <div className="space-y-3">
                          {recentSearches.map(term => (
                            <div key={term} className="flex items-center justify-between group cursor-pointer" onClick={() => handleSearch(term)}>
                              <div className="flex items-center gap-3 text-slate-gray group-hover:text-[#1E293B] transition-colors">
                                <ChevronRight size={14} className="text-electric-cyan/50 group-hover:text-electric-cyan" />
                                <span className="text-sm font-medium">{term}</span>
                              </div>
                              <button onClick={(e) => { e.stopPropagation(); removeRecent(term); }} className="text-slate-gray/30 hover:text-neon-pink opacity-0 group-hover:opacity-100 transition-all"><X size={14} /></button>
                            </div>
                          ))}
                        </div>
                      </section>
                      <section>
                         <p className="text-[10px] uppercase tracking-[0.2em] text-slate-gray/60 font-black mb-6 flex items-center gap-2"><TrendingUp size={12} className="text-vibrant-purple" /> Trending Now</p>
                         <div className="flex flex-wrap gap-2">{TRENDING_SEARCHES.map(term => (<button key={term} onClick={() => handleSearch(term)} className="px-4 py-2 rounded-xl bg-black/5 border border-black/5 text-xs text-slate-gray hover:border-vibrant-purple/50 hover:text-[#1E293B] transition-all flex items-center gap-2">{term}</button>))}</div>
                      </section>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 space-y-8 max-h-[500px] overflow-y-auto no-scrollbar">
                    {suggestions.posts.length > 0 && (
                      <section>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-gray/60 font-black mb-4 flex items-center gap-2"><FileText size={12} className="text-electric-cyan" /> Posts</p>
                        <div className="space-y-2">
                          {suggestions.posts.map((post, idx) => (
                            <Link key={post.id} to={`/blog/${post.slug}`} className={`block p-3 rounded-xl transition-all group ${selectedIndex === idx ? 'bg-black/10 ring-1 ring-electric-cyan/30' : 'hover:bg-black/5'}`}>
                              <h4 className="text-[#1E293B] font-bold group-hover:text-electric-cyan transition-colors">{highlightMatch(post.title, query)}</h4>
                              <p className="text-[11px] text-slate-gray line-clamp-1 mt-0.5">{post.excerpt}</p>
                            </Link>
                          ))}
                        </div>
                      </section>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       {suggestions.authors.length > 0 && (
                        <section>
                           <p className="text-[10px] uppercase tracking-[0.2em] text-slate-gray/60 font-black mb-4">Authors</p>
                           <div className="space-y-2">{suggestions.authors.map((author, idx) => {
                                const realIdx = suggestions.posts.length + suggestions.tags.length + suggestions.categories.length + idx;
                                return (<button key={author} onClick={() => handleSearch(author)} className={`flex items-center gap-3 w-full p-2 rounded-xl transition-all ${selectedIndex === realIdx ? 'bg-black/10 ring-1 ring-electric-cyan/30' : 'hover:bg-black/5'}`}><div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-[10px] font-black text-[#1E293B] uppercase tracking-tighter">{author.slice(0, 2)}</div><span className="text-xs font-bold text-[#1E293B]">{author}</span></button>);
                              })}</div>
                        </section>
                      )}
                      {suggestions.tags.length > 0 && (
                        <section className="md:col-span-2">
                           <p className="text-[10px] uppercase tracking-[0.2em] text-slate-gray/60 font-black mb-4">Topics & Categories</p>
                           <div className="flex flex-wrap gap-2">{suggestions.tags.map((tag, idx) => {
                                const realIdx = suggestions.posts.length + idx;
                                return (<button key={tag} onClick={() => handleSearch(tag)} className={`px-3 py-1.5 rounded-full border text-[11px] font-bold transition-all flex items-center gap-2 ${selectedIndex === realIdx ? 'bg-electric-cyan text-[#1E293B] border-electric-cyan shadow-lg' : 'bg-black/5 border-black/5 text-slate-gray hover:border-electric-cyan/30 hover:text-[#1E293B]'}`}>#{tag}</button>);
                              })}
                              {suggestions.categories.map((cat, idx) => {
                                const realIdx = suggestions.posts.length + suggestions.tags.length + idx;
                                return (<button key={cat} onClick={() => handleSearch(cat)} className={`px-3 py-1.5 rounded-full border text-[11px] font-bold transition-all flex items-center gap-2 ${selectedIndex === realIdx ? 'bg-vibrant-purple text-[#1E293B] border-vibrant-purple shadow-lg' : 'bg-black/5 border-black/5 text-slate-gray hover:border-vibrant-purple/30 hover:text-[#1E293B]'}`}><Folder size={12} /> {cat}</button>);
                              })}</div>
                        </section>
                      )}
                    </div>
                  </div>
                )}
                <div className="p-4 bg-black/5 border-t border-black/10 flex justify-between items-center text-[10px] font-bold text-slate-gray/50 uppercase tracking-widest"><span>Arrow Keys to navigate</span><span>Esc to close</span></div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {query && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-black/10 pb-8">
              <div>
                <h3 className="text-2xl font-bold text-[#1E293B] mb-1">Found <span className="gradient-text">{results.length} results</span> for "{query}"</h3>
                <div className="flex items-center gap-3 text-xs text-slate-gray"><span className="flex items-center gap-1"><ClockIcon size={12} /> Real-time results</span></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex bg-black/5 p-1 rounded-xl border border-black/5">
                   {categoriesAvailable.slice(0, 4).map(tab => (<button key={tab} onClick={() => { setActiveFilter(tab); setCurrentPage(1); }} className={clsx("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", activeFilter === tab ? "bg-electric-cyan text-[#1E293B] shadow-lg" : "text-slate-gray hover:text-[#1E293B]")}>{tab}</button>))}
                </div>
                <select value={selectedSort} onChange={(e) => { setSelectedSort(e.target.value); setCurrentPage(1); }} className="bg-black/5 border border-black/10 rounded-xl px-4 py-2 text-xs text-slate-gray font-bold outline-none focus:border-electric-cyan transition-all cursor-pointer">
                  <option>Relevance</option><option>Latest</option><option>Most Viewed</option>
                </select>
              </div>
            </div>

            {results.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{currentResults.map((post) => (<motion.div key={post.id}><PostCard post={post} /></motion.div>))}</div>
                {totalPages > 1 && (<div className="flex justify-center items-center gap-4 mt-12 pt-8 border-t border-black/5">
                    <Button variant="ghost" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="px-6 border-black/10 text-[#1E293B] disabled:opacity-30">Previous</Button>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-gray">Page <span className="text-[#1E293B]">{currentPage}</span> of {totalPages}</span>
                    <Button variant="ghost" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="px-6 border-black/10 text-[#1E293B] disabled:opacity-30">Next</Button>
                  </div>)}
              </>
            ) : (
              <div className="py-20 text-center"><div className="inline-flex p-6 rounded-full bg-black/5 border border-black/10 mb-6"><SearchIcon size={48} className="text-slate-gray opacity-30" /></div><h4 className="text-xl font-bold text-[#1E293B] mb-2">No results found for "{query}"</h4><p className="text-slate-gray">Try adjusting your keywords or checking for spelling errors.</p></div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const clsx = (...classes) => classes.filter(Boolean).join(' ');

export default Search;
