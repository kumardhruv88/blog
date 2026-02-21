import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const Card = ({
  children,
  className,
  hover = false,
  glass = 'default', // default | dark
  padding = 'p-6',
  ...props
}) => {
  const baseClasses = glass === 'dark' ? 'glass-card-dark' : 'glass-card';
  
  return (
    <motion.div
      className={twMerge(
        baseClasses,
        'rounded-2xl',
        padding,
        hover && 'card-hover cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
