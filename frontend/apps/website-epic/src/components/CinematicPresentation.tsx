import { AnimatePresence, motion, useSpring } from 'framer-motion';
import { Pause, Play, SkipForward } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useSentimentUI } from '../hooks/useSentimentUI';
import { useSound } from '../services/audio-service';
import { MagneticButton } from './MagneticButton';
import { useAppContext } from '../contexts/AppContext';

interface Slide {
  id: string;
  speaker: string;
  title: string;
  subtitle: string;
  desc: string;
  staticImage: string;
  emoji: string;
  color: string;
  funFact: string;
}

const SLIDES: Slide[] = [
  {
    id: 'daniela_intro',
    speaker: 'daniela',
    title: 'DANIELA',
    subtitle: 'NEXUS INTELLIGENCE GHOST',
    desc: 'Hola, soy Daniela. Bienvenido a AIGestion.net. He diseñado este carrusel cinemático para mostrarte el futuro de tu organización bajo la arquitectura de Inteligencia Soberana.',
    staticImage: '/images/daniela/daniela_office_godmode.png',
    emoji: '✨',
    color: 'from-violet-900 to-black',
    funFact: 'Sistemas con conciencia algorítmica y protocolos de soberanía total.',
  },
  {
    id: 'nexus_control',
    speaker: 'nexus',
    title: 'NEXUS CORE',
    subtitle: 'SOBERANÍA OPERATIVA',
    desc: 'Control total de infraestructuras críticas. Gestión autónoma de activos con redundancia de grado militar y latencia cero.',
    staticImage: '/images/cinematic/nexus_iot.png',
    emoji: '🤖',
    color: 'from-slate-900 to-black',
    funFact: 'Capacidad de procesamiento masivo en el edge para decisiones en milisegundos.',
  },
  {
    id: 'sovereign_ai',
    speaker: 'daniela',
    title: 'IA SOBERANA',
    subtitle: 'AUTONOMÍA ESTRATÉGICA',
    desc: 'Tu inteligencia, tus datos, tu poder. Implementamos redes neuronales privadas que solo responden ante tu organización.',
    staticImage: '/images/daniela/desk.png',
    emoji: '🧠',
    color: 'from-indigo-900 to-violet-900',
    funFact: 'Gobernanza de datos inquebrantable mediante bóvedas de cifrado cuántico.',
  },
  {
    id: 'global_vision',
    speaker: 'nexus',
    title: 'VISIÓN GLOBAL',
    subtitle: 'EXPANSIÓN DOMINANTE',
    desc: 'Dominamos el ecosistema digital. Automatización de presencia y análisis predictivo para posicionar vuestra marca en la vanguardia.',
    staticImage: '/images/cinematic/viral_architecture.png',
    emoji: '🌟',
    color: 'from-slate-800 to-blue-900',
    funFact: 'Algoritmos de crecimiento viral escalables a nivel continental.',
  },
  {
    id: 'roi_epic',
    speaker: 'system',
    title: 'EFICIENCIA DIOS',
    subtitle: 'OPTIMIZACIÓN DE CAPITAL',
    desc: 'Maximización radical del retorno de inversión. Reducimos costes operativos mediante la orquestación inteligente de procesos.',
    staticImage: '/images/cinematic/roi_synergy.png',
    emoji: '💰',
    color: 'from-emerald-900 to-slate-900',
    funFact: 'Incremento de rentabilidad medible desde el primer ciclo de despliegue.',
  },
  {
    id: 'nexus_portal',
    speaker: 'daniela',
    title: 'AIGESTION.NET',
    subtitle: 'INICIA TU DESPLIEGUE',
    desc: 'El Nexo está preparado. Es hora de reclamar la soberanía tecnológica de vuestra empresa. Acceded al Centro de Control.',
    staticImage: '/images/cinematic/future_portal.png',
    emoji: '🎮',
    color: 'from-slate-900 to-indigo-950',
    funFact: 'Ecosistema escalable listo para la próxima generación de gobernanza digital.',
  },
];

