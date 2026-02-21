import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout, Search as SearchIcon, Image as ImageIcon,
  Palette, Smartphone, Bell, Lock, Database, Trash2,
  RefreshCcw, Terminal, ExternalLink, Share2, Mail,
  Globe, Download, FileText, Zap
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Layout },
    { id: 'seo', label: 'Search Optimization', icon: SearchIcon },
    { id: 'social', label: 'Social Sync', icon: Share2 },
    { id: 'email', label: 'Mail Services', icon: Mail },
    { id: 'security', label: 'Security Vault', icon: Lock },
    { id: 'advanced', label: 'System Engine', icon: Database },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h2 className="text-3xl font-heading font-black text-[#1E293B]">System <span className="gradient-text">Configuration</span></h2>
        <p className="text-slate-gray text-sm mt-1">Platform-wide preferences and architectural controls</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation */}
        <aside className="lg:w-72 space-y-1">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all relative group ${activeTab === tab.id ? 'text-[#1E293B]' : 'text-slate-gray hover:text-[#1E293B] hover:bg-black/5'}`}
            >
              {activeTab === tab.id && <motion.div layoutId="settings-nav" className="absolute inset-0 bg-black/5 rounded-2xl border border-black/10" />}
              <tab.icon size={18} className={activeTab === tab.id ? 'text-electric-cyan' : 'group-hover:scale-110 transition-transform'} />
              <span className="text-xs font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* Settings Content */}
        <div className="flex-grow">
          <Card className="p-10 border-black/5 glass-card-dark min-h-[600px] relative">
            {activeTab === 'general' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-gray ml-1">Platform Identity</label>
                      <input type="text" placeholder="TechScribe" className="w-full bg-[#FEFBF6] border border-black/10 rounded-xl px-5 py-3.5 text-sm text-[#1E293B] focus:border-electric-cyan outline-none transition-all font-bold" />
                      <input type="text" placeholder="Documenting the digital frontier" className="w-full bg-[#FEFBF6] border border-black/10 rounded-xl px-5 py-3.5 text-sm text-[#1E293B] focus:border-electric-cyan outline-none transition-all font-bold" />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-gray ml-1">Branding Assets</label>
                      <div className="flex gap-4">
                         <div className="w-20 h-20 bg-black/5 border border-dashed border-black/20 rounded-2xl flex items-center justify-center text-slate-gray hover:text-electric-cyan cursor-pointer transition-all"><ImageIcon size={32} /></div>
                         <div className="flex-grow space-y-2 flex flex-col justify-center">
                            <Button icon={Download} size="sm" variant="outline">Upload New Logo</Button>
                            <p className="text-[9px] text-slate-gray/50 italic font-mono px-2">PNG, Max 2MB, Transp. bg</p>
                         </div>
                      </div>
                   </div>
                </div>
                <div className="pt-10 border-t border-black/5">
                   <h5 className="text-xs font-black uppercase text-[#1E293B] tracking-widest mb-6 italic">Color Signature Settings</h5>
                   <div className="flex flex-wrap gap-8">
                      {[ { l: 'Primary Hub', c: '#2563EB' }, { l: 'Accent Pulse', c: '#BD34FE' }, { l: 'Status Danger', c: '#FF3366' } ].map((c, i) => (
                        <div key={i} className="space-y-2">
                           <span className="text-[9px] font-black text-slate-gray block uppercase">{c.l}</span>
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl border border-black/10 cursor-pointer" style={{ backgroundColor: c.c }} />
                              <span className="text-[10px] font-mono font-black text-[#1E293B]">{c.c}</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-5">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      { l: 'New User Registration', d: 'Enable platform-wide account creation', active: true },
                      { l: 'Email Verification', d: 'Enforce mandatory credential validation', active: true },
                      { l: 'Multi-Factor Auth', d: 'Apply secondary security layer for admins', active: false },
                      { l: 'Comment Strictness', d: 'Require manual approval for all submissions', active: true },
                    ].map((s, i) => (
                      <div key={i} className="p-6 bg-white/[0.02] border border-black/5 rounded-3xl flex items-center justify-between hover:border-black/20 transition-all group">
                         <div>
                            <h6 className="text-xs font-black text-[#1E293B] uppercase tracking-widest mb-1">{s.l}</h6>
                            <p className="text-[10px] text-slate-gray">{s.d}</p>
                         </div>
                         <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${s.active ? 'bg-electric-cyan' : 'bg-black/10'}`}><div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${s.active ? 'right-1 bg-deep-code-blue' : 'left-1 bg-slate-gray'}`} /></div>
                      </div>
                    ))}
                 </div>
                 <div className="space-y-4 pt-10 border-t border-black/5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-gray ml-1">Blacklisted IP Matrix</label>
                    <textarea placeholder="192.168.1.1&#10;104.28.14.2" className="w-full h-32 bg-[#FEFBF6] border border-black/10 rounded-2xl p-5 text-sm text-[#1E293B] font-mono focus:border-red-400 outline-none transition-all no-scrollbar" />
                 </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-5">
                 <div className="space-y-6">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-gray ml-1 mb-2">Search Engine Basics</h5>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-gray ml-1">Meta Title</label>
                       <input type="text" placeholder="TechScribe - Document Your Code Journey" className="w-full bg-[#FEFBF6] border border-black/10 rounded-xl px-5 py-3.5 text-sm text-[#1E293B] focus:border-electric-cyan outline-none transition-all font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-gray ml-1">Meta Description</label>
                       <textarea rows="3" placeholder="A platform for developers to share knowledge, tutorials, and insights..." className="w-full bg-[#FEFBF6] border border-black/10 rounded-xl px-5 py-3.5 text-sm text-[#1E293B] focus:border-electric-cyan outline-none transition-all font-medium resize-none" />
                    </div>
                 </div>

                 <div className="pt-10 border-t border-black/5 space-y-6">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-gray ml-1 mb-2">Crawling & Indexing</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-gray ml-1">Sitemap URL</label>
                          <div className="flex gap-2">
                             <input type="text" readOnly value="https://techscribe.dev/sitemap.xml" className="w-full bg-[#FEFBF6] border border-black/10 rounded-xl px-5 py-3.5 text-sm text-slate-gray font-mono outline-none" />
                             <Button icon={RefreshCcw} size="sm" variant="outline">Regen</Button>
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-gray ml-1">Robots.txt</label>
                          <Button icon={FileText} size="sm" className="w-full justify-start">Edit Robots.txt</Button>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-5">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-gray ml-1">Social Handles</label>
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#1DA1F2]/10 text-[#1DA1F2] flex items-center justify-center border border-[#1DA1F2]/20"><Globe size={20} /></div>
                          <input type="text" placeholder="@TechScribe" className="flex-grow bg-[#FEFBF6] border border-black/10 rounded-xl px-5 py-3 text-sm text-[#1E293B] focus:border-electric-cyan outline-none transition-all font-bold" />
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#0A66C2]/10 text-[#0A66C2] flex items-center justify-center border border-[#0A66C2]/20"><Share2 size={20} /></div>
                          <input type="text" placeholder="linkedin.com/company/techscribe" className="flex-grow bg-[#FEFBF6] border border-black/10 rounded-xl px-5 py-3 text-sm text-[#1E293B] focus:border-electric-cyan outline-none transition-all font-bold" />
                       </div>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-gray ml-1">Sharing Options</label>
                       <div className="p-6 bg-white/[0.02] border border-black/5 rounded-3xl space-y-4">
                          {['Enable Twitter Sharing', 'Enable LinkedIn Sharing', 'Show Share Counts'].map((opt, i) => (
                             <div key={i} className="flex items-center justify-between group">
                                <span className="text-xs font-bold text-slate-gray group-hover:text-[#1E293B] transition-colors">{opt}</span>
                                <div className={`w-10 h-5 rounded-full relative cursor-pointer ${i < 2 ? 'bg-electric-cyan' : 'bg-black/10'}`}><div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${i < 2 ? 'right-1 bg-deep-code-blue' : 'left-1 bg-slate-gray'}`} /></div>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-5">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-gray ml-1">SMTP Configuration</label>
                       <input type="text" placeholder="smtp.gmail.com" className="w-full bg-[#FEFBF6] border border-black/10 rounded-xl px-5 py-3 text-sm text-[#1E293B] focus:border-electric-cyan outline-none transition-all font-mono" />
                       <div className="grid grid-cols-2 gap-4">
                          <input type="text" placeholder="587" className="w-full bg-[#FEFBF6] border border-black/10 rounded-xl px-5 py-3 text-sm text-[#1E293B] focus:border-electric-cyan outline-none transition-all font-mono" />
                          <input type="text" placeholder="TLS/SSL" className="w-full bg-[#FEFBF6] border border-black/10 rounded-xl px-5 py-3 text-sm text-[#1E293B] focus:border-electric-cyan outline-none transition-all font-mono" />
                       </div>
                       <input type="password" placeholder="••••••••••••" className="w-full bg-[#FEFBF6] border border-black/10 rounded-xl px-5 py-3 text-sm text-[#1E293B] focus:border-electric-cyan outline-none transition-all font-mono" />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-gray ml-1">Transactional Emails</label>
                       <div className="space-y-2">
                          {[
                             { l: 'Welcome Email', d: 'Sent upon registration' },
                             { l: 'Password Reset', d: 'Security recovery flow' },
                             { l: 'New Digest', d: 'Weekly summary' }
                          ].map((e, i) => (
                             <div key={i} className="flex items-center justify-between p-3 border border-black/5 rounded-xl bg-white/[0.02]">
                                <div>
                                   <p className="text-xs font-bold text-[#1E293B]">{e.l}</p>
                                   <p className="text-[9px] text-slate-gray">{e.d}</p>
                                </div>
                                <Button size="sm" variant="ghost" icon={ExternalLink} />
                             </div>
                          ))}
                       </div>
                       <Button icon={Mail} className="w-full">Send Test Email</Button>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-5">
                 <div className="p-6 bg-red-400/5 border border-red-400/10 rounded-3xl flex items-center justify-between">
                    <div>
                       <h6 className="text-sm font-black text-red-400 uppercase tracking-widest mb-1 flex items-center gap-2"><Lock size={14} /> Maintenance Mode</h6>
                       <p className="text-xs text-red-400/70">Shutdown public access. Only admins can login.</p>
                    </div>
                    <div className="w-12 h-6 rounded-full relative cursor-pointer bg-black/10 hover:bg-red-400/20 transition-all"><div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-slate-gray shadow-lg" /></div>
                 </div>
                 
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-gray ml-1">Custom Injection</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <span className="text-[9px] font-black text-electric-cyan uppercase">Global CSS</span>
                          <textarea placeholder="/* Custom Styles */" className="w-full h-40 bg-[#FEFBF6] border border-black/10 rounded-2xl p-4 text-xs font-mono text-electric-cyan/80 focus:border-electric-cyan outline-none transition-all no-scrollbar" />
                       </div>
                       <div className="space-y-2">
                          <span className="text-[9px] font-black text-vibrant-purple uppercase">Global JS</span>
                          <textarea placeholder="// Custom Scripts" className="w-full h-40 bg-[#FEFBF6] border border-black/10 rounded-2xl p-4 text-xs font-mono text-vibrant-purple/80 focus:border-vibrant-purple outline-none transition-all no-scrollbar" />
                       </div>
                    </div>
                 </div>

                 <div className="pt-10 border-t border-black/5">
                    <h5 className="text-xs font-black uppercase text-[#1E293B] tracking-widest mb-6 italic">Data Governance</h5>
                    <div className="flex gap-4">
                       <Button icon={Database} variant="outline">Backup SQL</Button>
                       <Button icon={RefreshCcw} variant="outline">Clear Cache</Button>
                    </div>
                 </div>
              </div>
            )}

            <div className="absolute bottom-10 right-10">
               <Button icon={Zap}>Save Configuration</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
