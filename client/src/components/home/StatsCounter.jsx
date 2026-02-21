import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FileText, Tag, Clock, Code, ArrowUpRight } from 'lucide-react';

const AnimatedCounter = ({ value, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const numericValue = parseInt(value) || 0;
  const suffix = value.toString().replace(numericValue.toString(), '');

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const startTime = Date.now() + delay * 1000;

    const animate = () => {
      const now = Date.now();
      if (now < startTime) { requestAnimationFrame(animate); return; }
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.round(eased * numericValue));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, numericValue, delay]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
};

const STATS = [
  {
    label: "Total Posts",
    value: "127",
    icon: FileText,
    color: "from-blue-500 to-cyan-400",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    description: "In-depth technical articles",
    span: "col-span-1",
  },
  {
    label: "Topics Covered",
    value: "23",
    icon: Tag,
    color: "from-purple-500 to-pink-400",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
    description: "Across the tech landscape",
    span: "col-span-1",
  },
  {
    label: "Reading Time",
    value: "18h",
    icon: Clock,
    color: "from-amber-500 to-orange-400",
    bgColor: "bg-amber-50",
    textColor: "text-amber-600",
    description: "Of curated content",
    span: "col-span-1",
  },
  {
    label: "Code Snippets",
    value: "342",
    icon: Code,
    color: "from-emerald-500 to-teal-400",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
    description: "Copy-paste ready examples",
    span: "col-span-1",
  },
];

const StatsCounter = () => {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-slate-400 mb-2 block">Metrics</span>
        <h2 className="text-3xl md:text-5xl font-heading font-black text-[#1E293B] mb-3">
          Learning <span className="gradient-text">Progress</span>
        </h2>
        <p className="text-slate-500 max-w-lg mx-auto">
          Tracking my journey one commit at a time.
        </p>
      </motion.div>

      {/* Bento grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {STATS.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className={`${stat.span} group relative`}
          >
            <div className="relative bg-white/70 backdrop-blur-xl border border-black/[0.06] rounded-2xl p-6 md:p-8 overflow-hidden hover:border-blue-200/50 hover:shadow-xl hover:shadow-blue-500/[0.05] transition-all duration-500 h-full">
              {/* Gradient glow on hover */}
              <div className={`absolute -inset-4 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-[0.06] blur-3xl transition-opacity duration-500`} />

              {/* Corner accent */}
              <div className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${stat.color} rounded-full opacity-[0.06] group-hover:opacity-[0.12] transition-opacity blur-xl`} />

              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>

                {/* Value */}
                <div className="text-4xl md:text-5xl font-heading font-black text-[#1E293B] mb-1 leading-none">
                  <AnimatedCounter value={stat.value} delay={index * 0.15} />
                </div>

                {/* Label */}
                <div className="text-sm font-bold text-[#1E293B] mb-1">{stat.label}</div>
                <div className="text-xs text-slate-400">{stat.description}</div>

                {/* Hover arrow */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight size={16} className="text-slate-300" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StatsCounter;
