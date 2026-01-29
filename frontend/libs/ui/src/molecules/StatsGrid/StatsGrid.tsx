import { motion } from 'framer-motion';
import React from 'react';
import { cn } from '../../utils/cn';

export interface StatItem {
  label: string;
  value: string;
  description?: string;
  color?: string;
}

export interface StatsGridProps {
  stats: StatItem[];
  columns?: number;
  className?: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  columns = 3,
  className,
}) => {
  const columnClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[columns as 1 | 2 | 3 | 4] || 'grid-cols-3';

  return (
    <div className={cn('grid gap-6', columnClass, className)}>
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className="text-center group"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <motion.div
            className={cn(
              "text-3xl md:text-5xl font-orbitron font-black bg-gradient-to-r bg-clip-text text-transparent mb-2",
              stat.color || 'from-nexus-violet to-nexus-cyan'
            )}
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            {stat.value}
          </motion.div>
          <div className="text-sm font-medium text-white/90 group-hover:text-nexus-cyan transition-colors">
            {stat.label}
          </div>
          {stat.description && (
            <div className="text-xs text-gray-500 mt-1 max-w-[150px] mx-auto">
              {stat.description}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};
