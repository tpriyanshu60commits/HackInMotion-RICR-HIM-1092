import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatbotPanel } from './ChatbotPanel';

export const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-[80px] md:bottom-8 right-4 md:right-8 w-14 h-14 bg-primary-500 rounded-full shadow-lg shadow-primary-500/30 flex items-center justify-center text-white z-50 hover:bg-primary-600 transition-colors border border-primary-400/30"
          >
            <Sparkles size={24} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-background"></span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <ChatbotPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