export const CinematicPresentation: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showFunFact, setShowFunFact] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { playWuaw, playHover } = useSound();
  const { colors } = useSentimentUI();
  const { setIsContactModalOpen } = useAppContext();

  const mouseX = useSpring(0, { damping: 30, stiffness: 100 });
  const mouseY = useSpring(0, { damping: 30, stiffness: 100 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 40;
    const y = (clientY / innerHeight - 0.5) * 40;
    mouseX.set(x);
    mouseY.set(y);
    setMousePosition({ x: clientX, y: clientY });
  };

  const nextSlide = useCallback(() => {
    playWuaw();
    setShowFunFact(false);
    setCurrentSlide(prev => (prev + 1) % SLIDES.length);
  }, [playWuaw]);

  const togglePause = useCallback(() => setIsPaused(!isPaused), [isPaused]);
  const toggleFunFact = useCallback(() => setShowFunFact(!showFunFact), [showFunFact]);

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(nextSlide, 8000);
      return () => clearInterval(timer);
    }
  }, [isPaused, nextSlide]);

  const activeSlide = SLIDES[currentSlide];

  const getSpeakerDetails = (speaker: string) => {
    switch (speaker) {
      case 'nexus':
        return {
          color: 'text-nexus-cyan-glow',
          name: 'ARQUITECTURA NEXUS',
          align: 'items-start text-left',
          description: 'Sistemas de Infraestructura Autónoma',
        };
      case 'daniela':
        return {
          color: 'text-nexus-violet-glow',
          name: 'NEXUS INTELLIGENCE GHOST',
          align: 'items-end text-right',
          description: 'Daniela AI | Protocolo Soberano',
        };
      default:
        return {
          color: 'text-white',
          name: 'AIGESTION.NET',
          align: 'items-center text-center',
          description: 'Núcleo de Inteligencia Estratégica',
        };
    }
  };

  const speakerStyle = getSpeakerDetails(activeSlide.speaker);

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-black text-white font-orbitron"
      onMouseMove={handleMouseMove}
    >
      {/* Background Layer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.4, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: `url(${activeSlide.staticImage})`,
            x: mouseX,
            y: mouseY,
          }}
        >
          {/* Ambient Glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-1"
            animate={{
              background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 245, 255, 0.08) 0%, transparent 50%)`,
            }}
            transition={{ duration: 1.5 }}
          />

          {/* Sovereign Scanlines */}
          <div className="absolute inset-0 pointer-events-none z-2 overflow-hidden opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-size-[100%_4px,3px_100%]" />
          </div>

          {/* Holographic HUD Overlay */}
          <div className="absolute inset-0 pointer-events-none z-3 opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 border-l border-t border-nexus-cyan/40" />
            <div className="absolute top-10 right-10 w-32 h-32 border-r border-t border-nexus-cyan/40" />
            <div className="absolute bottom-10 left-10 w-32 h-32 border-l border-b border-nexus-cyan/40" />
            <div className="absolute bottom-10 right-10 w-32 h-32 border-r border-b border-nexus-cyan/40" />
          </div>

          <div className="absolute inset-x-0 bottom-0 h-px bg-size-[100%_4px,3px_100%] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        </motion.div>
      </AnimatePresence>

      {/* Content Layer */}
      <div
        className={`relative z-20 w-full h-full flex flex-col justify-center px-6 md:px-32 ${speakerStyle.align}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id + '-text'}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl"
          >
            <div
              className={`flex ${speakerStyle.align.includes('end') ? 'justify-end' : speakerStyle.align.includes('center') ? 'justify-center' : 'justify-start'} mb-12`}
            >
              <div className="flex items-center gap-4 py-2 border-b border-white/5 pr-12">
                <div
                  className={`text-[10px] font-bold tracking-[0.4em] uppercase ${speakerStyle.color}`}
                >
                  {speakerStyle.name}
                </div>
                <div className="w-8 h-px bg-white/10" />
                <div className="text-[8px] text-nexus-silver/30 uppercase tracking-[0.3em] font-mono">
                  {speakerStyle.description}
                </div>
              </div>
            </div>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-nexus-silver/40 text-[10px] font-bold mb-6 tracking-[0.8em] uppercase"
            >
              {activeSlide.subtitle}
            </motion.h2>

            <h1 className="text-6xl md:text-8xl xl:text-9xl font-black mb-12 leading-none tracking-tight kinetic-text stack-reveal drop-shadow-[0_0_50px_rgba(255,255,255,0.1)] glitch-text">
              {activeSlide.title}
              <span className="text-nexus-cyan">.</span>
            </h1>

            <div
              className={`flex ${speakerStyle.align.includes('end') ? 'justify-end' : speakerStyle.align.includes('center') ? 'justify-center' : 'justify-start'}`}
            >
              <p className="text-lg md:text-xl text-nexus-silver/80 leading-relaxed font-light tracking-wide italic max-w-2xl text-glow">
                "{activeSlide.desc}"
              </p>
            </div>

            <div
              className="flex flex-wrap gap-8 mt-16 items-center"
              style={{
                justifyContent: speakerStyle.align.includes('center')
                  ? 'center'
                  : speakerStyle.align.includes('end')
                    ? 'flex-end'
                    : 'flex-start',
              }}
            >
              <MagneticButton>
                <button
                  onMouseEnter={playHover}
                  onClick={() => setIsContactModalOpen(true)}
                  className="px-12 py-5 bg-white text-black border border-white rounded-full text-[10px] tracking-[0.4em] uppercase hover:bg-nexus-cyan hover:text-white transition-all font-bold shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                  Contactar Estratega
                </button>
              </MagneticButton>

              <button
                onMouseEnter={playHover}
                onClick={() => {
                  const el = document.getElementById('demo-dashboard');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-12 py-5 bg-transparent text-white border border-white/20 rounded-full text-[10px] tracking-[0.4em] uppercase hover:border-nexus-cyan hover:text-nexus-cyan transition-all font-bold"
              >
                Acceder al Nexo
              </button>

              <button
                onClick={toggleFunFact}
                className="text-nexus-cyan-glow/60 hover:text-nexus-cyan-glow text-[10px] tracking-[0.4em] uppercase transition-colors"
                onMouseEnter={playHover}
              >
                Especificaciones Técnicas
              </button>

              <div className="flex gap-4">
                <button
                  onClick={togglePause}
                  className="p-2 text-nexus-silver/30 hover:text-white transition-colors"
                >
                  {isPaused ? <Play size={16} /> : <Pause size={16} />}
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 text-nexus-silver/30 hover:text-white transition-colors"
                >
                  <SkipForward size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 left-12 z-30 flex flex-col gap-4">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-700 h-px ${index === currentSlide ? 'w-16 bg-nexus-cyan' : 'w-4 bg-white/10 hover:w-8 hover:bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
};
