import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface GodModeTextProps {
  text: string;
  className?: string;
  effect?: 'neon' | 'glitch' | 'hologram' | 'none';
}

export const GodModeText: React.FC<GodModeTextProps> = ({ text, className, effect = 'none' }) => {
  return (
    <div className={cn('relative inline-block', className)}>
      {/* Base Text */}
      <span className="relative z-10">{text}</span>

      {/* Neon Glow Effect */}
      {effect === 'neon' && (
        <span
          className="absolute inset-0 blur-md text-nexus-cyan/50 select-none pointer-events-none"
          aria-hidden="true"
        >
          {text}
        </span>
      )}

      {/* Glitch Overlay */}
      {effect === 'glitch' && (
        <>
          <motion.span
            className="absolute top-0 left-0 -ml-[2px] text-nexus-violet opacity-70 select-none pointer-events-none mix-blend-screen"
            animate={{ x: [-2, 2, -1, 0] }}
            transition={{ repeat: Infinity, duration: 2, repeatType: 'mirror', ease: 'easeInOut' }}
            aria-hidden="true"
          >
            {text}
          </motion.span>
          <motion.span
            className="absolute top-0 left-0 ml-[2px] text-nexus-cyan opacity-70 select-none pointer-events-none mix-blend-screen"
            animate={{ x: [2, -2, 1, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }}
            aria-hidden="true"
          >
            {text}
          </motion.span>
        </>
      )}

      {/* Hologram Effect (Scanlines) */}
      {effect === 'hologram' && (
        <span
          className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent bg-[length:100%_4px] opacity-30 select-none pointer-events-none"
          aria-hidden="true"
        />
      )}
    </div>
  );
};
