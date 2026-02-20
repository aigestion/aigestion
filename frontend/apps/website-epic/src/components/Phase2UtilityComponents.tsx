import React from 'react';
import { motion } from 'framer-motion';

// ============================================================================
// SCROLL PROGRESS INDICATOR
// ============================================================================

export const ScrollProgressIndicator: React.FC = () => {
  const [scrollProgress, setScrollProgress] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (scrollTop / docHeight) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top progress bar */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-nexus-violet to-nexus-cyan z-50"
        style={{
          width: `${scrollProgress}%`,
        }}
        transition={{ duration: 0.1 }}
      />

      {/* Scroll to top button (appears at bottom right) */}
      {scrollProgress > 30 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-nexus-violet/20 border border-nexus-cyan/50 flex items-center justify-center text-nexus-cyan z-40 hover:bg-nexus-violet/40 transition-colors"
        >
          <span className="text-xl">↑</span>
        </motion.button>
      )}
    </>
  );
};

// ============================================================================
// STAGGERED GRID WITH REVEAL ANIMATION
// ============================================================================

interface StaggeredGridProps {
  children: React.ReactNode;
  columns?: number;
}

export const StaggeredGrid: React.FC<StaggeredGridProps> = ({ children, columns = 3 }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {React.Children.map(children, child => (
        <motion.div variants={itemVariants}>{child}</motion.div>
      ))}
    </motion.div>
  );
};

// ============================================================================
// FEATURE SHOWCASE WITH ICON
// ============================================================================

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureShowcase: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <motion.div
      className="space-y-4 p-6 rounded-lg bg-nexus-obsidian/40 backdrop-blur-sm border border-white/5 hover:border-nexus-cyan/30 transition-colors"
      whileHover={{ y: -5 }}
    >
      {/* Icon with animated background */}
      <motion.div
        className="relative w-12 h-12 flex items-center justify-center"
        animate={{
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-nexus-violet/20 to-nexus-cyan/20 rounded-lg blur-lg" />
        <div className="relative text-2xl text-nexus-cyan">{icon}</div>
      </motion.div>

      {/* Content */}
      <div>
        <h3 className="font-orbitron font-bold text-white mb-2">{title}</h3>
        <p className="text-nexus-silver/60 text-sm">{description}</p>
      </div>

      {/* Hover indicator */}
      <motion.div
        className="inline-flex items-center gap-2 text-nexus-cyan text-sm"
        animate={{ x: [0, 5, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        Explorar →
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// LOADING SKELETON SHIMMER
// ============================================================================

export const SkeletonLoader: React.FC<{ count?: number; variant?: 'card' | 'text' | 'title' }> = ({
  count = 3,
  variant = 'card',
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`bg-gradient-to-r from-nexus-obsidian via-nexus-violet/10 to-nexus-obsidian rounded-lg overflow-hidden ${
            variant === 'card' ? 'h-64' : variant === 'title' ? 'h-8 w-48' : 'h-4 w-full'
          }`}
          animate={{
            backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundSize: '200% 100%',
          }}
        />
      ))}
    </>
  );
};

// ============================================================================
// ANIMATED COUNTER
// ============================================================================

interface CounterProps {
  end: number;
  label: string;
  suffix?: string;
}

export const AnimatedCounter: React.FC<CounterProps> = ({ end, label, suffix = '' }) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = end / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <motion.div
      className="text-center p-6 rounded-lg bg-gradient-to-br from-nexus-violet/10 to-nexus-cyan/10 border border-white/5"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
    >
      <div className="text-4xl font-orbitron font-bold text-nexus-cyan mb-2">
        {count}
        {suffix}
      </div>
      <div className="text-sm text-nexus-silver/60 font-orbitron">{label}</div>
    </motion.div>
  );
};

// ============================================================================
// GRADIENT TEXT ANIMATION
// ============================================================================

interface GradientTextProps {
  text: string;
  className?: string;
}

export const GradientText: React.FC<GradientTextProps> = ({ text, className = '' }) => {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <span className="bg-gradient-to-r from-nexus-violet via-nexus-cyan to-nexus-gold bg-clip-text text-transparent">
        {text}
      </span>

      {/* Animated underline */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-nexus-violet to-nexus-cyan rounded-full"
        initial={{ width: 0 }}
        whileInView={{ width: '100%' }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      />
    </motion.div>
  );
};

// ============================================================================
// SUCCESS STATE ANIMATION
// ============================================================================

type SuccessToastProps = {
  message: string;
};

export function SuccessToast({ message }: SuccessToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 20, y: -20 }}
      className="fixed top-6 right-6 bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg font-orbitron text-sm flex items-center gap-2 z-50"
    >
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }}>
        ✓
      </motion.div>
      {message}
    </motion.div>
  );
}
