import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Filter, Calendar, Clock, ChevronDown, Check, FileText, Tag, Folder, User, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '../common/Input';
import Badge from '../common/Badge';

const CATEGORIES = [
  { id: 1, name: "AI & ML", count: 12, color: "purple" },
  { id: 2, name: "React", count: 24, color: "cyan" },
  { id: 3, name: "Backend", count: 15, color: "green" },
  { id: 4, name: "DevOps", count: 9, color: "blue" },
  { id: 5, name: "System Design", count: 7, color: "pink" },
];

// Updated TAGS with counts for visual weight
const TAGS = [
  { name: "JavaScript", count: 45 },
  { name: "TypeScript", count: 38 },
  { name: "Next.js", count: 32 },
  { name: "Docker", count: 28 },
  { name: "Kubernetes", count: 25 },
  { name: "AWS", count: 22 },
  { name: "CSS", count: 40 },
  { name: "Tailwind", count: 35 },
  { name: "Performance", count: 18 },
  { name: "Security", count: 15 },
  { name: "Testing", count: 12 },
  { name: "Graph", count: 8 },
  { name: "GraphQL", count: 14 },
  { name: "Redux", count: 20 },
  { name: "Node.js", count: 30 },
  { name: "Database", count: 26 },
  { name: "Serverless", count: 10 },
  { name: "CI/CD", count: 16 },
  { name: "Microservices", count: 19 },
  { name: "WebAssembly", count: 5 },
  { name: "Rust", count: 7 },
  { name: "Python", count: 33 },
];

// Mock Search Suggestions
const SEARCH_SUGGESTIONS = [
  { type: 'recent', text: 'Advanced TypeScript Patterns', icon: Clock },
  { type: 'post', text: 'Understanding React Server Components', icon: FileText },
  { type: 'tag', text: 'Docker', icon: Tag },
  { type: 'category', text: 'DevOps', icon: Folder },
  { type: 'author', text: 'Dhruv', icon: User },
  { type: 'recent', text: 'Mastering Tailwind CSS Grid', icon: Clock },
];

const DATE_PRESETS = ["Today", "This Week", "This Month", "This Year", "Custom Range", "All Time"];
const SORT_OPTIONS = [
  "Latest First", "Oldest First", "Most Viewed", "Most Bookmarked", "Longest Read", "Shortest Read", "Alphabetical (A-Z)", "Alphabetical (Z-A)"
];

