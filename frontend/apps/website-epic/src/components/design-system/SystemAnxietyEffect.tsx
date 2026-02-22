import React from 'react';
import { motion } from 'framer-motion';

interface SystemAnxietyEffectProps {
  pulse: 'nominal' | 'warning' | 'critical';
  children: React.ReactNode;
}

export const SystemAnxietyEffect: React.FC<SystemAnxietyEffectProps> = ({ pulse, children }) => {
  // Define anxiety levels
  const isCritical = pulse === 'critical';

  const containerVariants = {
    nominal: {
      filter: 'blur(0px) brightness(1) contrast(1)',
      transition: { duration: 1 },
    },
    warning: {
      filter: 'blur(0.2px) brightness(0.95) contrast(1.05)',
      transition: {
        duration: 0.1,
        repeat: Infinity,
        repeatType: 'reverse' as const,
      },
    },
    critical: {
      filter: 'blur(0.5px) brightness(0.8) contrast(1.2)',
      transition: {
        duration: 0.05,
        repeat: Infinity,
        repeatType: 'reverse' as const,
      },
    },
  };

  const glitchVariants = {
    critical: {
      x: [0, -2, 2, -1, 0],
      y: [0, 1, -1, 0, 0],
      skew: [0, 2, -2, 0, 0],
      transition: {
        duration: 0.2,
        repeat: Infinity,
        repeatDelay: 2,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      animate={pulse}
      className="relative w-full h-full overflow-hidden"
    >
      {/* Chromatic Aberration Layer (only on critical) */}
      {isCritical && (
        <>
          <div className="absolute inset-0 pointer-events-none z-50 opacity-30 mix-blend-screen overflow-hidden">
            <motion.div
              animate={{ x: [-1, 1, -1] }}
              transition={{ duration: 0.2, repeat: Infinity }}
              className="absolute inset-0 bg-red-500/10 blur-[1px]"
            />
          </div>
          <div className="absolute inset-0 pointer-events-none z-50 opacity-30 mix-blend-screen overflow-hidden">
            <motion.div
              animate={{ x: [1, -1, 1] }}
              transition={{ duration: 0.2, repeat: Infinity }}
              className="absolute inset-0 bg-cyan-500/10 blur-[1px]"
            />
          </div>
        </>
      )}

      {/* Global Glitch */}
      <motion.div
        variants={glitchVariants}
        animate={isCritical ? 'critical' : ''}
        className="w-full h-full"
      >
        {children}
      </motion.div>

      {/* Static Noise Overlay when critical */}
      {isCritical && (
        <div className="absolute inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
      )}
    </motion.div>
  );
};
