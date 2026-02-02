import { AnimatePresence, motion, useSpring } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import { useSentimentUI } from '../hooks/useSentimentUI';
import { useSound } from '../hooks/useSound';

interface Slide {
  id: string;
  speaker: string;
  title: string;
  subtitle: string;
  desc: string;
  staticImage: string;
}

const SLIDES: Slide[] = [
  {
    id: 'intro',
    speaker: 'system',
    title: 'AIGESTION',
    subtitle: 'SISTEMA OPERATIVO CENTRAL',
    desc: 'Iniciando aigestion.net protocolos de amplificación empresarial...',
    staticImage: '/images/cinematic/aigestion_core.png',
  },
  {
    id: 'nexus_iot',
    speaker: 'nexus',
    title: 'CONTROL NEXUS',
    subtitle: 'YO VEO LOS DATOS',
    desc: 'Mientras tú descansas, yo optimizo tu infraestructura. Gestión de IoT, servidores y logística con precisión milimétrica.',
    staticImage: '/images/cinematic/nexus_iot.png',
  },
  {
    id: 'daniela_sales',
    speaker: 'daniela',
    title: 'DANIELA VOZ',
    subtitle: 'YO CREO LA CONEXIÓN',
    desc: 'Hablo con mil clientes a la vez. Cierro ventas, reservo citas y fidelizo a tu audiencia con calidez humana.',
    staticImage: '/images/daniela/desk.png',
  },
  {
    id: 'nexus_social',
    speaker: 'nexus',
    title: 'ARQUITECTURA VIRAL',
    subtitle: 'ANÁLISIS DE TENDENCIAS',
    desc: 'Detecto patrones de crecimiento. Automatizo la publicación omnicanal para maximizar el impacto.',
    staticImage: '/images/cinematic/viral_architecture.png',
  },
  {
    id: 'roi',
    speaker: 'system',
    title: 'SINERGIA TOTAL',
    subtitle: 'LÓGICA + EMPATÍA',
    desc: 'Reduce costes operativos un 70%. Multiplica tu eficiencia un 300%. La matemática del futuro.',
    staticImage: '/images/cinematic/roi_synergy.png',
  },
  {
    id: 'cta',
    speaker: 'daniela',
    title: 'TU NUEVA REALIDAD',
    subtitle: '¿EMPEZAMOS?',
    desc: 'No es ciencia ficción. Es tu negocio, hoy.',
    staticImage: '/images/cinematic/future_portal.png',
  },
];

