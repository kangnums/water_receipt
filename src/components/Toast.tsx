import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 12, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -12, x: '-50%' }}
          transition={{ duration: 0.2 }}
          className="fixed left-1/2 bottom-8 bg-slate-800 text-slate-100 text-xs font-bold px-5 py-2.5 rounded-full shadow-2xl border border-slate-700/80 z-50 pointer-events-none whitespace-nowrap"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
