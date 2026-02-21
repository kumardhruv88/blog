import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  loading = false,
  icon: Icon,
  onClick,
  disabled
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-accent font-medium rounded-lg transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'gradient-cta text-white hover:shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:scale-[1.02]',
    secondary: 'bg-transparent border border-electric-cyan text-electric-cyan hover:bg-electric-cyan/10',
    ghost: 'bg-transparent text-slate-gray hover:text-electric-cyan hover:underline decoration-electric-cyan underline-offset-4',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20'
  };

  const sizes = {
    sm: 'h-9 px-4 text-xs',
    md: 'h-10 px-6 text-sm',
    lg: 'h-12 px-8 text-base'
  };

  return (
    <motion.button
      type={type}
      className={twMerge(baseStyles, variants[variant], sizes[size], className)}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : Icon ? (
        <Icon className="w-4 h-4 mr-2" />
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;
