/**
 * Design System - Card Component
 * Componente Card reutilizable para AIGestion Design System
 */

import React, { forwardRef } from 'react'
import { motion, MotionProps } from 'framer-motion'
import { cn } from 'clsx'

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'glass' | 'neon' | 'gaming'
export type CardSize = 'sm' | 'md' | 'lg' | 'xl'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  size?: CardSize
  hover?: boolean
  animated?: boolean
  animation?: MotionProps
  children: React.ReactNode
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      hover = true,
      animated = true,
      animation,
      children,
      ...props
    },
    ref
  ) => {
    // Base classes
    const baseClasses = [
      'rounded-xl',
      'transition-all',
      'duration-300',
      'ease-in-out',
    ]

    // Size classes
    const sizeClasses = {
      sm: ['p-4'],
      md: ['p-6'],
      lg: ['p-8'],
      xl: ['p-10'],
    }

    // Variant classes
    const variantClasses = {
      default: [
        'bg-white',
        'border',
        'border-gray-200',
        'shadow-sm',
      ],
      elevated: [
        'bg-white',
        'border',
        'border-gray-100',
        'shadow-lg',
        'shadow-gray-100/50',
      ],
      outlined: [
        'bg-transparent',
        'border-2',
        'border-gray-300',
      ],
      glass: [
        'bg-white/10',
        'backdrop-blur-md',
        'border',
        'border-white/20',
        'shadow-lg',
        'shadow-white/10',
      ],
      neon: [
        'bg-black',
        'border-2',
        'border-cyan-400',
        'shadow-lg',
        'shadow-cyan-400/50',
      ],
      gaming: [
        'bg-gradient-to-br',
        'from-purple-900/50',
        'via-pink-900/50',
        'to-orange-900/50',
        'backdrop-blur-sm',
        'border',
        'border-purple-500/30',
        'shadow-lg',
        'shadow-purple-500/25',
      ],
    }

    // Hover classes
    const hoverClasses = hover ? {
      default: ['hover:shadow-md', 'hover:border-gray-300'],
      elevated: ['hover:shadow-xl', 'hover:shadow-gray-200/60'],
      outlined: ['hover:border-gray-400', 'hover:bg-gray-50'],
      glass: ['hover:bg-white/20', 'hover:border-white/30'],
      neon: ['hover:shadow-xl', 'hover:shadow-cyan-400/70'],
      gaming: ['hover:shadow-xl', 'hover:shadow-purple-500/40', 'hover:border-purple-400/50'],
    } : {}

    // Animation
    const defaultAnimation: MotionProps = animated ? {
      whileHover: { y: -4 },
      transition: { duration: 0.3 },
    } : {}

    const mergedAnimation = { ...defaultAnimation, ...animation }

    const MotionComponent = motion.div

    return (
      <MotionComponent
        ref={ref}
        className={cn(
          ...baseClasses,
          ...sizeClasses[size],
          ...variantClasses[variant],
          hover && hoverClasses[variant],
          className
        )}
        {...mergedAnimation}
        {...props}
      >
        {children}
      </MotionComponent>
    )
  }
)

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          'items-center',
          'justify-between',
          'mb-4',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex-1',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          'items-center',
          'justify-between',
          'mt-4',
          'pt-4',
          'border-t',
          'border-gray-200',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
CardHeader.displayName = 'CardHeader'
CardBody.displayName = 'CardBody'
CardFooter.displayName = 'CardFooter'

export { CardHeader, CardBody, CardFooter }
export default Card
