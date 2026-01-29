import { HTMLMotionProps, motion } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'glass' | 'neon';
  hoverEffect?: boolean;
  padded?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hoverEffect = false, padded = true, children, ...props }, ref) => {

    const variants = {
      default: "bg-nexus-obsidian-light border border-zinc-800",
      glass: "bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl",
      neon: "bg-nexus-obsidian-deep border border-nexus-violet/30 shadow-lg shadow-nexus-violet/10"
    }

    return (
      <motion.div
        ref={ref}
        whileHover={hoverEffect ? { y: -5, transition: { duration: 0.2 } } : undefined}
        className={cn(
          'rounded-2xl overflow-hidden relative',
          variants[variant],
          padded && 'p-6',
          className
        )}
        {...props}
      >
        {variant === 'neon' && (
          <div className="absolute inset-0 bg-gradient-to-br from-nexus-violet/5 to-nexus-cyan/5 pointer-events-none" />
        )}
        <div className="relative z-10">
          {children as React.ReactNode}
        </div>
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
