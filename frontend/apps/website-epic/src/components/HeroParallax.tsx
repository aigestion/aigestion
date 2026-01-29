import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useRef } from 'react';

export const HeroParallax: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Layers move at different speeds for parallax effect
  const yBackground = useTransform(scrollY, [0, 500], [0, 150]);
  const yMiddle = useTransform(scrollY, [0, 500], [0, 100]);
  const yForeground = useTransform(scrollY, [0, 500], [0, 50]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">
      {/* Background Layer - Slowest */}
      <motion.div
        style={{ y: yBackground }}
        className="absolute inset-0 bg-gradient-to-b from-nexus-violet/20 via-nexus-obsidian to-nexus-obsidian"
      />

      {/* Middle Layer with radial gradient */}
      <motion.div
        style={{ y: yMiddle }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-nexus-cyan)_0%,transparent_70%)] opacity-10"
      />

      {/* Animated noise layer */}
      <motion.div
        style={{ y: yMiddle }}
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlUGVydGluTm9pc2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIuOSIgbnVtT2N0YXZlcz0iNCIgc2VlZD0iMiIgcmVzdWx0PSJub2lzZSIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')] opacity-5"
      />

      {/* Foreground Content - Fastest movement */}
      <motion.div
        style={{ y: yForeground }}
        className="relative z-10 h-full flex items-center justify-center px-6"
      >
        <div className="text-center">
          <h1 className="text-7xl md:text-8xl font-orbitron font-bold text-white mb-6">
            TRANSFORMACIÓN NEURONAL
          </h1>
          <p className="text-xl text-nexus-cyan/80 max-w-2xl mx-auto">
            Soberanía digital escalable para el futuro
          </p>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="w-6 h-10 border-2 border-nexus-cyan rounded-full flex justify-center">
          <motion.div className="w-1 h-2 bg-nexus-cyan rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  );
};
