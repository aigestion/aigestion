// ============================================
// PROGRESS INDICATORS
// Sistema de indicadores de progreso elegantes y personalizables
// ============================================

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback, useRef } from 'react';
import { cn } from '../../utils/cn';

// ============================================
// TIPOS DE INDICADORES
// ============================================

export type ProgressVariant = 
  | 'linear'
  | 'circular'
  | 'step'
  | 'segmented'
  | 'wave'
  | 'dots'
  | 'pulse'
  | 'gradient';

export type ProgressSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ProgressConfig {
  variant?: ProgressVariant;
  size?: ProgressSize;
  value?: number;
  max?: number;
  color?: string;
  backgroundColor?: string;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  striped?: boolean;
  indeterminate?: boolean;
  thickness?: number;
  rounded?: boolean;
}

// ============================================
// LINEAR PROGRESS COMPONENT
// ============================================

interface LinearProgressProps extends ProgressConfig {
  className?: string;
}

export const LinearProgress: React.FC<LinearProgressProps> = ({
  variant = 'linear',
  size = 'md',
  value = 0,
  max = 100,
  color = '#00ffff',
  backgroundColor = 'rgba(0, 255, 255, 0.1)',
  showLabel = false,
  label,
  animated = true,
  striped = false,
  indeterminate = false,
  thickness = 4,
  rounded = true,
  className,
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const sizeMap = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-5',
  };

  const thicknessMap = {
    xs: 1,
    sm: 2,
    md: 4,
    lg: 6,
    xl: 8,
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-2">
          <span className="text-nexus-cyan/80">{label || 'Progress'}</span>
          <span className="text-nexus-cyan/80">{Math.round(percentage)}%</span>
        </div>
      )}
      
      <div className={cn(
        'relative overflow-hidden',
        sizeMap[size],
        rounded ? 'rounded-full' : 'rounded',
        backgroundColor
      )}>
        {/* Background */}
        <div
          className={cn(
            'absolute inset-0',
            rounded ? 'rounded-full' : 'rounded',
            backgroundColor
          )}
        />
        
        {/* Progress Bar */}
        <motion.div
          className={cn(
            'absolute top-0 left-0 h-full',
            rounded ? 'rounded-full' : 'rounded',
            striped && 'bg-gradient-to-r',
            indeterminate && 'origin-left'
          )}
          style={{
            backgroundColor: color,
            width: indeterminate ? '50%' : `${percentage}%`,
          }}
          animate={
            indeterminate
              ? {
                  x: ['-100%', '100%'],
                  transition: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }
              : animated
              ? {
                  width: [0, percentage],
                  transition: {
                    duration: 0.5,
                    ease: 'easeOut',
                  },
                }
              : {}
          }
        />
        
        {/* Animated Stripes */}
        {striped && !indeterminate && (
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `linear-gradient(90deg, transparent, ${color}, transparent)`,
              backgroundSize: '200% 100%',
            }}
            animate={{
              backgroundPosition: ['-200% center', '200% center'],
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

// ============================================
// CIRCULAR PROGRESS COMPONENT
// ============================================

interface CircularProgressProps extends ProgressConfig {
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  variant = 'circular',
  size = 'md',
  value = 0,
  max = 100,
  color = '#00ffff',
  backgroundColor = 'rgba(0, 255, 255, 0.1)',
  showLabel = false,
  label,
  animated = true,
  striped = false,
  indeterminate = false,
  thickness = 4,
  className,
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const sizeMap = {
    xs: { container: 'w-8 h-8', radius: 14 },
    sm: { container: 'w-12 h-12', radius: 20 },
    md: { container: 'w-16 h-16', radius: 28 },
    lg: { container: 'w-20 h-20', radius: 35 },
    xl: { container: 'w-24 h-24', radius: 42 },
  };

  const thicknessMap = {
    xs: 2,
    sm: 3,
    md: 4,
    lg: 5,
    xl: 6,
  };

  const { container, radius } = sizeMap[size];
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        className={container}
        viewBox="0 0 100 100"
      >
        {/* Background Circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={thicknessMap[size]}
        />
        
        {/* Progress Circle */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thicknessMap[size]}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={
            indeterminate
              ? {
                  rotate: 360,
                  transformOrigin: 'center',
                  transition: {
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear',
                  },
                }
              : animated
              ? {
                  strokeDashoffset: [circumference, strokeDashoffset],
                  transition: {
                    duration: 0.5,
                    ease: 'easeOut',
                  },
                }
              : {}
          }
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: 'center',
          }}
        />
      </svg>
      
      {/* Center Label */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium" style={{ color }}>
            {label || `${Math.round(percentage)}%`}
          </span>
        </div>
      )}
    </div>
  );
};

// ============================================
// STEP PROGRESS COMPONENT
// ============================================