export const CinematicPresentation: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
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

  const activeSlide = SLIDES[currentSlide];

  const getSpeakerDetails = (speaker: string) => {
    switch (speaker) {
      case 'nexus':
        return {
          color: 'text-nexus-cyan-glow',
          name: 'NEXUS ANDROID',
          align: 'items-start text-left',
          glow: 'rgba(0, 245, 255, 0.2)',
        };
      case 'daniela':
        return {
          color: 'text-nexus-violet-glow',
          name: 'DANIELA AI',
          align: 'items-end text-right',
          glow: 'rgba(138, 43, 226, 0.2)',
        };
      default: // system
        return {
          color: 'text-white',
          name: 'AIGESTION CORE',
          align: 'items-center text-center',
          glow: 'rgba(255, 255, 255, 0.1)',
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
          background: `radial-gradient(circle at center, ${colors.glow} 0%, transparent 70%)`,
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
            backgroundImage: `url(${activeSlide.staticImage})`,
            x: mouseX,
            y: mouseY,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-nexus-obsidian via-transparent to-nexus-obsidian/40" />
        </motion.div>
      </AnimatePresence>

      {/* Cinematic Overlays */}
      <motion.div
        className="absolute top-0 inset-x-0 h-[8vh] bg-black z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-0 inset-x-0 h-[8vh] bg-black z-40"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      />

      {/* Decorative HUD Elements */}
      <div className="absolute inset-0 pointer-events-none z-30">
        <div className="absolute top-[10vh] left-12 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-nexus-cyan/40" />
            <div className="text-[8px] font-orbitron text-nexus-cyan/40 tracking-[0.5em] uppercase leading-relaxed">
              Protocolo Dios v4.3 // Activo
              <br />
              Sincronización Neuronal: 100%
              <br />
              Latencia: 0.0001ms
            </div>
          </div>
          <div className="w-48 h-px bg-gradient-to-r from-nexus-cyan/20 to-transparent" />
        </div>

        <div className="absolute top-[10vh] right-12 text-right">
          <div className="text-[8px] font-orbitron text-nexus-silver/20 tracking-[0.5em] uppercase leading-relaxed">
            Localización: Nodo Central AIG
            <br />
            Encriptación: Cuántica Pura
            <br />
            ID: CX-HE-882
          </div>
        </div>

        <div className="absolute bottom-[10vh] left-12">
          <div className="text-[8px] font-orbitron text-nexus-silver/10 tracking-[1em] uppercase">
            AIGESTION // CINEMATIC_CORE
          </div>
        </div>
      </div>

      {/* Content Layer */}
      <div
        className={`relative z-20 w-full h-full flex flex-col justify-center px-6 md:px-20 ${speakerStyle.align}`}
      >
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
            <div
              className={`flex ${speakerStyle.align.includes('end') ? 'justify-end' : speakerStyle.align.includes('center') ? 'justify-center' : 'justify-start'} mb-8`}
            >
              <motion.div
                className="premium-glass px-4 py-2 rounded-full border-white/5"
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  borderColor: colors.primary.includes('cyan')
                    ? 'rgba(0, 245, 255, 0.1)'
                    : 'rgba(138, 43, 226, 0.1)',
                }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${speakerStyle.color.replace('text-', 'bg-')} animate-pulse`}
                  />
                  <span
                    className={`text-[10px] font-orbitron tracking-[0.4em] uppercase ${speakerStyle.color}`}
                  >
                    {speakerStyle.name} // ONLINE
                  </span>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2
                className={`${speakerStyle.color} tracking-[0.6em] text-xs md:text-sm uppercase font-bold mb-6 text-glow`}
              >
                {activeSlide.subtitle}
              </h2>
            </motion.div>

            <h1 className="text-6xl md:text-[8rem] xl:text-[9rem] font-black font-orbitron mb-10 leading-none tracking-[-0.05em]">
              <motion.span
                className="bg-clip-text text-transparent bg-white drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                animate={{
                  opacity: [0.9, 1, 0.9],
                  scale: [0.99, 1, 0.99],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {activeSlide.title}
              </motion.span>
            </h1>

            <motion.div
              className={`premium-glass p-8 md:p-12 rounded-3xl border-white/10 backdrop-blur-3xl relative overflow-hidden ${colors.bg} shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)]`}
              initial={{ scale: 0.9, opacity: 0, x: -50 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <motion.div
                className="absolute inset-x-0 bottom-0 h-1"
                animate={{ backgroundColor: colors.glow }}
              />
              <p className="text-xl md:text-3xl text-nexus-silver/90 max-w-2xl leading-relaxed font-light italic">
                "{activeSlide.desc}"
              </p>
            </motion.div>

            {activeSlide.id === 'cta' && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, type: 'spring' }}
                className="flex flex-col md:flex-row gap-6 items-center mt-12"
              >
                <button
                  className="btn-enterprise px-12 py-5 text-lg rounded-full font-orbitron tracking-[0.2em]"
                  onClick={() => (window.location.href = '#contact')}
                >
                  AUTORIZAR ACCESO
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-0.5 bg-white/20" />
                  <span className="text-[10px] font-orbitron text-nexus-silver/40 tracking-[0.3em] uppercase">
                    Eslabón de Seguridad v2.4
                  </span>
                </div>
              </motion.div>
            )}

            {/* Dashboard Access Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0, type: 'spring' }}
              className="flex flex-col md:flex-row gap-4 items-center mt-8"
            >
              <button
                className="px-8 py-3 rounded-full bg-nexus-violet/10 border border-nexus-violet/30 text-nexus-violet-glow hover:bg-nexus-violet/20 transition-all font-orbitron text-[10px] tracking-[0.2em] uppercase"
                onClick={() => (window.location.href = '/admin')}
              >
                🎛️ Admin Dashboard
              </button>
              <button
                className="px-8 py-3 rounded-full bg-nexus-cyan/10 border border-nexus-cyan/30 text-nexus-cyan-glow hover:bg-nexus-cyan/20 transition-all font-orbitron text-[10px] tracking-[0.2em] uppercase"
                onClick={() => (window.location.href = '/client')}
              >
                👤 Client Dashboard
              </button>
              <button
                className="px-8 py-3 rounded-full bg-nexus-gold/10 border border-nexus-gold/30 text-nexus-gold hover:bg-nexus-gold/20 transition-all font-orbitron text-[10px] tracking-[0.2em] uppercase"
                onClick={() => (window.location.href = '/demo')}
              >
                🚀 Demo Dashboard
              </button>
            </motion.div>
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
        <button
          onClick={prevSlide}
          className="group p-4 rounded-full border border-white/5 hover:border-white/20 transition-all premium-glass"
        >
          <span className="text-white/20 group-hover:text-nexus-cyan-glow transition-colors italic font-orbitron">
            PREV
          </span>
        </button>
      </div>
      <div className="absolute inset-y-0 right-8 z-30 hidden xl:flex items-center">
        <button
          onClick={nextSlide}
          className="group p-4 rounded-full border border-white/5 hover:border-white/20 transition-all premium-glass"
        >
          <span className="text-white/20 group-hover:text-nexus-violet-glow transition-colors italic font-orbitron">
            NEXT
          </span>
        </button>
      </div>
    </div>
  );
};

