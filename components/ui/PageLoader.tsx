'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FovisssteLogo } from './FovisssteLogo';

interface PageLoaderProps {
  text?: string;
  isVisible: boolean; // Explicit control
}

export default function PageLoader({ text = "Procesando...", isVisible }: PageLoaderProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }} // Visually pleasing entry
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md"
        >
          <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0.8, opacity: 0 }}
             className="flex flex-col items-center"
          >
            {/* Logo Animado Grande */}
            <FovisssteLogo className="w-24 h-24 mb-4" animated={true} />
            
            {/* Texto con parpadeo suave */}
            <div className="flex flex-col items-center animate-pulse">
                <h3 className="text-[#9D2449] font-bold text-xl font-montserrat tracking-widest">FOVISSSTE</h3>
                <p className="text-gray-500 text-sm mt-1 font-medium">{text}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
