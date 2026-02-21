import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Cpu, Database, Globe, Layout, Server, Terminal, Box, Cloud, Lock, Zap } from 'lucide-react';

const CATEGORIES = [
  { id: 1, name: "AI & ML", icon: Cpu, count: 12, color: "from-purple-500 to-indigo-500" },
  { id: 2, name: "React", icon: Code2, count: 24, color: "from-cyan-400 to-blue-500" },
  { id: 3, name: "Python", icon: Terminal, count: 18, color: "from-yellow-400 to-orange-500" },
  { id: 4, name: "Backend", icon: Server, count: 15, color: "from-green-400 to-emerald-600" },
  { id: 5, name: "DevOps", icon: Cloud, count: 9, color: "from-blue-400 to-indigo-600" },
  { id: 6, name: "System Design", icon: Layout, count: 7, color: "from-pink-500 to-rose-500" },
  { id: 7, name: "Database", icon: Database, count: 11, color: "from-teal-400 to-cyan-600" },
  { id: 8, name: "Algorithms", icon: Zap, count: 20, color: "from-orange-400 to-red-500" },
  { id: 9, name: "Security", icon: Lock, count: 5, color: "from-red-500 to-pink-600" },
  { id: 10, name: "Docker", icon: Box, count: 8, color: "from-blue-500 to-cyan-500" },
  { id: 11, name: "Web Dev", icon: Globe, count: 30, color: "from-indigo-400 to-purple-600" },
];

const CategoryCard = ({ cat }) => (
  <div className="flex-shrink-0 w-52 group cursor-pointer">
    <div className="relative bg-white/70 backdrop-blur-xl border border-black/[0.06] rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-500 hover:border-blue-300/50 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/[0.06] overflow-hidden">
      {/* Background glow on hover */}
      <div className={`absolute -inset-4 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-[0.08] blur-2xl transition-opacity duration-500`} />
      
      {/* Icon */}
      <div className="relative">
        <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
        <div className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500`}>
          <cat.icon className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Name & count */}
      <div className="relative z-10 text-center">
        <h3 className="text-lg font-heading font-black text-[#1E293B] group-hover:text-blue-600 transition-colors mb-1">
          {cat.name}
        </h3>
        <div className="flex items-center gap-1.5 justify-center">
          <span className="w-1 h-1 rounded-full bg-blue-400 group-hover:animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {cat.count} articles
          </span>
        </div>
      </div>
    </div>
  </div>
);

const CategoryCarousel = () => {
  // Duplicate for seamless infinite loop
  const doubled = [...CATEGORIES, ...CATEGORIES];

  return (
    <section className="py-24 bg-white/30 border-y border-black/[0.04] relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-blue-200/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-purple-200/20 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="flex items-end justify-between mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-slate-400 mb-2 block">Categories</span>
            <h2 className="text-3xl md:text-5xl font-heading font-black text-[#1E293B]">
              Explore by <span className="gradient-text">Technology</span>
            </h2>
          </motion.div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-black/[0.03] rounded-full border border-black/[0.04]">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Auto-scrolling</span>
          </div>
        </div>
      </div>

      {/* Infinite marquee */}
      <div className="relative">
        {/* Left/right fade edges */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#FEFBF6] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#FEFBF6] to-transparent z-10 pointer-events-none" />

        <div className="marquee-track gap-6 py-2">
          {doubled.map((cat, i) => (
            <div key={`${cat.id}-${i}`} className="px-2">
              <CategoryCard cat={cat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCarousel;
