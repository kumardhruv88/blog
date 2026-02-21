import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail, ArrowRight, Shield, Zap, Globe, Cpu, Server, Database, Layout, Smartphone, Cloud } from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

const About = () => {
  const techStack = [
    { name: 'React 18', icon: <Layout />, desc: 'Frontend Framework', color: '#61DAFB' },
    { name: 'Supabase', icon: <Database />, desc: 'Database & Auth', color: '#3ECF8E' },
    { name: 'Clerk', icon: <Shield />, desc: 'User Management', color: '#6C47FF' },
    { name: 'Vite', icon: <Zap />, desc: 'Build Tool', color: '#646CFF' },
    { name: 'Tailwind CSS', icon: <Layout />, desc: 'UI Styling', color: '#38BDF8' },
    { name: 'Framer Motion', icon: <Zap />, desc: 'Animations', color: '#FF0055' },
    { name: 'Node.js', icon: <Server />, desc: 'API Layer', color: '#339933' },
    { name: 'Cloudinary', icon: <Cloud />, desc: 'Media Storage', color: '#3448C5' }
  ];

  const features = [
    { 
      title: 'Technical Markdown', 
      desc: 'Optimized for code blocks, diagrams, and math symbols out of the box.',
      icon: <Cpu />
    },
    { 
      title: 'Knowledge Repository', 
      desc: 'Build a searchable, categorized database of everything you learn.',
      icon: <Globe />
    },
    { 
      title: 'Dev-First Analytics', 
      desc: 'Track which articles resonated most with the technical community.',
      icon: <Smartphone />
    }
  ];

  return (
    <div className="min-h-screen bg-[#FEFBF6] text-[#1E293B] overflow-hidden">
      {/* --- PARALLAX HERO --- */}
      <section className="relative h-[80vh] flex items-center justify-center pt-20">
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[10%] left-[15%] w-96 h-96 bg-blue-200/30 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[10%] right-[15%] w-[500px] h-[500px] bg-purple-200/30 blur-[150px] rounded-full" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
         </div>

         <div className="relative z-10 text-center px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
               <Badge variant="outline" className="mb-6 uppercase tracking-[0.2em] font-black border-electric-cyan/30 text-electric-cyan">TechScribe Vision</Badge>
               <h1 className="text-6xl md:text-8xl font-heading font-black mb-8 leading-tight">
                  Documenting the <br />
                  <span className="gradient-text">Future of Code.</span>
               </h1>
               <p className="text-xl md:text-2xl text-slate-gray max-w-2xl mx-auto leading-relaxed">
                  More than just a blog—TechScribe is a high-performance documentation platform designed for engineers to track their learning journey and share technical insights.
               </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-12 flex flex-col md:flex-row gap-6 justify-center"
            >
               <button className="px-10 py-4 bg-gradient-brand text-[#1E293B] font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:scale-105 transition-all">Start Documentation</button>
               <button className="px-10 py-4 border-2 border-black/10 hover:bg-black/5 font-black uppercase tracking-widest rounded-xl transition-all">Explore Features</button>
            </motion.div>
         </div>
      </section>

      {/* --- MISSION STATEMENT --- */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto border-t border-black/5">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-left">
            <div>
               <h2 className="text-4xl font-heading font-black mb-8">The <span className="text-electric-cyan">Learning Journal</span> Reimagined</h2>
               <div className="space-y-6 text-lg text-slate-gray leading-relaxed">
                  <p>
                    In the fast-paced world of technology, what you learn today can become the foundation of your career tomorrow. TechScribe was born out of the need for a beautiful, distraction-free environment to document complex technical topics.
                  </p>
                  <p>
                    We believe that teaching is the best way to learn. By documenting your process—the bugs, the breakthroughs, and the "aha!" moments—you're not just building a blog; you're building a source of truth for yourself and a beacon for others.
                  </p>
               </div>
               
               <div className="mt-12 grid grid-cols-2 gap-8">
                  <div className="border-l-2 border-electric-cyan pl-6">
                     <div className="text-4xl font-black text-[#1E293B] mb-1">100%</div>
                     <div className="text-sm font-bold text-slate-gray uppercase tracking-widest">Open Source</div>
                  </div>
                  <div className="border-l-2 border-vibrant-purple pl-6">
                     <div className="text-4xl font-black text-[#1E293B] mb-1">Developer</div>
                     <div className="text-sm font-bold text-slate-gray uppercase tracking-widest">Centric UI</div>
                  </div>
               </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
               {features.map((feature, i) => (
                 <motion.div
                   key={feature.title}
                   whileHover={{ x: 10 }}
                   className="p-8 bg-black/5 border border-black/10 rounded-3xl group"
                 >
                    <div className="flex items-start gap-6">
                       <div className="p-4 bg-black/5 text-electric-cyan rounded-2xl group-hover:bg-electric-cyan group-hover:text-[#1E293B] transition-all">
                          {feature.icon}
                       </div>
                       <div>
                          <h3 className="text-xl font-black mb-2">{feature.title}</h3>
                          <p className="text-slate-gray">{feature.desc}</p>
                       </div>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* --- TECH STACK GRID --- */}
      <section className="py-32 relative">
         <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-electric-cyan/20 to-transparent top-0" />
         <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
            <h2 className="text-4xl font-heading font-black mb-4">Built with Modern <span className="text-vibrant-purple">Architecture</span></h2>
            <p className="text-slate-gray max-w-2xl mx-auto mb-16">
               TechScribe leverages the best-in-class tools of the modern web to ensure performance, security, and a seamless developer experience.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {techStack.map((tech, i) => (
                 <motion.div
                   key={tech.name}
                   whileHover={{ y: -10 }}
                   className="p-8 bg-[#F5F0EB] border border-black/5 rounded-3xl hover:border-black/20 transition-all relative group"
                 >
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity rounded-3xl"
                      style={{ backgroundColor: tech.color }}
                    />
                    <div className="mb-4 inline-block p-4 bg-black/5 rounded-2xl text-slate-gray group-hover:text-[#1E293B] transition-colors" style={{ color: tech.color + '50' }}>
                       {React.cloneElement(tech.icon, { size: 32, style: { color: tech.color } })}
                    </div>
                    <h3 className="text-lg font-black text-[#1E293B] mb-1">{tech.name}</h3>
                    <p className="text-xs font-bold text-slate-gray uppercase tracking-widest">{tech.desc}</p>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* --- FOUNDER SECTION --- */}
      <section className="py-32 px-4 md:px-8 max-w-5xl mx-auto text-center">
         <div className="relative inline-block mb-8">
            <div className="w-32 h-32 rounded-full border-4 border-electric-cyan/20 p-2 overflow-hidden mx-auto">
               <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop" alt="Founder" className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-500" />
            </div>
            <div className="absolute -bottom-2 -right-2 p-2 bg-gradient-brand rounded-full text-[#1E293B]">
               <Zap size={20} />
            </div>
         </div>
         <h2 className="text-3xl font-heading font-black mb-4">A Project for the Community</h2>
         <p className="text-lg text-slate-gray mb-12 italic leading-relaxed">
            "TechScribe started as a private dashboard to track my own progress in AI and Web Development. Realizing that many developers shared the same struggle of organizing knowledge, I decided to open-source the design and architecture to help others document their journey."
         </p>
         
         <div className="flex justify-center gap-6">
            <button className="p-4 bg-black/5 hover:bg-black/10 rounded-2xl transition-all text-slate-gray hover:text-[#1E293B]"><Github /></button>
            <button className="p-4 bg-black/5 hover:bg-black/10 rounded-2xl transition-all text-slate-gray hover:text-[#1E293B]"><Twitter /></button>
            <button className="p-4 bg-black/5 hover:bg-black/10 rounded-2xl transition-all text-slate-gray hover:text-[#1E293B]"><Linkedin /></button>
            <button className="p-4 bg-black/5 hover:bg-black/10 rounded-2xl transition-all text-slate-gray hover:text-[#1E293B]"><Mail /></button>
         </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="pb-32 px-4">
         <div className="max-w-7xl mx-auto p-16 bg-white border border-black/5 rounded-[40px] text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200/30 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-purple-200/30 transition-colors duration-1000" />
            
            <h2 className="text-4xl md:text-5xl font-heading font-black mb-8 relative z-10">Ready to start your <span className="gradient-text">Documentation?</span></h2>
            <div className="flex flex-col md:flex-row gap-6 justify-center relative z-10">
               <button className="px-12 py-5 bg-gradient-brand text-[#1E293B] font-black uppercase tracking-widest rounded-2xl hover:brightness-110 transition-colors group">
                  Get Started Free <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
               </button>
               <button className="px-12 py-5 border-2 border-black/10 rounded-2xl font-black uppercase tracking-widest hover:bg-black/5 transition-colors">Join Community</button>
            </div>
         </div>
      </section>
    </div>
  );
};

export default About;
