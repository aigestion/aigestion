import React from 'react';
import { Card, CardProps } from '../atoms/Card';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

export interface StatsCardProps extends Omit<CardProps, 'children'> {
  label: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'accent' | 'success';
}

const StatsCard = ({
  label,
  value,
  description,
  trend,
  icon,
  color = 'primary',
  className,
  ...props
}: StatsCardProps) => {
  const colorMap = {
    primary: 'text-[#8a2be2]',
    secondary: 'text-[#00d1ff]',
    accent: 'text-[#ffb700]',
    success: 'text-[#10b981]',
  };

  const bgGlowMap = {
    primary: 'bg-[#8a2be2]/10',
    secondary: 'bg-[#00d1ff]/10',
    accent: 'bg-[#ffb700]/10',
    success: 'bg-[#10b981]/10',
  };

  return (
    <Card className={cn('relative group overflow-hidden', className)} {...props}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            {label}
          </span>
          <h3 className="text-3xl font-bold text-white tabular-nums">
            {value}
          </h3>
        </div>
        {icon && (
          <div className={cn('p-3 rounded-xl transition-all duration-300 group-hover:scale-110', bgGlowMap[color])}>
            <div className={colorMap[color]}>{icon}</div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {trend && (
          <span className={cn(
            'text-sm font-bold flex items-center',
            trend.isUp ? 'text-[#10b981]' : 'text-red-500'
          )}>
            {trend.isUp ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
        {description && (
          <span className="text-sm text-gray-500">
            {description}
          </span>
        )}
      </div>

      {/* Decorative background glow */}
      <div className={cn(
        'absolute -bottom-8 -right-8 w-24 h-24 blur-[60px] opacity-20 rounded-full transition-all duration-500 group-hover:opacity-40',
        color === 'primary' ? 'bg-[#8a2be2]' : 'bg-[#00d1ff]'
      )} />
    </Card>
  );
};

export { StatsCard };
