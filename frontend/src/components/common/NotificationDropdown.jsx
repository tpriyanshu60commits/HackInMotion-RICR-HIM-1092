import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, CheckCircle2, AlertTriangle, AlertCircle, Trash2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../../store/useStore';
import { cn } from '../common/GlassCard';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const alerts = useStore(state => state.alerts);
  const markAllAlertsRead = useStore(state => state.markAllAlertsRead);
  const markAlertRead = useStore(state => state.markAlertRead);
  const clearAllAlerts = useStore(state => state.clearAllAlerts);
  
  const unreadCount = alerts.filter(a => !a.read).length;

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // When dropdown opens, optionally mark all as read automatically
  // For now, let's keep them unread until they click 'Clear All' or we just mark as read on open
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      markAllAlertsRead();
    }
  }, [isOpen, unreadCount, markAllAlertsRead]);

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="text-green-400" size={18} />;
      case 'warning': return <AlertTriangle className="text-amber-400" size={18} />;
      case 'danger': return <AlertCircle className="text-red-400" size={18} />;
      default: return <Info className="text-blue-400" size={18} />;
    }
  };

  return (
    <div className="relative z-[100]" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.1] backdrop-blur-xl transition-colors relative",
          unreadCount > 0 && "animate-pulse" // Subtle pulse when there are unread messages
        )}
      >
        <Bell size={18} className={unreadCount > 0 ? "animate-wiggle" : ""} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center border border-black/50">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-14 w-80 max-h-[400px] bg-[#0A0F0D]/90 backdrop-blur-2xl border border-white/[0.15] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
              <h3 className="text-sm font-semibold text-white tracking-wide">Notifications</h3>
              <div className="flex items-center gap-2">
                {alerts.length > 0 && (
                  <button 
                    onClick={clearAllAlerts}
                    className="text-xs text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md"
                  >
                    <Trash2 size={12} /> Clear All
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
              {alerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                  <Bell size={32} className="opacity-20 mb-3" />
                  <p className="text-sm font-medium">All caught up!</p>
                  <p className="text-xs">No new notifications.</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl transition-all duration-300",
                      alert.read ? "bg-transparent opacity-70" : "bg-white/[0.04] border border-white/[0.05]"
                    )}
                  >
                    <div className="shrink-0 mt-0.5">
                      {getIcon(alert.type || 'info')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white mb-0.5">{alert.title}</p>
                      <p className="text-xs text-gray-400 leading-snug">{alert.message}</p>
                      <p className="text-[10px] text-gray-500 mt-1 font-medium">
                        {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
