import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = React.forwardRef(({
  label,
  error,
  className,
  icon: Icon,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-gray mb-1.5 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-slate-gray group-focus-within:text-electric-cyan transition-colors" />
          </div>
        )}
        <input
          ref={ref}
          className={twMerge(
            'w-full bg-white/80 backdrop-blur-sm border border-black/10 rounded-lg',
            'px-4 py-3 text-ghost-white placeholder-slate-gray/50',
            'focus:outline-none focus:border-electric-cyan focus:ring-1 focus:ring-electric-cyan/20',
            'transition-all duration-300 font-body',
            Icon && 'pl-10',
            error && 'border-neon-pink focus:border-neon-pink focus:ring-neon-pink/20',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-neon-pink ml-1">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
