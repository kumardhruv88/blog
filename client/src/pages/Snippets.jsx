import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Code, Copy, Check, Terminal, Zap, Hash,
  ChevronRight, BookOpen, Sparkles, Braces, FileCode,
  Database, Layout, Coffee, X
} from 'lucide-react';
import CodeBlock from '../components/blog/CodeBlock';

/* ─── Language icon + color mapping ─── */
const LANG_META = {
  javascript: { icon: Braces, color: 'from-amber-400 to-yellow-500', bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-400', label: 'JavaScript' },
  sql:        { icon: Database, color: 'from-blue-400 to-indigo-500', bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-400', label: 'SQL' },
  python:     { icon: Coffee, color: 'from-green-400 to-emerald-500', bg: 'bg-green-50', text: 'text-green-600', dot: 'bg-green-400', label: 'Python' },
  css:        { icon: Layout, color: 'from-pink-400 to-rose-500', bg: 'bg-pink-50', text: 'text-pink-600', dot: 'bg-pink-400', label: 'CSS' },
};

const getLangMeta = (lang) => LANG_META[lang] || { icon: Terminal, color: 'from-slate-400 to-slate-500', bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400', label: lang };

const COMPLEXITY_STYLES = {
  Beginner:     'bg-emerald-50 text-emerald-600 border-emerald-200/60',
  Intermediate: 'bg-purple-50 text-purple-600 border-purple-200/60',
  Advanced:     'bg-rose-50 text-rose-600 border-rose-200/60',
};

/* ─── Snippet data ─── */
const SNIPPETS_DATA = [
  {
    id: 1, title: "React custom hook for LocalStorage",
    description: "Persist state to localStorage with React lifecycle sync.",
    language: "javascript", category: "React Hooks",
    code: `function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}`,
    tags: ["react", "persistence", "hooks"], complexity: "Intermediate"
  },
  {
    id: 2, title: "SQL Recursive CTE for Categories",
    description: "Fetch hierarchical data like category trees or nested comments.",
    language: "sql", category: "Database",
    code: `WITH RECURSIVE CategoryTree AS (
  SELECT id, name, parent_id, 0 as level
  FROM categories
  WHERE parent_id IS NULL
  
  UNION ALL
  
  SELECT c.id, c.name, c.parent_id, ct.level + 1
  FROM categories c
  INNER JOIN CategoryTree ct ON c.parent_id = ct.id
)
SELECT * FROM CategoryTree ORDER BY level, name;`,
    tags: ["sql", "postgres", "hierarchy"], complexity: "Advanced"
  },
  {
    id: 3, title: "Python Debounce Decorator",
    description: "Prevent a function from being called too frequently.",
    language: "python", category: "Utilities",
    code: `import threading

def debounce(wait):
    def decorator(fn):
        def debounced(*args, **kwargs):
            def call_it():
                fn(*args, **kwargs)
            try:
                debounced.t.cancel()
            except AttributeError:
                pass
            debounced.t = threading.Timer(wait, call_it)
            debounced.t.start()
        return debounced
    return decorator`,
    tags: ["python", "threading", "decorator"], complexity: "Advanced"
  },
  {
    id: 4, title: "CSS Glassmorphism Utility",
    description: "Standard glassmorphism effect tokens for modern UI.",
    language: "css", category: "Design",
    code: `.glass-container {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}`,
    tags: ["css", "styling", "glassmorphism"], complexity: "Beginner"
  },
  {
    id: 5, title: "Next.js API Error Handler",
    description: "Standardized error response handler for API routes.",
    language: "javascript", category: "Next.js",
    code: `export default function errorHandler(err, res) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(\`[Error] \${message}\`);

  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: err.code || 'INTERNAL_ERROR',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
}`,
    tags: ["nextjs", "api", "backend"], complexity: "Intermediate"
  }
];

/* ─── Snippet Card ─── */
const SnippetCard = ({ snippet, copiedId, onCopy, index }) => {
  const meta = getLangMeta(snippet.language);
  const LangIcon = meta.icon;
  const [isExpanded, setIsExpanded] = useState(false);
  const lineCount = snippet.code.split('\n').length;
  const isLong = lineCount > 12;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
    >
      <div className="group relative bg-white/70 backdrop-blur-xl border border-black/[0.06] rounded-2xl overflow-hidden hover:border-blue-200/50 hover:shadow-lg hover:shadow-blue-500/[0.04] transition-all duration-400">
        {/* Accent bar */}
        <div className={`h-[2px] bg-gradient-to-r ${meta.color}`} />

        <div className="p-5 md:p-6">
          {/* Row 1: meta + copy */}
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-7 h-7 rounded-lg ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                <LangIcon size={14} className={meta.text} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 truncate">{snippet.category}</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${COMPLEXITY_STYLES[snippet.complexity]} flex-shrink-0`}>
                {snippet.complexity}
              </span>
            </div>
            <button
              onClick={() => onCopy(snippet.id, snippet.code)}
              className={`flex-shrink-0 p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                copiedId === snippet.id
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                  : 'bg-white/80 border-black/[0.05] text-slate-400 hover:text-blue-600 hover:border-blue-200'
              }`}
            >
              {copiedId === snippet.id ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
            </button>
          </div>

          {/* Row 2: title + desc (compact) */}
          <h3 className="text-lg font-heading font-black text-[#1E293B] group-hover:text-blue-600 transition-colors leading-snug mb-1">
            {snippet.title}
          </h3>
          <p className="text-[13px] text-slate-500 leading-relaxed mb-3">{snippet.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {snippet.tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-slate-50 border border-black/[0.04] rounded-md text-[10px] font-semibold text-slate-400">
                <Hash size={8} className="opacity-40" />{tag}
              </span>
            ))}
          </div>

          {/* Code */}
          <div className="relative rounded-xl overflow-hidden border border-black/[0.06] bg-[#1E293B]">
            {/* Code header bar */}
            <div className="flex items-center justify-between px-3.5 py-2 bg-[#1E293B]/95 border-b border-white/[0.06]">
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                <span className="text-[10px] font-mono font-medium text-slate-500">{meta.label}</span>
              </div>
              <span className="text-[10px] text-slate-600">{lineCount} lines</span>
            </div>

            <div className={`${!isExpanded && isLong ? 'max-h-[280px] overflow-hidden' : ''}`}>
              <CodeBlock language={snippet.language}>{snippet.code}</CodeBlock>
            </div>

            {isLong && !isExpanded && (
              <div className="absolute bottom-0 left-0 right-0">
                <div className="h-16 bg-gradient-to-t from-[#1E293B] to-transparent" />
                <div className="bg-[#1E293B] px-4 pb-2.5 flex justify-center">
                  <button onClick={() => setIsExpanded(true)} className="text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 uppercase tracking-wider transition-colors">
                    Show all <ChevronRight size={11} className="rotate-90" />
                  </button>
                </div>
              </div>
            )}
            {isExpanded && isLong && (
              <div className="bg-[#1E293B] px-4 pb-2.5 flex justify-center border-t border-white/[0.04]">
                <button onClick={() => setIsExpanded(false)} className="text-[10px] font-bold text-slate-500 hover:text-slate-300 flex items-center gap-1 uppercase tracking-wider transition-colors">
                  Collapse <ChevronRight size={11} className="-rotate-90" />
                </button>
              </div>
            )}
          </div>

          {/* Footer links */}
          <div className="mt-3.5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="text-[11px] font-medium text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors">
                <BookOpen size={12} /> Docs
              </button>
              <button className="text-[11px] font-medium text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors">
                <Zap size={12} /> Sandbox
              </button>
            </div>
            <button className="text-[11px] font-medium text-blue-500 hover:text-blue-700 flex items-center gap-0.5 transition-colors">
              Details <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};


/* ═══════════════════════════════════════════
   Main Snippets Page — Compact Layout
   ═══════════════════════════════════════════ */
const Snippets = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

  const languages = useMemo(() => ['All', ...new Set(SNIPPETS_DATA.map(s => s.language))], []);

  const filteredSnippets = useMemo(() => {
    return SNIPPETS_DATA.filter(snippet => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || snippet.title.toLowerCase().includes(q) ||
                           snippet.description.toLowerCase().includes(q) ||
                           snippet.tags.some(tag => tag.includes(q));
      const matchesLanguage = selectedLanguage === 'All' || snippet.language === selectedLanguage;
      return matchesSearch && matchesLanguage;
    });
  }, [searchQuery, selectedLanguage]);

  const handleCopy = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-5 md:px-8 max-w-5xl mx-auto">

      {/* ─── Compact Hero + Search (merged) ─── */}
      <section className="mb-6">
        {/* Row: title left, stats right */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Code size={16} className="text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#1E293B]">
                Code <span className="gradient-text">Snippets</span>
              </h1>
            </div>
            <p className="text-sm text-slate-500 max-w-md">
              Reusable logic, utilities, and patterns — copy-paste ready.
            </p>
          </div>

          {/* Quick stats pills */}
          <div className="flex items-center gap-3">
            {[
              { label: 'Snippets', value: SNIPPETS_DATA.length, icon: Code },
              { label: 'Languages', value: new Set(SNIPPETS_DATA.map(s => s.language)).size, icon: Terminal },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/70 border border-black/[0.06] rounded-xl">
                <s.icon size={13} className="text-blue-500" />
                <span className="text-sm font-bold text-[#1E293B]">{s.value}</span>
                <span className="text-[10px] text-slate-400 font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Search + filters — tight, inline */}
        <div className="bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-xl p-3 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            {/* Search input */}
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search snippets…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50/80 border border-black/[0.05] rounded-lg py-2.5 pl-9 pr-8 text-sm text-[#1E293B] placeholder-slate-400 focus:border-blue-300 focus:bg-white focus:ring-0 outline-none transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Language pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
              {languages.map(lang => {
                const isActive = selectedLanguage === lang;
                const langMeta = lang !== 'All' ? getLangMeta(lang) : null;
                return (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                        : 'bg-slate-50 text-slate-500 hover:text-[#1E293B] hover:bg-slate-100'
                    }`}
                  >
                    {langMeta && <langMeta.icon size={12} className={isActive ? 'text-white/70' : ''} />}
                    {langMeta ? langMeta.label : 'All'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active filters */}
          {(searchQuery || selectedLanguage !== 'All') && (
            <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-black/[0.04] text-[10px]">
              <span className="text-slate-400 font-medium">Active:</span>
              {selectedLanguage !== 'All' && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 font-semibold rounded border border-blue-100">
                  {getLangMeta(selectedLanguage).label}
                  <button onClick={() => setSelectedLanguage('All')} className="hover:text-blue-800"><X size={10} /></button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-50 text-slate-600 font-semibold rounded border border-slate-200">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-slate-800"><X size={10} /></button>
                </span>
              )}
              <button onClick={() => { setSearchQuery(''); setSelectedLanguage('All'); }} className="text-slate-400 hover:text-red-500 font-medium ml-auto transition-colors">
                Clear
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── Results count ─── */}
      <div className="flex items-center justify-between mb-4 px-1">
        <span className="text-xs text-slate-400">
          <span className="font-bold text-[#1E293B]">{filteredSnippets.length}</span> snippet{filteredSnippets.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ─── Snippets List ─── */}
      {filteredSnippets.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredSnippets.map((snippet, index) => (
              <SnippetCard key={snippet.id} snippet={snippet} copiedId={copiedId} onCopy={handleCopy} index={index} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
          <div className="w-16 h-16 bg-slate-50 border border-black/[0.06] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Code size={28} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-heading font-black text-[#1E293B] mb-1">No snippets found</h3>
          <p className="text-sm text-slate-500 mb-4">Try adjusting your search or filters.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedLanguage('All'); }}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-50 text-blue-600 font-semibold text-sm rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
          >
            <X size={13} /> Clear filters
          </button>
        </motion.div>
      )}

      {/* ─── CTA Footer ─── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <div className="relative rounded-2xl overflow-hidden gradient-border">
          <div className="bg-gradient-to-br from-blue-50/80 via-purple-50/40 to-white p-8 md:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="max-w-md">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={14} className="text-purple-500" />
                  <span className="text-[11px] font-bold text-slate-500 tracking-wide">Open for contributions</span>
                </div>
                <h2 className="text-2xl font-heading font-black text-[#1E293B] mb-1.5">Have a useful snippet?</h2>
                <p className="text-sm text-slate-500">Contribute and help other developers build faster.</p>
              </div>
              <div className="flex gap-2.5 flex-shrink-0">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/15 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                  Submit Snippet
                </button>
                <button className="px-6 py-3 bg-white/80 border border-black/[0.08] rounded-xl font-bold text-sm text-[#1E293B] hover:border-blue-200 transition-all">
                  Guidelines
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Snippets;
