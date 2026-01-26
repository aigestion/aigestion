import React from 'react';
import { motion } from 'framer-motion';

export const NeuralParticles: React.FC = () => {
  const particles = Array.from({ length: 20 });

  return (
    <div className="fixed inset-0 -z-30 pointer-events-none overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-nexus-cyan/20 rounded-full"
          initial={{
            x: Math.random() * 100 + '%',
            y: Math.random() * 100 + '%',
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            y: ['-10%', '110%'],
            opacity: [0, 0.5, 0],
            x: [null, (Math.random() - 0.5) * 50 + '%'],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * 10,
          }}
        />
      ))}
    </div>
  );
};
