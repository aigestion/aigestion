import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { NexusCard } from './NexusCard';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface NexusMetricCardProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'cyan' | 'violet' | 'gold' | 'green' | 'rose' | 'default';
  sparkline?: number[];
  className?: string;
}

const useCountUp = (end: number, duration: number = 1200, decimals: number = 0) => {
  const [value, setValue] = useState(0);
  const startTime = useRef<number | null>(null);
  const animFrame = useRef<number>(0);

  useEffect(() => {
    startTime.current = null;
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(parseFloat((eased * end).toFixed(decimals)));
      if (progress < 1) {
        animFrame.current = requestAnimationFrame(animate);
      }
    };
    animFrame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame.current);
  }, [end, duration, decimals]);

  return value;
};

const MiniSparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={w} height={h} className="opacity-60">
      <defs>
        <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polygon
        points={`0,${h} ${points} ${w},${h}`}
        fill={`url(#spark-${color})`}
      />
    </svg>
  );
};

const trendColors = {
  up: 'text-emerald-400',
  down: 'text-rose-400',
  neutral: 'text-white/30',
};

const sparklineColors: Record<string, string> = {
  cyan: '#00F5FF',
  violet: '#8A2BE2',
  gold: '#FFD700',
  green: '#34D399',
  rose: '#FB7185',
  default: '#00F5FF',
};

const iconGlowColors: Record<string, string> = {
  cyan: 'shadow-nexus-cyan/30',
  violet: 'shadow-nexus-violet/30',
  gold: 'shadow-nexus-gold/30',
  green: 'shadow-emerald-400/30',
  rose: 'shadow-rose-400/30',
  default: 'shadow-white/10',
};

export const NexusMetricCard: React.FC<NexusMetricCardProps> = ({
  label,
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  icon,
  trend,
  trendValue,
  variant = 'cyan',
  sparkline,
  className,
}) => {
  const animatedValue = useCountUp(value, 1400, decimals);

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <NexusCard variant={variant} glow className={cn('p-6', className)}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-[10px] font-bold text-white/50 uppercase tracking-[0.15em] font-orbitron">
          {label}
        </h3>
        {icon && (
          <motion.div
            className={cn(
              'p-2 rounded-lg bg-white/[0.04] shadow-lg',
              iconGlowColors[variant]
            )}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            {icon}
          </motion.div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <motion.div
            className="text-3xl font-black text-white font-orbitron tracking-tight"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {prefix}{animatedValue.toLocaleString()}{suffix}
          </motion.div>

          {trend && (
            <div className={cn('flex items-center gap-1.5 mt-2', trendColors[trend])}>
              <TrendIcon className="w-3 h-3" />
              {trendValue && (
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {trendValue}
                </span>
              )}
            </div>
          )}
        </div>

        {sparkline && sparkline.length > 1 && (
          <MiniSparkline data={sparkline} color={sparklineColors[variant]} />
        )}
      </div>
    </NexusCard>
  );
};
