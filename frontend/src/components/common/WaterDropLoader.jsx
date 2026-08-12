import React from 'react';
import { Droplets } from 'lucide-react';

export const WaterDropLoader = ({ message = 'Loading environmental data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] w-full space-y-6">
      <div className="relative flex items-center justify-center">
        {/* The Ripple */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary-400 rounded-full opacity-0 animate-ripple"></div>
        {/* The Drop */}
        <div className="relative z-10 text-primary-500 animate-fall">
          <Droplets size={48} strokeWidth={1.5} />
        </div>
      </div>
      <p className="text-text-muted font-medium animate-pulse">{message}</p>
    </div>
  );
};
