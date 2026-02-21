import React from 'react';
import { twMerge } from 'tailwind-merge';

const Badge = ({
  children,
  variant = 'default',
  className,
  size = 'md'
}) => {
  const variants = {
    default: 'bg-slate-gray/10 text-slate-gray border border-slate-gray/20',
    primary: 'bg-electric-cyan/10 text-electric-cyan border border-electric-cyan/20',
    purple: 'bg-vibrant-purple/10 text-vibrant-purple border border-vibrant-purple/20',
    pink: 'bg-neon-pink/10 text-neon-pink border border-neon-pink/20',
    gradient: 'bg-gradient-to-r from-electric-cyan/20 to-vibrant-purple/20 text-ghost-white border border-electric-cyan/30'
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-4 py-1.5'
  };

  return (
    <span
      className={twMerge(
        'inline-flex items-center justify-center font-code font-medium rounded-full uppercase tracking-wider',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
