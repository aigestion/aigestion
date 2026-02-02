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
  emoji: string;
  color: string;
  funFact: string;
}

const SLIDES: Slide[] = [
  {
    id: 'intro',
    speaker: 'system',
    title: '🚀 AIGESTION',
    subtitle: 'EL SISTEMA MÁGICO',
    desc: '¡Bienvenido al lugar más increíble! Aquí la inteligencia artificial es como magia que hace tu negocio volar. ✨',
    staticImage: '/images/cinematic/aigestion_core.png',
    emoji: '🚀',
    color: 'from-purple-500 to-pink-500',
    funFact: '💡 ¡Sabías que? Esta IA es más inteligente que 100 expertos juntos!',
  },
  {
    id: 'nexus_iot',
    speaker: 'nexus',
    title: '🤖 CONTROL NEXUS',
    subtitle: '¡YO VEO TODO!',
    desc: 'Mientras tú juegas o descansas, yo trabajo como un superhéroe. ¡Controlo todas las cosas para que todo funcione perfecto! 🎮',
    staticImage: '/images/cinematic/nexus_iot.png',
    emoji: '🤖',
    color: 'from-blue-500 to-cyan-500',
    funFact: '🔍 Nexus puede procesar 1 millón de datos por segundo. ¡Más rápido que un rayo!',
  },
  {
    id: 'daniela_sales',
    speaker: 'daniela',
    title: '🧠 DANIELA IA',
    subtitle: '¡TU MEJOR AMIGA!',
    desc: '¡Hola! Soy Daniela y soy como una amiga súper inteligente. Hablo con mil personas a la vez y ayudo a todos a ser felices y exitosos. 💕',
    staticImage: '/images/daniela/desk.png',
    emoji: '🧠',
    color: 'from-pink-500 to-rose-500',
    funFact: '💬 Daniela conoce 100 idiomas y puede hablar como tú prefieras',
  },
  {
    id: 'nexus_social',
    speaker: 'nexus',
    title: '🌟 MODO VIRAL',
    subtitle: '¡FAMOSO EN 5 MINUTOS!',
    desc: '¡Hago que tu negocio sea famoso! Publico en todas partes como un mago y todos quieran ser tus amigos. 📱✨',
    staticImage: '/images/cinematic/viral_architecture.png',
    emoji: '🌟',
    color: 'from-yellow-500 to-orange-500',
    funFact: '📈 Nexus ha hecho que 100 empresas se vuelvan virales en TikTok',
  },
  {
    id: 'roi',
    speaker: 'system',
    title: '💰 DINERO MÁGICO',
    subtitle: '¡MÁS GANANCIA!',
    desc: '¡Con mi ayuda ganas mucho más dinero! Es como tener una máquina que hace billetes. ¡Menos trabajo y más diversión! 🎉',
    staticImage: '/images/cinematic/roi_synergy.png',
    emoji: '💰',
    color: 'from-green-500 to-emerald-500',
    funFact: '🎯 Las empresas ganan 300% más con nuestra ayuda mágica',
  },
  {
    id: 'cta',
    speaker: 'daniela',
    title: '🎮 ¡EMPECEMOS!',
    subtitle: '¿LISTO PARA LA AVENTURA?',
    desc: '¡Este no es un cuento de ciencia ficción! Es tu negocio convertido en un videojuego épico. ¡Vamos a jugar y ganar juntos! 🏆',
    staticImage: '/images/cinematic/future_portal.png',
    emoji: '🎮',
    color: 'from-indigo-500 to-purple-500',
    funFact: '🎪 ¡Más de 10,000 personas ya están jugando y ganando con nosotros!',
  },
];

