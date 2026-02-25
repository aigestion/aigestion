// ============================================
// ENHANCED LOADING STATES
// Sistema de estados de carga personalizados y elegantes
// ============================================

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { cn } from '../../utils/cn';

// ============================================
// TIPOS DE LOADING STATES
// ============================================

export type LoadingVariant = 
  | 'spinner'
  | 'dots'
  | 'pulse'
  | 'skeleton'
  | 'progress'
  | 'wave'
  | 'orbit'
  | 'bars'
  | 'morph'
  | 'glow';

export type LoadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface LoadingStateConfig {
  variant: LoadingVariant;
  size?: LoadingSize;
  color?: string;
  speed?: 'slow' | 'normal' | 'fast';
  text?: string;
  showProgress?: boolean;
  progress?: number;
}

// ============================================
// SPINNER LOADING COMPONENT
// ============================================

interface SpinnerProps {
  size?: LoadingSize;
  color?: string;
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'currentColor',
  speed = 'normal',
  className,
}) => {
  const sizeMap = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const speedMap = {
    slow: 3,
    normal: 1,
    fast: 0.5,
  };

  return (
    <motion.div
      className={cn('rounded-full border-2 border-t-transparent', sizeMap[size], className)}
      style={{ borderColor: color, borderTopColor: 'transparent' }}
      animate={{ rotate: 360 }}
      transition={{
        duration: speedMap[speed],
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
};

// ============================================
// DOTS LOADING COMPONENT
// ============================================

interface DotsProps {
  count?: number;
  size?: LoadingSize;
  color?: string;
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

export const Dots: React.FC<DotsProps> = ({
  count = 3,
  size = 'md',
  color = 'currentColor',
  speed = 'normal',
  className,
}) => {
  const sizeMap = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  const speedMap = {
    slow: 1.2,
    normal: 0.8,
    fast: 0.4,
  };

  return (
    <div className={cn('flex gap-1', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={cn('rounded-full', sizeMap[size])}
          style={{ backgroundColor: color }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: speedMap[speed],
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// ============================================
// PULSE LOADING COMPONENT
// ============================================

interface PulseProps {
  size?: LoadingSize;
  color?: string;
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

export const Pulse: React.FC<PulseProps> = ({
  size = 'md',
  color = 'currentColor',
  speed = 'normal',
  className,
}) => {
  const sizeMap = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const speedMap = {
    slow: 2,
    normal: 1.5,
    fast: 1,
  };

  return (
    <div className={cn('relative', className)}>
      <motion.div
        className={cn('rounded-full', sizeMap[size])}
        style={{ backgroundColor: color }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.3, 1],
        }}
        transition={{
          duration: speedMap[speed],
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

// ============================================
// PROGRESS LOADING COMPONENT
// ============================================

interface ProgressLoaderProps {
  progress?: number;
  size?: LoadingSize;
  color?: string;
  showText?: boolean;
  className?: string;
}

export const ProgressLoader: React.FC<ProgressLoaderProps> = ({
  progress = 0,
  size = 'md',
  color = 'currentColor',
  showText = false,
  className,
}) => {
  const sizeMap = {
    xs: 'w-8 h-8',
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
  };

  const strokeWidthMap = {
    xs: 2,
    sm: 3,
    md: 4,
    lg: 5,
    xl: 6,
  };

  const radius = {
    xs: 14,
    sm: 20,
    md: 28,
    lg: 35,
    xl: 42,
  };

  const circumference = 2 * Math.PI * radius[size];
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <svg className={sizeMap[size]} viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius[size]}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidthMap[size]}
          className="opacity-20"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius[size]}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidthMap[size]}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
        />
      </svg>
      
      {showText && (
        <div className="absolute text-sm font-medium" style={{ color }}>
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

// ============================================
// WAVE LOADING COMPONENT
// ============================================

interface WaveProps {
  size?: LoadingSize;
  color?: string;
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

export const Wave: React.FC<WaveProps> = ({
  size = 'md',
  color = 'currentColor',
  speed = 'normal',
  className,
}) => {
  const sizeMap = {
    xs: 'w-8 h-4',
    sm: 'w-12 h-6',
    md: 'w-16 h-8',
    lg: 'w-20 h-10',
    xl: 'w-24 h-12',
  };

  const speedMap = {
    slow: 2,
    normal: 1.5,
    fast: 1,
  };

  return (
    <div className={cn('flex items-end gap-1', sizeMap[size], className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-full"
          style={{ backgroundColor: color }}
          animate={{
            height: ['20%', '100%', '20%'],
          }}
          transition={{
            duration: speedMap[speed],
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// ============================================
// ORBIT LOADING COMPONENT
// ============================================

interface OrbitProps {
  size?: LoadingSize;
  color?: string;
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

export const Orbit: React.FC<OrbitProps> = ({
  size = 'md',
  color = 'currentColor',
  speed = 'normal',
  className,
}) => {
  const sizeMap = {
    xs: 'w-8 h-8',
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
  };

  const speedMap = {
    slow: 3,
    normal: 2,
    fast: 1,
  };

  return (
    <div className={cn('relative', sizeMap[size], className)}>
      {/* Central dot */}
      <div 
        className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{ backgroundColor: color }}
      />
      
      {/* Orbiting dots */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{ backgroundColor: color }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: speedMap[speed],
            repeat: Infinity,
            ease: 'linear',
            delay: i * (speedMap[speed] / 3),
          }}
          style={{
            transformOrigin: '0 0',
            transform: `rotate(${i * 120}deg) translateY(-12px)`,
          }}
        />
      ))}
    </div>
  );
};

// ============================================
// BARS LOADING COMPONENT
// ============================================

interface BarsProps {
  count?: number;
  size?: LoadingSize;
  color?: string;
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

export const Bars: React.FC<BarsProps> = ({
  count = 5,
  size = 'md',
  color = 'currentColor',
  speed = 'normal',
  className,
}) => {
  const sizeMap = {
    xs: 'h-4',
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
    xl: 'h-12',
  };

  const speedMap = {
    slow: 1.2,
    normal: 0.8,
    fast: 0.4,
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={cn('w-1 rounded-full', sizeMap[size])}
          style={{ backgroundColor: color }}
          animate={{
            height: ['20%', '100%', '20%'],
          }}
          transition={{
            duration: speedMap[speed],
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// ============================================
// MORPH LOADING COMPONENT
// ============================================

interface MorphProps {
  size?: LoadingSize;
  color?: string;
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

export const Morph: React.FC<MorphProps> = ({
  size = 'md',
  color = 'currentColor',
  speed = 'normal',
  className,
}) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const speedMap = {
    slow: 2,
    normal: 1.5,
    fast: 1,
  };

  return (
    <motion.div
      className={cn(sizeMap[size], className)}
      style={{ backgroundColor: color }}
      animate={{
        borderRadius: ['20%', '50%', '20%', '50%'],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: speedMap[speed],
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

// ============================================
// GLOW LOADING COMPONENT
// ============================================

interface GlowProps {
  size?: LoadingSize;
  color?: string;
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

export const Glow: React.FC<GlowProps> = ({
  size = 'md',
  color = 'currentColor',
  speed = 'normal',
  className,
}) => {
  const sizeMap = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const speedMap = {
    slow: 3,
    normal: 2,
    fast: 1,
  };

  return (
    <motion.div
      className={cn('rounded-full', sizeMap[size], className)}
      style={{ 
        backgroundColor: color,
        boxShadow: `0 0 20px ${color}`,
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: speedMap[speed],
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

// ============================================
// MAIN LOADING STATE COMPONENT
// ============================================

interface LoadingStateProps extends LoadingStateConfig {
  className?: string;
  overlay?: boolean;
  centered?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  variant,
  size = 'md',
  color = '#00ffff',
  speed = 'normal',
  text,
  showProgress = false,
  progress = 0,
  className,
  overlay = false,
  centered = true,
}) => {
  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return <Spinner size={size} color={color} speed={speed} />;
      case 'dots':
        return <Dots size={size} color={color} speed={speed} />;
      case 'pulse':
        return <Pulse size={size} color={color} speed={speed} />;
      case 'progress':
        return (
          <ProgressLoader
            progress={showProgress ? progress : undefined}
            size={size}
            color={color}
            showText={showProgress}
          />
        );
      case 'wave':
        return <Wave size={size} color={color} speed={speed} />;
      case 'orbit':
        return <Orbit size={size} color={color} speed={speed} />;
      case 'bars':
        return <Bars size={size} color={color} speed={speed} />;
      case 'morph':
        return <Morph size={size} color={color} speed={speed} />;
      case 'glow':
        return <Glow size={size} color={color} speed={speed} />;
      default:
        return <Spinner size={size} color={color} speed={speed} />;
    }
  };

  const content = (
    <div className={cn(
      'flex flex-col items-center gap-3',
      centered && 'justify-center min-h-[200px]',
      className
    )}>
      {renderLoader()}
      
      <AnimatePresence>
        {text && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-nexus-cyan/80"
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

// ============================================
// SKELETON LOADING COMPONENTS
// ============================================

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  lines?: number;
  className?: string;
  animated?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  lines = 1,
  className,
  animated = true,
}) => {
  const baseClasses = cn(
    'bg-nexus-dark/50',
    {
      'rounded-full': variant === 'circular',
      'rounded': variant === 'rounded',
      'rounded-sm': variant === 'text',
    },
    className
  );

  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1rem' : undefined),
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              'h-4',
              i === lines - 1 ? 'w-3/4' : 'w-full'
            )}
            style={animated ? {
              background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.1), transparent)',
              backgroundSize: '200% 100%',
              animation: 'skeleton 1.5s ease-in-out infinite',
            } : undefined}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={baseClasses}
      style={{
        ...style,
        ...(animated ? {
          background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.1), transparent)',
          backgroundSize: '200% 100%',
          animation: 'skeleton 1.5s ease-in-out infinite',
        } : {}),
      }}
    />
  );
};

// ============================================
// PAGE LOADING COMPONENT
// ============================================

interface PageLoadingProps {
  text?: string;
  variant?: LoadingVariant;
  showLogo?: boolean;
  className?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  text = 'Loading...',
  variant = 'spinner',
  showLogo = true,
  className,
}) => {
  return (
    <div className={cn(
      'fixed inset-0 bg-nexus-obsidian flex flex-col items-center justify-center z-50',
      className
    )}>
      <AnimatePresence>
        {showLogo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-8"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-nexus-cyan to-nexus-purple rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">AI</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LoadingState
        variant={variant}
        size="lg"
        text={text}
        speed="normal"
      />
    </div>
  );
};

// ============================================
// HOOK FOR LOADING STATES
// ============================================

export function useLoadingState(
  initialLoading = false,
  delay = 200
) {
  const [loading, setLoading] = useState(initialLoading);
  const [showLoading, setShowLoading] = useState(initialLoading);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (loading) {
      timeout = setTimeout(() => setShowLoading(true), delay);
    } else {
      setShowLoading(false);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [loading, delay]);

  return {
    loading,
    showLoading,
    setLoading,
  };
}

// ============================================
// STYLES FOR SKELETON ANIMATION
// ============================================

const skeletonStyles = `
  @keyframes skeleton {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

// Inject styles if they don't exist
if (typeof document !== 'undefined' && !document.getElementById('skeleton-styles')) {
  const style = document.createElement('style');
  style.id = 'skeleton-styles';
  style.textContent = skeletonStyles;
  document.head.appendChild(style);
}

// ============================================
// EXPORTS
// ============================================

export {
  LoadingState,
  Skeleton,
  PageLoading,
  useLoadingState,
};

export type {
  LoadingVariant,
  LoadingSize,
  LoadingStateConfig,
};
