import React from 'react';
import { motion } from 'framer-motion';

interface HolographicSkeletonProps {
  className?: string; // Tailwind classes for sizing/shaping
}

export const HolographicSkeleton: React.FC<HolographicSkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden bg-white/5 rounded-lg ${className}`}>
      {/* Mesh Shimmer Effect */}
      <motion.div
        className="absolute inset-0 z-10"
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: 'linear',
        }}
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(0, 245, 255, 0.05), rgba(138, 43, 226, 0.1), rgba(0, 245, 255, 0.05), transparent)',
        }}
      />
      {/* Static Grain for texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
    </div>
  );
};
