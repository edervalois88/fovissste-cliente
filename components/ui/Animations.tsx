'use client';

import { motion } from 'framer-motion';

// Componente Wrapper para animaciones estándar (Motion.dev)
// Mejora la legibilidad encapsulando la configuración de animación.

export const FadeInView = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StepTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ x: 20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -20, opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);