export const CinematicPresentation: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showFunFact, setShowFunFact] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { playWuaw } = useSound();
  const { colors } = useSentimentUI();

  // Parallax Values
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

  const prevSlide = useCallback(() => {
    playWuaw();
    setShowFunFact(false);
    setCurrentSlide(prev => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  }, [playWuaw]);

  const togglePause = useCallback(() => {
    setIsPaused(!isPaused);
  }, [isPaused]);

  const toggleFunFact = useCallback(() => {
    setShowFunFact(!showFunFact);
  }, [showFunFact]);

  const goToSlide = useCallback(
    (index: number) => {
      playWuaw();
      setShowFunFact(false);
      setCurrentSlide(index);
    },
    [playWuaw]
  );

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        nextSlide();
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [currentSlide, nextSlide, isPaused]);

  const activeSlide = SLIDES[currentSlide];

  const getSpeakerDetails = (speaker: string) => {
    switch (speaker) {
      case 'nexus':
        return {
          color: 'text-cyan-400',
          name: '🤖 NEXUS ANDROID',
          align: 'items-start text-left',
          glow: 'rgba(0, 245, 255, 0.3)',
          emoji: '🤖',
          description: 'El súper robot guardián',
        };
      case 'daniela':
        return {
          color: 'text-pink-400',
          name: '🧠 DANIELA IA',
          align: 'items-end text-right',
          glow: 'rgba(236, 72, 153, 0.3)',
          emoji: '🧠',
          description: 'Tu amiga inteligente',
        };
      default: // system
        return {
          color: 'text-purple-400',
          name: '🚀 AIGESTION CORE',
          align: 'items-center text-center',
          glow: 'rgba(147, 51, 234, 0.3)',
          emoji: '🚀',
          description: 'El cerebro mágico',
        };
    }
  };

  const speakerStyle = getSpeakerDetails(activeSlide.speaker);

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white font-sans"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-3 h-3 bg-purple-400 rounded-full animate-ping opacity-60" />
        <div className="absolute top-40 right-32 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-60 animation-delay-1000" />
        <div className="absolute bottom-32 left-40 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60 animation-delay-2000" />
        <div className="absolute top-60 right-20 w-5 h-5 bg-pink-400 rounded-full animate-ping opacity-60 animation-delay-3000" />

        {/* Floating Stars */}
        <Star className="absolute top-1/4 left-1/4 w-6 h-6 text-yellow-400 animate-pulse" />
        <Star className="absolute top-3/4 right-1/4 w-8 h-8 text-yellow-300 animate-pulse animation-delay-1000" />
        <Sparkles className="absolute top-1/2 left-1/3 w-10 h-10 text-purple-400 animate-spin" />
        <Zap className="absolute bottom-1/3 right-1/3 w-7 h-7 text-blue-400 animate-bounce" />
      </div>

      {/* Dynamic Ambient Background Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-1"
        animate={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${
            mousePosition.y
          }px, ${activeSlide.color
            .replace('from-', 'rgba(')
            .replace(' to-', ', ')}, 0.3) 0%, transparent 50%)`,
        }}
        transition={{ duration: 1.5 }}
      />

      {/* Background Layer with Parallax */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide.id}
          initial={{ opacity: 0, scale: 1.2, filter: 'blur(30px)' }}
          animate={{ opacity: 0.4, scale: 1.1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.2, filter: 'blur(20px)' }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: `url(${activeSlide.staticImage})`,
            x: mouseX,
            y: mouseY,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
        </motion.div>
      </AnimatePresence>

      {/* Cinematic Overlays */}
      <motion.div
        className="absolute top-0 inset-x-0 h-[6vh] bg-gradient-to-b from-black to-transparent z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-0 inset-x-0 h-[6vh] bg-gradient-to-t from-black to-transparent z-40"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      />

      {/* Fun HUD Elements */}
      <div className="absolute inset-0 pointer-events-none z-30">
        <div className="absolute top-[8vh] left-8 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-10 bg-gradient-to-b from-cyan-400 to-transparent animate-pulse" />
            <div className="text-[10px] font-bold text-cyan-300 tracking-wider uppercase leading-relaxed">
              🎮 MODO DIOS ACTIVO ✨
              <br />
              🧠 Cerebro Mágico: 100%
              <br />⚡ Velocidad: ¡Instantánea!
            </div>
          </div>
          <div className="w-32 h-px bg-gradient-to-r from-cyan-400/50 to-transparent" />
        </div>

        <div className="absolute top-[8vh] right-8 text-right">
          <div className="text-[10px] font-bold text-purple-300 tracking-wider uppercase leading-relaxed">
            🌍 Ubicación: Planeta Tierra 🌎
            <br />
            🔐 Seguridad: Nivel Increíble
            <br />
            🎯 ID: NIÑO-GENIO-2026
          </div>
        </div>

        <div className="absolute bottom-[8vh] left-8">
          <div className="text-[10px] font-bold text-pink-300 tracking-wider uppercase">
            🎪 AIGESTION // MODO DIVERTIDO
          </div>
        </div>

        {/* Fun Fact Bubble */}
        {showFunFact && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-2xl border-2 border-white/30 shadow-2xl z-50 max-w-sm"
          >
            <div className="text-white text-sm font-bold mb-2">💡 ¡DATO DIVERTIDO!</div>
            <div className="text-white text-xs">{activeSlide.funFact}</div>
          </motion.div>
        )}
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
              className={`flex ${
                speakerStyle.align.includes('end')
                  ? 'justify-end'
                  : speakerStyle.align.includes('center')
                    ? 'justify-center'
                    : 'justify-start'
              } mb-8`}
            >
              <motion.div
                className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 px-6 py-3 rounded-full border-2 border-white/30 backdrop-blur-sm shadow-lg shadow-purple-500/30"
                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl animate-bounce">{speakerStyle.emoji}</div>
                  <div>
                    <div className={`text-sm font-bold ${speakerStyle.color}`}>
                      {speakerStyle.name}
                    </div>
                    <div className="text-xs text-gray-300">{speakerStyle.description}</div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2
                className={`${speakerStyle.color} text-lg md:text-xl font-bold mb-4 tracking-wider uppercase animate-pulse`}
              >
                {activeSlide.subtitle}
              </h2>
            </motion.div>

            <h1 className="text-5xl md:text-7xl xl:text-8xl font-black mb-8 leading-tight tracking-tight">
              <motion.span
                className="bg-clip-text text-transparent bg-gradient-to-r from-white via-yellow-200 to-white drop-shadow-[0_0_50px_rgba(255,255,255,0.5)]"
                animate={{
                  opacity: [0.8, 1, 0.8],
                  scale: [0.98, 1, 0.98],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {activeSlide.title}
              </motion.span>
            </h1>

            <motion.div
              className="bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 p-8 md:p-12 rounded-3xl border-2 border-white/30 backdrop-blur-2xl relative overflow-hidden shadow-2xl shadow-purple-500/30"
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-purple-500 to-pink-500"
                animate={{ x: ['0%', '100%', '0%'] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <p className="text-lg md:text-2xl text-gray-200 max-w-3xl leading-relaxed font-medium">
                "{activeSlide.desc}"
              </p>
            </motion.div>

            {/* Fun Fact Button */}
            <motion.button
              onClick={toggleFunFact}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full font-bold text-white shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-4 h-4" />
              <span>💡 ¡Saber más!</span>
            </motion.button>

            {/* Interactive Buttons */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
              className="flex flex-wrap gap-4 justify-center items-center mt-8"
            >
              <button
                onClick={() => (window.location.href = '/dashboard')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-white shadow-lg hover:scale-105 transition-all flex items-center gap-2 border-2 border-white/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Rocket className="w-5 h-5" />
                <span>🎮 ¡Jugar Ahora!</span>
              </button>

              <button
                onClick={togglePause}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full font-bold text-white shadow-lg hover:scale-105 transition-all flex items-center gap-2 border-2 border-white/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPaused ? (
                  <>
                    <Play className="w-5 h-5" />
                    <span>▶️ Play</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-5 h-5" />
                    <span>⏸️ Pausa</span>
                  </>
                )}
              </button>

              <button
                onClick={nextSlide}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full font-bold text-white shadow-lg hover:scale-105 transition-all flex items-center gap-2 border-2 border-white/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SkipForward className="w-5 h-5" />
                <span>⏭️ Siguiente</span>
              </button>

              <button
                onClick={prevSlide}
                className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-full font-bold text-white shadow-lg hover:scale-105 transition-all flex items-center gap-2 border-2 border-white/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SkipBack className="w-5 h-5" />
                <span>⏮️ Anterior</span>
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
              className={`group relative transition-all duration-500 h-1 rounded-full overflow-hidden ${
                index === currentSlide ? 'w-24' : 'w-8 hover:w-12 bg-white/10'
              }`}
            >
              {index === currentSlide && (
                <motion.div
                  className={`absolute inset-0 ${
                    slide.speaker === 'daniela' ? 'bg-nexus-violet' : 'bg-nexus-cyan-glow'
                  }`}
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
