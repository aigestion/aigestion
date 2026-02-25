// ============================================
// MICROINTERACTIONS AVANZADAS
// Sistema de microinteracciones elegantes y performantes
// ============================================

import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '../../utils/cn';

// ============================================
// CONFIGURACIONES DE ANIMACIÓN
// ============================================

export const MICRO_INTERACTIONS = {
  // Hover effects
  hover: {
    scale: 1.05,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  
  // Press effects
  press: {
    scale: 0.95,
    transition: { duration: 0.1, ease: 'easeIn' },
  },
  
  // Focus effects
  focus: {
    scale: 1.02,
    boxShadow: '0 0 0 3px rgba(0, 255, 255, 0.3)',
    transition: { duration: 0.2 },
  },
  
  // Loading states
  loading: {
    opacity: 0.6,
    scale: 0.98,
    transition: { duration: 0.3 },
  },
  
  // Success states
  success: {
    scale: 1.1,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  
  // Error states
  error: {
    x: [-5, 5, -5, 5, 0],
    transition: { duration: 0.4, ease: 'easeOut' },
  },
} as const;

// ============================================
// HOOK PARA MICROINTERACCIONES
// ============================================

export function useMicroInteraction(
  type: keyof typeof MICRO_INTERACTIONS,
  options?: {
    disabled?: boolean;
    customVariants?: any;
  }
) {
  const [isActive, setIsActive] = useState(false);
  const animation = useAnimation();
  const ref = useRef<HTMLDivElement>(null);

  const variants = options?.customVariants || MICRO_INTERACTIONS[type];

  const startInteraction = useCallback(async () => {
    if (options?.disabled) return;
    
    setIsActive(true);
    await animation.start(variants);
  }, [animation, variants, options?.disabled]);

  const endInteraction = useCallback(async () => {
    if (options?.disabled) return;
    
    setIsActive(false);
    await animation.start({ scale: 1, x: 0, opacity: 1, boxShadow: 'none' });
  }, [animation, options?.disabled]);

  return {
    ref,
    isActive,
    startInteraction,
    endInteraction,
    props: {
      animate: animation,
      initial: { scale: 1, x: 0, opacity: 1, boxShadow: 'none' },
    },
  };
}

// ============================================
// COMPONENTE INTERACTIVO BASE
// ============================================

interface InteractiveElementProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  interactionType?: keyof typeof MICRO_INTERACTIONS;
  customVariants?: any;
}

export const InteractiveElement: React.FC<InteractiveElementProps> = ({
  children,
  className,
  disabled = false,
  onClick,
  onHoverStart,
  onHoverEnd,
  interactionType = 'hover',
  customVariants,
}) => {
  const { ref, isActive, startInteraction, endInteraction, props } = useMicroInteraction(
    interactionType,
    { disabled, customVariants }
  );

  return (
    <motion.div
      ref={ref}
      className={cn('cursor-pointer select-none', className)}
      {...props}
      whileHover={!disabled ? startInteraction : undefined}
      whileTap={!disabled ? MICRO_INTERACTIONS.press : undefined}
      onFocus={!disabled ? startInteraction : undefined}
      onBlur={!disabled ? endInteraction : undefined}
      onHoverStart={() => {
        startInteraction();
        onHoverStart?.();
      }}
      onHoverEnd={() => {
        endInteraction();
        onHoverEnd?.();
      }}
      onClick={onClick}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
    >
      {children}
    </motion.div>
  );
};

// ============================================
// BOTÓN CON MICROINTERACCIONES
// ============================================

interface MicroButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  onClick?: () => void;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const MicroButton: React.FC<MicroButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  success = false,
  error = false,
  onClick,
  className,
  leftIcon,
  rightIcon,
}) => {
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRipple({ x, y, id: Date.now() });
    onClick?.();

    // Clear ripple after animation
    setTimeout(() => setRipple(null), 600);
  }, [disabled, loading, onClick]);

  const baseClasses = cn(
    'relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
    {
      'bg-nexus-cyan text-white hover:bg-nexus-cyan/90 focus:ring-nexus-cyan': variant === 'primary',
      'bg-nexus-dark text-nexus-cyan border border-nexus-cyan hover:bg-nexus-cyan/10 focus:ring-nexus-cyan': variant === 'secondary',
      'text-nexus-cyan hover:bg-nexus-cyan/10 focus:ring-nexus-cyan': variant === 'ghost',
      'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500': variant === 'danger',
      'px-3 py-1.5 text-sm': size === 'sm',
      'px-4 py-2 text-base': size === 'md',
      'px-6 py-3 text-lg': size === 'lg',
      'opacity-50 cursor-not-allowed': disabled,
      'cursor-wait': loading,
    },
    className
  );

  const getAnimationVariant = () => {
    if (loading) return 'loading';
    if (success) return 'success';
    if (error) return 'error';
    return 'hover';
  };

  return (
    <motion.button
      className={baseClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      variants={MICRO_INTERACTIONS}
      animate={getAnimationVariant()}
      whileTap={!disabled && !loading ? MICRO_INTERACTIONS.press : {}}
    >
      {/* Ripple Effect */}
      <AnimatePresence>
        {ripple && (
          <motion.span
            className="absolute bg-white/30 rounded-full pointer-events-none"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              left: ripple.x - 16,
              top: ripple.y - 16,
              width: 32,
              height: 32,
            }}
            key={ripple.id}
          />
        )}
      </AnimatePresence>

      {/* Loading Spinner */}
      {loading && (
        <motion.div
          className="absolute -left-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
        </motion.div>
      )}

      {/* Left Icon */}
      {leftIcon && !loading && (
        <span className="mr-2">{leftIcon}</span>
      )}

      {/* Button Content */}
      <span className={cn({ 'opacity-0': loading })}>{children}</span>

      {/* Right Icon */}
      {rightIcon && !loading && (
        <span className="ml-2">{rightIcon}</span>
      )}

      {/* Success Checkmark */}
      {success && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-green-500 rounded-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
};

