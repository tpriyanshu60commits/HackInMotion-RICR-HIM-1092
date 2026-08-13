import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useHealthAlerts } from '../../hooks/useHealthAlerts';
import { cn } from '../common/GlassCard';

export const AlertsList = () => {
  const { alerts, summary } = useHealthAlerts();

  const severityConfig = {
    red: { icon: ShieldAlert, classes: 'border-red-500/30 bg-red-500/10 text-red-300', iconColor: 'text-red-400' },
    purple: { icon: ShieldAlert, classes: 'border-purple-500/30 bg-purple-500/10 text-purple-300', iconColor: 'text-purple-400' },
    amber: { icon: AlertTriangle, classes: 'border-amber-500/30 bg-amber-500/10 text-amber-300', iconColor: 'text-amber-400' },
    orange: { icon: AlertCircle, classes: 'border-orange-500/30 bg-orange-500/10 text-orange-300', iconColor: 'text-orange-400' },
    green: { icon: ShieldCheck, classes: 'border-green-500/30 bg-green-500/10 text-green-300', iconColor: 'text-green-400' }
  };

  return (
    <div className="w-full bg-white/[0.035] backdrop-blur-xl border border-white/[0.10] rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col h-full">
      <h2 className="text-xl font-semibold text-white tracking-tight mb-6 flex items-center gap-2">
        <AlertCircle className="text-green-400" size={24} /> 
        Today's Health Alerts
      </h2>

      <div className="flex-1 flex flex-col gap-3">
        {summary && (
          <div className="mb-2 p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
            <p className="text-sm text-gray-300 leading-relaxed font-medium">
              {summary}
            </p>
          </div>
        )}
        
        <AnimatePresence mode="popLayout">
          {alerts.length === 0 ? (
            summary ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-green-500/20 bg-green-500/5 rounded-xl"
              >
                <ShieldCheck size={32} className="text-green-500 mb-3" />
                <p className="text-sm text-green-400 font-medium">All Clear!</p>
                <p className="text-xs text-green-500/70 mt-1">No specific alerts triggered for your conditions right now.</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-xl"
              >
                <ShieldCheck size={32} className="text-gray-500 mb-3 opacity-50" />
                <p className="text-sm text-gray-400 font-medium">Monitoring conditions...</p>
                <p className="text-xs text-gray-500 mt-1">Please enter your name and select conditions to see personalized alerts.</p>
              </motion.div>
            )
          ) : (
            alerts.map((alert, idx) => {
              const config = severityConfig[alert.severity] || severityConfig.amber;
              const Icon = config.icon || AlertCircle;
              
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md",
                    config.classes
                  )}
                >
                  <Icon className={cn("shrink-0 mt-0.5", config.iconColor)} size={20} />
                  <p className="text-sm font-medium leading-relaxed drop-shadow-sm">
                    {alert.message}
                  </p>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
