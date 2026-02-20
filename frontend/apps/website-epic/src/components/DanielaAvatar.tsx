import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DanielaAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isSpeaking?: boolean;
  volume?: number;
  onClick?: () => void;
}

export const DanielaAvatar: React.FC<DanielaAvatarProps> = ({
  size = 'md',
  isSpeaking = false,
  volume = 0,
  onClick,
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64',
  };

  // Dynamic glow based on volume
  const glowScale = 1 + volume * 0.8;
  const glowOpacity = 0.1 + volume * 0.5;

  return (
    <div className="relative group cursor-pointer" onClick={onClick}>
      {/* Volumetric glow based on sound */}
      <AnimatePresence>
        {(isSpeaking || volume > 0.05) && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: glowScale,
              opacity: glowOpacity,
            }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="absolute inset-x-0 top-0 bottom-0 bg-nexus-cyan-glow/30 rounded-full blur-[60px] z-0"
          />
        )}
      </AnimatePresence>

      <div
        className={`${sizeClasses[size]} relative z-10 rounded-full border border-white/10 p-1.5 bg-nexus-obsidian/40 backdrop-blur-xl overflow-hidden transition-all duration-500 group-hover:scale-105 group-hover:border-nexus-violet-glow/50 shadow-2xl`}
      >
        <div className="absolute inset-0 bg-radial-at-center from-white/10 to-transparent opacity-50" />
        <img
          src="/images/brand/icon.png"
          alt="Daniela"
          className="w-full h-full object-cover rounded-full filter contrast-125 saturate-125 brightness-110"
        />

        {/* Holographic scanning effect overlay */}
        <motion.div
          className="absolute inset-0 bg-linear-to-b from-transparent via-nexus-cyan/10 to-transparent pointer-events-none"
          animate={{ y: ['-100%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />

        {/* Animated speaking indicator with reactive bars */}
        {(isSpeaking || volume > 0.05) && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 items-end h-8 px-4 py-2 rounded-full bg-nexus-obsidian/60 border border-white/10 backdrop-blur-md">
            {[1, 2, 3, 4, 3, 2, 1].map((i, idx) => (
              <motion.div
                key={idx}
                animate={{
                  height: [4, 4 + volume * 16 * (i / 4), 4],
                }}
                transition={{ duration: 0.15, repeat: Infinity, delay: idx * 0.03 }}
                className="w-1 bg-nexus-cyan-glow rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)]"
              />
            ))}
          </div>
        )}
      </div>

      {!isSpeaking && volume <= 0.05 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileHover={{ opacity: 1, y: -12 }}
          className="absolute -top-12 left-1/2 -translate-x-1/2 premium-glass px-4 py-1.5 rounded-full text-[10px] font-orbitron text-nexus-cyan-glow tracking-[0.2em] uppercase border-white/5 pointer-events-none whitespace-nowrap overflow-visible"
        >
          Canal de Voz en Espera
        </motion.div>
      )}
    </div>
  );
};
