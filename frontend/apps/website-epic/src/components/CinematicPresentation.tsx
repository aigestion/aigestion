import { AnimatePresence, motion, useSpring, useTransform } from 'framer-motion';
import { Pause, Play, SkipForward, ArrowRight } from 'lucide-react';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useSentimentUI } from '../hooks/useSentimentUI';
import { useSound } from '../services/audio-service';
import { MagneticButton } from './MagneticButton';
import { useAppContext } from '../contexts/AppContext';

// 3D Tilt Component
import { TiltCard } from './design-system/TiltCard';
import { DeepSpaceField } from './design-system/DeepSpaceField';

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
    title: 'AUTO-PILOTO',
    subtitle: 'TU NEGOCIO EN LAS MEJORES MANOS',
    desc: 'Hola, soy Daniela. He diseñado AIGestion.net para que te olvides de las facturas que no cuadran o el stock que se pierde. Yo me ocupo de lo difícil.',
    staticImage: '/images/daniela/daniela_office_godmode.png',
    emoji: '✨',
    color: 'from-nexus-violet/80 to-black',
    funFact: 'Tu asistente personal que nunca duerme y siempre está al día.',
  },
  {
    id: 'sara_focus',
    speaker: 'nexus',
    title: 'TRABAJO LIBRE',
    subtitle: 'PARA AUTÓNOMOS Y CREATIVOS',
    desc: '¿Cansada de perder el fin de semana haciendo facturas? Yo las hago por ti mientras trabajas. Recupera tu tiempo libre de verdad.',
    staticImage: '/images/cinematic/nexus_iot.png',
    emoji: '🎨',
    color: 'from-nexus-obsidian-deep to-black',
    funFact: 'Contabilidad automática hablando por el móvil. Sin líos.',
  },
  {
    id: 'antonio_focus',
    speaker: 'daniela',
    title: 'CONTROL TOTAL',
    subtitle: 'TU NEGOCIO SIEMPRE EN TU BOLSILLO',
    desc: 'Sin exceles ni papeles. Si te queda poco stock o tienes una cita, te aviso antes de que pase. Todo bajo control, sin estrés.',
    staticImage: '/images/daniela/desk.png',
    emoji: '📈',
    color: 'from-nexus-violet-dim/50 to-nexus-violet/20',
    funFact: 'Toda la información de tu empresa lista en un segundo.',
  },
  {
    id: 'family_focus',
    speaker: 'nexus',
    title: 'PAZ FAMILIAR',
    subtitle: 'TU HOGAR BIEN ORGANIZADO',
    desc: 'De las citas del médico a los gastos de casa. Una memoria compartida para que todos sepáis qué hay que hacer. Menos caos, más vida.',
    staticImage: '/images/cinematic/viral_architecture.png',
    emoji: '🏠',
    color: 'from-slate-800 to-nexus-cyan/20',
    funFact: 'Organización fácil para que lo importante sea vuestro tiempo juntos.',
  },
  {
    id: 'simplicity_focus',
    speaker: 'system',
    title: 'NIVEL CERO',
    subtitle: 'SIN SABER DE INFORMÁTICA',
    desc: 'Si sabes usar WhatsApp, sabes usar AIGestion. Es así de sencillo. Empezamos hoy mismo a mejorar tu día a día.',
    staticImage: '/images/cinematic/roi_synergy.png',
    emoji: '✅',
    color: 'from-emerald-900 to-slate-900',
    funFact: 'Ayuda inteligente real para problemas reales. Sin tecnicismos.',
  },
  {
    id: 'nexus_portal',
    speaker: 'daniela',
    title: 'EMPIEZA HOY',
    subtitle: 'TU NUEVA ETAPA COMIENZA AQUÍ',
    desc: 'El Centro de Control está listo para ti. Es hora de recuperar tu tiempo y la tranquilidad. Entra y descubre la diferencia.',
    staticImage: '/images/cinematic/future_portal.png',
    emoji: '🚀',
    color: 'from-slate-900 to-indigo-950',
    funFact: 'Únete a las familias y negocios que ya viven sin estrés tecnológico.',
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

  // Helper function to extract speaker styling logic (was missing in previous view)
  const getSpeakerDetails = (speaker: string) => {
    switch (speaker) {
      case 'daniela':
        return { name: 'DANIELA', color: 'text-nexus-violet', align: 'justify-start items-start', description: 'DIRECTORA DE I.A.' };
      case 'nexus':
        return { name: 'NEXUS SYSTEM', color: 'text-nexus-cyan', align: 'justify-center items-center text-center', description: 'CORE DE PROCESAMIENTO' };
      default: // system
        return { name: 'AIGESTION.NET', color: 'text-white', align: 'justify-end items-end text-right', description: 'PLATAFORMA GLOBAL' };
    }
  };

  const speakerStyle = getSpeakerDetails(activeSlide.speaker);

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-nexus-obsidian text-white font-orbitron"
      onMouseMove={handleMouseMove}
    >
      {/* Sovereign Particle Field */}
      <DeepSpaceField className="z-10 opacity-60 pointer-events-none" />

      {/* Background Layer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.6, scale: 1 }}
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
              background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 245, 255, 0.15) 0%, transparent 40%)`,
            }}
            transition={{ duration: 1.5 }}
          />

          {/* Sovereign Scanlines */}
          <div className="absolute inset-0 pointer-events-none z-2 overflow-hidden opacity-20">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-size-[100%_4px,3px_100%]" />
          </div>

          {/* Holographic HUD Overlay */}
          <div className="absolute inset-0 pointer-events-none z-3 opacity-30">
            <div className="absolute top-10 left-10 w-32 h-32 border-l border-t border-nexus-cyan/40" />
            <div className="absolute top-10 right-10 w-32 h-32 border-r border-t border-nexus-cyan/40" />
            <div className="absolute bottom-10 left-10 w-32 h-32 border-l border-b border-nexus-cyan/40" />
            <div className="absolute bottom-10 right-10 w-32 h-32 border-r border-b border-nexus-cyan/40" />
          </div>

          <div className="absolute inset-x-0 bottom-0 h-px bg-size-[100%_4px,3px_100%] bg-gradient-to-r from-transparent via-nexus-cyan/50 to-transparent shadow-[0_0_15px_#22d3ee]" />
          <div className="absolute inset-0 bg-gradient-to-t from-nexus-obsidian via-transparent to-nexus-obsidian/40" />
        </motion.div>
      </AnimatePresence>

      {/* Content Layer */}
      <div
        className={`relative z-20 w-full h-full flex flex-col justify-center px-6 md:px-32 ${speakerStyle.align}`}
      >
        <AnimatePresence mode="wait">
          <TiltCard className="max-w-5xl">
            <motion.div
              key={activeSlide.id + '-text'}
              initial={{ y: 20, opacity: 0, filter: 'blur(10px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: -20, opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className={`flex ${speakerStyle.align.includes('center') ? 'justify-center' : speakerStyle.align.includes('end') ? 'justify-end' : 'justify-start'} mb-12`}
              >
                <div className="flex items-center gap-4 py-2 border-b border-white/10 pr-12 backdrop-blur-sm bg-black/20 rounded-lg px-4">
                  <div
                    className={`text-[12px] font-bold tracking-[0.4em] uppercase ${speakerStyle.color} drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]`}
                  >
                    {speakerStyle.name}
                  </div>
                  <div className="w-8 h-px bg-white/20" />
                  <div className="text-[9px] text-nexus-silver/50 uppercase tracking-[0.3em] font-mono">
                    {speakerStyle.description}
                  </div>
                </div>
              </div>

              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-nexus-cyan text-[12px] font-bold mb-6 tracking-[0.8em] uppercase ${speakerStyle.align.includes('end') ? 'text-right' : speakerStyle.align.includes('center') ? 'text-center' : 'text-left'}`}
              >
                <span className="inline-block w-2 h-2 bg-nexus-cyan rounded-full mr-4 animate-pulse" />
                {activeSlide.subtitle}
              </motion.h2>

              <h1 className="text-6xl md:text-8xl xl:text-9xl font-black mb-12 leading-none tracking-tight kinetic-text stack-reveal drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] glitch-text">
                {activeSlide.title}
                <span className="text-nexus-cyan animate-pulse">.</span>
              </h1>

              <div
                className={`flex ${speakerStyle.align.includes('center') ? 'justify-center' : speakerStyle.align.includes('end') ? 'justify-end' : 'justify-start'}`}
              >
                <p className="text-lg md:text-xl text-nexus-silver/90 leading-relaxed font-light tracking-wide italic max-w-2xl text-shadow-sm">
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
                    className="px-10 py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl text-[10px] tracking-[0.3em] uppercase hover:bg-nexus-cyan hover:text-black hover:border-nexus-cyan transition-all duration-300 font-bold shadow-[0_0_30px_rgba(34,211,238,0.1)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] flex items-center gap-3"
                  >
                    Contactar ahora
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </MagneticButton>

                <button
                  onMouseEnter={playHover}
                  onClick={() => {
                    const el = document.getElementById('demo-dashboard');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-10 py-5 bg-transparent text-nexus-silver/70 border border-white/10 rounded-xl text-[10px] tracking-[0.3em] uppercase hover:border-nexus-cyan/50 hover:text-white transition-all font-bold hover:shadow-[0_0_20px_rgba(0,245,255,0.2)]"
                >
                  Ver Demo
                </button>

                <div className="flex gap-4 ml-4">
                  <button
                    onClick={togglePause}
                    className="p-3 bg-white/5 rounded-full text-nexus-silver/50 hover:text-nexus-cyan hover:bg-white/10 transition-colors"
                  >
                    {isPaused ? <Play size={16} /> : <Pause size={16} />}
                  </button>
                  <button
                    onClick={nextSlide}
                    className="p-3 bg-white/5 rounded-full text-nexus-silver/50 hover:text-nexus-cyan hover:bg-white/10 transition-colors"
                  >
                    <SkipForward size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </TiltCard>
        </AnimatePresence>
      </div>

      {/* Slide Indicators - Vertical on right for God Mode feel */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-6">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(index)}
            className="group relative flex items-center justify-end"
          >
            <div
              className={`transition-all duration-500 rounded-full ${index === currentSlide ? 'w-1 h-8 bg-nexus-cyan shadow-[0_0_10px_#22d3ee]' : 'w-1 h-3 bg-white/10 group-hover:bg-white/30 group-hover:h-5'}`}
            />
            {index === currentSlide && (
              <span className="absolute right-6 text-[9px] font-mono tracking-widest text-nexus-cyan opacity-0 animate-fade-in-right whitespace-nowrap">
                0{index + 1} // {slide.title}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
