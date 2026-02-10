'use client';

import { motion, AnimatePresence } from 'framer-motion';

// Toast Notification basada en DaisyUI + Motion
// Clean: Componente independiente
// Observabilidad: Muestra estados visuales claros (Éxito, Error)

export const Toast = ({ 
  message, 
  type = 'info', 
  visible, 
  onClose 
}: { 
  message: string, 
  type?: 'success' | 'error' | 'info', 
  visible: boolean,
  onClose?: () => void
}) => {
  return (
    <AnimatePresence>
      {visible && (
        <div className="toast toast-end toast-bottom z-50">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`alert ${type === 'success' ? 'alert-success' : type === 'error' ? 'alert-error' : 'alert-info'} text-white shadow-lg`}
          >
            <span>{message}</span>
            <button onClick={onClose} className="btn btn-xs btn-ghost text-white">✕</button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
