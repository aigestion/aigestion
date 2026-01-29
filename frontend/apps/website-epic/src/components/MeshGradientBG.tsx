import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import React, { useEffect } from 'react';

export const MeshGradientBG: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    mouseX.set(clientX);
    mouseY.set(clientY);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [mouseX, mouseY]);

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
      className="fixed inset-0 z-0 transition-opacity duration-300 pointer-events-none"
    >
      {/* Static gradient layers for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-nexus-violet/5 via-transparent to-nexus-obsidian" />
      <div className="absolute inset-0 bg-gradient-to-r from-nexus-cyan/5 via-transparent to-nexus-obsidian" />

      {/* Animated blob 1 */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'mirror',
        }}
        className="absolute top-20 -left-40 w-80 h-80 bg-gradient-to-r from-nexus-violet/20 to-transparent rounded-full blur-3xl"
      />

      {/* Animated blob 2 */}
      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'mirror',
          delay: 1,
        }}
        className="absolute bottom-20 -right-40 w-80 h-80 bg-gradient-to-l from-nexus-cyan/20 to-transparent rounded-full blur-3xl"
      />
    </motion.div>
  );
};
