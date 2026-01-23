import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { useSound } from '../hooks/useSound';

interface CinematicHeroProps {
  onHeroComplete?: () => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({ onHeroComplete }) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { playHover, playClick, playWuaw } = useSound();

  const scenes = [
    {
      id: 'space-intro',
      title: 'EL FUTURO HA COMENZADO',
      subtitle: 'Transformación Neural Empresarial',
      video: '/videos/cinematic/space-intro.mp4',
      duration: 4000,
    },
    {
      id: 'city-future',
      title: 'CIUDADES INTELIGENTES',
      subtitle: 'Ecosistemas Conectados por IA',
      video: '/videos/cinematic/future-city.mp4',
      duration: 5000,
    },
    {
      id: 'corporate-transform',
      title: 'FORTUNE 500 TRANSFORMADA',
      subtitle: 'Tesla, Microsoft, Google, Amazon',
      video: '/videos/cinematic/corporate-transform.mp4',
      duration: 6000,
    },
    {
      id: 'daniela-ai',
      title: 'DANIELA AI',
      subtitle: 'Conciencia Artificial 8K Ultra-Realista',
      video: '/videos/cinematic/daniela-ai.mp4',
      duration: 5000,
    },
    {
      id: 'nexus-android',
      title: 'NEXUS ANDROID WARRIOR',
      subtitle: 'Guardián Cuántico de la Innovación',
      video: '/videos/cinematic/nexus-android.mp4',
      duration: 4000,
    },
    {
      id: 'solutions-showcase',
      title: 'AIGESTION.NET',
      subtitle: 'Arquitectura de Inteligencia Soberana',
      video: '/videos/cinematic/solutions-showcase.mp4',
      duration: 6000,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (isPlaying && !isLoading) {
        setCurrentScene((prev) => (prev + 1) % scenes.length);
      }
    }, scenes[currentScene].duration);

    return () => clearInterval(timer);
  }, [currentScene, isPlaying, isLoading, scenes]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => setIsLoading(false));
    }
  }, [currentScene]);

  const handleVideoLoaded = () => {
    setIsLoading(false);
  };

  const handleSceneClick = (sceneIndex: number) => {
    playClick();
    setCurrentScene(sceneIndex);
  };

  const handlePlayPause = () => {
    playClick();
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleSkipToEnd = () => {
    playWuaw();
    onHeroComplete?.();
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.video
            key={scenes[currentScene].id}
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            onLoadedData={handleVideoLoaded}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <source src={scenes[currentScene].video} type="video/mp4" />
          </motion.video>
        </AnimatePresence>

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

        {/* Animated Particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-nexus-cyan rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [0, -100, -200],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 h-full flex flex-col justify-between p-8">
        {/* Top Controls */}
        <div className="flex justify-between items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-nexus-violet to-nexus-cyan rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">AI</span>
            </div>
            <div>
              <h1 className="text-white font-orbitron text-2xl font-bold">AIGESTION.NET</h1>
              <p className="text-nexus-cyan text-sm">Cinematic Experience</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="flex gap-4"
          >
            <button
              onClick={handlePlayPause}
              className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all"
            >
              {isPlaying ? '⏸️ Pausar' : '▶️ Reproducir'}
            </button>
            <button
              onClick={handleSkipToEnd}
              className="px-6 py-3 bg-nexus-violet/20 backdrop-blur-md border border-nexus-violet/30 rounded-full text-nexus-cyan hover:bg-nexus-violet/30 transition-all"
            >
              ⏭️ Saltar al Sitio
            </button>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={scenes[currentScene].id}
              className="text-center max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <motion.h2
                className="text-6xl md:text-8xl font-orbitron font-black text-white mb-6"
                style={{
                  textShadow: '0 0 40px rgba(138, 43, 226, 0.8), 0 0 80px rgba(0, 245, 255, 0.6)',
                }}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              >
                {scenes[currentScene].title}
              </motion.h2>

              <motion.p
                className="text-2xl md:text-4xl text-nexus-cyan mb-8 font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {scenes[currentScene].subtitle}
              </motion.p>

              {/* Scene-specific content */}
              {scenes[currentScene].id === 'corporate-transform' && (
                <motion.div
                  className="flex justify-center gap-8 mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  {['Tesla', 'Microsoft', 'Google', 'Amazon'].map((company) => (
                    <motion.div
                      key={company}
                      className="premium-glass px-6 py-3 rounded-full"
                      whileHover={{ scale: 1.05 }}
                      onMouseEnter={playHover}
                    >
                      <span className="text-white font-bold">{company}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {scenes[currentScene].id === 'daniela-ai' && (
                <motion.div
                  className="mt-8"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-nexus-cyan shadow-2xl shadow-nexus-cyan/50">
                    <img
                      src="/images/daniela-ai-8k.jpg"
                      alt="Daniela AI"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-white mt-4 text-lg">Conciencia Artificial Ultra-Realista 8K</p>
                </motion.div>
              )}

              {scenes[currentScene].id === 'nexus-android' && (
                <motion.div
                  className="mt-8"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="text-6xl mb-4">🤖</div>
                  <p className="text-nexus-violet text-xl">Guardián Cuántico de la Innovación</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Scene Selector */}
        <div className="flex justify-center items-center gap-4">
          {scenes.map((scene, index) => (
            <motion.button
              key={scene.id}
              onClick={() => handleSceneClick(index)}
              className={`relative w-32 h-20 rounded-lg overflow-hidden border-2 transition-all ${currentScene === index
                  ? 'border-nexus-cyan shadow-lg shadow-nexus-cyan/50'
                  : 'border-white/20 hover:border-white/40'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={playHover}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-nexus-violet/20 to-nexus-cyan/20" />
              <div className="relative z-10 p-2">
                <p className="text-white text-xs font-bold text-center">{scene.title.split(' ')[0]}</p>
                <p className="text-nexus-cyan text-xs text-center mt-1">{index + 1}/6</p>
              </div>
              {currentScene === index && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-nexus-cyan"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: scene.duration / 1000, ease: "linear" }}
                  style={{ originX: 0 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 z-20 bg-black flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-nexus-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white text-lg">Cargando Experiencia Cinematográfica...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
