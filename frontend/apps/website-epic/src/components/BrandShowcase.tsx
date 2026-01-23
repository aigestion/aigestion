import React from 'react';
import { motion } from 'framer-motion';

export const BrandShowcase: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-nexus-obsidian-deep flex flex-col items-center justify-center">
      {/* Spectacular Background Glow */}
      <div className="absolute inset-0 bg-radial-at-center from-nexus-violet/10 via-transparent to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Animated Rings around Logo */}
        <motion.div
          className="absolute -inset-24 border border-nexus-cyan/20 rounded-full"
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -inset-16 border border-nexus-violet/30 rounded-full"
          animate={{ rotate: -360, scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* The Premium Logo */}
        <div className="relative group">
          <motion.div
            className="absolute -inset-4 bg-nexus-cyan-glow/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
          <img
            src="/images/brand/logo.png"
            alt="AIGestion.net Premium"
            className="h-32 md:h-48 w-auto filter drop-shadow-[0_0_20px_rgba(34,211,238,0.4)] relative z-10"
          />
        </div>

        {/* Spectacular Title/Slogan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-12 text-center"
        >
          <h2 className="text-2xl md:text-4xl font-orbitron font-black tracking-[0.5em] text-transparent bg-clip-text bg-linear-to-r from-nexus-cyan-glow via-white to-nexus-violet-glow uppercase">
            AIGestion.net
          </h2>
          <div className="h-px w-64 bg-linear-to-r from-transparent via-nexus-cyan/40 to-transparent mx-auto mt-6" />
          <p className="mt-6 text-nexus-silver/40 font-orbitron text-[10px] tracking-[0.4em] uppercase italic">
            "La soberanía digital no es una opción, es el destino."
          </p>
        </motion.div>

        {/* Holographic Particle Spray (using CSS dots) */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-nexus-cyan-glow rounded-full"
              initial={{
                x: 0,
                y: 0,
                opacity: 0
              }}
              animate={{
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400,
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
              style={{
                left: '50%',
                top: '50%'
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Corporate Confidence Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.1 }}
        viewport={{ once: true }}
        className="absolute bottom-10 right-10 font-mono text-[8px] tracking-[0.5em] uppercase text-white rotate-90 origin-bottom-right"
      >
        God Level Restored v2.0
      </motion.div>
    </section>
  );
};
