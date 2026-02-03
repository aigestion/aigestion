/**
 * Design System - Button Component
 * Componente Button reutilizable para AIGestion Design System
 */

import React, { forwardRef } from 'react'
import { motion, MotionProps } from 'framer-motion'
import { cn } from 'clsx'
import { colors } from '../../tokens/colors'
import { typography } from '../../tokens/typography'
import { spacing } from '../../tokens/spacing'

// Button variants
export type ButtonVariant = 
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'gaming'
  | 'neon'

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  animation?: MotionProps
  href?: string
  target?: string
  rel?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      animation,
      href,
      target,
      rel,
      ...props
    },
    ref
  ) => {
    // Base classes
    const baseClasses = [
      'inline-flex',
      'items-center',
      'justify-center',
      'font-medium',
      'rounded-lg',
      'transition-all',
      'duration-200',
      'ease-in-out',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
      'disabled:pointer-events-none',
    ]

    // Size classes
    const sizeClasses = {
      xs: ['px-2', 'py-1', 'text-xs', 'min-h-[24px]'],
      sm: ['px-3', 'py-1.5', 'text-sm', 'min-h-[32px]'],
      md: ['px-4', 'py-2', 'text-sm', 'min-h-[40px]'],
      lg: ['px-6', 'py-3', 'text-base', 'min-h-[48px]'],
      xl: ['px-8', 'py-4', 'text-lg', 'min-h-[56px]'],
    }

    // Variant classes
    const variantClasses = {
      primary: [
        'bg-gradient-to-r',
        'from-blue-500',
        'to-purple-600',
        'text-white',
        'hover:from-blue-600',
        'hover:to-purple-700',
        'focus:ring-blue-500',
        'shadow-lg',
        'hover:shadow-xl',
      ],
      secondary: [
        'bg-gradient-to-r',
        'from-purple-500',
        'to-pink-500',
        'text-white',
        'hover:from-purple-600',
        'hover:to-pink-600',
        'focus:ring-purple-500',
        'shadow-lg',
        'hover:shadow-xl',
      ],
      accent: [
        'bg-gradient-to-r',
        'from-pink-500',
        'to-orange-500',
        'text-white',
        'hover:from-pink-600',
        'hover:to-orange-600',
        'focus:ring-pink-500',
        'shadow-lg',
        'hover:shadow-xl',
      ],
      outline: [
        'border-2',
        'border-blue-500',
        'text-blue-600',
        'bg-transparent',
        'hover:bg-blue-50',
        'hover:border-blue-600',
        'focus:ring-blue-500',
      ],
      ghost: [
        'text-blue-600',
        'bg-transparent',
        'hover:bg-blue-50',
        'focus:ring-blue-500',
      ],
      link: [
        'text-blue-600',
        'bg-transparent',
        'hover:text-blue-700',
        'hover:underline',
        'focus:ring-blue-500',
        'p-0',
        'min-h-0',
      ],
      success: [
        'bg-gradient-to-r',
        'from-green-500',
        'to-emerald-600',
        'text-white',
        'hover:from-green-600',
        'hover:to-emerald-700',
        'focus:ring-green-500',
        'shadow-lg',
        'hover:shadow-xl',
      ],
      warning: [
        'bg-gradient-to-r',
        'from-yellow-500',
        'to-orange-500',
        'text-white',
        'hover:from-yellow-600',
        'hover:to-orange-600',
        'focus:ring-yellow-500',
        'shadow-lg',
        'hover:shadow-xl',
      ],
      error: [
        'bg-gradient-to-r',
        'from-red-500',
        'to-pink-500',
        'text-white',
        'hover:from-red-600',
        'hover:to-pink-600',
        'focus:ring-red-500',
        'shadow-lg',
        'hover:shadow-xl',
      ],
      info: [
        'bg-gradient-to-r',
        'from-cyan-500',
        'to-blue-500',
        'text-white',
        'hover:from-cyan-600',
        'hover:to-blue-600',
        'focus:ring-cyan-500',
        'shadow-lg',
        'hover:shadow-xl',
      ],
      gaming: [
        'bg-gradient-to-r',
        'from-purple-600',
        'via-pink-500',
        'to-orange-500',
        'text-white',
        'hover:from-purple-700',
        'hover:via-pink-600',
        'hover:to-orange-600',
        'focus:ring-purple-500',
        'shadow-lg',
        'hover:shadow-xl',
        'font-bold',
        'uppercase',
        'tracking-wider',
      ],
      neon: [
        'bg-black',
        'text-cyan-400',
        'border',
        'border-cyan-400',
        'hover:bg-cyan-400',
        'hover:text-black',
        'hover:shadow-lg',
        'hover:shadow-cyan-400/50',
        'focus:ring-cyan-400',
        'font-mono',
        'uppercase',
      ],
    }

    // Combine classes
    const classes = cn(
      ...baseClasses,
      ...sizeClasses[size],
      ...variantClasses[variant],
      fullWidth && 'w-full',
      className
    )

    // Loading spinner
    const LoadingSpinner = () => (
      <svg
        className="animate-spin -ml-1 mr-2 h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    )

    // Motion component
    const MotionComponent = motion.button

    // Default animation
    const defaultAnimation: MotionProps = {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      transition: { duration: 0.2 },
    }

    const mergedAnimation = { ...defaultAnimation, ...animation }

    // Render as link if href is provided
    if (href) {
      return (
        <motion.a
          href={href}
          target={target}
          rel={rel}
          className={cn(
            ...baseClasses,
            ...sizeClasses[size],
            ...variantClasses[variant],
            fullWidth && 'w-full',
            'no-underline',
            className
          )}
          {...mergedAnimation}
        >
          {loading && <LoadingSpinner />}
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </motion.a>
      )
    }

    return (
      <MotionComponent
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...mergedAnimation}
        {...props}
      >
        {loading && <LoadingSpinner />}
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </MotionComponent>
    )
  }
)

Button.displayName = 'Button'

export default Button
