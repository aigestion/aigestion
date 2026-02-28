import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { useSound } from '../hooks/useSound';

// LAZY LOAD: Heavy 3D Components
const NeuralServer = lazy(() => import('./3d/NeuralServer').then(m => ({ default: m.NeuralServer })));
const FluidBackground = lazy(() => import('./FluidBackground').then(m => ({ default: m.FluidBackground })));

import { MiniDashboard } from './MiniDashboard';
import { useAppContext } from '../contexts/AppContext';
import { useLocation } from 'react-router-dom';

interface Scene {
  id: string;
  title: string;
  subtitle: string;
  video: string;
  duration: number;
}

const defaultScenes: Scene[] = [
  {
    id: 'aigestion-platform',
    title: 'AIGESTION.NET',
    subtitle: 'Tu plataforma de inteligencia artificial para mejorar tu empresa y tu vida',
    video: '/videos/tutorial_onboarding.mp4',
    duration: 7000,
  },
  {
    id: 'daniela-assistant',
    title: 'DANIELA',
    subtitle: 'Asistente personal: no necesitas tener conocimientos',
    video: '/videos/tutorial_features.mp4',
    duration: 7000,
  },
  {
    id: 'nexus-control',
    title: 'NEXUS',
    subtitle: 'En tu teléfono para todo el control en tu mano',
    video: '/videos/tutorial_onboarding.mp4',
    duration: 6000,
  },
  {
    id: 'quantum-protocol',
    title: 'PROTOCOLO QUANTUM',
    subtitle: 'Seguridad grado militar',
    video: '/videos/tutorial_features.mp4',
    duration: 6000,
  },
  {
    id: 'ecosystem-demo',
    title: 'DEMO WEB',
    subtitle: 'Ecosistema AIGestion.net',
    video: '/videos/tutorial_onboarding.mp4',
    duration: 8000,
  },
];

