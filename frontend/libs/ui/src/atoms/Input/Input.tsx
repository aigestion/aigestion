import { HTMLMotionProps, motion } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends HTMLMotionProps<'input'> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  wrapperClassName?: string;
  variant?: 'default' | 'glass';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className, wrapperClassName, variant = 'default', ...props }, ref) => {

    const variants = {
      default: "bg-nexus-obsidian-light border-zinc-700 focus:border-nexus-violet focus:ring-nexus-violet/30",
      glass: "bg-white/5 border-white/10 backdrop-blur-md focus:bg-white/10 focus:border-white/20 focus:ring-white/10"
    }

    return (
      <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
        {label && (
          <label className="text-xs font-medium text-zinc-400 ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-zinc-300">
              {leftIcon}
            </div>
          )}

          <motion.input
            ref={ref}
            whileFocus={{ scale: 1.01 }}
            className={cn(
              'w-full rounded-xl border px-3 py-2.5 text-sm transition-all outline-none placeholder:text-zinc-600',
              variants[variant],
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400 ml-1"
          >
            {error}
          </motion.span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