// ============================================
// CARD CON MICROINTERACCIONES
// ============================================

interface MicroCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  lift?: boolean;
  glow?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const MicroCard: React.FC<MicroCardProps> = ({
  children,
  className,
  hover = true,
  lift = true,
  glow = false,
  disabled = false,
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: hover ? {
      y: lift ? -8 : 0,
      scale: 1.02,
      boxShadow: glow 
        ? '0 20px 40px rgba(0, 255, 255, 0.3)' 
        : '0 10px 30px rgba(0, 0, 0, 0.2)',
      transition: { duration: 0.3, ease: 'easeOut' },
    } : {},
    disabled: {
      opacity: 0.5,
      filter: 'grayscale(100%)',
      cursor: 'not-allowed',
    },
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        'bg-nexus-dark rounded-xl border border-nexus-cyan/20 p-6 cursor-pointer transition-all duration-300',
        {
          'hover:border-nexus-cyan/40': hover && !disabled,
        },
        className
      )}
      variants={cardVariants}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      whileHover={disabled ? "disabled" : "hover"}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={disabled ? undefined : onClick}
      layout
    >
      {children}
    </motion.div>
  );
};

// ============================================
// INPUT CON MICROINTERACCIONES
// ============================================

interface MicroInputProps {
  type?: 'text' | 'email' | 'password' | 'search';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const MicroInput: React.FC<MicroInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  error = false,
  disabled = false,
  className,
  leftIcon,
  rightIcon,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const inputVariants = {
    idle: {
      borderColor: 'rgba(0, 255, 255, 0.2)',
      boxShadow: 'none',
    },
    focused: {
      borderColor: 'rgba(0, 255, 255, 0.6)',
      boxShadow: '0 0 0 3px rgba(0, 255, 255, 0.1)',
      scale: 1.01,
    },
    error: {
      borderColor: 'rgba(239, 68, 68, 0.6)',
      boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
      x: [-2, 2, -2, 2, 0],
      transition: { x: { duration: 0.4 } },
    },
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  return (
    <motion.div
      className={cn(
        'relative flex items-center bg-nexus-dark/50 border rounded-lg overflow-hidden',
        {
          'border-red-500/60': error,
          'border-nexus-cyan/20': !error,
        },
        className
      )}
      variants={inputVariants}
      animate={error ? 'error' : isFocused ? 'focused' : 'idle'}
      transition={{ duration: 0.2 }}
    >
      {leftIcon && (
        <span className="pl-3 text-nexus-cyan/60">{leftIcon}</span>
      )}

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        className={cn(
          'flex-1 bg-transparent px-4 py-3 text-white placeholder-nexus-cyan/40 outline-none',
          {
            'pl-3': !leftIcon,
            'pr-3': !rightIcon,
            'opacity-50 cursor-not-allowed': disabled,
          }
        )}
      />

      {rightIcon && (
        <span className="pr-3 text-nexus-cyan/60">{rightIcon}</span>
      )}
    </motion.div>
  );
};

// ============================================
// TOGGLE SWITCH CON MICROINTERACCIONES
// ============================================

interface MicroToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MicroToggle: React.FC<MicroToggleProps> = ({
  checked = false,
  onChange,
  disabled = false,
  size = 'md',
  className,
}) => {
  const toggleVariants = {
    unchecked: {
      backgroundColor: 'rgba(156, 163, 175, 0.3)',
    },
    checked: {
      backgroundColor: 'rgba(0, 255, 255, 0.8)',
    },
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  };

  const thumbVariants = {
    unchecked: { x: 0 },
    checked: { x: size === 'sm' ? 16 : size === 'md' ? 24 : 32 },
  };

  const sizeClasses = {
    sm: 'w-10 h-6',
    md: 'w-14 h-8',
    lg: 'w-20 h-10',
  };

  const thumbSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <motion.button
      className={cn(
        'relative rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-nexus-cyan/50',
        sizeClasses[size],
        {
          'cursor-not-allowed': disabled,
        },
        className
      )}
      variants={toggleVariants}
      animate={disabled ? 'disabled' : checked ? 'checked' : 'unchecked'}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={() => !disabled && onChange?.(!checked)}
      disabled={disabled}
    >
      <motion.div
        className={cn(
          'absolute top-1 left-1 bg-white rounded-full shadow-lg',
          thumbSizeClasses[size]
        )}
        variants={thumbVariants}
        animate={checked ? 'checked' : 'unchecked'}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );
};

// ============================================
// PROGRESS INDICATOR CON MICROINTERACCIONES
// ============================================

interface MicroProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'green' | 'yellow' | 'red';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export const MicroProgress: React.FC<MicroProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  color = 'cyan',
  showLabel = false,
  animated = true,
  className,
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const colorClasses = {
    cyan: 'bg-nexus-cyan',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-nexus-cyan/60 mb-2">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      
      <div className={cn(
        'w-full bg-nexus-dark/50 rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <motion.div
          className={cn('h-full rounded-full', colorClasses[color])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={animated ? {
            duration: 0.8,
            ease: 'easeOut',
            type: 'spring',
            stiffness: 100,
          } : {}}
        />
      </div>
    </div>
  );
};

// ============================================
// EXPORTS
// ============================================

export {
  MICRO_INTERACTIONS,
  useMicroInteraction,
  InteractiveElement,
  MicroButton,
  MicroCard,
  MicroInput,
  MicroToggle,
  MicroProgress,
};
