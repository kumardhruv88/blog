import React, { useState, useRef, useEffect } from 'react';
import { Check, Copy, Terminal, Cpu, FileJson, FileCode, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'JetBrains Mono',
});

const LANGUAGE_ICONS = {
  js: Terminal,
  jsx: Terminal,
  javascript: Terminal,
  typescript: Cpu,
  ts: Cpu,
  tsx: Cpu,
  json: FileJson,
  css: FileCode,
  html: FileCode,
  python: Coffee,
  text: Terminal
};

const CodeBlock = ({ inline, className, children, metastring, ...props }) => {
  const [copied, setCopied] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';
  const Icon = LANGUAGE_ICONS[language] || Terminal;
  const mermaidRef = useRef(null);

  // Extract file name and highlighted lines from metastring
  const fileName = metastring?.match(/filename="(.+?)"/)?.[1];
  const highlightMatch = metastring?.match(/\{([\d,-]+)\}/);
  const highlightedLines = highlightMatch ? highlightMatch[1].split(',').flatMap(range => {
    if (range.includes('-')) {
      const [start, end] = range.split('-').map(Number);
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
    return [Number(range)];
  }) : [];

  useEffect(() => {
    if (language === 'mermaid' && mermaidRef.current) {
        mermaidRef.current.removeAttribute('data-processed');
        mermaid.contentLoaded();
    }
  }, [language, children]);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPlaygroundCompatible = ['js', 'jsx', 'javascript', 'ts', 'tsx', 'typescript'].includes(language);
  const isMermaid = language === 'mermaid';

  if (inline) {
    return (
      <code className="bg-[#1E293B] text-electric-cyan px-2 py-0.5 rounded-md font-code text-[0.9em] border border-black/10" {...props}>
        {children}
      </code>
    );
  }

  // Mermaid Diagram View
  if (isMermaid) {
    return (
      <div className="my-10 relative overflow-hidden glass-card border border-black/10 rounded-3xl group">
        <div className="flex items-center justify-between px-6 py-4 bg-black/5 border-b border-black/5">
           <div className="flex items-center gap-2">
              <Cpu size={16} className="text-vibrant-purple" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-gray">Architecture Diagram</span>
           </div>
           <button 
             onClick={() => {
                const svg = mermaidRef.current?.innerHTML;
                if (svg) {
                  const blob = new Blob([svg], { type: 'image/svg+xml' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'diagram.svg';
                  a.click();
                }
             }}
             className="text-[10px] font-black uppercase tracking-widest text-slate-gray hover:text-[#1E293B] transition-all flex items-center gap-2"
           >
             <Download size={14} /> Export SVG
           </button>
        </div>
        <div className="p-8 bg-[#FEFBF6]/50 min-h-[200px] flex items-center justify-center overflow-x-auto no-scrollbar">
           <div ref={mermaidRef} className="mermaid w-full flex justify-center text-[#1E293B]">
             {children}
           </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-vibrant-purple to-electric-cyan" />
      </div>
    );
  }

  const codeString = String(children).replace(/\n$/, '');
  const lines = codeString.split('\n');

  return (
    <div className="relative group my-10 rounded-3xl overflow-hidden glass-card-dark border border-black/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-electric-cyan/30">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-black/10">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/30 border border-red-500/20" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/30 border border-yellow-500/20" />
            <div className="w-3 h-3 rounded-full bg-green-500/30 border border-green-500/20" />
          </div>
          <div className="h-4 w-px bg-black/10" />
          {fileName ? (
            <div className="flex items-center gap-2">
              <FileCode size={14} className="text-slate-gray" />
              <span className="text-[10px] font-mono text-slate-gray">{fileName}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-black/5 border border-black/5">
                 <Icon size={14} className="text-electric-cyan" />
              </div>
              <span className="text-[10px] font-black font-mono text-slate-gray uppercase tracking-[0.2em]">{language}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowLineNumbers(!showLineNumbers)}
            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border transition-all ${showLineNumbers ? 'text-electric-cyan border-electric-cyan/20 bg-electric-cyan/5' : 'text-slate-gray border-black/5'}`}
          >
            Lines
          </button>
          {isPlaygroundCompatible && (
            <Link
              to="/playground"
              className="flex items-center gap-2 px-4 py-2 bg-electric-cyan/10 border border-electric-cyan/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-electric-cyan hover:bg-electric-cyan hover:text-[#1E293B] transition-all"
            >
              <Cpu size={14} />
              Lab
            </Link>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-gray hover:text-[#1E293B] transition-all bg-black/5 px-4 py-2 rounded-xl border border-black/5 hover:border-black/20"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                  className="flex items-center gap-2 text-electric-cyan"
                >
                  <Check size={14} />
                  <span>Copied!</span>
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                  className="flex items-center gap-2"
                >
                  <Copy size={14} />
                  <span>Copy</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Code Content with Line Numbers */}
      <div className="relative flex overflow-x-auto no-scrollbar font-code text-sm leading-relaxed scroll-smooth">
        {/* Left Fade Indicator */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-deep-code-blue to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
        
        {/* Line Numbers Gutter */}
        <AnimatePresence>
          {showLineNumbers && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="sticky left-0 flex flex-col items-end px-4 py-6 bg-[#051122]/80 backdrop-blur-md border-r border-black/5 text-slate-gray/30 select-none min-w-[50px] z-20"
            >
              {lines.map((_, i) => {
                const isHighlighted = highlightedLines.includes(i + 1);
                return (
                  <span key={i} className={`h-6 leading-6 ${isHighlighted ? 'text-electric-cyan font-bold scale-110' : ''}`}>
                    {i + 1}
                  </span>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actual Code */}
        <div className="flex-grow py-6 min-w-0">
          {lines.map((line, i) => {
            const isHighlighted = highlightedLines.includes(i + 1);
            return (
              <div 
                key={i} 
                className={`h-6 leading-6 px-6 relative ${isHighlighted ? 'bg-electric-cyan/5 border-l-2 border-electric-cyan' : ''}`}
              >
                <span className={isHighlighted ? 'text-[#1E293B] drop-shadow-[0_0_8px_rgba(100,255,218,0.3)]' : ''}>
                  {line || ' '}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right Fade Indicator */}
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-deep-code-blue to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
      </div>
    </div>
  );
};

export default CodeBlock;
