import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Share2, Download, Copy, Maximize2, Minimize2, Cpu, Code2, Layout, Settings, ChevronRight, X, Sparkles, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const DEFAULT_CODE = `// Welcome to TechScribe Interactive Playground!
// Try modifying the code below to see live updates.

const App = () => {
  const [count, setCount] = React.useState(0);
  
  return (
    <div className="p-8 text-center bg-gradient-brand rounded-3xl text-[#1E293B]">
      <h1 className="text-4xl font-black mb-4 tracking-tighter uppercase">
        Live Build
      </h1>
      <p className="text-xl font-bold mb-8 opacity-80">
        Interactive React Sandbox
      </p>
      
      <div className="flex flex-col items-center gap-6">
        <div className="text-6xl font-black">{count}</div>
        <button 
          onClick={() => setCount(c => c + 1)}
          className="px-8 py-4 bg-deep-code-blue text-[#1E293B] rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
        >
          Increment
        </button>
      </div>
    </div>
  );
};

render(<App />);`;

const CodePlayground = () => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');
  const [showConsole, setShowConsole] = useState(true);
  const iframeRef = useRef(null);

  const runCode = () => {
    setIsRunning(true);
    // In a real app, this would use a worker or a safe evaluator like ‘babel-standalone’
    // For this prototype, we'll simulate the "Render" effect with a styled iframe
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
             body { margin: 0; background: transparent; font-family: sans-serif; overflow: hidden; }
             #root { display: flex; justify-content: center; align-items: center; min-h: 100vh; }
             .bg-gradient-brand { background: linear-gradient(135deg, #2563EB 0%, #7000FF 100%); }
             .text-[#1E293B] { color: #F5F0EB; }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            const { useState, useEffect } = React;
            const render = (Component) => {
              const root = ReactDOM.createRoot(document.getElementById('root'));
              root.render(Component);
            };
            try {
              ${code.replace('React.', '')}
            } catch (err) {
              console.error(err);
            }
          </script>
        </body>
      </html>
    `;

    setTimeout(() => {
      if (iframeRef.current) {
        const doc = iframeRef.current.contentDocument;
        doc.open();
        doc.write(html);
        doc.close();
      }
      setIsRunning(false);
    }, 800);
  };

  useEffect(() => {
    runCode();
  }, []);

  return (
    <div className="min-h-screen bg-[#FEFBF6] text-[#1E293B] pt-20 flex flex-col">
      {/* Playground Header */}
      <header className="px-6 py-4 border-b border-black/5 bg-white/80 backdrop-blur-xl flex items-center justify-between z-30">
        <div className="flex items-center gap-6">
           <Link to="/blog" className="p-2 hover:bg-black/5 rounded-xl text-slate-gray hover:text-[#1E293B] transition-all">
              <ChevronRight size={24} className="rotate-180" />
           </Link>
           <div className="h-8 w-px bg-black/10" />
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-[#1E293B] shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                 <Terminal size={20} />
              </div>
              <div>
                 <h1 className="text-lg font-black uppercase tracking-widest text-[#1E293B] leading-none">Code Lab</h1>
                 <span className="text-[10px] font-bold text-electric-cyan uppercase tracking-widest">v2.0 Beta</span>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center gap-2 bg-black/5 px-4 py-2 rounded-xl border border-black/5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-gray">Connected to Edge Runtime</span>
           </div>
           
           <div className="flex items-center gap-2">
              <button 
                onClick={runCode}
                className="flex items-center gap-2 px-6 py-2.5 bg-electric-cyan text-[#1E293B] font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(100,255,218,0.3)]"
              >
                {isRunning ? (
                  <RotateCcw size={16} className="animate-spin" />
                ) : (
                  <Play size={16} fill="currentColor" />
                )}
                Run Build
              </button>
              <button className="p-2.5 rounded-xl bg-black/5 border border-black/10 text-slate-gray hover:text-[#1E293B] hover:bg-black/10 transition-all">
                <Share2 size={20} />
              </button>
           </div>
        </div>
      </header>

      {/* Main Lab Area */}
      <main className="flex-grow flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden">
         {/* Sidebar Controls */}
         <div className="w-16 border-r border-black/5 bg-white/60 flex flex-col items-center py-6 gap-8">
            <button className="p-3 bg-electric-cyan/10 text-electric-cyan rounded-xl"><Code2 size={20} /></button>
            <button className="p-3 text-slate-gray hover:text-[#1E293B] transition-all"><Layout size={20} /></button>
            <button className="p-3 text-slate-gray hover:text-[#1E293B] transition-all"><Cpu size={20} /></button>
            <div className="mt-auto">
              <button className="p-3 text-slate-gray hover:text-[#1E293B] transition-all"><Settings size={20} /></button>
            </div>
         </div>

         {/* Editor Section */}
         <div className="flex-grow flex flex-col min-w-0 md:w-1/2">
            <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-black/5">
               <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/10" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/10" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/10" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-gray flex items-center gap-2">
                     index.jsx <Sparkles size={10} className="text-vibrant-purple" />
                  </span>
               </div>
               <button className="text-[10px] font-black uppercase tracking-widest text-slate-gray hover:text-[#1E293B] flex items-center gap-2">
                  <Copy size={12} /> Copy Code
               </button>
            </div>
            
            <div className="flex-grow relative bg-[#FEFBF6]">
               <textarea
                 value={code}
                 onChange={(e) => setCode(e.target.value)}
                 className="absolute inset-0 w-full h-full p-8 bg-transparent text-ghost-white font-mono text-sm resize-none focus:outline-none leading-relaxed"
                 spellCheck="false"
               />
               {/* Custom syntax highlighting could be layered here if needed */}
            </div>

            {/* Bottom Panel (Console) */}
            <AnimatePresence>
              {showConsole && (
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: 200 }}
                  exit={{ height: 0 }}
                  className="bg-[#F5F0EB] border-t border-black/5 flex flex-col"
                >
                   <div className="px-6 py-2 border-b border-black/5 flex items-center justify-between bg-black/20">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-gray">Output Console</span>
                      <button onClick={() => setShowConsole(false)} className="text-slate-gray hover:text-[#1E293B] px-2">
                        <Maximize2 size={12} />
                      </button>
                   </div>
                   <div className="flex-grow p-4 font-mono text-[11px] text-green-400 overflow-y-auto no-scrollbar">
                      <p className="mb-1 text-slate-gray">[{new Date().toLocaleTimeString()}] System: Runtime initialized.</p>
                      <p className="mb-1 text-slate-gray">[{new Date().toLocaleTimeString()}] System: React 18.2.0 loaded via ESM.</p>
                      <p className="mb-1 text-electric-cyan">[{new Date().toLocaleTimeString()}] Log: App component rendered successfully.</p>
                      <p className="mb-1"> {">"} Waiting for input...</p>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
         </div>

         {/* Preview Section */}
         <div className="md:w-1/2 bg-[#FEFBF6] border-l border-black/5 flex flex-col">
            <div className="flex items-center px-6 py-3 bg-white border-b border-black/5 gap-6">
               <button 
                 onClick={() => setActiveTab('preview')}
                 className={`text-[10px] font-black uppercase tracking-widest relative py-1 ${activeTab === 'preview' ? 'text-[#1E293B]' : 'text-slate-gray hover:text-[#1E293B]'}`}
               >
                 Live Preview
                 {activeTab === 'preview' && <motion.div layoutId="tab-active" className="absolute -bottom-[12px] left-0 right-0 h-0.5 bg-electric-cyan" />}
               </button>
               <button 
                 onClick={() => setActiveTab('inspect')}
                 className={`text-[10px] font-black uppercase tracking-widest relative py-1 ${activeTab === 'inspect' ? 'text-[#1E293B]' : 'text-slate-gray hover:text-[#1E293B]'}`}
               >
                 Inspector
                 {activeTab === 'inspect' && <motion.div layoutId="tab-active" className="absolute -bottom-[12px] left-0 right-0 h-0.5 bg-electric-cyan" />}
               </button>
               
               <div className="ml-auto flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 bg-black/5 rounded-full border border-black/5">
                     <div className="w-1.5 h-1.5 rounded-full bg-electric-cyan" />
                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-gray">localhost:3000</span>
                  </div>
                  <button className="text-slate-gray hover:text-[#1E293B]"><Layout size={14} /></button>
                  <button className="text-slate-gray hover:text-[#1E293B]"><Maximize2 size={14} /></button>
               </div>
            </div>

            <div className="flex-grow relative overflow-hidden bg-[radial-gradient(circle_at_50%_50%,rgba(100,255,218,0.02),transparent_70%)]">
               {/* Pattern Background */}
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                    style={{ backgroundImage: 'radial-gradient(circle, var(--electric-cyan) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
               
               <div className="absolute inset-8 rounded-[2rem] overflow-hidden border border-black/10 shadow-3xl bg-white/60 backdrop-blur-sm z-10 transition-all duration-700">
                  <iframe 
                    ref={iframeRef}
                    title="Playground Preview"
                    className="w-full h-full border-none bg-transparent"
                    sandbox="allow-scripts"
                  />
                  
                  {isRunning && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center gap-4">
                       <div className="w-12 h-12 rounded-full border-4 border-black/5 border-t-electric-cyan animate-spin" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-electric-cyan">Compiling Assets...</span>
                    </div>
                  )}
               </div>

               {/* Floating Info Panels */}
               <div className="absolute bottom-12 right-12 z-20 flex flex-col gap-3 pointer-events-none">
                  <div className="bg-white/80 backdrop-blur-xl border border-black/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-right-4">
                     <div className="w-10 h-10 rounded-full bg-vibrant-purple/20 flex items-center justify-center text-vibrant-purple">
                        <Sparkles size={18} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1E293B]">Edge Hot Reload</p>
                        <p className="text-[9px] text-slate-gray font-bold">Active and Monitoring Changes</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </main>
    </div>
  );
};

export default CodePlayground;
