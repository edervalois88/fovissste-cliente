'use client';

import { motion } from 'framer-motion';

interface FovisssteLogoProps {
  className?: string; // Para tamaños: w-16 h-16, w-32 h-32
  animated?: boolean; // Activar animación de carga
}

export const FovisssteLogo = ({ className = "w-32 h-32", animated = false }: FovisssteLogoProps) => {
  
  // Faster, snappier liquid fill for feedback
  const fillVariants = {
    hidden: { y: 100 },
    visible: { 
      y: 0,
      transition: {
        duration: 1.2, // Faster cycle
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse" as const, 
        repeatDelay: 0.1
      }
    }
  };

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: {
        duration: 1.2, // Synced
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse" as const,
      }
    }
  };

  // Ensure unique ID per instance to avoid clipPath conflicts
  const uniqueId = `fovissste-logo-fill-clip-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-full h-full text-current" // allows color inherit
      >
        <defs>
            <clipPath id={uniqueId}>
                <motion.rect 
                    x="0" 
                    y="0" 
                    width="100" 
                    height="100" 
                    variants={animated ? fillVariants : {}}
                    initial={animated ? "hidden" : "visible"} // Start immediately
                    animate="visible"
                />
            </clipPath>
        </defs>

        {/* Static/Back Layer so it's not empty before animation starts */}
        <g opacity={animated ? 0.3 : 1}>
             <path
                d="M50 10 L90 40 L80 40 L80 80 L65 80 L65 55 L35 55 L35 80 L20 80 L20 40 L10 40 Z"
                stroke="#9D2449"
                strokeWidth="2"
                fill="transparent"
            />
             <path
                d="M40 90 L60 90 L60 95 L40 95 Z"
                stroke="#B38E5D"
                strokeWidth="1"
                fill="transparent"
            />
        </g>

        {/* Animated Outline Layer */}
        {animated && (
        <g>
            <motion.path
                d="M50 10 L90 40 L80 40 L80 80 L65 80 L65 55 L35 55 L35 80 L20 80 L20 40 L10 40 Z"
                stroke="#9D2449"
                strokeWidth="2"
                fill="transparent"
                variants={pathVariants}
                initial="hidden"
                animate="visible"
            />
        </g>
        )}

        {/* Filled Layer (Clipped) */}
        <g clipPath={`url(#${uniqueId})`}>
             <path
                d="M50 10 L90 40 L80 40 L80 80 L65 80 L65 55 L35 55 L35 80 L20 80 L20 40 L10 40 Z"
                fill="#9D2449"
            />
             <path
                d="M40 90 L60 90 L60 95 L40 95 Z"
                fill="#B38E5D"
            />
        </g>

      </svg>
    </div>
  );
};
