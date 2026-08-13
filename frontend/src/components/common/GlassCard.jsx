import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const GlassCard = ({ children, className, hover = false, ...props }) => {
  return (
    <div 
      className={cn(
        "glass rounded-2xl p-6",
        "transition-all duration-300 ease-in-out",
        "hover:scale-[1.03] hover:-translate-y-1",
        "hover:bg-white/[0.09] hover:border-white/20",
        "hover:shadow-2xl hover:shadow-green-500/10",
        "cursor-default",
        hover && "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
