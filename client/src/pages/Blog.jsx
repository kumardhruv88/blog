import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import PostCard from '../components/blog/PostCard';
import BlogSidebar from '../components/blog/BlogSidebar';
import { FileText, X, Filter, ArrowUp, Cpu } from 'lucide-react';
import Button from '../components/common/Button';
import { fetchPosts } from '../services/api';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedDatePreset, setSelectedDatePreset] = useState("All Time");
  const [selectedSort, setSelectedSort] = useState("Latest First");
  const [readingTimeRange, setReadingTimeRange] = useState([0, 60]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data.posts || data);

      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, []);

  // Infinite scroll states
  const [postsToShow, setPostsToShow] = useState(6); // Show 6 posts initially
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef(null);

  // Filter Logic
  const filteredPosts = useMemo(() => {
    let result = posts.filter(post => {
      const categoryName = post.category?.name || "Uncategorized";
      const tagNames = post.tags?.map(t => t.tag.name) || [];

      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tagNames.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(categoryName);
      
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => tagNames.includes(tag));
      
      // Date Filter
      let matchesDate = true;
      const postDate = new Date(post.published_at || post.created_at);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (selectedDatePreset === "Today") {
        matchesDate = postDate.toDateString() === today.toDateString();
      } else if (selectedDatePreset === "This Week") {
        const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        matchesDate = postDate >= firstDayOfWeek;
      } else if (selectedDatePreset === "This Month") {
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        matchesDate = postDate >= firstDayOfMonth;
      } else if (selectedDatePreset === "This Year") {
        const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
        matchesDate = postDate >= firstDayOfYear;
      }
      
      const readTimeVal = post.reading_time || 0;
      const matchesReadingTime = readTimeVal >= readingTimeRange[0] && readTimeVal <= readingTimeRange[1];

      return matchesSearch && matchesCategory && matchesTags && matchesDate && matchesReadingTime;
    });

    // Sort Logic
    return result.sort((a, b) => {
      if (selectedSort === "Latest First") return new Date(b.published_at || b.created_at) - new Date(a.published_at || a.created_at);
      if (selectedSort === "Oldest First") return new Date(a.published_at || a.created_at) - new Date(b.published_at || b.created_at);
      if (selectedSort === "Most Viewed") return (b.views || 0) - (a.views || 0);
      if (selectedSort === "Most Bookmarked") return (b.bookmarks_count || 0) - (a.bookmarks_count || 0);
      if (selectedSort === "Longest Read") return (b.reading_time || 0) - (a.reading_time || 0);
      if (selectedSort === "Shortest Read") return (a.reading_time || 0) - (b.reading_time || 0);
      if (selectedSort === "Alphabetical (A-Z)") return a.title.localeCompare(b.title);
      if (selectedSort === "Alphabetical (Z-A)") return b.title.localeCompare(a.title);
      return 0;
    });
  }, [posts, searchQuery, selectedCategories, selectedTags, selectedDatePreset, selectedSort, readingTimeRange]);

  const [isInfiniteScroll, setIsInfiniteScroll] = useState(true);

  // Infinite Scroll Effect
  useEffect(() => {
    if (!isInfiniteScroll) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && postsToShow < filteredPosts.length) {
          setLoadingMore(true);
          setTimeout(() => { // Simulate network delay
            setPostsToShow(prev => Math.min(prev + 6, filteredPosts.length));
            setLoadingMore(false);
          }, 1000);
        }
      },
      { threshold: 1, rootMargin: '100px' }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [postsToShow, filteredPosts, loadingMore, isInfiniteScroll]);

  // Handle manual load more
  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setPostsToShow(prev => Math.min(prev + 6, filteredPosts.length));
      setLoadingMore(false);
    }, 800);
  };

  const removeCategory = (cat) => setSelectedCategories(prev => prev.filter(c => c !== cat));
  const removeTag = (tag) => setSelectedTags(prev => prev.filter(t => t !== tag));
  const resetDate = () => setSelectedDatePreset("All Time");
  const resetReadingTime = () => setReadingTimeRange([0, 60]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedTags([]);
    setSelectedDatePreset("All Time");
    setReadingTimeRange([0, 60]);
    setSelectedSort("Latest First");
  };

  const hasActiveFilters = 
    searchQuery || 
    selectedCategories.length > 0 || 
    selectedTags.length > 0 || 
    selectedDatePreset !== "All Time" || 
    readingTimeRange[0] > 0 || 
    readingTimeRange[1] < 60;

  // Back to Top button logic
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="min-h-screen pt-32 px-4 text-[#1E293B] uppercase font-black text-center">Synchronizing Matrix Content...</div>;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-heading font-black mb-4">
            Technical <span className="gradient-text">Journal</span>
          </h1>
          <p className="text-slate-gray text-lg max-w-2xl font-medium">
            Exploring the intersection of code, architecture, and engineering.
          </p>
        </div>
        
        {/* Infinite Scroll Toggle & Playground Link */}
        <div className="flex items-center gap-4 bg-black/5 p-2 rounded-2xl border border-black/5">
           <Link 
             to="/playground"
             className="flex items-center gap-2 px-4 py-2 bg-vibrant-purple/10 border border-vibrant-purple/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-vibrant-purple hover:bg-vibrant-purple hover:text-white transition-all group"
           >
             <Cpu size={14} className="group-hover:rotate-12 transition-transform" />
             Code Lab
           </Link>
           <div className="w-px h-6 bg-black/10" />
           <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-gray ml-2">Infinite Scroll</span>
              <button 
                onClick={() => setIsInfiniteScroll(!isInfiniteScroll)}
                className={`w-12 h-6 rounded-full transition-all relative ${isInfiniteScroll ? 'bg-electric-cyan shadow-[0_0_10px_rgba(37,99,235,0.3)]' : 'bg-black/10'}`}
              >
                <motion.div 
                  animate={{ x: isInfiniteScroll ? 24 : 4 }}
                  className={`absolute top-1 w-4 h-4 rounded-full ${isInfiniteScroll ? 'bg-white' : 'bg-slate-gray'}`} 
                />
              </button>
           </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <BlogSidebar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          selectedDatePreset={selectedDatePreset}
          setSelectedDatePreset={setSelectedDatePreset}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          readingTimeRange={readingTimeRange}
          setReadingTimeRange={setReadingTimeRange}
        />

        {/* Main Content Grid */}
        <div className="flex-grow">
          {/* High-Fidelity Active Filters Bar */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 flex overflow-x-auto no-scrollbar pb-2 items-center gap-3"
              >
                <div className="flex-shrink-0 p-2 bg-black/5 rounded-lg border border-black/5">
                   <Filter size={14} className="text-electric-cyan" />
                </div>
                
                {selectedCategories.map(cat => (
                  <motion.button 
                    layout
                    key={cat} onClick={() => removeCategory(cat)}
                    className="flex items-center gap-2 px-4 py-2 bg-electric-cyan/10 text-electric-cyan text-xs font-black uppercase tracking-widest rounded-xl border border-electric-cyan/20 hover:bg-electric-cyan hover:text-deep-code-blue transition-all whitespace-nowrap group"
                  >
                    {cat} <X size={12} className="opacity-40 group-hover:opacity-100" />
                  </motion.button>
                ))}

                {selectedTags.map(tag => (
                  <motion.button 
                    layout
                    key={tag} onClick={() => removeTag(tag)}
                    className="flex items-center gap-2 px-4 py-2 bg-vibrant-purple/10 text-vibrant-purple text-xs font-black uppercase tracking-widest rounded-xl border border-vibrant-purple/20 hover:bg-vibrant-purple hover:text-white transition-all whitespace-nowrap group"
                  >
                    #{tag} <X size={12} className="opacity-40 group-hover:opacity-100" />
                  </motion.button>
                ))}

                <button 
                  onClick={clearAllFilters}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-neon-pink hover:text-pink-400 ml-4 flex-shrink-0"
                >
                  Reset All
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mb-8">
              <span className="text-xs font-black uppercase tracking-widest text-slate-gray">
              Results Found: <span className="text-[#1E293B]">{filteredPosts.length}</span>
            </span>
            <div className="h-px bg-black/5 flex-grow mx-6 hidden sm:block" />
          </div>

          {filteredPosts.length === 0 && !loadingMore ? (
            <div className="flex flex-col items-center justify-center py-32 text-center glass-card-dark rounded-[2.5rem] border-black/5">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-electric-cyan/10 rounded-full blur-[60px]"></div>
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                   <FileText size={40} className="text-electric-cyan opacity-50" />
                </div>
              </div>
              <h3 className="text-3xl font-heading font-black text-[#1E293B] mb-4">No Matches Found</h3>
              <p className="text-slate-gray mb-10 max-w-md mx-auto font-medium">
                We couldn't find any articles matching your current filter selection. Try expanding your search.
              </p>
              
              <button 
                onClick={clearAllFilters}
                className="px-10 py-4 bg-gradient-brand text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-blue-500/20 transform active:scale-95 transition-all"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.slice(0, postsToShow).map((post, index) => (
                 <motion.div
                   layout
                   key={post.id}
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ duration: 0.4, delay: index * 0.05 }}
                 >
                    <PostCard post={post} />
                 </motion.div>
              ))}
              {loadingMore && Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="glass-card-dark p-6 rounded-[2rem] border-black/5 h-[400px] animate-pulse">
                   <div className="w-full h-48 bg-black/5 rounded-2xl mb-6" />
                   <div className="w-24 h-6 bg-black/5 rounded-lg mb-4" />
                   <div className="w-full h-8 bg-black/5 rounded-lg mb-4" />
                   <div className="w-2/3 h-4 bg-black/5 rounded-lg" />
                </div>
              ))}
            </div>
          )}
          
          <AnimatePresence>
            {postsToShow < filteredPosts.length && !loadingMore && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                ref={loadMoreRef}
                className="mt-16 text-center"
              >
                <Button 
                  onClick={handleLoadMore}
                  className="px-12 py-5 rounded-2xl border-black/5 bg-black/5 hover:bg-black/10 text-[#1E293B] font-black uppercase tracking-widest"
                >
                  {isInfiniteScroll ? 'Loading More...' : 'Load More Articles'}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 50 }}
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 w-16 h-16 bg-white border border-black/10 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex items-center justify-center text-electric-cyan hover:text-white z-50 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-brand opacity-0 group-hover:opacity-10 transition-opacity" />
          <ArrowUp size={28} className="relative z-10" />
        </motion.button>
      )}
    </div>
  );
};

export default Blog;