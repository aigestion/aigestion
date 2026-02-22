import React from 'react';
import { cn } from '../../utils/cn';

interface NexusStatusBadgeProps {
  status: 'online' | 'offline' | 'warning' | 'critical' | 'syncing';
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

const statusConfig = {
  online: {
    dot: 'bg-emerald-400',
    glow: 'shadow-[0_0_8px_rgba(52,211,153,0.6)]',
    text: 'text-emerald-400',
    pulse: true,
    defaultLabel: 'Online',
  },
  offline: {
    dot: 'bg-white/20',
    glow: '',
    text: 'text-white/30',
    pulse: false,
    defaultLabel: 'Offline',
  },
  warning: {
    dot: 'bg-yellow-400',
    glow: 'shadow-[0_0_8px_rgba(250,204,21,0.6)]',
    text: 'text-yellow-400',
    pulse: true,
    defaultLabel: 'Warning',
  },
  critical: {
    dot: 'bg-rose-500',
    glow: 'shadow-[0_0_8px_rgba(244,63,94,0.6)]',
    text: 'text-rose-500',
    pulse: true,
    defaultLabel: 'Critical',
  },
  syncing: {
    dot: 'bg-nexus-cyan',
    glow: 'shadow-[0_0_8px_rgba(0,245,255,0.5)]',
    text: 'text-nexus-cyan',
    pulse: true,
    defaultLabel: 'Syncing',
  },
};

export const NexusStatusBadge: React.FC<NexusStatusBadgeProps> = ({
  status,
  label,
  size = 'sm',
  className,
}) => {
  const config = statusConfig[status];
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2.5 h-2.5';
  const textSize = size === 'sm' ? 'text-[9px]' : 'text-[11px]';

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <span className="relative flex">
        <span
          className={cn(
            'rounded-full',
            dotSize,
            config.dot,
            config.glow
          )}
        />
        {config.pulse && (
          <span
            className={cn(
              'absolute inset-0 rounded-full animate-ping opacity-40',
              config.dot
            )}
          />
        )}
      </span>
      <span
        className={cn(
          'font-bold uppercase tracking-[0.15em] font-mono',
          textSize,
          config.text
        )}
      >
        {label || config.defaultLabel}
      </span>
    </div>
  );
};
