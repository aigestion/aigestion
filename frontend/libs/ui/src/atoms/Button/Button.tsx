import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'className'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

const variants = {
  primary: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 border border-transparent',
  secondary: 'bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700',
  ghost: 'bg-transparent text-zinc-300 hover:text-white hover:bg-white/5',
  glass: 'bg-white/5 backdrop-blur-md border border-white/10 text-white shadow-xl hover:bg-white/10 hover:border-white/20',
  outline: 'bg-transparent border border-zinc-600 text-zinc-300 hover:border-zinc-400 hover:text-white',
};

const sizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-10 w-10 p-2 flex items-center justify-center',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, className, children, disabled, ...props },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={disabled || isLoading}
        className={cn(
          'relative inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/50 disabled:opacity-50 disabled:pointer-events-none rounded-xl',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <div className={cn('flex items-center gap-2', isLoading && 'invisible')}>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </div>

        {/* Glow effect for primary variant */}
        {variant === 'primary' && (
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 transition-opacity duration-300 hover:opacity-100 blur-xl" />
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
