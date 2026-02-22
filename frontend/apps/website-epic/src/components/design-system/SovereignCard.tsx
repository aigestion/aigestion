import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface SovereignCardProps {
  children: React.ReactNode;
  className?: string;
  pulse?: 'nominal' | 'warning' | 'critical';
  title?: string;
  icon?: React.ReactNode;
}

export const SovereignCard: React.FC<SovereignCardProps> = ({
  children,
  className,
  pulse = 'nominal',
  title,
  icon,
}) => {
  const borderColor = {
    nominal: 'group-hover:border-nexus-cyan/50 border-white/5',
    warning: 'border-yellow-500/30',
    critical: 'border-red-500/50',
  }[pulse];

  const glowColor = {
    nominal: 'bg-nexus-cyan/5',
    warning: 'bg-yellow-500/10',
    critical: 'bg-red-500/20',
  }[pulse];

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "group relative rounded-2xl border bg-black/40 backdrop-blur-xl p-6 transition-all duration-500 overflow-hidden",
        borderColor,
        className
      )}
    >
      {/* Liquid Metal Refraction Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent" />
        <div className={cn("absolute -inset-[50%] animate-spin-slow blur-3xl", glowColor)} />
      </div>

      {/* Header */}
      {(title || icon) && (
        <div className="flex items-center gap-3 mb-4 relative z-10">
          {icon && (
            <div className={cn(
              "p-2 rounded-lg bg-white/5 transition-colors",
              pulse === 'critical' ? 'text-red-500' : 'text-nexus-cyan'
            )}>
              {icon}
            </div>
          )}
          {title && <h3 className="text-sm font-medium tracking-wider text-white/70 uppercase">{title}</h3>}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Pulse Indicator Line */}
      <motion.div
        initial={false}
        animate={{
          scaleX: pulse === 'critical' ? 1 : 0.3,
          backgroundColor: pulse === 'critical' ? '#EF4444' : pulse === 'warning' ? '#F59E0B' : '#06B6D4',
        }}
        className="absolute bottom-0 left-0 h-[2px] w-full origin-left opacity-50"
      />
    </motion.div>
  );
};
