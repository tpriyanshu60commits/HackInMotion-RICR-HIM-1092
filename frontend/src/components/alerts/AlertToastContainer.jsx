import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLiveAlerts } from '../../hooks/useLiveAlerts';
import { AlertToast } from './AlertToast';

export const AlertToastContainer = () => {
  const { activeToast, dismissToast } = useLiveAlerts();

  return (
    <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-[100] pointer-events-none flex flex-col gap-4">
      <AnimatePresence mode="popLayout">
        {activeToast && (
          <AlertToast 
            key={activeToast.id} 
            toast={activeToast} 
            onDismiss={dismissToast} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};
