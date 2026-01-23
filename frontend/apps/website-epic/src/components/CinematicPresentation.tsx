import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { ImageService } from '../services/ImageService';
import { useSound } from '../hooks/useSound';
import { useSentimentUI } from '../hooks/useSentimentUI';
import type { FluxModel } from '../services/ImageService';

interface Slide {
  id: string;
  speaker: string;
  title: string;
  subtitle: string;
  desc: string;
  bgPrompt: string;
  model: FluxModel;
}

const SLIDES: Slide[] = [
  {
    id: 'intro',
    speaker: 'system',
    title: 'AIGESTION',
    subtitle: 'SISTEMA OPERATIVO CENTRAL',
    desc: 'Iniciando protocolos de amplificación empresarial...',
    bgPrompt: 'Futuristic abstract digital neural network, dark cyan and violet neon, cinematic, 8k',
    model: 'flux-schnell'
  },
  {
    id: 'nexus_iot',
    speaker: 'nexus',
    title: 'CONTROL NEXUS',
    subtitle: 'YO VEO LOS DATOS',
    desc: 'Mientras tú descansas, yo optimizo tu infraestructura. Gestión de IoT, servidores y logística con precisión milimétrica.',
    bgPrompt: 'High tech android robot analyzing hologram data charts, cyberpunk style, dark background, blue glitch effect, detailed',
    model: 'flux-pro'
  },
  {
    id: 'daniela_sales',
    speaker: 'daniela',
    title: 'DANIELA VOZ',
    subtitle: 'YO CREO LA CONEXIÓN',
    desc: 'Hablo con mil clientes a la vez. Cierro ventas, reservo citas y fidelizo a tu audiencia con calidez humana.',
    bgPrompt: 'Beautiful friendly AI female avatar assistant, soft lighting, professional, warm colors, futuristic office background, portrait',
    model: 'flux-pro'
  },
  {
    id: 'nexus_social',
    speaker: 'nexus',
    title: 'ARQUITECTURA VIRAL',
    subtitle: 'ANÁLISIS DE TENDENCIAS',
    desc: 'Detecto patrones de crecimiento. Automatizo la publicación omnicanal para maximizar el impacto.',
    bgPrompt: 'Digital neural network connecting social media icons, viral growth graph, futuristic command center, blue data nodes',
    model: 'flux-schnell'
  },
  {
    id: 'roi',
    speaker: 'system',
    title: 'SINERGIA TOTAL',
    subtitle: 'LÓGICA + EMPATÍA',
    desc: 'Reduce costes operativos un 70%. Multiplica tu eficiencia un 300%. La matemática del futuro.',
    bgPrompt: 'Futuristic financial growth chart with glowing gold and cyan lines, profit maximization concept, 3d render, epic scale',
    model: 'flux-schnell'
  },
  {
    id: 'cta',
    speaker: 'daniela',
    title: 'TU NUEVA REALIDAD',
    subtitle: '¿EMPEZAMOS?',
    desc: 'No es ciencia ficción. Es tu negocio, hoy.',
    bgPrompt: 'Epic cinematic portal to the future, glowing neon lights, hyperrealistic, welcoming atmosphere',
    model: 'flux-schnell'
  }
];

