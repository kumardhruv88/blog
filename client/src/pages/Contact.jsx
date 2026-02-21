import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, Github, Twitter, Linkedin, MapPin, Phone } from 'lucide-react';
import Card from '../components/common/Card';

const Contact = () => {
  return (
    <div className="min-h-screen pt-32 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
         <motion.h1 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-5xl md:text-7xl font-heading font-black mb-6"
         >
            Get In <span className="gradient-text">Touch</span>
         </motion.h1>
         <p className="text-xl text-slate-gray max-w-2xl mx-auto">
            Have a question about a post, a suggestion for a new feature, or just want to say hi? I'd love to hear from you.
         </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* --- CONTACT INFO --- */}
         <div className="lg:col-span-1 space-y-6">
            <Card className="p-8 bg-white/70 border-black/5">
                <div className="flex items-center gap-6 mb-8 group">
                   <div className="p-4 bg-electric-cyan/10 text-electric-cyan rounded-2xl group-hover:bg-electric-cyan group-hover:text-[#1E293B] transition-all">
                      <Mail size={24} />
                   </div>
                   <div>
                      <h3 className="text-sm font-black text-slate-gray uppercase tracking-widest">Email</h3>
                      <p className="text-lg font-bold text-[#1E293B]">hello@techscribe.com</p>
                   </div>
                </div>

                <div className="flex items-center gap-6 mb-8 group">
                   <div className="p-4 bg-vibrant-purple/10 text-vibrant-purple rounded-2xl group-hover:bg-vibrant-purple group-hover:text-[#1E293B] transition-all">
                      <MessageSquare size={24} />
                   </div>
                   <div>
                      <h3 className="text-sm font-black text-slate-gray uppercase tracking-widest">Discord</h3>
                      <p className="text-lg font-bold text-[#1E293B]">TechScribe#8812</p>
                   </div>
                </div>

                <div className="flex items-center gap-6 group">
                   <div className="p-4 bg-neon-pink/10 text-neon-pink rounded-2xl group-hover:bg-neon-pink group-hover:text-[#1E293B] transition-all">
                      <MapPin size={24} />
                   </div>
                   <div>
                      <h3 className="text-sm font-black text-slate-gray uppercase tracking-widest">Location</h3>
                      <p className="text-lg font-bold text-[#1E293B]">Remote / Distributed</p>
                   </div>
                </div>
            </Card>

            <Card className="p-8 bg-white/70 border-black/5">
               <h3 className="text-lg font-black mb-6">Social Channels</h3>
               <div className="flex gap-4">
                  <button className="flex-1 p-4 bg-black/5 hover:bg-black/10 rounded-2xl transition-all text-slate-gray hover:text-[#1E293B] flex justify-center"><Github /></button>
                  <button className="flex-1 p-4 bg-black/5 hover:bg-black/10 rounded-2xl transition-all text-slate-gray hover:text-[#1E293B] flex justify-center"><Twitter /></button>
                  <button className="flex-1 p-4 bg-black/5 hover:bg-black/10 rounded-2xl transition-all text-slate-gray hover:text-[#1E293B] flex justify-center"><Linkedin /></button>
               </div>
            </Card>
         </div>

         {/* --- CONTACT FORM --- */}
         <div className="lg:col-span-2">
            <Card className="p-8 md:p-12 bg-white/80 backdrop-blur-xl border-black/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-electric-cyan/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
               
               <form className="relative z-10 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm font-black text-slate-gray uppercase tracking-widest">Full Name</label>
                        <input type="text" placeholder="John Doe" className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3 outline-none focus:border-electric-cyan/50 transition-all text-[#1E293B]" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-black text-slate-gray uppercase tracking-widest">Email Address</label>
                        <input type="email" placeholder="john@example.com" className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3 outline-none focus:border-electric-cyan/50 transition-all text-[#1E293B]" />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-sm font-black text-slate-gray uppercase tracking-widest">Subject</label>
                     <select className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3 outline-none focus:border-electric-cyan/50 transition-all text-[#1E293B] appearance-none">
                        <option className="bg-[#F5F0EB]">General Inquiry</option>
                        <option className="bg-[#F5F0EB]">Feature Request</option>
                        <option className="bg-[#F5F0EB]">Collaboration</option>
                        <option className="bg-[#F5F0EB]">Technical Issue</option>
                     </select>
                  </div>

                  <div className="space-y-2">
                     <label className="text-sm font-black text-slate-gray uppercase tracking-widest">Message</label>
                     <textarea rows="6" placeholder="Your message here..." className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3 outline-none focus:border-electric-cyan/50 transition-all text-[#1E293B] resize-none"></textarea>
                  </div>

                  <button className="w-full py-4 bg-gradient-brand text-[#1E293B] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                     Send Message <Send size={18} />
                  </button>
               </form>
            </Card>
         </div>
      </div>
    </div>
  );
};

export default Contact;
