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
    id: 'intro',
    speaker: 'system',
    title: 'AIGESTION',
    subtitle: 'SOVEREIGN INTELLIGENCE',
    desc: 'Arquitectura avanzada de inteligencia artificial diseñada para la soberanía operativa y la automatización estratégica empresarial.',
    staticImage: '/images/cinematic/aigestion_core.png',
    emoji: '🚀',
    color: 'from-slate-700 to-slate-900',
    funFact: 'Sistemas con arquitectura de alta disponibilidad y redundancia geográfica.',
  },
  {
    id: 'nexus_iot',
    speaker: 'nexus',
    title: 'NEXUS CONTROL',
    subtitle: 'OPERATIONAL EXCELLENCE',
    desc: 'Gestión autónoma de infraestructura y activos en tiempo real, garantizando la continuidad operativa mediante monitoreo predictivo.',
    staticImage: '/images/cinematic/nexus_iot.png',
    emoji: '🤖',
    color: 'from-slate-900 to-black',
    funFact: 'Capacidad de procesamiento masivo con latencia ultra-baja para entornos críticos.',
  },
  {
    id: 'daniela_sales',
    speaker: 'daniela',
    title: 'DANIELA AI',
    subtitle: 'COGNITIVE ASSISTANT',
    desc: 'Asistente cognitivo multilingüe especializado en optimización de procesos y atención al cliente de alto nivel.',
    staticImage: '/images/daniela/desk.png',
    emoji: '🧠',
    color: 'from-indigo-900 to-violet-900',
    funFact:
      'Interface neuronal capaz de gestionar flujos de trabajo complejos con precisión absoluta.',
  },
  {
    id: 'nexus_social',
    speaker: 'nexus',
    title: 'GLOBAL REACH',
    subtitle: 'STRATEGIC EXPANSION',
    desc: 'Automatización de presencia digital y análisis de tendencias globales para un posicionamiento de mercado dominante.',
    staticImage: '/images/cinematic/viral_architecture.png',
    emoji: '🌟',
    color: 'from-slate-800 to-blue-900',
    funFact: 'Algoritmos propietarios de optimización de visibilidad en ecosistemas digitales.',
  },
  {
    id: 'roi',
    speaker: 'system',
    title: 'ROI OPTIMIZATION',
    subtitle: 'ECONOMIC EFFICIENCY',
    desc: 'Maximización del retorno de inversión mediante la reducción de costos operativos y la eficiencia algorítmica aplicada.',
    staticImage: '/images/cinematic/roi_synergy.png',
    emoji: '💰',
    color: 'from-emerald-900 to-slate-900',
    funFact: 'Incremento medible en la eficiencia de capital mediante automatización inteligente.',
  },
  {
    id: 'cta',
    speaker: 'daniela',
    title: 'CENTRO DE CONTROL',
    subtitle: 'START YOUR DEPLOYMENT',
    desc: 'Inicie la transformación digital de su organización con protocolos de implementación de grado industrial.',
    staticImage: '/images/cinematic/future_portal.png',
    emoji: '🎮',
    color: 'from-slate-900 to-indigo-950',
    funFact: 'Ecosistema escalable preparado para el futuro de la gobernanza digital.',
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
          name: 'NEXUS ARCHITECTURE',
          align: 'items-start text-left',
          description: 'Autonomous Infrastructure Systems',
        };
      case 'daniela':
        return {
          color: 'text-nexus-violet-glow',
          name: 'DANIELA COGNITIVE',
          align: 'items-end text-right',
          description: 'Advanced Process Automation',
        };
      default:
        return {
          color: 'text-white',
          name: 'AIGESTION CORE',
          align: 'items-center text-center',
          description: 'Strategic Intelligence Hub',
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
              background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 245, 255, 0.05) 0%, transparent 60%)`,
            }}
            transition={{ duration: 1.5 }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black" />
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

            <h1 className="text-6xl md:text-8xl xl:text-9xl font-black mb-12 leading-none tracking-tight kinetic-text stack-reveal drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]">
              {activeSlide.title}
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
                  Contactar Especialista
                </button>
              </MagneticButton>

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
