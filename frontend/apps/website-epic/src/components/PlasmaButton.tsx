import { motion, useMotionValue } from 'framer-motion';
import React, { useRef } from 'react';

interface PlasmaButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export const PlasmaButton: React.FC<PlasmaButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { left, top } = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const isSecondary = variant === 'secondary';

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={`relative px-10 py-4 font-orbitron tracking-widest uppercase overflow-hidden group transition-all ${
        isSecondary
          ? 'border border-white/20 text-white hover:border-nexus-cyan'
          : 'bg-nexus-violet text-white'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Background */}
      {!isSecondary && <div className="absolute inset-0 bg-nexus-violet" />}

      {/* Plasma circle effect */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 100,
          height: 100,
          left: mouseX,
          top: mouseY,
          x: -50,
          y: -50,
          background: isSecondary
            ? 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(0,245,255,0.3) 0%, transparent 70%)',
          filter: 'blur(10px)',
        }}
      />

      {/* Animated border glow */}
      <motion.div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${
          isSecondary ? 'border border-nexus-cyan' : 'border border-nexus-cyan'
        }`}
        animate={{
          boxShadow: [
            isSecondary ? '0 0 0 0 rgba(255, 255, 255, 0.7)' : '0 0 0 0 rgba(0, 245, 255, 0.7)',
            isSecondary
              ? '0 0 20px 10px rgba(255, 255, 255, 0)'
              : '0 0 20px 10px rgba(0, 245, 255, 0)',
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />

      {/* Text */}
      <span className="relative z-10">{label}</span>
    </motion.button>
  );
};
