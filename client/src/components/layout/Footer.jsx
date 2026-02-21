import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Mail, Code, Database, Server, Zap, Heart } from 'lucide-react';
import Button from '../common/Button';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Code, href: 'https://dev.to', label: 'Dev.to' },
    { icon: Mail, href: 'mailto:contact@techscribe.dev', label: 'Email' },
  ];

  const quickLinks = [
    { label: 'About', path: '/about' },
    { label: 'Research Papers', path: '/research' },
    { label: 'Contact', path: '/contact' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Sitemap', path: '/sitemap.xml' },
  ];

  const categories = [
    { label: 'AI & Machine Learning', path: '/blog/category/ai-ml' },
    { label: 'Web Development', path: '/blog/category/web-dev' },
    { label: 'Cloud Computing', path: '/blog/category/cloud' },
    { label: 'DevOps', path: '/blog/category/devops' },
    { label: 'System Design', path: '/blog/category/system-design' },
  ];

  return (
    <footer className="mt-auto border-t border-black/5 bg-white/80 backdrop-blur-xl relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: About */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-heading font-bold gradient-text">TechScribe</span>
            </Link>
            <p className="text-slate-gray text-sm leading-relaxed max-w-xs">
              Documenting the journey through code. A personal knowledge base and technical blog for developers.
            </p>
            <div className="flex items-center text-sm text-slate-gray">
              <span>Built with</span>
              <Heart className="w-4 h-4 text-neon-pink mx-1 fill-neon-pink" />
              <span>by Dhruv</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-[#1E293B] font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.path} 
                    className="text-slate-gray hover:text-electric-cyan transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h3 className="text-[#1E293B] font-bold mb-6">Categories</h3>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.label}>
                  <Link 
                    to={cat.path}
                    className="text-slate-gray hover:text-vibrant-purple transition-colors text-sm"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  to="/blog" 
                  className="text-electric-cyan text-sm font-medium hover:underline mt-2 inline-block"
                >
                  View All Categories →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div>
            <h3 className="text-[#1E293B] font-bold mb-6">Connect</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-black/5 border border-black/10 flex items-center justify-center text-slate-gray hover:text-electric-cyan hover:border-electric-cyan/30 hover:bg-electric-cyan/5 transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-gray text-sm">
            © {currentYear} TechScribe. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4 text-slate-gray text-sm">
            <span className="hidden md:inline">Powered by:</span>
            <div className="flex gap-3">
              <div title="React" className="hover:text-electric-cyan transition-colors cursor-help"><Code className="w-5 h-5" /></div>
              <div title="Supabase" className="hover:text-emerald-400 transition-colors cursor-help"><Database className="w-5 h-5" /></div>
              <div title="Clerk" className="hover:text-indigo-400 transition-colors cursor-help"><UserIcon className="w-5 h-5" /></div>
              <div title="Vercel" className="hover:text-white transition-colors cursor-help"><Triangle className="w-5 h-5" /></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Helper components for icons that might not be in the main import list
const UserIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const Triangle = (props) => (
   <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 20h18L12 4z"/></svg>
);

export default Footer;
