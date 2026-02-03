import React, { forwardRef } from 'react';
import { cn } from '../utils/cn';
import { Loader2 } from 'lucide-react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      children,
      disabled,
      whileHover,
      whileTap,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'inline-flex items-center justify-center',
      'font-medium rounded-xl',
      'transition-all duration-300',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'relative overflow-hidden',
    ];

    const variantClasses = {
      primary: 'bg-[#8a2be2] text-white hover:bg-[#a052ee] shadow-[0_0_15px_rgba(138,43,226,0.4)]',
      secondary: 'bg-[#00d1ff] text-black hover:bg-[#33dbff] shadow-[0_0_15px_rgba(0,209,255,0.4)]',
      outline: 'border-2 border-[#8a2be2] text-[#8a2be2] hover:bg-[#8a2be2] hover:text-white',
      ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
      glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20',
    };

    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
      xl: 'px-10 py-5 text-xl font-bold',
    };

    const renderIcon = () => {
      if (loading) {
        return <Loader2 className="w-5 h-5 animate-spin" />;
      }
      return icon;
    };

    return (
      <motion.button
       // @ts-ignore - ref issues with motion.button and forwardRef are common
        ref={ref}
        whileHover={whileHover || { scale: 1.02 }}
        whileTap={whileTap || { scale: 0.98 }}
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        <div className="flex items-center justify-center gap-2">
          {icon && iconPosition === 'left' && !loading && <span>{renderIcon()}</span>}
          {loading && <span>{renderIcon()}</span>}
          {children}
          {icon && iconPosition === 'right' && !loading && <span>{renderIcon()}</span>}
        </div>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
