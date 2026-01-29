import { motion } from 'framer-motion';
import React from 'react';
import { Card } from '../../atoms/Card';
import { cn } from '../../utils/cn';

export interface FeatureStat {
  label: string;
  value: string;
}

export interface FeatureCardProps {
  title: string;
  subtitle?: string;
  description: string;
  icon: React.ReactNode;
  color?: string;
  stats?: FeatureStat[];
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  subtitle,
  description,
  icon,
  color = 'from-nexus-violet to-nexus-cyan',
  stats,
  className,
}) => {
  return (
    <Card variant="glass" className={cn('p-8 flex flex-col gap-6', className)}>
      <div className="flex flex-col gap-4">
        <motion.div
          className="text-6xl"
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {icon}
        </motion.div>

        <div>
          <h3
            className={cn(
              'text-2xl font-orbitron font-black mb-2 bg-gradient-to-r bg-clip-text text-transparent',
              color,
            )}
          >
            {title}
          </h3>
          {subtitle && <p className="text-nexus-cyan text-sm font-medium mb-4">{subtitle}</p>}
          <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
        </div>
      </div>

      {stats && stats.length > 0 && (
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className={cn(
                  'text-xl font-orbitron font-black bg-gradient-to-r bg-clip-text text-transparent',
                  color,
                )}
              >
                {stat.value}
              </div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