export const CinematicPresentation: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [backgrounds, setBackgrounds] = useState<Record<string, string>>({});
  const { playWuaw } = useSound();
  const { colors } = useSentimentUI();

  // Parallax Values
  const mouseX = useSpring(0, { damping: 30, stiffness: 100 });
  const mouseY = useSpring(0, { damping: 30, stiffness: 100 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth - 0.5) * 40);
    mouseY.set((clientY / innerHeight - 0.5) * 40);
  };

  const nextSlide = useCallback(() => {
    playWuaw();
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, [playWuaw]);

  const prevSlide = useCallback(() => {
    playWuaw();
    setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  }, [playWuaw]);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(timer);
  }, [currentSlide, nextSlide]);

  useEffect(() => {
    const loadImages = async () => {
      SLIDES.forEach(slide => {
        try {
          ImageService.generateImage(slide.bgPrompt, { model: slide.model })
            .then(url => {
              setBackgrounds(prev => ({ ...prev, [slide.id]: url }));
            })
            .catch(err => console.error('BG Load Error', err));
        } catch (e) {
          console.error(e);
        }
      });
    };
    loadImages();
  }, []);

  const activeSlide = SLIDES[currentSlide];

  const getSpeakerDetails = (speaker: string) => {
    switch (speaker) {
      case 'nexus':
        return {
          color: 'text-nexus-cyan-glow',
          name: 'NEXUS ANDROID',
          align: 'items-start text-left',
          glow: 'rgba(0, 245, 255, 0.2)'
        };
      case 'daniela':
        return {
          color: 'text-nexus-violet-glow',
          name: 'DANIELA AI',
          align: 'items-end text-right',
          glow: 'rgba(138, 43, 226, 0.2)'
        };
      default: // system
        return {
          color: 'text-white',
          name: 'AIGESTION CORE',
          align: 'items-center text-center',
          glow: 'rgba(255, 255, 255, 0.1)'
        };
    }
  };

  const speakerStyle = getSpeakerDetails(activeSlide.speaker);

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-nexus-obsidian text-white font-sans"
      onMouseMove={handleMouseMove}
    >
      <div className="grain-overlay" />

      {/* Dynamic Ambient Background Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-1"
        animate={{
          background: `radial-gradient(circle at center, ${colors.glow} 0%, transparent 70%)`
        }}
        transition={{ duration: 2 }}
      />

      {/* Background Layer with Parallax */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide.id}
          initial={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
          animate={{ opacity: 0.5, scale: 1.05, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: backgrounds[activeSlide.id]
              ? `url(${backgrounds[activeSlide.id]})`
              : undefined,
            x: mouseX,
            y: mouseY,
          }}
        >
          {!backgrounds[activeSlide.id] && (
            <div className="w-full h-full bg-linear-to-br from-nexus-obsidian-light to-nexus-obsidian-deep flex items-center justify-center">
              <span className="text-xl font-orbitron tracking-widest animate-pulse-glow text-white/20">SYNCHRONIZING...</span>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-nexus-obsidian via-transparent to-nexus-obsidian/40" />
        </motion.div>
      </AnimatePresence>

      {/* Content Layer */}
      <div className={`relative z-20 w-full h-full flex flex-col justify-center px-6 md:px-20 ${speakerStyle.align}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id + '-text'}
            initial={{ y: 50, opacity: 0, filter: 'blur(10px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: -50, opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            {/* Speaker Indicator */}
            <div className={`flex ${speakerStyle.align.includes('end') ? 'justify-end' : speakerStyle.align.includes('center') ? 'justify-center' : 'justify-start'} mb-8`}>
              <motion.div
                className="premium-glass px-4 py-2 rounded-full border-white/5"
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  borderColor: colors.primary.includes('cyan') ? 'rgba(0, 245, 255, 0.1)' : 'rgba(138, 43, 226, 0.1)'
                }}
                transition={{ delay: 0.3 }}
              >
                <span className={`text-[10px] font-orbitron tracking-[0.4em] uppercase ${speakerStyle.color}`}>
                  {speakerStyle.name} // ONLINE
                </span>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className={`${speakerStyle.color} tracking-[0.5em] text-xs md:text-sm uppercase font-bold mb-6 text-glow`}>
                {activeSlide.subtitle}
              </h2>
            </motion.div>

            <h1 className="text-6xl md:text-9xl font-black font-orbitron mb-10 leading-none tracking-tight">
              <motion.span
                className="bg-clip-text text-transparent bg-linear-to-b from-white via-white to-white/40"
                animate={{ textShadow: `0 0 20px ${colors.glow}` }}
              >
                {activeSlide.title}
              </motion.span>
            </h1>

            <motion.div
              className={`premium-glass p-8 rounded-3xl border-white/5 backdrop-blur-xl relative overflow-hidden ${colors.bg}`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                className="absolute inset-x-0 bottom-0 h-1"
                animate={{ backgroundColor: colors.glow }}
              />
              <p className="text-xl md:text-3xl text-nexus-silver/80 max-w-2xl leading-relaxed font-light italic">
                "{activeSlide.desc}"
              </p>
            </motion.div>

            {activeSlide.id === 'cta' && (
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, type: 'spring' }}
                className="btn-enterprise mt-12 px-12! py-5! text-lg! rounded-full! font-orbitron tracking-[0.2em]"
                onClick={() => window.location.href = '#contact'}
              >
                AUTORIZAR ACCESO
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation UI */}
      <div className="absolute bottom-12 left-0 right-0 z-30 flex justify-center items-center gap-6">
        <div className="flex gap-3">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(index)}
              className={`group relative transition-all duration-500 h-1 rounded-full overflow-hidden ${index === currentSlide ? 'w-24' : 'w-8 hover:w-12 bg-white/10'}`}
            >
              {index === currentSlide && (
                <motion.div
                  className={`absolute inset-0 ${slide.speaker === 'daniela' ? 'bg-nexus-violet' : 'bg-nexus-cyan-glow'}`}
                  layoutId="activeSlideIndicator"
                  initial={false}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Side Controls */}
      <div className="absolute inset-y-0 left-8 z-30 hidden xl:flex items-center">
        <button onClick={prevSlide} className="group p-4 rounded-full border border-white/5 hover:border-white/20 transition-all premium-glass">
          <span className="text-white/20 group-hover:text-nexus-cyan-glow transition-colors italic font-orbitron">PREV</span>
        </button>
      </div>
      <div className="absolute inset-y-0 right-8 z-30 hidden xl:flex items-center">
        <button onClick={nextSlide} className="group p-4 rounded-full border border-white/5 hover:border-white/20 transition-all premium-glass">
          <span className="text-white/20 group-hover:text-nexus-violet-glow transition-colors italic font-orbitron">NEXT</span>
        </button>
      </div>
    </div>
  );
};
