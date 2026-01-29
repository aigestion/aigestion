import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { Button } from '../../atoms/Button';

export interface HeroCTA {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'glass';
}

export interface HeroSectionProps {
  title: React.ReactNode;
  subtitle?: string;
  description?: string;
  videoSrc?: string;
  backgroundImage?: string;
  ctas?: HeroCTA[];
  overlayVariant?: 'default' | 'intense' | 'none';
  className?: string;
  children?: React.ReactNode;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  videoSrc,
  backgroundImage,
  ctas = [],
  overlayVariant = 'default',
  className,
  children,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const overlayClasses = {
    default: 'bg-gradient-to-b from-black/40 via-transparent to-black',
    intense: 'bg-gradient-to-b from-black/80 via-black/20 to-black',
    none: '',
  };

  return (
    <section className={cn('relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-black', className)}>
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {backgroundImage && (
          <img
            src={backgroundImage}
            className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105 blur-[2px]"
            alt="Hero Background"
          />
        )}

        {videoSrc && (
          <motion.video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
          >
            <source src={videoSrc} type="video/mp4" />
          </motion.video>
        )}

        {/* Global Overlays */}
        <div className={cn('absolute inset-0 z-10', overlayClasses[overlayVariant])} />
        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,rgba(0,245,255,0.05),transparent_80%)]" />
        <div className="scanline z-10 opacity-20" />
      </div>

      {/* Content Layer */}
      <div className="relative z-20 text-center px-6 max-w-7xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {subtitle && (
            <motion.div
              className="flex items-center justify-center gap-3 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="h-[1px] w-8 bg-nexus-violet" />
              <p className="text-nexus-cyan text-[10px] md:text-xs font-mono tracking-[0.4em] uppercase">
                {subtitle}
              </p>
              <div className="h-[1px] w-8 bg-nexus-violet" />
            </motion.div>
          )}

          <h1 className="text-5xl md:text-8xl lg:text-9xl font-orbitron font-black text-white leading-none tracking-tighter mb-8">
            {title}
          </h1>

          {description && (
            <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              {description}
            </p>
          )}

          {ctas.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {ctas.map((cta) => (
                <Button
                  key={cta.label}
                  variant={cta.variant || 'primary'}
                  size="lg"
                  onClick={cta.onClick}
                  className="min-w-[200px]"
                >
                  {cta.label}
                </Button>
              ))}
            </div>
          )}
        </motion.div>

        {children}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-nexus-cyan to-transparent mx-auto opacity-50" />
      </motion.div>
    </section>
  );
};
