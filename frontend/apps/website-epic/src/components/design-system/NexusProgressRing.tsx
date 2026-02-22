import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface NexusProgressRingProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showValue?: boolean;
  variant?: 'cyan' | 'violet' | 'gold' | 'green';
  className?: string;
}

const sizeMap = {
  sm: { svg: 64, stroke: 4, fontSize: 'text-xs', radius: 26 },
  md: { svg: 96, stroke: 5, fontSize: 'text-lg', radius: 40 },
  lg: { svg: 140, stroke: 6, fontSize: 'text-2xl', radius: 58 },
};

const gradientMap = {
  cyan: ['#00F5FF', '#8A2BE2'],
  violet: ['#8A2BE2', '#BD00FF'],
  gold: ['#FFD700', '#FF8C00'],
  green: ['#34D399', '#00F5FF'],
};

const glowMap = {
  cyan: 'drop-shadow(0 0 6px rgba(0, 245, 255, 0.5))',
  violet: 'drop-shadow(0 0 6px rgba(138, 43, 226, 0.5))',
  gold: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.5))',
  green: 'drop-shadow(0 0 6px rgba(52, 211, 153, 0.5))',
};

export const NexusProgressRing: React.FC<NexusProgressRingProps> = ({
  value,
  size = 'md',
  label,
  showValue = true,
  variant = 'cyan',
  className,
}) => {
  const s = sizeMap[size];
  const circumference = 2 * Math.PI * s.radius;
  const offset = circumference - (Math.min(value, 100) / 100) * circumference;
  const [colors] = useState(gradientMap[variant]);
  const gradId = `nexus-ring-${variant}-${size}`;

  return (
    <div className={cn('relative inline-flex flex-col items-center', className)}>
      <svg
        width={s.svg}
        height={s.svg}
        className="transform -rotate-90"
        style={{ filter: glowMap[variant] }}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1]} />
          </linearGradient>
        </defs>

        {/* Background ring */}
        <circle
          cx={s.svg / 2}
          cy={s.svg / 2}
          r={s.radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={s.stroke}
        />

        {/* Progress ring */}
        <motion.circle
          cx={s.svg / 2}
          cy={s.svg / 2}
          r={s.radius}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={s.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
        />
      </svg>

      {/* Value overlay */}
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className={cn('font-orbitron font-black text-white', s.fontSize)}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            {Math.round(value)}%
          </motion.span>
        </div>
      )}

      {/* Label */}
      {label && (
        <span className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-bold mt-2">
          {label}
        </span>
      )}
    </div>
  );
};
