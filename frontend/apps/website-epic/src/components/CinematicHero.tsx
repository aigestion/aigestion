import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { useSound } from '../hooks/useSound';
import { NeuralServer } from './3d/NeuralServer';
import { FluidBackground } from './FluidBackground';
import { MiniDashboard } from './MiniDashboard';

interface CinematicHeroProps {
  onHeroComplete?: () => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showDemo, setShowDemo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { playHover, playClick } = useSound();

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

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black" data-build="website-epic-v2">
      {/* Background Layer with Multi-layered effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={scenes[currentScene].id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="relative w-full h-full"
          >
            {/* Base Layer: wide hero or video */}
            <img
              src="/images/cinematic/hero_wide.png"
              className="absolute inset-0 w-full h-full object-cover opacity-40 scale-110 blur-[2px]"
              alt="Background Depth"
            />

            <motion.video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-40"
              onLoadedData={handleVideoLoaded}
            >
              <source src={scenes[currentScene].video} type="video/mp4" />
            </motion.video>

            {/* 3D Neural Core - Interactive Layer */}
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
              <div className="w-full h-full md:w-1/2 md:h-1/2 opacity-80 mix-blend-screen pointer-events-auto">
                <NeuralServer />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Fluid Interaction Layer */}
        <FluidBackground />

        {/* Scanline Effect Overlay */}
        <div className="scanline" />

        {/* Global Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,245,255,0.05),transparent_80%)]" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 h-full flex flex-col justify-between p-8">
        {/* Top Controls */}
        <div className="flex justify-between items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-nexus-cyan/40 blur-xl animate-pulse" />
              <div className="relative w-16 h-16 bg-black/60 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center overflow-hidden">
                <img src="/images/brand/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
              </div>
            </div>
            <div>
              <h1 className="text-white font-orbitron text-3xl font-black tracking-tighter">
                AIGESTION<span className="text-nexus-cyan font-light">.NET</span>
              </h1>
              <div className="flex items-center gap-2">
                <div className="h-[2px] w-8 bg-nexus-violet" />
                <p className="text-nexus-cyan text-[10px] font-mono tracking-[0.4em] uppercase">
                  Cinematic Experience
                </p>
              </div>
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
              className="premium-glass px-6 py-3 rounded-full text-white text-xs font-orbitron font-bold tracking-widest uppercase hover:text-nexus-cyan transition-colors"
            >
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
            <button
              onClick={() => setShowDemo(true)}
              className="btn-enterprise px-8 py-3 rounded-full"
            >
              Enter the Nexus
            </button>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={scenes[currentScene].id}
              className="text-center max-w-7xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div className="relative inline-block mb-4">
                <div className="absolute -inset-4 bg-nexus-violet/20 blur-3xl rounded-full" />
                <motion.h2
                  className="relative text-7xl md:text-9xl font-orbitron font-black text-white leading-none glitch-text"
                  style={{
                    textShadow: '0 0 30px rgba(138, 43, 226, 0.4)',
                  }}
                >
                  {scenes[currentScene].title}
                </motion.h2>
              </div>

              <motion.p
                className="text-2xl md:text-4xl text-nexus-cyan mb-8 font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {scenes[currentScene].subtitle}
              </motion.p>

              {/* Scene-specific content */}
              {scenes[currentScene].id === 'daniela-ai' && (
                <motion.div
                  className="mt-8"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-nexus-cyan shadow-2xl shadow-nexus-cyan/50">
                    <img
                      src="/images/daniela/daniela_lab_godmode.png"
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
              className={`relative w-32 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                currentScene === index
                  ? 'border-nexus-cyan shadow-lg shadow-nexus-cyan/50'
                  : 'border-white/20 hover:border-white/40'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={playHover}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-nexus-violet/20 to-nexus-cyan/20" />
              <div className="relative z-10 p-2">
                <p className="text-white text-xs font-bold text-center">
                  {scene.title.split(' ')[0]}
                </p>
                <p className="text-nexus-cyan text-xs text-center mt-1">{index + 1}/6</p>
              </div>
              {currentScene === index && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-nexus-cyan"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: scene.duration / 1000, ease: 'linear' }}
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

      <AnimatePresence>
        {showDemo && <MiniDashboard onClose={() => setShowDemo(false)} />}
      </AnimatePresence>
    </div>
  );
};

