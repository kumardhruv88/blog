import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Code2, Search } from 'lucide-react';
import { useScroll, motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Blog', path: '/blog' },
    { label: 'Research', path: '/research' },
    { label: 'Snippets', path: '/snippets' },
    { label: 'About', path: '/about' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-xl border-b border-black/5 shadow-sm py-3' 
            : 'bg-transparent py-5'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center group-hover:scale-110 transition-transform">
                 <Code2 className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-heading font-bold tracking-tight text-[#1E293B] group-hover:text-electric-cyan transition-colors">
                TechScribe
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors relative ${
                    isActive(link.path) 
                      ? 'text-electric-cyan' 
                      : 'text-slate-gray hover:text-[#1E293B]'
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-electric-cyan shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Link 
                to="/search"
                className="text-slate-gray hover:text-electric-cyan transition-colors p-2 rounded-full hover:bg-black/5"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </Link>

              <div className="w-px h-6 bg-black/10" />

              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="secondary" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <Link 
                  to="/dashboard"
                  className="text-sm font-bold text-electric-cyan hover:text-white transition-colors px-4 py-2 bg-electric-cyan/10 rounded-xl"
                >
                  Dashboard
                </Link>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9 border-2 border-electric-cyan/20 ring-2 ring-electric-cyan/10"
                    }
                  }}
                />
              </SignedIn>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-[#1E293B] p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-[70px] z-40 bg-[#F5F0EB]/95 backdrop-blur-xl md:hidden flex flex-col p-6 border-t border-black/5"
          >
             <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-lg font-medium ${
                    isActive(link.path) 
                      ? 'text-electric-cyan' 
                      : 'text-slate-gray'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="h-px bg-black/10 my-2" />
              
              <SignedIn>
                <Link
                  to="/dashboard"
                  className="text-lg font-bold text-electric-cyan"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Dashboard
                </Link>
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <Button className="w-full">Sign In</Button>
                </SignInButton>
              </SignedOut>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
