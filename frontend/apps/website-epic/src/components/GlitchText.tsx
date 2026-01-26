import React from 'react';
import { motion } from 'framer-motion';

interface GlitchTextProps {
  text: string;
  className?: string;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, className = '' }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 text-nexus-cyan opacity-50 animate-pulse translate-x-[2px]">{text}</span>
      <span className="absolute top-0 left-0 -z-10 text-nexus-violet opacity-50 animate-pulse -translate-x-[2px]">{text}</span>
    </div>
  );
}; // Simple CSS-based glitch for performance, can be upgraded to canvas if needed
