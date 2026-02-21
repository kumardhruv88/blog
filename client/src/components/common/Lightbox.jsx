import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Lightbox = ({ isOpen, imageSrc, alt, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-7xl max-h-[90vh] w-full flex items-center justify-center p-2"
          >
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <img
              src={imageSrc}
              alt={alt}
              className="max-h-[85vh] w-auto rounded-lg shadow-2xl object-contain border border-white/10"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;
