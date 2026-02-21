import React, { useState } from 'react';
import { X, Twitter, Linkedin, Facebook, MessageCircle, Mail, Link as LinkIcon, Check, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';

const ShareModal = ({ isOpen, onClose, postTitle, postUrl }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('social'); // social, embed, qr
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const handleCopy = (text, setCopiedState) => {
    navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  const socials = [
    { name: 'Twitter', icon: Twitter, color: 'bg-[#1DA1F2]', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(postUrl)}` },
    { name: 'LinkedIn', icon: Linkedin, color: 'bg-[#0077B5]', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}` },
    { name: 'Facebook', icon: Facebook, color: 'bg-[#1877F2]', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}` },
    { name: 'Dev.to', icon: Layers, color: 'bg-[#0A0A0A]', url: `https://dev.to/new?prefill=${encodeURIComponent(`---\ntitle: ${postTitle}\npublished: true\n--- \nCheck out this post: ${postUrl}`)}` },
    { name: 'Reddit', icon: MessageCircle, color: 'bg-[#FF4500]', url: `https://www.reddit.com/submit?url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(postTitle)}` },
    { name: 'Email', icon: Mail, color: 'bg-slate-600', url: `mailto:?subject=${encodeURIComponent(postTitle)}&body=${encodeURIComponent(postUrl)}` },
  ];

  const embedCode = `<iframe src="${postUrl}/embed" width="100%" height="400" frameborder="0" style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);"></iframe>`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-deep-code-blue/80 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] glass-card border-white/10 z-[101] overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-brand opacity-50" />
            
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-heading font-bold text-white">Share this post</h2>
                <button onClick={onClose} className="text-slate-gray hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Tabs Container (Line 1830) */}
              <div className="flex border-b border-white/10 mb-8">
                {['social', 'embed', 'qr'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] relative transition-all ${activeTab === tab ? 'text-white' : 'text-slate-gray hover:text-white'}`}
                  >
                    {tab === 'qr' ? 'QR Code' : tab}
                    {activeTab === tab && (
                      <motion.div layoutId="share-tab-active" className="absolute bottom-0 left-0 right-0 h-[2px] bg-electric-cyan shadow-[0_0_10px_#64FFDA]" />
                    )}
                  </button>
                ))}
              </div>

              <div className="min-h-[250px]">
                <AnimatePresence mode="wait">
                  {activeTab === 'social' && (
                    <motion.div 
                      key="social"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                    >
                      <div className="grid grid-cols-3 gap-4 mb-8">
                        {socials.map((social) => (
                          <a
                            key={social.name}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all group"
                          >
                            <div className={`p-3 rounded-xl ${social.color} shadow-lg mb-2 group-hover:scale-110 transition-transform`}>
                              <social.icon size={20} className="text-white" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-gray group-hover:text-white">{social.name}</span>
                          </a>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-gray uppercase tracking-widest">Post Link</p>
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            readOnly
                            value={postUrl}
                            className="w-full bg-[#051122]/50 border border-white/10 rounded-xl py-4 pl-4 pr-32 text-xs text-slate-gray font-mono outline-none"
                          />
                          <button
                            onClick={() => handleCopy(postUrl, setCopied)}
                            className="absolute right-2 px-4 py-2 gradient-brand rounded-lg text-deep-code-blue font-black text-[10px] uppercase flex items-center gap-2 hover:shadow-[0_0_15px_rgba(100,255,218,0.4)] transition-all"
                          >
                            {copied ? <Check size={14} /> : <LinkIcon size={14} />}
                            {copied ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'embed' && (
                    <motion.div 
                      key="embed"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-4"
                    >
                      <p className="text-[10px] font-black text-slate-gray uppercase tracking-widest">Embed snippet (iframe)</p>
                      <div className="relative h-32 glass-card-dark bg-black/50 border-white/10 rounded-xl p-4 font-mono text-[10px] text-electric-cyan/80 leading-relaxed overflow-hidden scrollbar-hide">
                         {embedCode}
                         <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                      </div>
                      <Button 
                        onClick={() => handleCopy(embedCode, setCopiedEmbed)} 
                        className="w-full uppercase text-[10px] font-black tracking-widest py-4"
                      >
                        {copiedEmbed ? 'Copied to Clipboard' : 'Copy Embed Code'}
                      </Button>
                      <p className="text-[10px] text-slate-gray text-center italic">Best for React, Next.js or any CMS with HTML support.</p>
                    </motion.div>
                  )}

                  {activeTab === 'qr' && (
                    <motion.div 
                      key="qr"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col items-center justify-center space-y-6"
                    >
                      <div className="p-6 bg-white rounded-3xl shadow-[0_0_30px_rgba(100,255,218,0.15)] relative group cursor-pointer">
                         <div className="absolute inset-0 border-2 border-dashed border-electric-cyan rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                         <img 
                           src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(postUrl)}`}
                           className="w-40 h-40" 
                           alt="QR Code" 
                         />
                      </div>
                      <div className="text-center">
                         <h4 className="text-white font-bold mb-1">Scan for direct access</h4>
                         <p className="text-xs text-slate-gray">Share this post in person or via presentations.</p>
                      </div>
                      <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-electric-cyan">Download High-Res (SVG)</Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