interface CinematicHeroProps {
  onHeroComplete?: () => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({ onHeroComplete }) => {
  const { setIsContactModalOpen } = useAppContext();
  const [currentScene, setCurrentScene] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showDemo, setShowDemo] = useState(false);
  const [personalizedScenes, setPersonalizedScenes] = useState<any[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const location = useLocation();
  const { playHover, playClick, playWuaw } = useSound();

  const activeScenes = personalizedScenes.length > 0 ? personalizedScenes : defaultScenes;

  useEffect(() => {
    const fetchPersonalization = async () => {
      const searchParams = new URLSearchParams(location.search);
      const source = searchParams.get('utm_source');
      if (source) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL || ''}/api/v1/landing/personalization?source=${source}`
          );
          if (response.ok) {
            const data = await response.json();
            if (data.scenes && data.scenes.length > 0) {
              setPersonalizedScenes(data.scenes);
            }
          }
        } catch (error) {
          console.error('Failed to fetch personalization:', error);
        }
      }
    };
    fetchPersonalization();
  }, [location.search]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isPlaying && !isLoading) {
        if (currentScene === activeScenes.length - 1) {
          onHeroComplete?.();
        } else {
          setCurrentScene(prev => (prev + 1) % activeScenes.length);
        }
      }
    }, activeScenes[currentScene]?.duration || 5000);

    return () => clearInterval(timer);
  }, [currentScene, isPlaying, isLoading, activeScenes, onHeroComplete]);

  useEffect(() => {
    setVideoError(false);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        setIsLoading(false);
        setVideoError(true);
      });
    }
  }, [currentScene]);

  const handleVideoLoaded = () => {
    setIsLoading(false);
    setVideoError(false);
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setVideoError(true);
  };

  const handleSceneClick = (sceneIndex: number) => {
    playClick();
    setCurrentScene(sceneIndex);
  };

  const handleSkip = () => {
    playWuaw();
    onHeroComplete?.();
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
    <div
      className="relative w-full h-screen overflow-hidden bg-black font-orbitron"
      data-build="website-epic-v4"
    >
      {/* Background Layer with Multi-layered effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScenes[currentScene].id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="relative w-full h-full"
          >
            {/* Base Layer: smooth mesh or fallback */}
            <div
              className={`absolute inset-0 smooth-mesh-bg scale-110 blur-[2px] transition-opacity duration-1000 ${videoError ? 'opacity-80' : 'opacity-40'}`}
            />

            {!videoError && (
              <motion.video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-20 filter grayscale contrast-125"
                onLoadedData={handleVideoLoaded}
                onError={handleVideoError}
              >
                <source src={activeScenes[currentScene].video} type="video/mp4" />
              </motion.video>
            )}

            {/* 3D Neural Core - Interactive Layer (Fallback & Enhancement) */}
            <div
              className={`absolute inset-0 z-10 flex items-center justify-center pointer-events-none transition-opacity duration-1000 ${videoError ? 'opacity-100' : 'opacity-80'}`}
            >
              <div className="w-full h-full md:w-1/2 md:h-1/2 mix-blend-screen pointer-events-auto">
                <Suspense
                  fallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-nexus-cyan border-t-transparent rounded-full animate-spin opacity-20" />
                    </div>
                  }
                >
                  <NeuralServer />
                </Suspense>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Fluid Interaction Layer */}
        <Suspense fallback={null}>
          <FluidBackground />
        </Suspense>

        {/* Scanline Effect Overlay */}
        <div className="scanline" />

        {/* Global Overlays */}
        <div className="absolute inset-0 bg-linear-to-b from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-radial-at-center from-nexus-cyan/5 via-transparent to-transparent" />
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
              <div className="absolute inset-0 bg-nexus-cyan/40 blur-2xl animate-pulse" />
              <div className="relative w-16 h-16 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden group">
                <div className="absolute inset-0 bg-linear-to-br from-nexus-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-8 h-8 rounded-full border-2 border-nexus-cyan/50 border-t-nexus-cyan animate-spin-slow" />
              </div>
            </div>
            <div>
              <span className="text-white font-orbitron text-4xl font-black tracking-tighter block">
                AIGESTION<span className="text-nexus-cyan font-light">.NET</span>
              </span>
              <div className="flex items-center gap-2">
                <div className="h-[1px] w-12 bg-linear-to-r from-nexus-violet to-transparent" />
                <p className="text-nexus-cyan/60 text-[8px] font-mono tracking-[0.5em] uppercase">
                  SOVEREIGN INTELLIGENCE NEXUS
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="flex gap-4 items-center"
          >
            <button
              onClick={handlePlayPause}
              className="premium-glass px-6 py-3 rounded-full text-white text-xs font-bold tracking-widest uppercase hover:text-nexus-cyan transition-colors tappable"
              aria-label={isPlaying ? 'Pausar intro' : 'Reproducir intro'}
            >
              {isPlaying ? '⏸ PAUSA' : '▶ PLAY'}
            </button>
            <button
              onClick={handleSkip}
              className="premium-glass px-6 py-3 rounded-full text-nexus-cyan text-xs font-bold tracking-widest uppercase hover:bg-nexus-cyan/20 transition-all border border-nexus-cyan/30 tappable"
              aria-label="Saltar introducción"
            >
              SALTAR INTRO
            </button>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="btn-enterprise px-8 py-3 rounded-full text-xs tappable"
              aria-label="Ingresar al sistema Nexus"
            >
              INGRESAR AL NEXUS
            </button>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScenes[currentScene].id}
              className="text-center max-w-7xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div className="relative inline-block mb-4">
                <div className="absolute -inset-4 bg-nexus-violet/20 blur-3xl rounded-full" />
                <motion.h1
                  className="relative text-responsive-h1 font-orbitron font-black text-white leading-none glitch-text tracking-tighter"
                  style={{
                    textShadow: '0 0 40px rgba(0, 240, 255, 0.3)',
                  }}
                >
                  {activeScenes[currentScene].title}
                </motion.h1>
              </div>

              <motion.p
                className="text-responsive-h2 text-nexus-cyan mb-8 font-light italic opacity-80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {activeScenes[currentScene].subtitle}
              </motion.p>

              {/* Scene-specific content */}
              {activeScenes[currentScene].id === 'daniela-assistant' && (
                <motion.div
                  className="mt-8"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="w-48 h-48 md:w-64 md:h-64 mx-auto rounded-full overflow-hidden border-2 border-nexus-violet-glow shadow-2xl shadow-nexus-violet/50 relative group">
                    <div className="absolute inset-0 bg-nexus-violet/20 group-hover:bg-transparent transition-colors duration-500" />
                    <img
                      src="/images/daniela/daniela_lab_godmode.png"
                      alt="Daniela AI"
                      className="w-full h-full object-cover filter brightness-110 contrast-110"
                    />
                  </div>
                  <p className="text-nexus-violet-glow mt-6 text-sm font-orbitron tracking-widest uppercase animate-pulse">
                    Tu aliada perfecta para el éxito
                  </p>
                </motion.div>
              )}

              {activeScenes[currentScene].id === 'nexus-control' && (
                <motion.div
                  className="mt-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="max-w-xs mx-auto">
                    <img
                      src="/images/nexus/nexus_guardian_godmode.png"
                      alt="Nexus Control"
                      className="w-full h-auto drop-shadow-[0_0_30px_rgba(0,240,255,0.3)]"
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Scene Selector */}
        <div className="flex justify-center items-center gap-4">
          {activeScenes.map((scene, index) => (
            <motion.button
              key={scene.id}
              onClick={() => handleSceneClick(index)}
              className={`relative w-40 h-24 rounded-xl overflow-hidden border transition-all duration-500 ${
                currentScene === index
                  ? 'border-nexus-cyan/60 bg-nexus-cyan/5 shadow-[0_0_40px_rgba(0,245,255,0.2)]'
                  : 'border-white/5 bg-white/2 hover:border-white/20 hover:bg-white/5'
              }`}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={playHover}
            >
              <div className="absolute inset-0 bg-linear-to-br from-nexus-violet/10 to-nexus-cyan/10 opacity-40" />
              <div className="relative z-10 p-3 h-full flex flex-col justify-between">
                <p
                  className={`text-[9px] font-bold tracking-widest uppercase transition-colors ${
                    currentScene === index ? 'text-white' : 'text-white/40'
                  }`}
                >
                  {scene.title}
                </p>
                <div className="flex justify-between items-end">
                  <p className="text-nexus-cyan text-[8px] font-mono">0{index + 1}</p>
                  <div
                    className={`w-1 h-1 rounded-full ${currentScene === index ? 'bg-nexus-cyan animate-pulse' : 'bg-white/10'}`}
                  />
                </div>
              </div>
              {currentScene === index && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-nexus-cyan shadow-[0_0_10px_rgba(0,245,255,1)]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: activeScenes[index].duration / 1000, ease: 'linear' }}
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
