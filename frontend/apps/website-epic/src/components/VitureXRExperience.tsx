import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import {
  Battery,
  Cpu,
  Fingerprint,
  Layout,
  Maximize2,
  Monitor,
  Radio,
  ScanLine,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSound } from '../hooks/useSound';
import { ARProjectionLab } from './ARProjectionLab';

// --- Sub-components for Epic Effects ---

const HUDCornerIndicator: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  label: string;
  value: string;
  icon: React.ReactNode;
}> = ({ position, label, value, icon }) => {
  const classes = {
    'top-left': 'top-8 left-8 border-t-2 border-l-2',
    'top-right': 'top-8 right-8 border-t-2 border-r-2 text-right',
    'bottom-left': 'bottom-8 left-8 border-b-2 border-l-2',
    'bottom-right': 'bottom-8 right-8 border-b-2 border-r-2 text-right',
  };

  return (
    <div
      className={`fixed p-4 border-cyan-400/40 z-50 pointer-events-none transition-all duration-500 scale-90 md:scale-100 ${classes[position]}`}
    >
      <div className="flex items-center gap-3 mb-1 text-cyan-400/60 font-orbitron text-[10px] tracking-[0.2em] uppercase">
        {position.includes('left') ? icon : null}
        {label}
        {position.includes('right') ? icon : null}
      </div>
      <div className="text-cyan-400 font-mono text-sm font-bold tracking-widest bg-cyan-400/5 px-2 py-1 rounded">
        {value}
      </div>
    </div>
  );
};

