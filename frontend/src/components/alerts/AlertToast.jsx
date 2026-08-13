import React, { useEffect, useState } from 'react';
import { X, Volume2, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../components/common/GlassCard';
import { useVoiceAlert } from '../../hooks/useVoiceAlert';

export const AlertToast = ({ toast, onDismiss }) => {
  const [timeAgo, setTimeAgo] = useState('just now');
  const { speak } = useVoiceAlert();

  // Simple relative time updater (just to be safe if it stays on screen)
  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = Math.floor((new Date() - toast.timestamp) / 1000);
      if (seconds < 60) setTimeAgo('just now');
      else setTimeAgo(`${Math.floor(seconds / 60)} min ago`);
    }, 10000);
    return () => clearInterval(interval);
  }, [toast.timestamp]);

  const severityStyles = {
    red: 'border-l-red-500 bg-red-500/10 text-red-100',
    amber: 'border-l-amber-500 bg-amber-500/10 text-amber-100',
    orange: 'border-l-orange-500 bg-orange-500/10 text-orange-100',
    blue: 'border-l-blue-500 bg-blue-500/10 text-blue-100',
    green: 'border-l-green-500 bg-green-500/10 text-green-100',
  };

  const Icon = toast.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "relative flex gap-4 p-4 rounded-2xl border-y border-r border-border glass shadow-2xl backdrop-blur-xl border-l-4 overflow-hidden",
        severityStyles[toast.severity] || severityStyles.amber,
        "w-full sm:w-[400px] pointer-events-auto"
      )}
    >
      {/* Icon Area */}
      <div className="shrink-0 mt-1">
        <Icon size={24} className="opacity-90" />
      </div>

      {/* Content */}
      <div className="flex-1 pr-6 space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-medium opacity-75">
          <MapPin size={12} />
          <span className="truncate">{toast.locationName}</span>
        </div>
        
        <p className="text-sm font-semibold leading-snug drop-shadow-sm">
          {toast.message}
        </p>
        
        <div className="flex items-center gap-4 pt-1 text-xs opacity-60 font-medium">
          <span>{timeAgo}</span>
          <button 
            onClick={() => speak(toast.message, true)}
            className="flex items-center gap-1 hover:text-white transition-colors"
            title="Read aloud"
          >
            <Volume2 size={12} />
            <span>Read</span>
          </button>
        </div>
      </div>

      {/* Dismiss Button */}
      <button 
        onClick={onDismiss}
        className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/10 transition-colors opacity-70 hover:opacity-100"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};
