import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import { useSound } from '../hooks/useSound';

export const NexusAndroid: React.FC = () => {
  const [activeMode, setActiveMode] = useState('warrior');
  const { playHover, playClick } = useSound();

  const modes = [
    {
      id: 'warrior',
      name: 'GUARDIÁN GUERRERO',
      description: 'Protección cuántica máxima y defensa neural avanzada.',
      color: 'from-nexus-violet to-purple-800',
      accent: 'text-nexus-violet-glow',
      image: '/images/nexus/nexus_guardian_godmode.png',
      abilities: ['Escudo Energético', 'Campo de Fuerza', 'Defensa Neural']
    },
    {
      id: 'strategist',
      name: 'ESTRATEGA CUÁNTICO',
      description: 'Análisis predictivo profundo y optimización sistémica.',
      color: 'from-nexus-cyan to-blue-800',
      accent: 'text-nexus-cyan-glow',
      image: '/images/nexus/nexus_strategist_godmode.png',
      abilities: ['Predicción Futura', 'Análisis de Datos', 'Optimización']
    },
    {
      id: 'creator',
      name: 'CREADOR INNOVADOR',
      description: 'Generación de soluciones disruptivas y arquitectura digital.',
      color: 'from-green-400 to-emerald-800',
      accent: 'text-green-400-glow',
      image: '/images/nexus/nexus_creator_godmode.png',
      abilities: ['Diseño Creativo', 'Innovación', 'Desarrollo']
    }
  ];

  const currentMode = modes.find(m => m.id === activeMode) || modes[0];

  return (
    <section className="relative py-32 bg-nexus-obsidian overflow-hidden">
      <div className="grain-overlay" />

      {/* Background Ambience */}
      <div className="absolute inset-0">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-nexus-cyan/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-nexus-violet/20 to-transparent" />
        <div className="absolute inset-0 bg-radial-at-center from-nexus-cyan/5 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-0.5 bg-nexus-cyan-glow" />
            <span className="text-nexus-cyan text-xs font-orbitron tracking-[0.5em] uppercase">Security Unit Nexus-9</span>
            <div className="w-12 h-0.5 bg-nexus-cyan-glow" />
          </div>
          <h2 className="text-5xl md:text-8xl font-orbitron font-black text-white mb-6 tracking-tighter">
            NEXUS <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-nexus-cyan-glow to-nexus-violet-glow">ANDROID</span>
          </h2>
          <p className="text-xl text-nexus-silver/60 max-w-3xl mx-auto font-light leading-relaxed">
            "No es una máquina. Es la manifestación física de tu inteligencia corporativa. <br />
            Lealtad absoluta. Poder ilimitado."
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Android Visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            {/* Display Container */}
            <div className="relative mx-auto w-full max-w-[500px] aspect-[4/5] perspective-1000">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMode}
                  initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 1.1, rotateY: -20 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black group"
                >
                  <img
                    src={currentMode.image}
                    alt={currentMode.name}
                    className="w-full h-full object-cover filter brightness-110 contrast-125 group-hover:scale-105 transition-transform duration-1000"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546776150-a04a5b9c0275?auto=format&fit=crop&q=80&w=1000';
                    }}
                  />

                  {/* HUD Overlays */}
                  <div className="absolute inset-0 pointer-events-none z-20">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    <div className="absolute inset-0 border-[20px] border-black/20" />

                    {/* Scanning Line */}
                    <motion.div
                      className={`absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_15px_rgba(255,255,255,0.5)] opacity-20`}
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* Corner HUD Data */}
                    <div className="absolute top-8 left-8 flex flex-col gap-1 text-left">
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest text-left">Target Locked</span>
                      <div className="w-16 h-1 bg-white/10 overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${currentMode.color}`}
                          animate={{ width: ['20%', '90%', '40%'] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                    </div>

                    <div className="absolute bottom-10 left-10 text-left">
                       <h4 className={`text-4xl font-orbitron font-black text-white mb-2 drop-shadow-lg uppercase`}>
                        {currentMode.name.split(' ')[1]}
                      </h4>
                      <p className={`text-xs font-mono font-bold tracking-[0.3em] uppercase ${currentMode.accent}`}>
                        MODE: {currentMode.id} ACTIVE
                      </p>
                    </div>
                  </div>

                  {/* Technical Lens Flare */}
                  <div className="absolute -top-20 -left-20 w-80 h-80 bg-nexus-cyan/10 blur-[100px] rounded-full" />
                </motion.div>
              </AnimatePresence>


              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 bg-nexus-cyan rounded-full opacity-60"
                animate={{
                  y: [0, -20, 0],
                  x: [0, 10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-6 h-6 bg-nexus-violet rounded-full opacity-60"
                animate={{
                  y: [0, 15, 0],
                  x: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Mode Selector */}
            <div className="space-y-6">
              <h3 className="text-2xl font-orbitron font-bold text-white">Modos de Operación</h3>

              <div className="space-y-4">
                {modes.map((mode, index) => (
                  <motion.div
                    key={mode.id}
                    className={`premium-glass p-6 rounded-2xl border-2 cursor-pointer transition-all ${activeMode === mode.id
                      ? 'border-nexus-cyan/60 shadow-lg shadow-nexus-cyan/30'
                      : 'border-white/20 hover:border-white/40'
                      }`}
                    onClick={() => {
                      playClick();
                      setActiveMode(mode.id);
                    }}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    onMouseEnter={playHover}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`text-xl font-orbitron font-bold bg-gradient-to-r ${mode.color} bg-clip-text text-transparent`}>
                          {mode.name}
                        </h4>
                        <p className="text-gray-400 mt-1">{mode.description}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${mode.color} ${activeMode === mode.id ? 'animate-pulse' : ''
                        }`} />
                    </div>

                    {/* Abilities */}
                    {activeMode === mode.id && (
                      <motion.div
                        className="mt-4 grid grid-cols-3 gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {mode.abilities.map((ability) => (
                          <div
                            key={ability}
                            className="text-center p-2 bg-black/30 rounded-lg border border-nexus-cyan/20"
                          >
                            <span className="text-xs text-nexus-cyan font-semibold">{ability}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: 'NIVEL 11', label: 'Poder Cuántico', color: 'text-nexus-cyan' },
                { value: '∞', label: 'Potencial', color: 'text-nexus-violet' },
                { value: '100%', label: 'Lealtad', color: 'text-green-400' },
                { value: '24/7', label: 'Vigilancia', color: 'text-orange-400' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="premium-glass p-4 rounded-xl border border-white/10"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className={`text-2xl font-orbitron font-black ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Call to Action */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <button className="btn-enterprise px-8 py-4 text-lg font-bold">
                ACTIVAR NEXUS ANDROID
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