interface StepProgressProps extends ProgressConfig {
  steps: number;
  currentStep?: number;
  completed?: boolean[];
  className?: string;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  variant = 'step',
  size = 'md',
  steps,
  currentStep = 0,
  completed = [],
  color = '#00ffff',
  backgroundColor = 'rgba(0, 255, 255, 0.1)',
  showLabel = true,
  className,
}) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {Array.from({ length: steps }).map((_, index) => {
        const isCompleted = completed[index] || index < currentStep;
        const isCurrent = index === currentStep;
        
        return (
          <div key={index} className="flex items-center">
            {/* Step Circle */}
            <div
              className={cn(
                sizeMap[size],
                'rounded-full border-2 flex items-center justify-center',
                isCompleted
                  ? 'bg-nexus-cyan border-nexus-cyan'
                  : isCurrent
                  ? 'border-nexus-cyan'
                  : 'border-nexus-cyan/30',
                'transition-colors duration-200'
              )}
            >
              {isCompleted ? (
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010-1.414l-8 8a1 1 0 01-1.414 0l-8 8a1 1 0 01-1.414 0l8-8z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <span className="text-xs font-medium" style={{ color: isCurrent ? color : undefined }}>
                  {index + 1}
                </span>
              )}
            </div>
            
            {/* Connector Line */}
            {index < steps - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5',
                  isCompleted ? 'bg-nexus-cyan' : 'bg-nexus-cyan/30',
                  'transition-colors duration-200'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ============================================
// SEGMENTED PROGRESS COMPONENT
// ============================================

interface SegmentedProgressProps extends ProgressConfig {
  segments: { value: number; color?: string; label?: string }[];
  className?: string;
}

export const SegmentedProgress: React.FC<SegmentedProgressProps> = ({
  variant = 'segmented',
  size = 'md',
  segments,
  color = '#00ffff',
  backgroundColor = 'rgba(0, 255, 255, 0.1)',
  showLabel = false,
  className,
}) => {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const sizeMap = {
    xs: 'h-2',
    sm: 'h-3',
    md: 'h-4',
    lg: 'h-5',
    xl: 'h-6',
  };

  return (
    <div className={cn('w-full flex rounded-lg overflow-hidden', sizeMap[size], className)}>
      {segments.map((segment, index) => {
        const percentage = (segment.value / total) * 100;
        const segmentColor = segment.color || color;
        
        return (
          <div
            key={index}
            className="relative flex-1"
            style={{ backgroundColor: backgroundColor }}
          >
            <motion.div
              className="h-full"
              style={{ backgroundColor: segmentColor }}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            
            {showLabel && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-white drop-shadow-md">
                  {segment.label || `${Math.round(percentage)}%`}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ============================================
// WAVE PROGRESS COMPONENT
// ============================================

interface WaveProgressProps extends ProgressConfig {
  className?: string;
}

export const WaveProgress: React.FC<WaveProgressProps> = ({
  variant = 'wave',
  size = 'md',
  value = 0,
  max = 100,
  color = '#00ffff',
  backgroundColor = 'rgba(0, 255, 255, 0.1)',
  showLabel = false,
  label,
  className,
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const sizeMap = {
    xs: 'h-8',
    sm: 'h-12',
    md: 'h-16',
    lg: 'h-20',
    xl: 'h-24',
  };

  return (
    <div className={cn('relative overflow-hidden', sizeMap[size], className)}>
      {/* Background */}
      <div
        className={cn('absolute inset-0', backgroundColor)}
      />
      
      {/* Wave Effect */}
      <div className="absolute inset-0">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 left-0 w-full bg-gradient-to-t"
            style={{
              backgroundColor: color,
              opacity: 0.6 - i * 0.2,
              height: `${percentage}%`,
            }}
            animate={{
              height: [
                `${percentage}%`,
                `${percentage * 0.8}%`,
                `${percentage}%`,
              ],
              transition: {
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              },
            }}
          />
        ))}
      </div>
      
      {/* Label */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium" style={{ color }}>
            {label || `${Math.round(percentage)}%`}
          </span>
        </div>
      )}
    </div>
  );
};

// ============================================
// DOTS PROGRESS COMPONENT
// ============================================

interface DotsProgressProps extends ProgressConfig {
  dots?: number;
  activeDots?: number;
  className?: string;
}

export const DotsProgress: React.FC<DotsProgressProps> = ({
  variant = 'dots',
  size = 'md',
  dots = 5,
  activeDots = 0,
  color = '#00ffff',
  backgroundColor = 'rgba(0, 255, 255, 0.1)',
  showLabel = false,
  label,
  className,
}) => {
  const sizeMap = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {Array.from({ length: dots }).map((_, index) => (
        <div
          key={index}
          className={cn(
            sizeMap[size],
            'rounded-full transition-all duration-300',
            index < activeDots
              ? 'bg-nexus-cyan shadow-lg shadow-nexus-cyan/50'
              : backgroundColor
          )}
        />
      ))}
      
      {showLabel && (
        <span className="text-sm text-nexus-cyan/80 ml-2">
          {label || `${activeDots} / ${dots}`}
        </span>
      )}
    </div>
  );
};

// ============================================
// PULSE PROGRESS COMPONENT
// ============================================

interface PulseProgressProps extends ProgressConfig {
  className?: string;
}

export const PulseProgress: React.FC<PulseProgressProps> = ({
  variant = 'pulse',
  size = 'md',
  value = 0,
  max = 100,
  color = '#00ffff',
  backgroundColor = 'rgba(0, 255, 255, 0.1)',
  showLabel = false,
  label,
  className,
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const sizeMap = {
    xs: 'w-8 h-8',
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <div
        className={cn(
          sizeMap[size],
          'rounded-full',
          backgroundColor
        )}
      >
        <motion.div
          className={cn('rounded-full', sizeMap[size])}
          style={{ backgroundColor: color }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
      
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-white">
            {label || `${Math.round(percentage)}%`}
          </span>
        </div>
      )}
    </div>
  );
};

// ============================================
// GRADIENT PROGRESS COMPONENT
// ============================================

interface GradientProgressProps extends ProgressConfig {
  gradient?: string[];
  className?: string;
}

export const GradientProgress: React.FC<GradientProgressProps> = ({
  variant = 'gradient',
  size = 'md',
  value = 0,
  max = 100,
  color = '#00ffff',
  backgroundColor = 'rgba(0, 255, 255, 0.1)',
  gradient = ['#00ffff', '#00ff88', '#00ff44'],
  showLabel = false,
  label,
  className,
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const sizeMap = {
    xs: 'h-2',
    sm: 'h-3',
    md: 'h-4',
    lg: 'h-5',
    xl: 'h-6',
  };

  const gradientColors = gradient.join(', ');

  return (
    <div className={cn('relative overflow-hidden rounded-lg', sizeMap[size], className)}>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, ${gradientColors})`,
        }}
      />
      
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{
          background: `linear-gradient(90deg, ${gradientColors})`,
          clipPath: `polygon(0 0, ${percentage}% 0, 100% 100%, ${percentage}% 0, 0 100%)`,
        }}
        animate={{
          clipPath: [
            'polygon(0 0, 0% 0, 100% 100%, 0% 0, 0 100%)',
            `polygon(0 0, ${percentage}% 0, 100% 100%, ${percentage}% 0, 0 100%)`,
          ],
        }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
      
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-white drop-shadow-lg">
            {label || `${Math.round(percentage)}%`}
          </span>
        </div>
      )}
    </div>
  );
};

// ============================================
// MAIN PROGRESS COMPONENT
// ============================================

interface ProgressProps extends ProgressConfig {
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  variant = 'linear',
  size = 'md',
  ...config
}) => {
  switch (variant) {
    case 'linear':
      return <LinearProgress variant={variant} size={size} {...config} />;
    case 'circular':
      return <CircularProgress variant={variant} size={size} {...config} />;
    case 'step':
      return <StepProgress variant={variant} size={size} {...config} />;
    case 'segmented':
      return <SegmentedProgress variant={variant} size={size} {...config} />;
    case 'wave':
      return <WaveProgress variant={variant} size={size} {...config} />;
    case 'dots':
      return <DotsProgress variant={variant} size={size} {...config} />;
    case 'pulse':
      return <PulseProgress variant={variant} size={size} {...config} />;
    case 'gradient':
      return <GradientProgress variant={variant} size={size} {...config} />;
    default:
      return <LinearProgress variant={variant} size={size} {...config} />;
  }
};

// ============================================
// HOOKS PARA PROGRESO
// ============================================

export function useProgress(initialValue = 0, maxValue = 100) {
  const [value, setValue] = useState(initialValue);
  const [max, setMax] = useState(maxValue);

  const percentage = useCallback(() => {
    return Math.min((value / max) * 100, 100);
  }, [value, max]);

  const updateValue = useCallback((newValue: number) => {
    setValue(Math.min(Math.max(0, newValue), max));
  }, [max]);

  const updateMax = useCallback((newMax: number) => {
    setMax(Math.max(1, newMax));
    setValue(prev => Math.min(prev, newMax));
  }, []);

  return {
    value,
    max,
    percentage,
    setValue: updateValue,
    setMax: updateMax,
  };
}

export function useProgressAnimation(
  targetValue: number,
  duration = 1000,
  maxValue = 100
) {
  const { value, setValue, setMax } = useProgress(0, maxValue);
  const [isAnimating, setIsAnimating] = useState(false);

  const animateTo = useCallback((target: number) => {
    setIsAnimating(true);
    const startValue = value;
    const distance = target - startValue;
    const steps = 60;
    const increment = distance / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const newValue = startValue + increment * currentStep;
      
      setValue(newValue);
      
      if (currentStep >= steps) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, duration / steps);
  }, [value, setValue]);

  useEffect(() => {
    animateTo(targetValue);
  }, [targetValue, animateTo]);

  return {
    value,
    isAnimating,
    animateTo,
    setValue,
    setMax,
  };
}

// ============================================
// EXPORTS
// ============================================

export {
  LinearProgress,
  CircularProgress,
  StepProgress,
  SegmentedProgress,
  WaveProgress,
  DotsProgress,
  PulseProgress,
  GradientProgress,
  Progress,
  useProgress,
  useProgressAnimation,
};

export type {
  ProgressVariant,
  ProgressSize,
  ProgressConfig,
};
