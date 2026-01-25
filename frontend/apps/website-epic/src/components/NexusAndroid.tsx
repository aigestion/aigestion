import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useSound } from '../hooks/useSound';

export const NexusAndroid: React.FC = () => {
  const [activeMode, setActiveMode] = useState('warrior');
  const { playHover, playClick } = useSound();

  const modes = [
    {
      id: 'warrior',
      name: 'GUARDIÁN GUERRERO',
      description: 'Protección cuántica máxima',
      color: 'from-nexus-violet to-purple-600',
      abilities: ['Escudo Energético', 'Campo de Fuerza', 'Defensa Neural']
    },
    {
      id: 'strategist',
      name: 'ESTRATEGA CUÁNTICO',
      description: 'Análisis predictivo avanzado',
      color: 'from-nexus-cyan to-blue-600',
      abilities: ['Predicción Futura', 'Análisis de Datos', 'Optimización']
    },
    {
      id: 'creator',
      name: 'CREADOR INNOVADOR',
      description: 'Generación de soluciones',
      color: 'from-green-400 to-emerald-600',
      abilities: ['Diseño Creativo', 'Innovación', 'Desarrollo']
    }
  ];

  return (
    <section className="relative py-32 bg-gradient-to-b from-black via-gray-900/20 to-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(0,245,255,0.1),transparent_60%)]" />
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                y: [0, -50, 0],
                x: [0, Math.random() * 100 - 50, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-7xl font-orbitron font-black text-white mb-6">
            NEXUS ANDROID
            <span className="block text-nexus-cyan text-glow">GUARDIÁN CUÁNTICO</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Defensor de la innovación. Protector del futuro. Guardián de tu transformación.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Android Visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            {/* Android Container */}
            <div className="relative mx-auto w-80 h-96 lg:w-96 lg:h-[500px]">
              {/* Energy Field */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${modes.find(m => m.id === activeMode)?.color} rounded-3xl blur-[40px] opacity-30`}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, 0],
                  filter: ['blur(40px)', 'blur(60px)', 'blur(40px)']
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {/* Quantum Particles Overlay */}
              <div className="absolute inset-0 z-0">
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${modes.find(m => m.id === activeMode)?.color}`}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -100],
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0]
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                  />
                ))}
              </div>

              {/* Android Figure */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-nexus-cyan/50 shadow-2xl shadow-nexus-cyan/30 bg-gradient-to-b from-gray-900 to-black">
                {/* Android Head */}
                <div className="relative h-1/3 flex items-center justify-center">
                  {/* Energy Core */}
                  <motion.div
                    className={`w-24 h-24 rounded-full bg-gradient-to-br ${modes.find(m => m.id === activeMode)?.color} flex items-center justify-center`}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
                      <span className="text-4xl">🤖</span>
                    </div>
                  </motion.div>

                  {/* Neural Connections */}
                  <div className="absolute inset-0">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-8 bg-nexus-cyan/60"
                        style={{
                          top: '50%',
                          left: '50%',
                          transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                          transformOrigin: 'center',
                        }}
                        animate={{
                          scaleY: [0.5, 1, 0.5],
                          opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Android Body */}
                <div className="h-2/3 relative">
                  {/* Armor Plates */}
                  <div className="absolute inset-4 border-2 border-nexus-cyan/30 rounded-2xl">
                    <div className="grid grid-cols-3 gap-2 p-4">
                      {[...Array(9)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="h-8 bg-gradient-to-br from-nexus-violet/20 to-nexus-cyan/20 rounded border border-nexus-cyan/20"
                          animate={{
                            opacity: [0.3, 0.8, 0.3],
                            scale: [0.9, 1.1, 0.9],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.3,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Power Core */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full"
                      animate={{
                        scale: [1, 1.3, 1],
                        boxShadow: ['0 0 20px rgba(255, 0, 0, 0.5)', '0 0 40px rgba(255, 0, 0, 0.8)', '0 0 20px rgba(255, 0, 0, 0.5)'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                </div>
              </div>

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