const BlogSidebar = ({
  searchQuery,
  setSearchQuery,
  selectedCategories,
  setSelectedCategories,
  selectedTags,
  setSelectedTags,
  selectedDatePreset,
  setSelectedDatePreset,
  selectedSort,
  setSelectedSort,
  readingTimeRange,
  setReadingTimeRange,
  className = ""
}) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const [showAllTags, setShowAllTags] = useState(false);
  
  // Custom Date Range State
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const visibleTags = showAllTags ? TAGS : TAGS.slice(0, 20);
  const hasMoreTags = TAGS.length > 20;

  // Initial max count for tag weighting
  const maxTagCount = Math.max(...TAGS.map(t => t.count));

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ctrl+K Shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Find input inside the searchRef container
        const input = searchRef.current?.querySelector('input');
        if (input) {
          input.focus();
          setShowSuggestions(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleCategory = (catName) => {
    setSelectedCategories(prev => 
      prev.includes(catName) 
        ? prev.filter(c => c !== catName)
        : [...prev, catName]
    );
  };

  const toggleTag = (tagName) => {
    setSelectedTags(prev => 
      prev.includes(tagName) 
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedTags([]);
    setSelectedDatePreset("All Time");
    setSelectedSort("Latest First");
    setReadingTimeRange([0, 60]);
    setCustomStartDate("");
    setCustomEndDate("");
  };

  const hasFilters = searchQuery || selectedCategories.length > 0 || selectedTags.length > 0 || selectedDatePreset !== "All Time" || readingTimeRange[0] > 0 || readingTimeRange[1] < 60;

  const handleMinReadChange = (e) => {
    const value = Math.min(Number(e.target.value), readingTimeRange[1] - 1);
    setReadingTimeRange([value, readingTimeRange[1]]);
  };

  const handleMaxReadChange = (e) => {
    const value = Math.max(Number(e.target.value), readingTimeRange[0] + 1);
    setReadingTimeRange([readingTimeRange[0], value]);
  };

  const SidebarContent = () => (
    <div className="space-y-8">
      {/* 1. Search with Suggestions */}
      <div ref={searchRef} className="relative">
        <div className="relative group">
          <Input 
            icon={Search}
            placeholder="Search posts, tags, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            className="bg-white/60 pr-24 border-black/5 group-focus-within:border-electric-cyan/50 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
            {!searchQuery && (
               <div className="hidden lg:flex items-center gap-1 px-2 py-1 bg-black/5 border border-black/10 rounded-md shadow-inner">
                  <span className="text-[10px] font-black font-mono text-slate-gray">CTRL</span>
                  <span className="text-[10px] font-black font-mono text-slate-gray">+</span>
                  <span className="text-[10px] font-black font-mono text-slate-gray">K</span>
               </div>
            )}
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="text-slate-gray hover:text-[#1E293B] pointer-events-auto p-1 hover:bg-black/5 rounded"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Robust Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute top-full left-0 right-0 mt-3 bg-white border border-black/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-30 overflow-hidden"
            >
              <div className="p-4 max-h-[400px] overflow-y-auto no-scrollbar">
                {/* Categorized Suggestions */}
                <div className="space-y-6">
                  {/* Recent Searches */}
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-gray mb-3 flex items-center gap-2">
                       <Clock size={12} /> Recent Searches
                    </h4>
                    <div className="grid grid-cols-1 gap-1">
                       {SEARCH_SUGGESTIONS.filter(s => s.type === 'recent').map((item, i) => (
                         <button 
                           key={i} 
                           onClick={() => { setSearchQuery(item.text); setShowSuggestions(false); }}
                           className="text-left py-2 px-3 rounded-xl hover:bg-black/5 text-sm text-slate-gray hover:text-[#1E293B] transition-all flex items-center justify-between group"
                         >
                           {item.text}
                           <ArrowUp size={12} className="opacity-0 group-hover:opacity-40 -rotate-45" />
                         </button>
                       ))}
                    </div>
                  </div>

                  {/* Top Categories */}
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-gray mb-3 flex items-center gap-2">
                       <Folder size={12} /> Categories
                    </h4>
                    <div className="flex flex-wrap gap-2">
                       {CATEGORIES.slice(0, 3).map(cat => (
                         <button 
                           key={cat.id} 
                           onClick={() => { toggleCategory(cat.name); setShowSuggestions(false); }}
                           className="px-3 py-1.5 bg-black/5 border border-black/5 rounded-lg text-xs font-bold hover:bg-electric-cyan/10 hover:text-electric-cyan hover:border-electric-cyan/30 transition-all"
                         >
                           {cat.name}
                         </button>
                       ))}
                    </div>
                  </div>

                  {/* Quick Topics */}
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-gray mb-3 flex items-center gap-2">
                       <Tag size={12} /> Popular Topics
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                       {TAGS.slice(0, 4).map(tag => (
                         <button 
                           key={tag.name} 
                           onClick={() => { toggleTag(tag.name); setShowSuggestions(false); }}
                           className="flex items-center gap-2 p-2 rounded-xl hover:bg-black/5 text-xs text-slate-gray hover:text-[#1E293B] transition-all"
                         >
                           <div className="w-1.5 h-1.5 rounded-full bg-vibrant-purple" />
                           {tag.name}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggestions Footer */}
              <div className="p-3 bg-black/5 border-t border-black/5 flex items-center justify-between text-[10px] text-slate-gray font-bold uppercase tracking-widest px-6">
                 <span>{searchQuery ? 'Searching...' : 'Search Everything'}</span>
                 <div className="flex gap-4">
                    <span>↑↓ Select</span>
                    <span>↵ Enter</span>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Sort Options */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-gray mb-4">Sort By</h3>
        <div className="relative group">
           <select 
             value={selectedSort}
             onChange={(e) => setSelectedSort(e.target.value)}
             className="w-full bg-[#112240]/50 border border-black/10 rounded-lg py-3 px-4 text-[#1E293B] appearance-none focus:ring-1 focus:ring-electric-cyan focus:border-electric-cyan outline-none cursor-pointer"
           >
             {SORT_OPTIONS.map(opt => (
               <option key={opt} value={opt} className="bg-[#F5F0EB]">{opt}</option>
             ))}
           </select>
           <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-gray pointer-events-none" size={16} />
        </div>
      </div>

      {/* 3. Categories */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-gray mb-4">Categories</h3>
        <div className="space-y-2">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategories.includes(cat.name);
            return (
              <label 
                key={cat.id}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all group border ${
                  isSelected ? 'border-electric-cyan bg-electric-cyan/10 text-electric-cyan' : 'border-black/10 hover:border-black/20 hover:bg-black/5 text-slate-gray'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleCategory(cat.name)}
                  className="hidden" 
                />
                <div className={`w-4 h-4 rounded-md flex items-center justify-center transition-all flex-shrink-0 ${
                  isSelected ? 'bg-electric-cyan border-electric-cyan' : 'border-white/30 group-hover:border-white'
                }`}>
                  {isSelected && <Check size={12} className="text-[#1E293B]" />}
                </div>
                <div className="flex-grow flex items-center gap-2">
                  <span className={`w-1 h-6 rounded-full transition-colors ${
                    isSelected ? 'bg-electric-cyan' : `bg-${cat.color}-500/50 group-hover:bg-${cat.color}-400`
                  }`} />
                  <span className="font-medium">{cat.name}</span>
                </div>
                <span className="text-xs opacity-60">({cat.count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Tags with Visual Weight */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-gray mb-4">Popular Tags</h3>
        <div className="flex flex-wrap gap-2 items-center">
          {visibleTags.map(tag => {
             const isSelected = selectedTags.includes(tag.name);
             // Calculate font size relative to max count (min 0.75rem, max 1.1rem)
             const weight = (tag.count / maxTagCount); 
             const fontSize = 0.75 + (weight * 0.4); 
             const opacity = 0.6 + (weight * 0.4);

             return (
               <button
                 key={tag.name}
                 onClick={() => toggleTag(tag.name)}
                 className={`transition-all duration-300 rounded-md px-2 py-1 ${
                    isSelected 
                      ? 'bg-gradient-primary text-[#1E293B] font-bold shadow-[0_0_10px_rgba(37,99,235,0.3)]' 
                      : 'bg-transparent text-slate-gray hover:text-[#1E293B] hover:bg-black/5'
                 }`}
                 style={{ 
                   fontSize: `${fontSize}rem`,
                   opacity: isSelected ? 1 : opacity
                 }}
               >
                 #{tag.name}
               </button>
             );
          })}
        </div>
        {hasMoreTags && (
          <button 
            onClick={() => setShowAllTags(prev => !prev)}
            className="mt-4 text-electric-cyan text-sm hover:underline"
          >
            {showAllTags ? "Show less tags" : `Show all ${TAGS.length} tags`}
          </button>
        )}
      </div>

      {/* 5. Date Range with Custom Picker */}
      <div>
         <h3 className="text-sm font-bold uppercase tracking-wider text-slate-gray mb-4">Published Date</h3>
         <div className="space-y-2">
            {DATE_PRESETS.map(preset => (
              <div key={preset}>
                <label className="flex items-center gap-3 cursor-pointer group">
                   <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                     selectedDatePreset === preset ? 'border-electric-cyan' : 'border-white/30 group-hover:border-white'
                   }`}>
                     {selectedDatePreset === preset && <div className="w-2 h-2 rounded-full bg-electric-cyan" />}
                   </div>
                   <input 
                     type="radio" 
                     name="date-preset" 
                     className="hidden" 
                     checked={selectedDatePreset === preset}
                     onChange={() => setSelectedDatePreset(preset)}
                   />
                   <span className={`text-sm ${selectedDatePreset === preset ? 'text-[#1E293B] font-medium' : 'text-slate-gray group-hover:text-[#1E293B]'}`}>
                     {preset}
                   </span>
                </label>
                
                {/* Custom Date Inputs */}
                {preset === "Custom Range" && selectedDatePreset === "Custom Range" && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="ml-7 mt-2 space-y-2 overflow-hidden"
                  >
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-xs text-slate-gray block mb-1">Start</label>
                        <input 
                          type="date" 
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                          className="w-full bg-[#F5F0EB] border border-black/10 rounded px-2 py-1 text-xs text-[#1E293B] focus:border-electric-cyan outline-none"
                        />
                      </div>
                      <div className="flex-1">
                         <label className="text-xs text-slate-gray block mb-1">End</label>
                         <input 
                           type="date" 
                           value={customEndDate}
                           onChange={(e) => setCustomEndDate(e.target.value)}
                           className="w-full bg-[#F5F0EB] border border-black/10 rounded px-2 py-1 text-xs text-[#1E293B] focus:border-electric-cyan outline-none"
                         />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
         </div>
      </div>

      {/* 6. Reading Time Dual Slider */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-gray mb-4">Reading Time</h3>
        <div className="px-1">
          <div className="flex gap-2 mb-3">
            <button 
              onClick={() => setReadingTimeRange([0, 5])}
              className="px-2 py-1 text-xs border border-black/10 rounded hover:bg-black/5 hover:text-[#1E293B] text-slate-gray transition-colors flex-1"
            >
              Quick
            </button>
            <button 
              onClick={() => setReadingTimeRange([5, 15])}
              className="px-2 py-1 text-xs border border-black/10 rounded hover:bg-black/5 hover:text-[#1E293B] text-slate-gray transition-colors flex-1"
            >
              Medium
            </button>
            <button 
              onClick={() => setReadingTimeRange([15, 60])}
              className="px-2 py-1 text-xs border border-black/10 rounded hover:bg-black/5 hover:text-[#1E293B] text-slate-gray transition-colors flex-1"
            >
              Deep
            </button>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-gray mb-4">
            <span className="bg-black/5 px-2 py-1 rounded">{readingTimeRange[0]} min</span>
            <span className="bg-black/5 px-2 py-1 rounded">{readingTimeRange[1]} min</span>
          </div>
          
          <div className="relative h-2 bg-black/10 rounded-full">
            {/* Active Range Track */}
            <div 
              className="absolute h-full bg-gradient-brand rounded-full pointer-events-none"
              style={{
                left: `${(readingTimeRange[0] / 60) * 100}%`,
                right: `${100 - (readingTimeRange[1] / 60) * 100}%`
              }}
            />
            
            {/* Min Slider */}
            <input 
              type="range" 
              min="0" max="60" 
              value={readingTimeRange[0]} 
              onChange={handleMinReadChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              style={{ pointerEvents: 'none' }} // Trick to allow click through? styling dual sliders often requires pointer-events manipulation or specific library
            />
            {/* 
              Note: Implementing a true dual slider with just HTML inputs is tricky because they overlap. 
              Below is a simplified implementation where we assume the user interacts with two visible sliders or specific UI.
              A robust cross-browser solution usually requires custom div thumbs.
              For this implementation, I will overlay them and use pointer-events trick logic which is common in CSS-only sliders.
            */}
             <input 
              type="range" 
              min="0" max="60" 
              value={readingTimeRange[0]} 
              onChange={handleMinReadChange}
              className="absolute w-full h-2 opacity-0 cursor-pointer pointer-events-auto z-20"
              style={{ zIndex: readingTimeRange[0] > 30 ? 30 : 20 }} // Bring to front if overlapping
            />
            <input 
              type="range" 
              min="0" max="60" 
              value={readingTimeRange[1]} 
              onChange={handleMaxReadChange}
              className="absolute w-full h-2 opacity-0 cursor-pointer pointer-events-auto z-20"
            />
            
            {/* Visual Thumbs */}
             <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-electric-cyan rounded-full shadow-lg pointer-events-none z-10"
              style={{ left: `${(readingTimeRange[0] / 60) * 100}%`, transform: 'translate(-50%, -50%)' }}
            />
             <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-electric-cyan rounded-full shadow-lg pointer-events-none z-10"
              style={{ left: `${(readingTimeRange[1] / 60) * 100}%`, transform: 'translate(-50%, -50%)' }}
            />
          </div>
        </div>
      </div>

      {/* Clear Filters Action */}
      <AnimatePresence>
        {hasFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <button 
              onClick={clearFilters}
              className="flex items-center gap-2 text-sm text-neon-pink hover:text-pink-400 w-full justify-center p-3 border border-neon-pink/20 rounded-lg hover:bg-neon-pink/10 transition-colors transform active:scale-95"
            >
              <RotateCcw size={16} /> Clear All Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block w-80 flex-shrink-0 ${className}`}>
        <div className="sticky top-28">
           <SidebarContent />
        </div>
      </aside>

      {/* Mobile Floating Filter Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileFiltersOpen(true)}
          className="p-4 bg-gradient-brand text-[#1E293B] rounded-2xl shadow-[0_10px_30px_rgba(100,255,218,0.4)] flex items-center gap-2 font-black uppercase tracking-widest text-xs"
        >
          <Filter size={18} />
          {hasFilters ? (
            <span className="flex items-center justify-center w-5 h-5 bg-deep-code-blue text-electric-cyan rounded-full text-[10px]">
              {selectedCategories.length + selectedTags.length + (searchQuery ? 1 : 0)}
            </span>
          ) : "Filters"}
        </motion.button>
      </div>

      {/* Mobile Filters Toggle (Inline) */}
      <div className="lg:hidden mb-6">
        <button 
          onClick={() => setMobileFiltersOpen(true)}
          className="w-full flex items-center justify-between p-4 bg-white/70 backdrop-blur-md border border-black/10 rounded-xl text-[#1E293B] hover:border-electric-cyan/30 transition-all transition-colors"
        >
          <span className="flex items-center gap-2">
            <Filter size={18} className="text-electric-cyan" /> Quick Filters
          </span>
          {hasFilters && (
            <Badge variant="gradient" size="sm">
              {selectedCategories.length + selectedTags.length + (searchQuery ? 1 : 0)} Active
            </Badge>
          )}
        </button>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-deep-code-blue/90 backdrop-blur-sm"
              onClick={() => setMobileFiltersOpen(false)}
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute left-0 top-0 bottom-0 w-full max-w-[320px] bg-[#FEFBF6]/95 backdrop-blur-xl border-r border-black/10 p-8 shadow-2xl overflow-y-auto no-scrollbar z-50"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-heading font-bold">Filters</h2>
                <button 
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 text-slate-gray hover:text-[#1E293B] bg-black/5 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              
              <SidebarContent />
              
              <div className="mt-8 pt-6 border-t border-black/10">
                <button 
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full py-3 bg-gradient-to-r from-electric-cyan to-vibrant-purple text-[#1E293B] font-bold rounded-lg"
                >
                  Show Results
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BlogSidebar;