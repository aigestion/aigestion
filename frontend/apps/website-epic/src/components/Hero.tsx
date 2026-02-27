import { motion } from 'framer-motion';
import React from 'react';
import { PlasmaButton } from './PlasmaButton';
import { TextReveal } from './TextReveal';

export const Hero: React.FC = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Parallax Background Layers */}
      <div className="absolute inset-0 z-0 bg-black">
        {/* Gradient layers for depth */}
        <div className="absolute inset-0 bg-linear-to-b from-nexus-obsidian/40 via-transparent to-nexus-obsidian z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-nexus-violet)_0%,transparent_70%)] opacity-20" />

        {/* Animated noise layer */}
        <motion.div
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-10"
        />

        {/* Animated blobs */}
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
      </div>

      {/* Hero Content */}
      <div className="relative z-20 text-center px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <TextReveal
            text="TRANSFORMACIÓN NEURONAL"
            className="text-5xl md:text-8xl font-orbitron font-bold tracking-tighter mb-6"
            useWords={true}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-2xl text-nexus-silver/80 font-sans max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Soberanía digital escalable para empresas que lideran el futuro. Arquitectura de IA
            integrada en el borde del metaverso.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <PlasmaButton label="Iniciar Expansión" variant="primary" />
            <PlasmaButton label="Ver Ecosistema" variant="secondary" />
            <a
              href="tel:+16185381369"
              className="group relative px-8 py-4 bg-nexus-cyan/10 border border-nexus-cyan/30 text-nexus-cyan rounded-xl font-bold flex items-center gap-3 hover:bg-nexus-cyan hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]"
            >
              <span className="text-xl">🤖</span>
              <span className="font-orbitron tracking-wide">Habla con Daniela IA</span>
              <span className="text-xs opacity-70">Asistente Virtual</span>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Down Arrow Animation */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
      >
        <div className="w-px h-12 bg-linear-to-b from-nexus-cyan to-transparent mx-auto" />
      </motion.div>
    </section>
  );
};
