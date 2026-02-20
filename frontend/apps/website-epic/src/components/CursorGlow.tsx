import { motion } from 'framer-motion';
import React from 'react';
import { useCursorGlow } from '../hooks/useCursorGlow';

export const CursorGlow: React.FC = () => {
  const { cursorX, cursorY, glowX, glowY } = useCursorGlow();

  return (
    <>
      {/* Cursor dot */}
      <motion.div
        className="fixed w-4 h-4 bg-nexus-cyan rounded-full pointer-events-none z-50 mix-blend-screen"
        style={{
          x: cursorX,
          y: cursorY,
          boxShadow: '0 0 10px rgba(0, 245, 255, 0.8), 0 0 20px rgba(0, 245, 255, 0.4)',
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

      {/* Hide default cursor */}
      <style>{`
        * {
          cursor: none;
        }
        input, textarea, button, a {
          cursor: none;
        }
      `}</style>
    </>
  );
};