const BootSequence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const stages = [
    { text: 'SCANNING RETINA...', icon: <Fingerprint className="w-8 h-8" /> },
    { text: 'CONNECTING NEURAL LINK...', icon: <Cpu className="w-8 h-8" /> },
    { text: 'CALIBRATING VITURE OPTICS...', icon: <ScanLine className="w-8 h-8" /> },
    { text: 'SYNC COMPLETE. WELCOME TO NEXUS.', icon: <ShieldCheck className="w-8 h-8" /> },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStage(prev => {
        if (prev < stages.length - 1) return prev + 1;
        clearInterval(timer);
        setTimeout(onComplete, 1000);
        return prev;
      });
    }, 1200);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative">
        <motion.div
          className="absolute -inset-12 border-2 border-cyan-500/20 rounded-full"
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute -inset-8 border-2 border-purple-500/20 rounded-full"
          animate={{ rotate: -360, scale: [1, 1.05, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          key={stage}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 p-12 glass-morphism rounded-full border border-cyan-500/30 text-cyan-400 flex flex-col items-center gap-6"
        >
          {stages[stage].icon}
          <div className="font-orbitron tracking-[0.3em] text-xs font-bold text-center max-w-[200px]">
            {stages[stage].text}
          </div>
          <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.2, ease: 'linear' }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export const VitureXRExperience: React.FC = () => {
  const [isXRActive, setIsXRActive] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const [activeMode, setActiveMode] = useState<'experiences' | 'ar_projection'>('experiences');
  const [currentExperience, setCurrentExperience] = useState(0);
  const [immersionLevel, setImmersionLevel] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { playHover, playClick, playWuaw, playPulse, play } = useSound();

  // Mouse tracking for spatial depth
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const experiences = [
    {
      id: 'quantum-leap',
      title: 'SALTO CUÁNTICO',
      subtitle: 'Antes: 2D → Después: 11D',
      description:
        'Experimenta la computación cuántica en 11 dimensiones. Ve los datos fluyendo como ríos de luz interactivos.',
      beforeIcon: '📱',
      afterIcon: '🌌',
      color: 'from-purple-600 to-violet-800',
      particles: 100,
      badge: 'EXPERIMENTAL',
    },
    {
      id: 'neural-interface',
      title: 'INTERFAZ NEURAL',
      subtitle: 'Antes: Teclado → Después: Mente',
      description:
        'Conecta directamente con tu cerebro. Controla sistemas con el poder de tus pensamientos y biometría activa.',
      beforeIcon: '⌨️',
      afterIcon: '🧠',
      color: 'from-cyan-600 to-blue-800',
      particles: 150,
      badge: 'SYNC ACTIVE',
    },
    {
      id: 'metaverse-office',
      title: 'OFICINA METAVERSO',
      subtitle: 'Antes: Cubículo → Después: Infinito',
      description:
        'Tu oficina ahora es el universo entero. Reuniones en galaxias lejanas con colaboración holográfica.',
      beforeIcon: '🏢',
      afterIcon: '🪐',
      color: 'from-green-600 to-emerald-800',
      particles: 200,
      badge: 'WORKSPACE',
    },
    {
      id: 'war-room',
      title: 'WAR ROOM ESTRATÉGICO',
      subtitle: 'Antes: Excel → Después: Campo de Batalla Digital',
      description:
        'Visualiza tu empresa como un organismo vivo. Toma decisiones en tiempo real con mapas tácticos globales.',
      beforeIcon: '📊',
      afterIcon: '🗺️',
      color: 'from-red-600 to-orange-800',
      particles: 250,
      badge: 'TACTICAL',
    },
  ];

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 40;
      const y = (clientY / innerHeight - 0.5) * 40;
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY]
  );

  useEffect(() => {
    if (isXRActive) {
      const interval = setInterval(() => {
        setImmersionLevel(prev => (prev < 100 ? prev + 1 : 100));
      }, 30);
      play('nexus_hum'); // Sound loop
      return () => {
        clearInterval(interval);
      };
    } else {
      setImmersionLevel(0);
    }
  }, [isXRActive, play]);

  const handleXREnter = () => {
    playWuaw();
    setIsBooting(true);
  };

  const finishBoot = () => {
    setIsBooting(false);
    setIsXRActive(true);
    playPulse();

    if (containerRef.current?.requestFullscreen) {
      containerRef.current.requestFullscreen().catch(() => console.log('Fullscreen failed'));
    }
    document.body.style.cursor = 'none';
    document.body.classList.add('xr-active');
  };

  const handleXRExit = () => {
    playClick();
    setIsXRActive(false);
    setImmersionLevel(0);
    document.body.style.cursor = 'auto';
    document.body.classList.remove('xr-active');

    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const currentExp = experiences[currentExperience];

  return (
    <section
      id="viture-xr"
      className="relative min-h-screen overflow-hidden bg-black selection:bg-cyan-500/30"
      onMouseMove={isXRActive ? handleMouseMove : undefined}
    >
      <AnimatePresence>{isBooting && <BootSequence onComplete={finishBoot} />}</AnimatePresence>

      {/* XR Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black to-cyan-900/40" />

        {/* Spatial Particles */}
        <div className="absolute inset-0">
          {[...Array(currentExp.particles)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 bg-gradient-to-r ${currentExp.color} rounded-full blur-[1px]`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                z: [0, 100, 0],
                y: [0, -400],
                opacity: [0, 0.8, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Dynamic Grid Background with parallax */}
        <motion.div
          className="absolute inset-x-[-10%] inset-y-[-10%] z-[-1] opacity-20 pointer-events-none"
          style={{ x: springX, y: springY }}
        >
          <div className="w-full h-full bg-[url('/images/nexus/grid.svg')] bg-repeat opacity-30" />
        </motion.div>
      </div>

      <div ref={containerRef} className="relative z-10 min-h-screen flex flex-col items-center">
        {/* HUD Elements (Only when active) */}
        <AnimatePresence>
          {isXRActive && (
            <>
              <HUDCornerIndicator
                position="top-left"
                label="Signal"
                value="SIGNAL: 98% AC"
                icon={<Radio className="w-3 h-3" />}
              />
              <HUDCornerIndicator
                position="top-right"
                label="Retina"
                value="ID: ALEX-01-GOD"
                icon={<Maximize2 className="w-3 h-3" />}
              />
              <HUDCornerIndicator
                position="bottom-left"
                label="Power"
                value="CELL: 84% CRYO"
                icon={<Battery className="w-3 h-3" />}
              />
              <HUDCornerIndicator
                position="bottom-right"
                label="Core"
                value="TEMP: 32°C KELV"
                icon={<Cpu className="w-3 h-3" />}
              />

              <div className="fixed top-12 left-1/2 -translate-x-1/2 flex gap-4 z-50">
                <button
                  onClick={() => {
                    playClick();
                    setActiveMode('experiences');
                  }}
                  className={`px-6 py-2 rounded-full font-orbitron text-[10px] tracking-[0.2em] transition-all border ${activeMode === 'experiences' ? 'bg-cyan-400 text-black border-cyan-400' : 'bg-black/50 text-cyan-400 border-cyan-400/30'}`}
                >
                  EXPERIENCIAS
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setActiveMode('ar_projection');
                  }}
                  className={`px-6 py-2 rounded-full font-orbitron text-[10px] tracking-[0.2em] transition-all border ${activeMode === 'ar_projection' ? 'bg-purple-600 text-white border-purple-600' : 'bg-black/50 text-purple-400 border-purple-600/30'}`}
                >
                  PROYECCIÓN AR
                </button>
              </div>

              <motion.div
                className="fixed bottom-12 left-1/2 -translate-x-1/2 px-6 py-2 glass-morphism border border-white/20 rounded-full font-orbitron text-[10px] tracking-[0.4em] text-white/40 uppercase z-50 pointer-events-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                {activeMode === 'experiences'
                  ? `PROCESADOR NEURAL ACTIVO // MODO XR NIVEL ${immersionLevel}`
                  : 'LABORATORIO DE PROYECCIÓN ACTIVO // MAPEO ESPACIAL'}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Content Layer */}
        <motion.div
          className={`flex-1 flex flex-col items-center justify-center p-6 w-full max-w-7xl transition-all duration-1000 ${isXRActive ? 'scale-95' : 'scale-100'}`}
          style={{ x: isXRActive ? springX : 0, y: isXRActive ? springY : 0 }}
        >
          {!isXRActive ? (
            <div className="text-center">
              <motion.div
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 shadow-[0_0_20px_rgba(138,43,226,0.2)] border border-purple-400/30 rounded-full mb-8"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_#4ade80]" />
                <span className="text-green-400 font-orbitron text-[10px] font-bold tracking-[0.2em] uppercase">
                  Viture Pro XR Ready
                </span>
              </motion.div>

              <h1 className="text-6xl md:text-9xl font-orbitron font-black text-white mb-6 leading-none">
                <span className="block text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40">
                  EXPERIENCIA
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-[length:200%_auto] animate-gradient-flow">
                  VITURE XR
                </span>
              </h1>

              <p className="text-xl text-nexus-silver/60 mb-12 max-w-2xl mx-auto font-light leading-relaxed italic">
                "No es solo ver el futuro; es vivir dentro de él con la precisión de 11
                dimensiones."
              </p>

              <motion.button
                onClick={handleXREnter}
                className="group relative px-12 py-6 glass-morphism rounded-full text-white font-bold text-xl overflow-hidden border border-white/20 transition-all hover:border-cyan-400/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={playHover}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center gap-4 tracking-[0.1em]">
                  <Maximize2 className="w-6 h-6 text-cyan-400" />
                  ENTRAR EN LA MATRIZ
                </span>
              </motion.button>
            </div>
          ) : (
            <>
              {activeMode === 'experiences' ? (
                <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
                  {/* Left: Interactive Visualizer */}
                  <motion.div
                    className="relative aspect-video rounded-3xl overflow-hidden glass-morphism border border-white/10 group"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${currentExp.color} opacity-40 mix-blend-overlay`}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
                      <motion.div
                        className="text-8xl mb-8"
                        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        {currentExp.afterIcon}
                      </motion.div>
                      <div className="text-center">
                        <span className="text-[10px] font-bold text-cyan-400 tracking-[0.5em] uppercase mb-4 block">
                          {currentExp.badge}
                        </span>
                        <h3 className="text-4xl font-orbitron font-bold text-white mb-2">
                          {currentExp.title}
                        </h3>
                        <p className="text-nexus-silver/80 italic">{currentExp.subtitle}</p>
                      </div>
                    </div>

                    {/* Scan Bar Effect */}
                    <motion.div
                      className="absolute left-0 right-0 h-1 bg-cyan-400/50 blur-[2px] z-20"
                      animate={{ top: ['0%', '100%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    />
                  </motion.div>

                  {/* Right: Details & Control */}
                  <div className="space-y-12">
                    <div className="space-y-6">
                      <div className="flex gap-2">
                        {experiences.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              playClick();
                              setCurrentExperience(idx);
                            }}
                            className={`w-3 h-3 rounded-full transition-all duration-500 ${currentExperience === idx ? 'bg-cyan-400 w-12' : 'bg-white/20 hover:bg-white/40'}`}
                          />
                        ))}
                      </div>
                      <h3
                        className={`text-4xl md:text-6xl font-orbitron font-black bg-gradient-to-r ${currentExp.color} bg-clip-text text-transparent`}
                      >
                        {currentExp.title}
                      </h3>
                      <p className="text-nexus-silver/90 text-xl font-light leading-relaxed">
                        {currentExp.description}
                      </p>
                    </div>

                    {/* Sub-features grid */}
                    <div className="grid grid-cols-2 gap-6">
                      {[
                        {
                          icon: <Layout className="w-5 h-5" />,
                          label: 'Holografía',
                          val: 'Activa',
                        },
                        { icon: <Zap className="w-5 h-5" />, label: 'Latencia', val: '0.1ms' },
                        {
                          icon: <Monitor className="w-5 h-5" />,
                          label: 'Resolución',
                          val: '8K Spatial',
                        },
                        {
                          icon: <ShieldCheck className="w-5 h-5" />,
                          label: 'Seguridad',
                          val: 'E2E Quantum',
                        },
                      ].map((feat, i) => (
                        <div
                          key={i}
                          className="glass-morphism p-4 rounded-2xl border border-white/5 flex items-center gap-4"
                        >
                          <div className="text-cyan-400">{feat.icon}</div>
                          <div>
                            <div className="text-[10px] text-white/40 uppercase tracking-tighter">
                              {feat.label}
                            </div>
                            <div className="text-xs font-bold text-white tracking-widest">
                              {feat.val}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <motion.button
                      onClick={handleXRExit}
                      className="px-8 py-4 border border-red-500/30 text-red-500 rounded-full font-orbitron text-xs font-bold tracking-[0.2em] hover:bg-red-500/10 transition-colors"
                    >
                      TERMINAR SESIÓN XR
                    </motion.button>
                  </div>
                </div>
              ) : (
                <ARProjectionLab />
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* Post-processing Overlay Effects */}
      <AnimatePresence>
        {isXRActive && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Vignette */}
            <div className="absolute inset-0 bg-radial-at-center from-transparent via-transparent to-black/60" />

            {/* Digital Chromatic Aberration Simulation (Subtle) */}
            <div className="absolute inset-0 opacity-10 mix-blend-screen bg-gradient-to-r from-red-500/10 via-green-500/10 to-blue-500/10" />

            {/* Scanlines layer */}
            <div className="absolute inset-0 bg-[url('/images/nexus/scanlines.svg')] opacity-[0.03] pointer-events-none" />

            {/* Crosshair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 opacity-20">
              <div className="absolute inset-0 border border-cyan-400/50 rounded-full" />
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-cyan-400/50" />
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-cyan-400/50" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
