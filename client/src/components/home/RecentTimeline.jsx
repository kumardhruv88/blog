import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';


const TIMELINE_POSTS = [
  {
    id: 1,
    title: "Optimizing Web Vitals for Better SEO",
    date: "Feb 1, 2024",
    excerpt: "Practical strategies to improve LCP, FID, and CLS scores.",
    tags: ["SEO", "Performance"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Introduction to Graph Neural Networks",
    date: "Jan 28, 2024",
    excerpt: "Understanding the basics of GNNs and their applications.",
    tags: ["AI", "ML"],
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Securing JWT Authentication",
    date: "Jan 25, 2024",
    excerpt: "Common pitfalls and best practices for JWT security.",
    tags: ["Security", "Auth"],
    image: "https://images.unsplash.com/photo-1614064641938-3e852943721d?q=80&w=2080&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "CSS CSS CSS: The Future of Styling",
    date: "Jan 20, 2024",
    excerpt: "Exploring new CSS features like Container Queries and Layers.",
    tags: ["CSS", "Frontend"],
    image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?q=80&w=2070&auto=format&fit=crop"
  }
];

const RecentTimeline = () => {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="flex flex-col items-center mb-24 text-center">
         <motion.span 
           initial={{ opacity: 0, y: 10 }}
           whileInView={{ opacity: 1, y: 0 }}
           className="text-[10px] uppercase font-black tracking-[0.5em] text-electric-cyan mb-4"
         >
           Technical Journal
         </motion.span>
         <h2 className="text-4xl md:text-6xl font-heading font-black">
           Latest <span className="gradient-text">Documentation</span>
         </h2>
         <div className="w-24 h-1.5 bg-gradient-brand mt-6 rounded-full" />
      </div>

      <div className="relative">
        {/* Animated Connector Line */}
        <motion.div 
          initial={{ height: 0 }}
          whileInView={{ height: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute left-4 md:left-1/2 top-0 w-1 bg-gradient-to-b from-electric-cyan via-vibrant-purple to-transparent opacity-30 md:-translate-x-1/2" 
        />

        <div className="space-y-24">
          {TIMELINE_POSTS.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`relative flex flex-col md:flex-row items-center gap-12 ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Timeline Indicator Node */}
              <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-[#F5F0EB] border-4 border-black/5 flex items-center justify-center md:-translate-x-1/2 z-10">
                 <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-electric-cyan shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-black/10'}`} />
                 {/* Floating Glow */}
                 {index === 0 && <div className="absolute inset-0 rounded-full bg-electric-cyan/20 animate-ping" />}
              </div>

              {/* Date Column (Desktop Only) */}
              <div className={`hidden md:flex md:w-1/2 px-12 items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                 <span className="text-sm font-black text-slate-gray/50 tracking-widest uppercase flex items-center gap-3">
                    {index % 2 !== 0 && <div className="w-12 h-px bg-black/10" />}
                    {post.date}
                    {index % 2 === 0 && <div className="w-12 h-px bg-black/10" />}
                 </span>
              </div>

              {/* Content Card */}
              <div className="pl-12 md:pl-0 w-full md:w-1/2 px-4 md:px-0">
                <Card className="p-0 overflow-hidden glass-card-dark border-black/5 group hover:border-electric-cyan/30 transition-all duration-500">
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-48 h-48 overflow-hidden relative">
                       <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                       <div className="absolute inset-0 bg-gradient-to-t from-[#F5F0EB] to-transparent opacity-60" />
                    </div>
                    
                    <div className="flex-grow p-6 flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-4">
                         {post.tags.slice(0, 1).map(tag => (
                           <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-electric-cyan px-2 py-1 bg-electric-cyan/10 rounded-md">
                              {tag}
                           </span>
                         ))}
                         <span className="sm:hidden text-[10px] font-bold text-slate-gray uppercase">{post.date}</span>
                      </div>
                      
                      <h3 className="text-2xl font-heading font-black mb-3 leading-tight group-hover:text-electric-cyan transition-colors">
                        <Link to={`/blog/post-${post.id}`}>{post.title}</Link>
                      </h3>
                      
                      <p className="text-sm text-slate-gray line-clamp-2 mb-6 font-medium leading-relaxed">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex -space-x-2">
                           {[1, 2, 3].map(i => (
                             <div key={i} className="w-6 h-6 rounded-full border-2 border-[#F5F0EB] bg-black/5" />
                           ))}
                           <span className="text-[10px] text-slate-gray font-bold self-center ml-4 uppercase tracking-tighter">12+ Readers</span>
                        </div>
                        
                        <Link to={`/blog/post-${post.id}`} className="p-3 rounded-xl bg-black/5 text-[#1E293B] hover:bg-electric-cyan hover:text-white transition-all group-hover:translate-x-2">
                          <ArrowRight size={18} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-32">
        <Button 
          variant="outline" 
          className="px-12 py-6 h-auto rounded-2xl group border-black/10 hover:border-electric-cyan/50"
        >
          <span className="text-sm font-black uppercase tracking-[0.2em]">View Full Journal</span>
          <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
        </Button>
      </div>
    </section>
  );
};

export default RecentTimeline;
