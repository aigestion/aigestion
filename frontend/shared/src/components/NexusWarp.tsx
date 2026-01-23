import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NexusWarpProps {
  isVisible: boolean;
  onComplete?: () => void;
}

/**
 * NexusWarp: Cinematic light-speed transition effect.
 * Used during heavy data loads or module switching to maintain the "God Mode" feel.
 */
export const NexusWarp: React.FC<NexusWarpProps> = ({ isVisible, onComplete }) => {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] bg-nexus-obsidian flex items-center justify-center overflow-hidden pointer-events-none"
        >
          {/* Warp Lines */}
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                scaleX: 0,
                x: 0,
                y: (Math.random() - 0.5) * window.innerHeight,
                opacity: 0
              }}
              animate={{
                scaleX: [0, 5, 0],
                x: [window.innerWidth / 2, -window.innerWidth / 2],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: Math.random() * 0.5,
                ease: "easeInOut"
              }}
              className="absolute h-[1px] w-64 bg-linear-to-r from-transparent via-nexus-cyan-glow to-transparent"
              style={{
                left: '50%',
                transformOrigin: 'right'
              }}
            />
          ))}

          {/* Central Glow */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-96 h-96 bg-nexus-cyan/20 blur-[100px] rounded-full"
          />

          <div className="relative z-10 flex flex-col items-center gap-4">
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="font-orbitron text-[10px] tracking-[1em] text-nexus-cyan-glow uppercase font-black"
            >
              Nexus_Warp_Engaged
            </motion.span>
            <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
               <motion.div
                 animate={{ x: ['-100%', '100%'] }}
                 transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 bg-nexus-cyan-glow"
               />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
