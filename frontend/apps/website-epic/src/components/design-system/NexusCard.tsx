import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface NexusCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'cyan' | 'violet' | 'gold' | 'green' | 'rose';
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

const variantMap = {
  default: {
    border: 'border-white/[0.06]',
    hoverBorder: 'hover:border-white/[0.12]',
    glowColor: 'rgba(255, 255, 255, 0.06)',
    spotColor: 'rgba(255, 255, 255, 0.04)',
  },
  cyan: {
    border: 'border-nexus-cyan/[0.08]',
    hoverBorder: 'hover:border-nexus-cyan/30',
    glowColor: 'rgba(0, 245, 255, 0.12)',
    spotColor: 'rgba(0, 245, 255, 0.06)',
  },
  violet: {
    border: 'border-nexus-violet/[0.08]',
    hoverBorder: 'hover:border-nexus-violet/30',
    glowColor: 'rgba(138, 43, 226, 0.12)',
    spotColor: 'rgba(138, 43, 226, 0.06)',
  },
  gold: {
    border: 'border-nexus-gold/[0.08]',
    hoverBorder: 'hover:border-nexus-gold/30',
    glowColor: 'rgba(255, 215, 0, 0.12)',
    spotColor: 'rgba(255, 215, 0, 0.06)',
  },
  green: {
    border: 'border-emerald-400/[0.08]',
    hoverBorder: 'hover:border-emerald-400/30',
    glowColor: 'rgba(52, 211, 153, 0.12)',
    spotColor: 'rgba(52, 211, 153, 0.06)',
  },
  rose: {
    border: 'border-rose-400/[0.08]',
    hoverBorder: 'hover:border-rose-400/30',
    glowColor: 'rgba(251, 113, 133, 0.12)',
    spotColor: 'rgba(251, 113, 133, 0.06)',
  },
};

export const NexusCard: React.FC<NexusCardProps> = ({
  children,
  className,
  variant = 'default',
  hover = true,
  glow = false,
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const v = variantMap[variant];

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'relative rounded-2xl border bg-white/[0.02] backdrop-blur-xl overflow-hidden transition-all duration-300',
        v.border,
        hover && v.hoverBorder,
        hover && 'cursor-pointer',
        glow && 'shadow-[0_0_30px_-5px] shadow-nexus-violet/10',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* Mouse-tracking spotlight */}
      {hover && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-500"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, ${v.glowColor}, transparent 40%)`,
          }}
        />
      )}

      {/* Inner spot glow */}
      {hover && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-500"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, ${v.spotColor}, transparent 40%)`,
          }}
        />
      )}

      {/* Animated border trace on hover */}
      {isHovered && glow && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `conic-gradient(from 0deg, transparent, ${v.glowColor}, transparent)`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'xor',
            WebkitMaskComposite: 'xor',
            padding: '1px',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
