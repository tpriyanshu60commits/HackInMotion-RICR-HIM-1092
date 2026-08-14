import { AnimatePresence } from 'framer-motion';
import { useLiveAlerts } from '../../hooks/useLiveAlerts';
import { AlertToast } from './AlertToast';

export const AlertToastContainer = () => {
  const { activeToast, dismissToast } = useLiveAlerts();

  return (
    <div className="fixed top-[90px] right-4 md:right-6 z-[100] pointer-events-none flex flex-col gap-4 items-end">
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
