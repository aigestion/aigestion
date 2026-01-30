import { motion } from 'framer-motion';
import React from 'react';

interface NeonCardProps {
  children: React.ReactNode;
  title: string;
  accentColor?: string;
  className?: string;
}

export const NeonCard: React.FC<NeonCardProps> = ({
  children,
  title,
  accentColor = 'rgba(0, 245, 255, 0.3)',
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative border border-white/10 bg-white/[0.02] backdrop-blur-xl rounded-2xl p-6 overflow-hidden ${className}`}
      style={{
        boxShadow: `0 0 20px ${accentColor}, inset 0 0 20px ${accentColor}10`
      }}
    >
      {/* Glow Effect */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${accentColor}, transparent 70%)`
        }}
      />

      {/* Title */}
      <h3 className="text-sm font-orbitron font-bold tracking-widest text-nexus-silver/80 mb-4 uppercase">
        {title}
      </h3>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Border Glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-50 pointer-events-none"
        style={{
          border: `1px solid ${accentColor}`,
          boxShadow: `0 0 10px ${accentColor} inset`
        }}
      />
    </motion.div>
  );
};
