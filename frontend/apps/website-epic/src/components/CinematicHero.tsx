import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { useSound } from '../hooks/useSound';
import { NeuralServer } from './3d/NeuralServer';
import { FluidBackground } from './FluidBackground';
import { MiniDashboard } from './MiniDashboard';
import { useAppContext } from '../contexts/AppContext';
import { useLocation } from 'react-router-dom';
import { NexusCommandBar } from './design-system/NexusCommandBar';
import { NexusStatusBadge } from './design-system/NexusStatusBadge';
import { SpotlightWrapper } from './design-system/SpotlightWrapper';
import { NexusCard } from './design-system/NexusCard';

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
      className="relative w-full h-screen overflow-hidden bg-nexus-obsidian font-orbitron"
      data-build="website-epic-v4"
    >
      <SpotlightWrapper>
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
              {/* Base Layer: grid overlay for depth */}
              <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />

              {/* Diffuse Orbs for atmospheric glow */}
              <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-nexus-cyan/5 rounded-full blur-[120px] animate-glow-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-nexus-violet/5 rounded-full blur-[120px] animate-glow-pulse [animation-delay:1.5s]" />

              {!videoError && (
                <motion.video
                  ref={videoRef}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-10 filter grayscale brightness-125 contrast-125"
                  onLoadedData={handleVideoLoaded}
                  onError={handleVideoError}
                >
                  <source src={activeScenes[currentScene].video} type="video/mp4" />
                </motion.video>
              )}

              {/* 3D Neural Core - Interactive Layer */}
              <div
                className={`absolute inset-0 z-10 flex items-center justify-center pointer-events-none transition-opacity duration-1000 ${videoError ? 'opacity-100' : 'opacity-80'}`}
              >
                <div className="w-full h-full md:w-2/3 md:h-2/3 mix-blend-lighten pointer-events-auto">
                  <NeuralServer />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Interaction Layer */}
          <FluidBackground />

          {/* Scanline Effect Overlay */}
          <div className="scanline opacity-30" />

          {/* Global Overlays */}
          <div className="absolute inset-0 bg-linear-to-b from-nexus-obsidian via-transparent to-nexus-obsidian" />
        </div>

        {/* Content Layer */}
        <div className="relative z-20 h-full flex flex-col justify-between">
          {/* Header Upgraded to NexusCommandBar */}
          <NexusCommandBar
            title="AIGESTION NEXUS"
            subtitle={`Phase 60+ Initialization | Scene: ${activeScenes[currentScene].title}`}
            status={
              <div className="flex items-center gap-6">
                <NexusStatusBadge status="online" label="MISSION TELEMETRY ACTIVE" size="sm" />
                <div className="flex gap-3">
                  <button
                    onClick={handlePlayPause}
                    className="glass-premium px-4 py-1.5 rounded text-white/60 text-[10px] font-bold tracking-widest uppercase hover:text-nexus-cyan hover:border-nexus-cyan/30 transition-all border border-white/10"
                  >
                    {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
                  </button>
                  <button
                    onClick={handleSkip}
                    className="glass-premium px-4 py-1.5 rounded text-nexus-cyan/70 text-[10px] font-bold tracking-widest uppercase hover:text-nexus-cyan hover:bg-nexus-cyan/10 transition-all border border-nexus-cyan/20"
                  >
                    SKIP INTRO
                  </button>
                </div>
              </div>
            }
          />

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center px-8">
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
                  <div className="absolute -inset-8 bg-nexus-cyan/10 blur-[100px] rounded-full opacity-50" />
                  <motion.h2
                    className="relative text-responsive-h1 font-orbitron font-black text-white leading-none tracking-tighter"
                    style={{
                      textShadow: '0 0 40px rgba(0, 240, 255, 0.4)',
                    }}
                  >
                    {activeScenes[currentScene].title}
                  </motion.h2>
                </div>

                <motion.p
                  className="text-responsive-h2 text-nexus-cyan mb-12 font-light italic opacity-90 tracking-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {activeScenes[currentScene].subtitle}
                </motion.p>

                {/* New Unified Call to Action Area */}
                <motion.div
                  className="flex flex-col items-center gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="group relative px-12 py-5 bg-nexus-cyan text-black font-black font-orbitron tracking-[0.3em] uppercase transition-all rounded-sm overflow-hidden hover:shadow-[0_0_50px_rgba(0,245,255,0.5)]"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/40 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative z-10">INGRESAR AL NEXUS</span>
                  </button>

                  <div className="flex items-center gap-4">
                    <div className="h-px w-8 bg-white/20" />
                    <span className="text-[10px] font-mono text-white/40 tracking-[0.4em]">
                      SOVEREIGN ACCESS GRANTED
                    </span>
                    <div className="h-px w-8 bg-white/20" />
                  </div>
                </motion.div>

                {/* Scene-specific content overlays */}
                <div className="mt-16">
                  {activeScenes[currentScene].id === 'daniela-assistant' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-block p-1 glass-premium rounded-full"
                    >
                      <div className="w-40 h-40 rounded-full overflow-hidden border border-nexus-violet-glow/30 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                        <img
                          src="/images/daniela/daniela_lab_godmode.png"
                          alt="Daniela AI"
                          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeScenes[currentScene].id === 'nexus-control' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-xs mx-auto opacity-60 grayscale"
                    >
                      <img
                        src="/images/nexus/nexus_guardian_godmode.png"
                        alt="Nexus Control"
                        className="w-full h-auto drop-shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Scene Selector Upgraded */}
          <div className="p-8 backdrop-blur-md border-t border-white/5 flex justify-center items-center gap-4 bg-nexus-obsidian/40">
            {activeScenes.map((scene, index) => (
              <motion.button
                key={scene.id}
                onClick={() => handleSceneClick(index)}
                className={`relative w-48 h-16 glass-premium rounded-lg border transition-all duration-500 overflow-hidden ${
                  currentScene === index
                    ? 'border-nexus-cyan/40 bg-nexus-cyan/5'
                    : 'border-white/5 hover:border-white/20'
                }`}
                whileHover={{ scale: 1.02 }}
                onMouseEnter={playHover}
              >
                <div className="relative z-10 px-4 h-full flex flex-col justify-center gap-1">
                  <p
                    className={`text-[8px] font-black tracking-[0.2em] transition-colors ${currentScene === index ? 'text-nexus-cyan' : 'text-white/40'}`}
                  >
                    {scene.title}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-white/20">0{index + 1} / 05</span>
                    {currentScene === index && (
                      <div className="w-1 h-1 bg-nexus-cyan rounded-full animate-ping" />
                    )}
                  </div>
                </div>
                {currentScene === index && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-nexus-cyan"
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
      </SpotlightWrapper>

      {/* Loading Overlay Upgraded */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 z-50 bg-nexus-obsidian flex items-center justify-center p-12"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center max-w-md w-full">
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 border-2 border-nexus-cyan/20 rounded-full" />
                <div className="absolute inset-0 border-2 border-nexus-cyan border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-4 border border-nexus-violet/30 rounded-full animate-pulse" />
              </div>
              <h3 className="text-white font-orbitron font-black text-xl tracking-[0.3em] mb-4">
                INITIALIZING BRIDGE
              </h3>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-nexus-cyan shadow-[0_0_15px_rgba(0,245,255,0.5)]"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                />
              </div>
              <p className="text-[10px] font-mono text-white/30 mt-4 tracking-widest">
                SOVEREIGN PROTOCOL V60.4 ACTIVE
              </p>
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
