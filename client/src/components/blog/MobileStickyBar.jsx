import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, ArrowUp } from 'lucide-react';

const MobileStickyBar = ({ 
  isVisible: initialIsVisible, 
  progress, 
  isBookmarked, 
  onBookmark, 
  onShare,
  bookmarkCount = 0 
}) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);

  // Scroll visibility logic (Lines 1895-1898)
  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const showBar = initialIsVisible && isVisible;

  return (
    <AnimatePresence>
      {showBar && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 h-16 glass-card border-t border-white/10 z-[80] flex items-center justify-around px-6 md:hidden lg:hidden"
        >
          {/* Bookmark Action */}
          <button 
            onClick={onBookmark}
            className="flex flex-col items-center justify-center gap-1 min-w-[44px]"
          >
            <Heart 
              size={20} 
              className={isBookmarked ? 'text-neon-pink fill-neon-pink' : 'text-slate-gray'} 
            />
            <span className="text-[10px] font-bold text-slate-gray">{bookmarkCount}</span>
          </button>

          {/* Progress Ring */}
          <div className="relative flex flex-col items-center justify-center min-w-[44px]">
             <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  className="text-white/10"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray={125.6}
                  strokeDashoffset={125.6 * (1 - progress)}
                  className="text-electric-cyan transition-all duration-300"
                />
             </svg>
             <span className="absolute text-[10px] font-bold text-white">
               {Math.round(progress * 100)}%
             </span>
          </div>

          {/* Share Action */}
          <button 
            onClick={onShare}
            className="flex flex-col items-center justify-center gap-1 min-w-[44px]"
          >
            <Share2 size={20} className="text-slate-gray" />
            <span className="text-[10px] font-bold text-slate-gray uppercase tracking-widest">Share</span>
          </button>

          {/* Scroll to Top helper if needed or just 3 buttons as spec */}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileStickyBar;
