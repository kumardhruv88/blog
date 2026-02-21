import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, ExternalLink, Calendar, Users, ChevronDown, Loader2, FileText, ArrowRight, X, Download, GraduationCap, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import curatedPapers from '../data/researchPapers';

const CATEGORIES = [
  { label: 'All', query: '' },
  { label: 'Computer Science', query: 'computer science' },
  { label: 'AI & Machine Learning', query: 'artificial intelligence machine learning' },
  { label: 'Data Science', query: 'data science' },
  { label: 'Cybersecurity', query: 'cybersecurity' },
  { label: 'Physics', query: 'physics' },
  { label: 'Mathematics', query: 'mathematics' },
  { label: 'Engineering', query: 'engineering' },
  { label: 'Biology', query: 'biology' },
  { label: 'Chemistry', query: 'chemistry' },
];

const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Recency', value: 'recency' },
];

// Use the free CORE API for academic papers
const CORE_API_BASE = 'https://api.core.ac.uk/v3';

const ResearchPapers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(0);
  const [apiPapers, setApiPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');
  const [isApiMode, setIsApiMode] = useState(false);
  const searchInputRef = useRef(null);
  const RESULTS_PER_PAGE = 10;

  // Filter curated papers by category
  const filteredCurated = useMemo(() => {
    const catLabel = CATEGORIES[activeCategory].label;
    if (catLabel === 'All') return curatedPapers;
    return curatedPapers.filter(p => p.category === catLabel);
  }, [activeCategory]);

  const papers = isApiMode ? apiPapers : filteredCurated;

  // Debounced search
  const debounceTimer = useRef(null);

  const searchPapers = useCallback(async (query, categoryQuery, pageNum = 1, sort = 'relevance') => {
    const fullQuery = [query, categoryQuery].filter(Boolean).join(' ');
    if (!fullQuery.trim()) return;

    setLoading(true);
    setError(null);
    setIsApiMode(true);

    try {
      const offset = (pageNum - 1) * RESULTS_PER_PAGE;
      const params = new URLSearchParams({
        q: fullQuery,
        limit: RESULTS_PER_PAGE.toString(),
        offset: offset.toString(),
      });

      if (sort === 'recency') {
        params.append('sort', 'publishedDate:desc');
      }

      const response = await fetch(`${CORE_API_BASE}/search/works?${params}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Search failed (${response.status})`);
      }

      const data = await response.json();
      setApiPapers(data.results || []);
      setTotalResults(data.totalHits || 0);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to fetch research papers. Please try again.');
      setApiPapers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback((e) => {
    e?.preventDefault();
    setPage(1);
    searchPapers(searchQuery, CATEGORIES[activeCategory].query, 1, sortBy);
  }, [searchQuery, activeCategory, sortBy, searchPapers]);

  const handleCategoryChange = (index) => {
    setActiveCategory(index);
    setPage(1);
    if (searchQuery) {
      searchPapers(searchQuery, CATEGORIES[index].query, 1, sortBy);
    } else {
      setIsApiMode(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    searchPapers(searchQuery, CATEGORIES[activeCategory].query, newPage, sortBy);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setPage(1);
    searchPapers(searchQuery, CATEGORIES[activeCategory].query, 1, newSort);
  };

  // Live search debounce
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (searchQuery.length >= 3) {
      debounceTimer.current = setTimeout(() => {
        setPage(1);
        searchPapers(searchQuery, CATEGORIES[activeCategory].query, 1, sortBy);
      }, 600);
    }
    return () => clearTimeout(debounceTimer.current);
  }, [searchQuery]);

  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatAuthors = (authors) => {
    if (!authors || authors.length === 0) return 'Unknown Authors';
    const names = authors.slice(0, 3).map(a => typeof a === 'string' ? a : (a.name || 'Unknown'));
    if (authors.length > 3) names.push(`+${authors.length - 3} more`);
    return names.join(', ');
  };

  const getYear = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).getFullYear() || '';
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-vibrant-purple rounded-full text-xs font-bold uppercase tracking-widest mb-6">
          <GraduationCap size={14} />
          Academic Research
        </div>
        <h1 className="text-5xl md:text-7xl font-heading font-black mb-6 text-[#1E293B]">
          Research <span className="gradient-text">Papers</span>
        </h1>
        <p className="text-lg text-slate-gray max-w-2xl mx-auto">
          Browse our curated collection of landmark papers or search millions more from CORE — the world's largest open access research aggregator.
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-3xl mx-auto mb-12"
      >
        <form onSubmit={handleSearch} className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-5 text-slate-gray" size={20} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for research papers, topics, authors..."
              className="w-full bg-white border border-black/10 rounded-2xl py-5 pl-14 pr-32 text-[#1E293B] placeholder-slate-gray/50 focus:outline-none focus:border-electric-cyan focus:ring-2 focus:ring-electric-cyan/10 transition-all text-base shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 px-6 py-3 bg-gradient-to-r from-electric-cyan to-vibrant-purple text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95"
            >
              Search
            </button>
          </div>
        </form>
      </motion.div>

      {/* Category Pills */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap justify-center gap-2 mb-8"
      >
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat.label}
            onClick={() => handleCategoryChange(i)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeCategory === i
                ? 'bg-gradient-to-r from-electric-cyan to-vibrant-purple text-white shadow-md shadow-blue-500/20'
                : 'bg-white border border-black/5 text-slate-gray hover:text-[#1E293B] hover:border-black/20'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </motion.div>

      {/* Results Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between mb-8 max-w-5xl mx-auto"
      >
        <span className="text-sm text-slate-gray">
          {loading ? 'Searching...' : isApiMode ? `${totalResults.toLocaleString()} results found` : `${papers.length} curated papers`}
        </span>
        {isApiMode && (
          <div className="flex items-center gap-2">
            <button onClick={() => { setIsApiMode(false); setSearchQuery(''); }} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-50 transition-all">✕ Clear search</button>
            <span className="text-xs text-slate-gray uppercase tracking-widest font-bold">Sort:</span>
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleSortChange(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  sortBy === opt.value
                    ? 'bg-electric-cyan/10 text-electric-cyan'
                    : 'text-slate-gray hover:text-[#1E293B]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="max-w-5xl mx-auto space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-black/5 animate-pulse">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-black/5 rounded-xl" />
                <div className="flex-grow space-y-3">
                  <div className="h-5 bg-black/5 rounded-lg w-3/4" />
                  <div className="h-4 bg-black/5 rounded-lg w-1/2" />
                  <div className="h-3 bg-black/5 rounded-lg w-full" />
                  <div className="h-3 bg-black/5 rounded-lg w-5/6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto text-center py-16">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <X className="text-red-500" size={24} />
          </div>
          <h3 className="text-xl font-bold text-[#1E293B] mb-2">Something went wrong</h3>
          <p className="text-slate-gray mb-6">{error}</p>
          <Button onClick={handleSearch}>Try Again</Button>
        </motion.div>
      )}

      {/* Results */}
      {!loading && !error && papers.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-5xl mx-auto space-y-4"
        >
          {papers.map((paper, index) => (
            <motion.div
              key={paper.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div 
                onClick={() => setSelectedPaper(paper)}
                className="bg-white rounded-2xl p-6 border border-black/5 hover:border-electric-cyan/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all cursor-pointer group"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center group-hover:from-blue-100 group-hover:to-purple-100 transition-colors">
                    <FileText className="text-electric-cyan" size={20} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-base font-bold text-[#1E293B] mb-1 group-hover:text-electric-cyan transition-colors line-clamp-2">
                      {paper.title || 'Untitled Paper'}
                    </h3>
                    <div className="flex items-center gap-3 mb-3 text-xs text-slate-gray">
                      {paper.authors && paper.authors.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Users size={12} />
                          {formatAuthors(paper.authors)}
                        </span>
                      )}
                      {(paper.publishedDate || paper.year) && (
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {paper.year || getYear(paper.publishedDate)}
                        </span>
                      )}
                      {paper.publisher && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-black/5 rounded-md">
                          {typeof paper.publisher === 'string' ? paper.publisher : paper.publisher.name || ''}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-gray line-clamp-2">
                      {truncateText(paper.abstract || paper.description || 'No abstract available.', 250)}
                    </p>
                  </div>
                  <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="text-electric-cyan" size={20} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && !error && papers.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="text-electric-cyan" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-[#1E293B] mb-3">No papers found</h3>
          <p className="text-slate-gray max-w-md mx-auto">
            Try adjusting your search terms or selecting a different category to find relevant research papers.
          </p>
        </motion.div>
      )}

      {/* Pagination (API mode only) */}
      {!loading && isApiMode && papers.length > 0 && totalPages > 1 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2 mt-12"
        >
          <button
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="w-10 h-10 rounded-xl border border-black/10 flex items-center justify-center text-slate-gray hover:text-[#1E293B] hover:border-black/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                  page === pageNum
                    ? 'bg-gradient-to-r from-electric-cyan to-vibrant-purple text-white shadow-md'
                    : 'border border-black/10 text-slate-gray hover:text-[#1E293B] hover:border-black/20'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="w-10 h-10 rounded-xl border border-black/10 flex items-center justify-center text-slate-gray hover:text-[#1E293B] hover:border-black/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </motion.div>
      )}

      {/* Paper Detail Modal */}
      <AnimatePresence>
        {selectedPaper && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedPaper(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl border border-black/10 w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-black/5 flex items-start justify-between gap-4 flex-shrink-0">
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {(selectedPaper.publishedDate || selectedPaper.year) && (
                      <span className="px-2 py-1 bg-blue-50 text-electric-cyan rounded-lg text-xs font-semibold">
                        {selectedPaper.year || getYear(selectedPaper.publishedDate)}
                      </span>
                    )}
                    {selectedPaper.language && (
                      <span className="px-2 py-1 bg-purple-50 text-vibrant-purple rounded-lg text-xs font-semibold uppercase">
                        {selectedPaper.language.code || selectedPaper.language}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-[#1E293B] leading-tight">
                    {selectedPaper.title || 'Untitled Paper'}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedPaper(null)}
                  className="w-10 h-10 rounded-xl bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-grow">
                {/* Authors */}
                {selectedPaper.authors && selectedPaper.authors.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-slate-gray uppercase tracking-widest mb-2">Authors</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPaper.authors.map((author, i) => (
                        <span key={i} className="px-3 py-1.5 bg-black/[0.03] border border-black/5 rounded-xl text-sm text-[#1E293B] font-medium">
                          {typeof author === 'string' ? author : (author.name || 'Unknown')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Abstract */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-gray uppercase tracking-widest mb-3">Abstract</h4>
                  <p className="text-sm text-slate-gray leading-relaxed whitespace-pre-line">
                    {selectedPaper.abstract || selectedPaper.description || 'No abstract available for this paper.'}
                  </p>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {selectedPaper.publisher && (
                    <div className="bg-black/[0.02] rounded-xl p-4">
                      <span className="text-[10px] font-bold text-slate-gray uppercase tracking-widest block mb-1">Publisher</span>
                      <span className="text-sm text-[#1E293B] font-medium">
                        {typeof selectedPaper.publisher === 'string' ? selectedPaper.publisher : selectedPaper.publisher.name || 'Unknown'}
                      </span>
                    </div>
                  )}
                  {selectedPaper.doi && (
                    <div className="bg-black/[0.02] rounded-xl p-4">
                      <span className="text-[10px] font-bold text-slate-gray uppercase tracking-widest block mb-1">DOI</span>
                      <a href={`https://doi.org/${selectedPaper.doi}`} target="_blank" rel="noopener noreferrer" className="text-sm text-electric-cyan hover:underline font-medium">
                        {selectedPaper.doi}
                      </a>
                    </div>
                  )}
                  {selectedPaper.yearPublished && (
                    <div className="bg-black/[0.02] rounded-xl p-4">
                      <span className="text-[10px] font-bold text-slate-gray uppercase tracking-widest block mb-1">Year Published</span>
                      <span className="text-sm text-[#1E293B] font-medium">{selectedPaper.yearPublished}</span>
                    </div>
                  )}
                  {selectedPaper.downloadUrl && (
                    <div className="bg-black/[0.02] rounded-xl p-4">
                      <span className="text-[10px] font-bold text-slate-gray uppercase tracking-widest block mb-1">Download</span>
                      <a href={selectedPaper.downloadUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-electric-cyan hover:underline font-medium flex items-center gap-1">
                        <Download size={14} /> PDF Available
                      </a>
                    </div>
                  )}
                </div>

                {/* Subjects / Topics */}
                {selectedPaper.subjects && selectedPaper.subjects.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-gray uppercase tracking-widest mb-2">Subjects</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPaper.subjects.slice(0, 10).map((subject, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-50 text-electric-cyan rounded-md text-xs font-medium">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-black/5 flex items-center gap-3 flex-shrink-0">
                {selectedPaper.downloadUrl && (
                  <a
                    href={selectedPaper.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-grow flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-electric-cyan to-vibrant-purple text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                  >
                    <Download size={16} />
                    Download PDF
                  </a>
                )}
                {(selectedPaper.doi || selectedPaper.sourceFulltextUrls?.[0]) && (
                  <a
                    href={selectedPaper.doi ? `https://doi.org/${selectedPaper.doi}` : selectedPaper.sourceFulltextUrls[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 border border-black/10 text-[#1E293B] font-bold rounded-xl hover:border-black/20 transition-all"
                  >
                    <ExternalLink size={16} />
                    View Source
                  </a>
                )}
                {!selectedPaper.downloadUrl && !selectedPaper.doi && (
                  <div className="flex-grow text-center py-3 text-sm text-slate-gray">
                    No external links available for this paper
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResearchPapers;
