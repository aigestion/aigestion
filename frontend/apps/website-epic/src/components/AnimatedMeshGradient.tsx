import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedMeshGradient: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 45, 0],
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-nexus-violet/5 blur-[120px] rounded-full"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [0, -30, 0],
          x: [0, -100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-nexus-cyan/5 blur-[100px] rounded-full"
      />
      <div className="absolute inset-0 bg-nexus-obsidian/40 backdrop-blur-[20px]" />
    </div>
  );
};
