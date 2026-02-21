import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, BookOpen, Code2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─── Typing text cycling ─── */
const TypingText = () => {
  const words = ["AI/ML", "React", "Python", "DevOps", "Cloud", "Architecture"];
  const [displayText, setDisplayText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    const update = () => {
      if (!isDeleting) {
        setDisplayText(currentWord.substring(0, displayText.length + 1));
        if (displayText === currentWord) setTimeout(() => setIsDeleting(true), 2000);
      } else {
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        if (displayText === '') {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    };
    const timer = setTimeout(update, isDeleting ? 40 : 80);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, wordIndex]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-cyan to-vibrant-purple font-black">
      {displayText}<span className="inline-block w-[3px] h-[1em] bg-electric-cyan ml-0.5 align-middle" style={{ animation: 'blink-cursor 1s step-end infinite' }} />
    </span>
  );
};

/* ─── Code editor card (right column) ─── */
const CODE_LINES = [
  { indent: 0, tokens: [{ text: 'const', cls: 'text-purple-500' }, { text: ' blog', cls: 'text-blue-600' }, { text: ' = ', cls: 'text-slate-500' }, { text: '{', cls: 'text-slate-700' }] },
  { indent: 1, tokens: [{ text: 'name', cls: 'text-sky-600' }, { text: ': ', cls: 'text-slate-500' }, { text: "'TechScribe'", cls: 'text-amber-600' }, { text: ',', cls: 'text-slate-500' }] },
  { indent: 1, tokens: [{ text: 'stack', cls: 'text-sky-600' }, { text: ': ', cls: 'text-slate-500' }, { text: "['React', 'Node', 'Supabase']", cls: 'text-amber-600' }, { text: ',', cls: 'text-slate-500' }] },
  { indent: 1, tokens: [{ text: 'posts', cls: 'text-sky-600' }, { text: ': ', cls: 'text-slate-500' }, { text: '127', cls: 'text-emerald-600' }, { text: ',', cls: 'text-slate-500' }] },
  { indent: 1, tokens: [{ text: 'topics', cls: 'text-sky-600' }, { text: ': ', cls: 'text-slate-500' }, { text: '23', cls: 'text-emerald-600' }, { text: ',', cls: 'text-slate-500' }] },
  { indent: 1, tokens: [{ text: 'passion', cls: 'text-sky-600' }, { text: ': ', cls: 'text-slate-500' }, { text: "'∞'", cls: 'text-rose-500' }] },
  { indent: 0, tokens: [{ text: '};', cls: 'text-slate-700' }] },
  { indent: 0, tokens: [] },
  { indent: 0, tokens: [{ text: '// ', cls: 'text-slate-400' }, { text: 'Start documenting your journey ✨', cls: 'text-slate-400 italic' }] },
];

const CodeEditorCard = () => {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines < CODE_LINES.length) {
      const timer = setTimeout(() => setVisibleLines(v => v + 1), 250);
      return () => clearTimeout(timer);
    }
  }, [visibleLines]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateY: -8 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
      style={{ perspective: '1200px' }}
    >
      {/* Glow behind card */}
      <div className="absolute -inset-4 bg-gradient-to-br from-blue-400/20 via-purple-400/15 to-pink-400/10 rounded-[2rem] blur-2xl" />

      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-black/[0.08] shadow-2xl shadow-blue-500/[0.08] overflow-hidden" style={{ animation: 'glow-pulse 4s ease-in-out infinite' }}>
        {/* Title bar */}
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-black/5 bg-stone-50/80">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/80" />
            <div className="w-3 h-3 rounded-full bg-amber-400/80" />
            <div className="w-3 h-3 rounded-full bg-green-400/80" />
          </div>
          <span className="text-[11px] font-mono text-slate-400 ml-2">blog.config.js</span>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-600 font-semibold">Live</span>
          </div>
        </div>

        {/* Code area */}
        <div className="p-5 font-mono text-[13px] leading-relaxed min-h-[240px]">
          {CODE_LINES.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={i < visibleLines ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3 }}
              className="flex items-center"
              style={{ paddingLeft: `${line.indent * 24}px` }}
            >
              <span className="w-6 text-[11px] text-slate-300 select-none mr-3 text-right">{i + 1}</span>
              {line.tokens.map((token, j) => (
                <span key={j} className={token.cls}>{token.text}</span>
              ))}
              {i === visibleLines - 1 && visibleLines < CODE_LINES.length && (
                <span className="inline-block w-[2px] h-4 bg-electric-cyan ml-0.5" style={{ animation: 'blink-cursor 0.8s step-end infinite' }} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Main Hero ─── */
const Hero = () => {
  const ref = useRef(null);
  const glowRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const opacityScrollIndicator = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Mouse-follow glow
  const handleMouseMove = (e) => {
    if (!glowRef.current) return;
    const rect = ref.current.getBoundingClientRect();
    glowRef.current.style.left = `${e.clientX - rect.left}px`;
    glowRef.current.style.top = `${e.clientY - rect.top}px`;
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* ── Background layers ── */}
      <div className="absolute inset-0 bg-[#FEFBF6]">
        <div className="absolute inset-0 hero-background-gradient opacity-50" />
        <div className="absolute inset-0 mesh-gradient" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(37,99,235,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.4) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Mouse-follow glow */}
      <div
        ref={glowRef}
        className="absolute w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none opacity-40 transition-opacity duration-300"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, rgba(124,58,237,0.06) 30%, transparent 70%)' }}
      />

      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-[15%] left-[8%] w-16 h-16 rounded-2xl border border-blue-200/40 bg-blue-50/30 backdrop-blur-sm"
        style={{ animation: 'float-slow 8s ease-in-out infinite' }}
      />
      <motion.div
        className="absolute top-[25%] right-[12%] w-10 h-10 rounded-full border border-purple-200/40 bg-purple-50/30 backdrop-blur-sm"
        style={{ animation: 'float-medium 6s ease-in-out infinite' }}
      />
      <motion.div
        className="absolute bottom-[20%] left-[15%] w-12 h-12 rounded-xl rotate-45 border border-pink-200/30 bg-pink-50/20 backdrop-blur-sm"
        style={{ animation: 'float-slow 10s ease-in-out infinite 2s' }}
      />
      <motion.div
        className="absolute top-[60%] right-[8%] w-8 h-8 rounded-lg border border-emerald-200/40 bg-emerald-50/20 backdrop-blur-sm"
        style={{ animation: 'float-medium 7s ease-in-out infinite 1s' }}
      />
      <motion.div
        className="absolute top-[10%] right-[35%] w-6 h-6 rounded-full border border-amber-200/40 bg-amber-50/30"
        style={{ animation: 'float-slow 9s ease-in-out infinite 3s' }}
      />

      {/* ── Content ── */}
      <motion.div style={{ y: yText }} className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left column — Copy */}
          <div className="relative">
            {/* Shimmer badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/[0.06] bg-white/70 backdrop-blur-md mb-8 shimmer-badge"
            >
              <Sparkles size={14} className="text-amber-500" />
              <span className="text-xs font-bold text-slate-600 tracking-wide">127 articles published</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-heading font-black leading-[1.05] tracking-tight text-[#1E293B] mb-6"
            >
              Document{' '}
              <span className="relative">
                Your
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 8 C50 2, 150 2, 198 8" stroke="url(#underline-grad)" strokeWidth="3" strokeLinecap="round" />
                  <defs><linearGradient id="underline-grad" x1="0" y1="0" x2="200" y2="0"><stop stopColor="#2563EB" /><stop offset="1" stopColor="#7C3AED" /></linearGradient></defs>
                </svg>
              </span>
              <br />
              <span className="gradient-text">Code Journey</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="text-lg sm:text-xl text-slate-500 max-w-lg mb-10 leading-relaxed"
            >
              Building the searchable database for my developer mind.
              <br />
              Specializing in <TypingText />
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Link
                to="/create-post"
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-base rounded-2xl shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                Start Writing
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity -z-10" />
              </Link>

              <Link
                to="/blog"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white/70 backdrop-blur-md border border-black/[0.08] text-[#1E293B] font-bold text-base rounded-2xl hover:border-blue-300 hover:bg-white hover:-translate-y-0.5 transition-all duration-300"
              >
                <BookOpen size={18} className="text-blue-500" />
                Explore Posts
              </Link>
            </motion.div>

            {/* Quick stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-8 mt-12 pt-8 border-t border-black/[0.06]"
            >
              {[
                { icon: Code2, value: '127', label: 'Articles' },
                { icon: Zap, value: '23', label: 'Topics' },
                { icon: BookOpen, value: '342', label: 'Snippets' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                    <stat.icon size={16} className="text-blue-500" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-[#1E293B] leading-tight">{stat.value}</div>
                    <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right column — Code editor */}
          <div className="hidden lg:block">
            <CodeEditorCard />
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400"
        style={{ opacity: opacityScrollIndicator }}
      >
        <span className="text-[10px] uppercase font-bold tracking-[0.25em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border-2 border-black/10 flex justify-center pt-1"
        >
          <motion.div className="w-1 h-1.5 bg-blue-500 rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
