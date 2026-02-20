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
    800px circle at ${mouseX}px ${mouseY}px,
    rgba(0, 245, 255, 0.08) 0%,
    rgba(138, 43, 226, 0.05) 30%,
    transparent 70%
  )`;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      style={{ backgroundImage: gradient }}
      className="fixed inset-0 z-0 transition-opacity duration-300 pointer-events-none"
    >
      {/* Static gradient layers for depth */}
      <div className="absolute inset-0 bg-linear-to-b from-nexus-violet/5 via-transparent to-black" />
      <div className="absolute inset-0 bg-linear-to-r from-black via-transparent to-black" />

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
        className="absolute top-20 -left-40 w-80 h-80 bg-linear-to-r from-nexus-violet/20 to-transparent rounded-full blur-3xl"
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
        className="absolute bottom-20 -right-40 w-80 h-80 bg-linear-to-l from-black/40 to-transparent rounded-full blur-3xl"
      />
    </motion.div>
  );
};
