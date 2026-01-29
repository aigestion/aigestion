// 🎨 TOP 5 VISUAL IMPROVEMENTS - IMPLEMENTATION EXAMPLES
// Website Epic Enhancements

// ============================================================================
// 1. PARALLAX BACKGROUND EFFECT (Hero Section)
// ============================================================================
// Archivo: frontend/apps/website-epic/src/components/HeroParallax.tsx

import { motion, useScroll, useTransform } from 'framer-motion';

export const HeroParallax = () => {
  const { scrollY } = useScroll();

  // Layers move at different speeds
  const yBackground = useTransform(scrollY, [0, 500], [0, 150]);
  const yMiddle = useTransform(scrollY, [0, 500], [0, 100]);
  const yForeground = useTransform(scrollY, [0, 500], [0, 50]);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Layer - Slowest */}
      <motion.div
        style={{ y: yBackground }}
        className="absolute inset-0 bg-gradient-to-b from-nexus-violet/20 via-nexus-obsidian to-nexus-obsidian"
      />

      {/* Middle Layer */}
      <motion.div
        style={{ y: yMiddle }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-nexus-cyan)_0%,transparent_70%)] opacity-10"
      />

      {/* Foreground Content - Fastest */}
      <motion.div
        style={{ y: yForeground }}
        className="relative z-10 h-full flex items-center justify-center px-6"
      >
        <div className="text-center">
          <h1 className="text-7xl font-orbitron font-bold text-white mb-6">
            TRANSFORMACIÓN NEURONAL
          </h1>
          <p className="text-xl text-nexus-cyan/80 max-w-2xl mx-auto">
            Soberanía digital escalable para el futuro
          </p>
        </div>
      </motion.div>
    </section>
  );
};

// ============================================================================
// 2. MESH GRADIENT ANIMATED BACKGROUND
// ============================================================================
// Archivo: frontend/apps/website-epic/src/components/MeshGradientBG.tsx

import { useMousePosition } from '../hooks/useMousePosition';
import { useMotionTemplate, useMotionValue, motion } from 'framer-motion';

export const MeshGradientBG = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    mouseX.set(clientX);
    mouseY.set(clientY);
  };

  const gradient = useMotionTemplate`radial-gradient(
    circle at ${mouseX}px ${mouseY}px,
    rgba(138, 43, 226, 0.3) 0%,
    rgba(0, 245, 255, 0.1) 25%,
    rgba(255, 215, 0, 0.05) 50%,
    transparent 100%
  )`;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      style={{ backgroundImage: gradient }}
      className="fixed inset-0 z-0 transition-opacity duration-300"
    >
      {/* Static gradient layers for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-nexus-violet/5 via-transparent to-nexus-obsidian" />
      <div className="absolute inset-0 bg-gradient-to-r from-nexus-cyan/5 via-transparent to-nexus-obsidian" />
    </motion.div>
  );
};

// ============================================================================
// 3. TEXT REVEAL ANIMATION
// ============================================================================
// Arquivo: frontend/apps/website-epic/src/components/TextReveal.tsx

import { motion } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export const TextReveal = ({ text, className = '', delay = 0 }: TextRevealProps) => {
  const words = text.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        delay: i * 0.05,
      },
    }),
  };

  return (
    <motion.div
      className={`flex flex-wrap gap-2 ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {words.map((word, wordIdx) => (
        <motion.span
          key={wordIdx}
          variants={wordVariants}
          className="inline-block"
        >
          {word.split('').map((letter, letterIdx) => (
            <motion.span
              key={letterIdx}
              custom={letterIdx}
              variants={letterVariants}
              className="inline-block"
            >
              {letter}
            </motion.span>
          ))}
        </motion.span>
      ))}
    </motion.div>
  );
};

// ============================================================================
// 4. CTA BUTTON WITH PLASMA EFFECT
// ============================================================================
// Archivo: frontend/apps/website-epic/src/components/PlasmaButton.tsx

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';

interface PlasmaButtonProps {
  label: string;
  onClick?: () => void;
}

export const PlasmaButton = ({ label, onClick }: PlasmaButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top } = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className="relative px-10 py-4 font-orbitron tracking-widest uppercase text-white overflow-hidden group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-nexus-violet" />

      {/* Plasma circle effect */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 100,
          height: 100,
          left: mouseX,
          top: mouseY,
          x: -50,
          y: -50,
          background: 'radial-gradient(circle, rgba(0,245,255,0.3) 0%, transparent 70%)',
          filter: 'blur(10px)',
        }}
      />

      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 border border-nexus-cyan opacity-0 group-hover:opacity-100"
        animate={{
          boxShadow: [
            '0 0 0 0 rgba(0, 245, 255, 0.7)',
            '0 0 20px 10px rgba(0, 245, 255, 0)',
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />

      {/* Text */}
      <span className="relative z-10">{label}</span>
    </motion.button>
  );
};

// ============================================================================
// 5. CUSTOM CURSOR WITH GLOW
// ============================================================================
// Archivo: frontend/apps/website-epic/src/hooks/useCursorGlow.ts

import { useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

export const useCursorGlow = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const cursorX = useTransform(mouseX, (x) => x - 8);
  const cursorY = useTransform(mouseY, (y) => y - 8);

  const glowX = useTransform(mouseX, (x) => x - 20);
  const glowY = useTransform(mouseY, (y) => y - 20);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return { cursorX, cursorY, glowX, glowY };
};

// Archivo: frontend/apps/website-epic/src/components/CursorGlow.tsx

import { motion } from 'framer-motion';
import { useCursorGlow } from '../hooks/useCursorGlow';

export const CursorGlow = () => {
  const { cursorX, cursorY, glowX, glowY } = useCursorGlow();

  return (
    <>
      {/* Cursor */}
      <motion.div
        className="fixed w-4 h-4 bg-nexus-cyan rounded-full pointer-events-none z-50 mix-blend-screen"
        style={{
          x: cursorX,
          y: cursorY,
          boxShadow: '0 0 10px rgba(0, 245, 255, 0.8)',
        }}
      />

      {/* Glow halo */}
      <motion.div
        className="fixed w-16 h-16 rounded-full pointer-events-none z-40 mix-blend-screen"
        style={{
          x: glowX,
          y: glowY,
          background: 'radial-gradient(circle, rgba(0, 245, 255, 0.2) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
    </>
  );
};

// ============================================================================
// HOW TO USE IN APP.tsx
// ============================================================================

/*
import { MeshGradientBG } from './components/MeshGradientBG';
import { CursorGlow } from './components/CursorGlow';
import { HeroParallax } from './components/HeroParallax';
import { TextReveal } from './components/TextReveal';
import { PlasmaButton } from './components/PlasmaButton';

function App() {
  return (
    <>
      <MeshGradientBG />
      <CursorGlow />

      <HeroParallax />

      <section className="py-20">
        <TextReveal
          text="Transformación Digital del Futuro"
          className="text-5xl font-orbitron mb-10"
        />

        <PlasmaButton
          label="Iniciar Expansión"
          onClick={() => console.log('Clicked!')}
        />
      </section>
    </>
  );
}
*/

// ============================================================================
// TAILWIND CSS ADDITIONS (Add to index.css)
// ============================================================================

/*
@layer utilities {
  .animate-shimmer {
    background-size: 200% 100%;
    animation: shimmer 3s infinite;
  }

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  .text-glow {
    text-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
  }

  .neon-border {
    border: 1px solid;
    box-shadow: inset 0 0 10px rgba(0, 245, 255, 0.1);
  }
}
*/
