import React from 'react';
import { motion } from 'framer-motion';
import { MeshGradientBG } from '../components/MeshGradientBG';
import { CustomCursor } from '../components/CustomCursor';

export const Maintenance: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden flex flex-col items-center justify-center font-orbitron selection:bg-nexus-cyan/20 selection:text-white">
      {/* Background & Effects */}
      <MeshGradientBG />
      <div className="grain-overlay" />
      <CustomCursor />

      {/* Content Container */}
      <div className="relative z-10 px-6 text-center">
        {/* Logo / Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mb-12"
        >
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-nexus-cyan/20 blur-xl rounded-full animate-pulse-glow" />
            <img
              src="/images/brand/logo.png"
              alt="AIGESTION"
              className="w-24 h-24 md:w-32 md:h-32 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(0,245,255,0.5)]"
            />
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl md:text-7xl font-black tracking-wider mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-nexus-silver to-gray-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
        >
          AIGESTION<span className="text-nexus-cyan-glow">.NET</span>
        </motion.h1>

        {/* Status Text */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.6 }}
           className="relative inline-block"
        >
            <div className="absolute -inset-4 bg-nexus-violet/10 rounded-lg blur-lg" />
            <h2 className="relative text-2xl md:text-4xl font-bold tracking-[0.5em] uppercase text-white mb-2 stack-reveal">
                PRÓXIMAMENTE
            </h2>
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-nexus-cyan-glow to-transparent mt-4 opacity-70" />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-8 text-nexus-silver/60 text-sm md:text-base tracking-[0.2em] font-mono uppercase max-w-lg mx-auto"
        >
          Arquitectura de Inteligencia Soberana <br />
          <span className="text-nexus-cyan-glow">En Construcción</span>
        </motion.p>

        {/* Loading Indicator */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-16 flex justify-center gap-2"
        >
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2
                    }}
                    className="w-2 h-2 bg-nexus-cyan-glow rounded-full shadow-[0_0_10px_rgba(0,245,255,0.8)]"
                />
            ))}
        </motion.div>
      </div>

      {/* Footer / Copyright */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 text-[10px] text-nexus-silver/40 tracking-[0.3em]"
      >
        COPYRIGHT © 2026 AIGESTION NEXUS
      </motion.div>
    </div>
  );
};
