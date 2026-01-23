import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useSound } from '../hooks/useSound';

export const InteractiveFeatures: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { playHover, playClick } = useSound();

  const features = [
    {
      id: 'ai-automation',
      title: 'AUTOMATIZACIÓN INTELIGENTE',
      subtitle: 'Procesos autónomos con IA avanzada',
      description: 'Sistemas que aprenden, se adaptan y evolucionan solos. Desde la toma de decisiones hasta la ejecución automática de tareas complejas.',
      icon: '🤖',
      color: 'from-nexus-violet to-purple-600',
      stats: [
        { label: 'Eficiencia', value: '+347%' },
        { label: 'Reducción Costos', value: '-68%' },
        { label: 'Velocidad', value: '10x' }
      ],
      demo: {
        title: 'Demo en Vivo',
        description: 'Observa cómo nuestra IA procesa 1M de datos en segundos'
      }
    },
    {
      id: 'quantum-computing',
      title: 'COMPUTACIÓN CUÁNTICA',
      subtitle: 'Procesamiento a velocidad lumínica',
      description: 'Algoritmos cuánticos que resuelven problemas imposibles para la computación tradicional. Optimización perfecta en tiempo real.',
      icon: '⚛️',
      color: 'from-nexus-cyan to-blue-600',
      stats: [
        { label: 'Velocidad', value: '1000x' },
        { label: 'Precisión', value: '99.97%' },
        { label: 'Escalabilidad', value: '∞' }
      ],
      demo: {
        title: 'Simulación Cuántica',
        description: 'Experimenta el poder de la superposición cuántica'
      }
    },
    {
      id: 'neural-interface',
      title: 'INTERFAZ NEURAL',
      subtitle: 'Conexión directo cerebro-máquina',
      description: 'Control de sistemas con el pensamiento. Interfaces que traducen señales neuronales en acciones digitales precisas.',
      icon: '🧠',
      color: 'from-green-400 to-emerald-600',
      stats: [
        { label: 'Latencia', value: '0.1ms' },
        { label: 'Precisión', value: '99.9%' },
        { label: 'Compatibilidad', value: '100%' }
      ],
      demo: {
        title: 'Control Neural',
        description: 'Maneja sistemas con tu mente'
      }
    },
    {
      id: 'metaverse-integration',
      title: 'METAVERSO EMPRESARIAL',
      subtitle: 'Oficinas virtuales inmersivas',
      description: 'Espacios de trabajo 3D donde la distancia física desaparece. Colaboración global como si estuvieras en la misma sala.',
      icon: '🌐',
      color: 'from-orange-400 to-red-600',
      stats: [
        { label: 'Productividad', value: '+89%' },
        { label: 'Colaboración', value: '+156%' },
        { label: 'Innovación', value: '+234%' }
      ],
      demo: {
        title: 'Tour Virtual',
        description: 'Explora nuestras oficinas virtuales'
      }
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating) {
        setActiveFeature((prev) => (prev + 1) % features.length);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [isAnimating, features.length]);

  const handleFeatureClick = (index: number) => {
    playClick();
    setIsAnimating(true);
    setActiveFeature(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const currentFeature = features[activeFeature];

  return (
    <section id="features" className="relative py-32 bg-gradient-to-b from-black via-gray-900/20 to-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(138,43,226,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(0,245,255,0.1),transparent_60%)]" />

        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute border border-nexus-cyan/20"
              style={{
                left: `${(i % 5) * 25}%`,
                top: `${Math.floor(i / 5) * 25}%`,
                width: '25%',
                height: '25%',
              }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scale: [0.95, 1.05, 0.95],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-7xl font-orbitron font-black text-white mb-6">
            CARACTERÍSTICAS
            <span className="block text-nexus-cyan text-glow">REVOLUCIONARIAS</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Tecnología que redefine lo posible. Soluciones que transforman el futuro.
          </p>
        </motion.div>

        {/* Feature Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {features.map((feature, index) => (
            <motion.button
              key={feature.id}
              onClick={() => handleFeatureClick(index)}
              className={`relative px-6 py-3 rounded-full border-2 transition-all duration-300 ${activeFeature === index
                  ? 'border-nexus-cyan bg-nexus-cyan/20 text-white'
                  : 'border-white/20 text-gray-400 hover:border-white/40 hover:text-white'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={playHover}
            >
              <span className="flex items-center gap-2 font-orbitron text-sm font-medium">
                <span className="text-lg">{feature.icon}</span>
                {feature.title.split(' ')[0]}
              </span>

              {activeFeature === index && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-nexus-violet/20 to-nexus-cyan/20"
                  layoutId="activeFeature"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Main Feature Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFeature.id}
            className="grid lg:grid-cols-2 gap-16 items-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
          >
            {/* Feature Content */}
            <div className="space-y-8">
              <div>
                <motion.h3
                  className={`text-4xl md:text-6xl font-orbitron font-black mb-4 bg-gradient-to-r ${currentFeature.color} bg-clip-text text-transparent`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {currentFeature.title}
                </motion.h3>
                <motion.p
                  className="text-xl text-nexus-cyan mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {currentFeature.subtitle}
                </motion.p>
                <motion.p
                  className="text-gray-300 text-lg leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {currentFeature.description}
                </motion.p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                {currentFeature.stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className={`text-3xl font-orbitron font-black bg-gradient-to-r ${currentFeature.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Demo Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <button className="btn-enterprise px-8 py-4 text-lg font-bold">
                  {currentFeature.demo.title}
                </button>
                <p className="text-gray-400 text-sm mt-2">{currentFeature.demo.description}</p>
              </motion.div>
            </div>

            {/* Feature Visual */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Animated Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${currentFeature.color} rounded-3xl blur-3xl opacity-30 animate-pulse`} />

              {/* Feature Card */}
              <div className="relative premium-glass p-8 rounded-3xl border-2 border-white/20">
                <div className="text-center">
                  <motion.div
                    className="text-8xl mb-6"
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {currentFeature.icon}
                  </motion.div>

                  {/* Interactive Elements */}
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="h-20 bg-black/30 rounded-xl border border-nexus-cyan/20 flex items-center justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        whileHover={{ scale: 1.05, borderColor: 'rgba(0, 245, 255, 0.5)' }}
                      >
                        <motion.div
                          className="w-12 h-12 bg-gradient-to-br from-nexus-violet to-nexus-cyan rounded-lg"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.5,
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-4 h-4 bg-gradient-to-r ${currentFeature.color} rounded-full opacity-60`}
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${10 + (i % 2) * 80}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    x: [0, 20, 0],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Feature Navigation Dots */}
        <div className="flex justify-center gap-3 mt-16">
          {features.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => handleFeatureClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${activeFeature === index
                  ? 'bg-nexus-cyan scale-1.5'
                  : 'bg-white/30 hover:bg-white/50'
                }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
