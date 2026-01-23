import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NexusAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isSyncing?: boolean;
  intensity?: number;
  onClick?: () => void;
}

export const NexusAvatar: React.FC<NexusAvatarProps> = ({
  size = 'md',
  isSyncing = false,
  intensity = 0.2,
  onClick
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64'
  };

  return (
    <div className="relative group cursor-pointer" onClick={onClick}>
      {/* Neural Network Glow */}
      <AnimatePresence>
        {(isSyncing || intensity > 0.1) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 0.2 + intensity * 0.5,
              scale: 1 + intensity * 0.3
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-x-0 top-0 bottom-0 bg-nexus-cyan/20 rounded-full blur-[40px] z-0"
          />
        )}
      </AnimatePresence>

      <div className={`${sizeClasses[size]} relative z-10 rounded-full border border-cyan-500/20 p-2 bg-nexus-obsidian-deep/80 backdrop-blur-3xl overflow-hidden transition-all duration-500 group-hover:scale-110 group-hover:border-nexus-cyan-glow/50 shadow-[0_0_30px_rgba(34,211,238,0.2)]`}>
        <div className="absolute inset-0 bg-linear-to-b from-cyan-500/10 to-transparent" />

        {/* Using the Neural Core / Robotic Eye asset from avatars.png indirectly by mapping to the brand icon if needed,
           but here we'll use a stylized CSS representation if we don't have individual files,
           though the user said "usa lo que tienes". We have brand/icon.png.
           Let's use a specific slice effect or just the icon with a cyan filter for Nexus. */}
        <img
          src="/images/brand/icon.png"
          alt="Nexus"
          className="w-full h-full object-cover rounded-full filter hue-rotate-180 brightness-125 saturate-150"
        />

        {/* Binary Overlay */}
        <div className="absolute inset-0 opacity-10 flex items-center justify-center font-mono text-[8px] text-cyan-400 pointer-events-none select-none">
          <motion.div
            animate={{ opacity: [0, 1, 0], y: [-20, 20] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            1010110010101
          </motion.div>
        </div>

        {/* Scanning Line */}
        <motion.div
          className="absolute inset-x-0 h-px bg-cyan-400/50 shadow-[0_0_8px_cyan] z-20"
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Orbiting Rings */}
      <motion.div
        className="absolute -inset-4 border border-cyan-500/10 rounded-full z-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -inset-8 border border-white/5 rounded-full z-0"
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};
