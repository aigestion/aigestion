import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface NexusGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
  ambientGlow?: boolean;
  pulse?: 'nominal' | 'warning' | 'critical';
}

const colsMap = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
};

const gapMap = {
  sm: 'gap-3',
  md: 'gap-5',
  lg: 'gap-8',
};

const pulseGlowColors = {
  nominal: 'bg-nexus-cyan/[0.04]',
  warning: 'bg-yellow-500/[0.06]',
  critical: 'bg-red-500/[0.1]',
};

export const NexusGrid: React.FC<NexusGridProps> = ({
  children,
  cols = 4,
  gap = 'md',
  className,
  ambientGlow = true,
  pulse = 'nominal',
}) => {
  const glowColor = pulseGlowColors[pulse];

  return (
    <div className={cn('relative', className)}>
      {/* Ambient glow zones - Dynamic Pulse */}
      {ambientGlow && (
        <>
          <motion.div
            animate={{
              scale: pulse === 'critical' ? [1, 1.2, 1] : [1, 1.05, 1],
              opacity: pulse === 'critical' ? [0.4, 0.8, 0.4] : [1, 1, 1],
            }}
            transition={{
              duration: pulse === 'critical' ? 1 : 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={cn(
              'absolute -top-32 -left-32 w-64 h-64 rounded-full blur-[100px] pointer-events-none transition-colors duration-1000',
              glowColor
            )}
          />
          <motion.div
            animate={{
              scale: pulse === 'critical' ? [1, 1.3, 1] : [1, 1.1, 1],
            }}
            transition={{
              duration: pulse === 'critical' ? 1.5 : 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={cn(
              'absolute -bottom-32 -right-32 w-64 h-64 rounded-full blur-[100px] pointer-events-none transition-colors duration-1000',
              pulse === 'critical' ? 'bg-red-500/[0.08]' : 'bg-nexus-violet/[0.04]'
            )}
          />
        </>
      )}

      <motion.div layout className={cn('relative grid', colsMap[cols], gapMap[gap])}>
        {children}
      </motion.div>
    </div>
  );
};
