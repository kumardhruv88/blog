import React from 'react';
import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const CALLOUT_TYPES = {
  info: {
    icon: Info,
    className: 'bg-blue-500/5 border-l-blue-500 text-blue-200',
    iconColor: 'text-blue-400',
    borderColor: 'from-blue-500 to-cyan-500'
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-orange-500/5 border-l-orange-500 text-orange-200',
    iconColor: 'text-orange-400',
    borderColor: 'from-orange-500 to-yellow-500'
  },
  success: {
    icon: CheckCircle,
    className: 'bg-green-500/5 border-l-green-500 text-green-200',
    iconColor: 'text-green-400',
    borderColor: 'from-green-500 to-emerald-500'
  },
  error: {
    icon: XCircle,
    className: 'bg-red-500/5 border-l-red-500 text-red-200',
    iconColor: 'text-red-400',
    borderColor: 'from-red-500 to-rose-500'
  }
};

const Callout = ({ type = 'info', title, children }) => {
  const config = CALLOUT_TYPES[type] || CALLOUT_TYPES.info;
  const Icon = config.icon;

  return (
    <div className={twMerge(
      'relative my-8 p-6 pl-14 rounded-r-xl glass-card border-l-4 overflow-hidden',
      config.className
    )}>
      {/* Absolute Gradient Border Overlay (Optional for more depth) */}
      <div className={clsx(
        'absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b',
        config.borderColor
      )} />
      
      <div className="absolute left-4 top-6">
        <Icon size={24} className={config.iconColor} />
      </div>
      
      {title && (
        <h4 className="font-bold text-lg mb-2 text-white">
          {title}
        </h4>
      )}
      
      <div className="prose prose-invert prose-sm max-w-none opacity-90 leading-relaxed">
        {children}
      </div>
    </div>
  );
};

export default Callout;
