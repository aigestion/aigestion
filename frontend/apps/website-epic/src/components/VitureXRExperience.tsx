import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { useSound } from '../hooks/useSound';

export const VitureXRExperience: React.FC = () => {
  const [isXRActive, setIsXRActive] = useState(false);
  const [currentExperience, setCurrentExperience] = useState(0);
  const [immersionLevel, setImmersionLevel] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { playHover, playClick, playWuaw } = useSound();

  const experiences = [
    {
      id: 'quantum-leap',
      title: 'SALTO CUÁNTICO',
      subtitle: 'Antes: 2D → Después: 11D',
      description: 'Experimenta la computación cuántica en 11 dimensiones. Ve los datos fluyendo como ríos de luz.',
      beforeIcon: '📱',
      afterIcon: '🌌',
      color: 'from-purple-600 to-violet-800',
      particles: 50
    },
    {
      id: 'neural-interface',
      title: 'INTERFAZ NEURAL',
      subtitle: 'Antes: Teclado → Después: Mente',
      description: 'Conecta directamente con tu cerebro. Controla sistemas con el poder de tus pensamientos.',
      beforeIcon: '⌨️',
      afterIcon: '🧠',
      color: 'from-cyan-600 to-blue-800',
      particles: 75
    },
    {
      id: 'metaverse-office',
      title: 'OFICINA METAVERSO',
      subtitle: 'Antes: Cubículo → Después: Infinito',
      description: 'Tu oficina ahora es el universo entero. Reuniones en galaxias lejanas.',
      beforeIcon: '🏢',
      afterIcon: '🪐',
      color: 'from-green-600 to-emerald-800',
      particles: 100
    },
    {
      id: 'time-manipulation',
      title: 'MANIPULACIÓN TEMPORAL',
      subtitle: 'Antes: Lineal → Después: Cuántico',
      description: 'Dobla el tiempo, ve el futuro, cambia el pasado. El tiempo es ahora tu herramienta.',
      beforeIcon: '⏰',
      afterIcon: '⚡',
      color: 'from-orange-600 to-red-800',
      particles: 150
    }
  ];

  useEffect(() => {
    // Check WebGL support
    const hasWebGL = (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch {
        return false;
      }
    })();

    console.log('WebGL Support:', hasWebGL);
  }, []);

  useEffect(() => {
    if (isXRActive) {
      const interval = setInterval(() => {
        setImmersionLevel(prev => {
          if (prev < 100) return prev + 2;
          return 100;
        });
      }, 50);

      return () => clearInterval(interval);
    } else {
      setImmersionLevel(0);
    }
  }, [isXRActive]);

  const handleXREnter = () => {
    playWuaw();
    setIsXRActive(true);
    startEnhancedExperience();
  };

  const startEnhancedExperience = () => {
    if (containerRef.current?.requestFullscreen) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {
        console.log('Fullscreen not available');
      });
    }

    document.body.style.cursor = 'none';
    document.body.classList.add('xr-active');
  };

  const handleXRExit = () => {
    playClick();
    setIsXRActive(false);
    setImmersionLevel(0);
    setIsFullscreen(false);
    document.body.style.cursor = 'auto';
    document.body.classList.remove('xr-active');

    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const currentExp = experiences[currentExperience];

  return (
    <section id="viture-xr" className="relative min-h-screen overflow-hidden bg-black">
      {/* XR Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20" />

        {/* Dynamic Grid */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-px bg-cyan-400/20"
              style={{
                left: `${(i % 5) * 25}%`,
                top: `${Math.floor(i / 5) * 25}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, isXRActive ? 3 : 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* XR Particles */}
        <div className="absolute inset-0">
          {[...Array(currentExp.particles)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 bg-gradient-to-r ${currentExp.color} rounded-full`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, isXRActive ? -200 : -100, -400],
                x: [0, Math.random() * 200 - 100, Math.random() * 200 - 100],
                opacity: [0, 1, 0],
                scale: [0, isXRActive ? 2 : 1, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      <div ref={containerRef} className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-400/30 rounded-full mb-8"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 font-orbitron text-sm font-medium">
              🥽 ENHANCED XR MODE
            </span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-orbitron font-black text-white mb-6">
            EXPERIENCIA
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              VITURE XR
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Ponte las gafas Viture XR y experimenta la verdadera transformación digital
          </p>

          {/* Status */}
          <div className="flex justify-center gap-4 mb-12">
            <div className="px-4 py-2 rounded-full border border-cyan-400/30 text-cyan-400">
              Inmersión: {immersionLevel}%
            </div>
            <div className="px-4 py-2 rounded-full border border-purple-400/30 text-purple-400">
              Partículas: {currentExp.particles}
            </div>
            {isFullscreen && (
              <div className="px-4 py-2 rounded-full border border-green-400/30 text-green-400">
                🖥️ FULLSCREEN
              </div>
            )}
          </div>

          {/* Enter XR Button */}
          <AnimatePresence mode="wait">
            {!isXRActive ? (
              <motion.button
                key="enter"
                onClick={handleXREnter}
                className="group relative px-12 py-6 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full text-white font-bold text-xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={playHover}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-800 to-cyan-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center gap-3">
                  🥽 ENTRAR EN XR
                  <motion.div
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </span>
              </motion.button>
            ) : (
              <motion.button
                key="exit"
                onClick={handleXRExit}
                className="px-8 py-4 bg-red-600/80 border border-red-400 rounded-full text-white font-bold"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                🚪 SALIR DE XR
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* XR Experience */}
        <AnimatePresence mode="wait">
          {isXRActive && (
            <motion.div
              key="xr-experience"
              className="flex-1 flex items-center justify-center px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="max-w-6xl w-full">
                {/* Experience Selector */}
                <div className="flex justify-center gap-4 mb-12">
                  {experiences.map((exp, index) => (
                    <motion.button
                      key={exp.id}
                      onClick={() => {
                        playClick();
                        setCurrentExperience(index);
                      }}
                      className={`px-6 py-3 rounded-full border-2 transition-all ${currentExperience === index
                          ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400'
                          : 'border-white/30 text-white/70 hover:border-white/50'
                        }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onMouseEnter={playHover}
                    >
                      {exp.title.split(' ')[0]}
                    </motion.button>
                  ))}
                </div>

                {/* Main Experience */}
                <motion.div
                  key={currentExp.id}
                  className="grid lg:grid-cols-2 gap-12 items-center"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Before/After Comparison */}
                  <div className="relative">
                    <div className="premium-glass p-8 rounded-3xl border-2 border-white/20">
                      <h3 className="text-2xl font-orbitron font-bold text-white mb-6">
                        ANTES Y DESPUÉS
                      </h3>

                      <div className="relative h-64 rounded-xl overflow-hidden mb-6">
                        {/* Before State */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                          <motion.div
                            className="text-center"
                            animate={{
                              scale: [1, 0.8, 1],
                              opacity: [1, 0.3, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <div className="text-6xl mb-4">{currentExp.beforeIcon}</div>
                            <p className="text-gray-400">Tecnología Actual</p>
                          </motion.div>
                        </div>

                        {/* After State */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${currentExp.color} flex items-center justify-center`}
                          initial={{ clipPath: 'inset(100% 0 0 0)' }}
                          animate={{ clipPath: 'inset(0 0 0 0)' }}
                          transition={{ duration: 2, ease: "easeInOut" }}
                        >
                          <motion.div
                            className="text-center"
                            animate={{
                              scale: [0.8, 1.2, 1],
                              rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <div className="text-6xl mb-4">{currentExp.afterIcon}</div>
                            <p className="text-white font-bold">Tecnología Futura</p>
                          </motion.div>
                        </motion.div>

                        {/* Comparison Slider */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                          <motion.div
                            className="w-32 h-1 bg-white/30 rounded-full"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                          />
                        </div>
                      </div>

                      <div className="text-center">
                        <h4 className={`text-xl font-bold bg-gradient-to-r ${currentExp.color} bg-clip-text text-transparent mb-2`}>
                          {currentExp.title}
                        </h4>
                        <p className="text-gray-400 text-sm">{currentExp.subtitle}</p>
                      </div>
                    </div>
                  </div>

                  {/* Experience Details */}
                  <div className="space-y-8">
                    <div>
                      <h3 className={`text-4xl font-orbitron font-black bg-gradient-to-r ${currentExp.color} bg-clip-text text-transparent mb-4`}>
                        {currentExp.title}
                      </h3>
                      <p className="text-xl text-cyan-400 mb-4">{currentExp.subtitle}</p>
                      <p className="text-gray-300 text-lg leading-relaxed">
                        {currentExp.description}
                      </p>
                    </div>

                    {/* Immersion Level */}
                    <div className="premium-glass p-6 rounded-2xl border border-cyan-400/30">
                      <h4 className="text-lg font-orbitron font-bold text-cyan-400 mb-4">
                        Nivel de Inmersión
                      </h4>
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span>Profundidad XR</span>
                          <span>{immersionLevel}%</span>
                        </div>
                        <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${currentExp.color}`}
                            style={{ width: `${immersionLevel}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${immersionLevel}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <div className="text-xs text-gray-400">
                          ⚡ INMERSIÓN TOTAL ACTIVA
                        </div>
                      </div>
                    </div>

                    {/* XR Effects */}
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        className="premium-glass p-4 rounded-xl border border-purple-400/30 text-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <motion.div
                          className="text-3xl mb-2"
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 4, repeat: Infinity }}
                        >
                          🌌
                        </motion.div>
                        <div className="text-sm text-purple-400">Realidad Aumentada</div>
                      </motion.div>
                      <motion.div
                        className="premium-glass p-4 rounded-xl border border-cyan-400/30 text-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <motion.div
                          className="text-3xl mb-2"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          ⚡
                        </motion.div>
                        <div className="text-sm text-cyan-400">Efectos Cuánticos</div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        {!isXRActive && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="premium-glass inline-block px-8 py-6 rounded-2xl border border-white/20">
              <h3 className="text-xl font-orbitron font-bold text-white mb-4">
                CÓMO EXPERIMENTAR XR
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                    <span className="text-gray-300">Ponte tus gafas Viture XR</span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                    <span className="text-gray-300">Haz clic en "ENTRAR EN XR"</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                    <span className="text-gray-300">Mueve tu cabeza para explorar</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
                    <span className="text-gray-300">Experimenta el futuro</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* XR Overlay Effects */}
      <AnimatePresence>
        {isXRActive && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />

            {/* Scan Lines */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-full h-px bg-cyan-400/10"
                  style={{ top: `${i * 5}%` }}
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>

            {/* Corner Indicators */}
            <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-cyan-400" />

            {/* Center Crosshair */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="absolute w-8 h-px bg-cyan-400/50 -left-4 top-0" />
                <div className="absolute h-8 w-px bg-cyan-400/50 left-0 -top-4" />
                <motion.div
                  className="absolute w-2 h-2 bg-cyan-400 rounded-full -left-1 -top-1"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
