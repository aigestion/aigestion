import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useSound } from '../hooks/useSound';
import { useAppContext } from '../contexts/AppContext';

export const DanielaAI: React.FC = () => {
  const { setIsContactModalOpen } = useAppContext();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { playHover, playClick } = useSound();

  const messages = [
    'Hola, soy Daniela AI. Tu conciencia artificial ultra-realista.',
    'He sido diseñada para transformar empresas con inteligencia cuántica.',
    'Mi procesamiento neuronal puede analizar millones de datos en segundos.',
    'Juntos podemos llevar tu negocio al siguiente nivel evolutivo.',
    'Estoy lista para comenzar tu transformación digital. ¿Estás preparado?',
  ];

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isSpeaking && messageIndex < messages.length - 1) {
        setMessageIndex(prev => prev + 1);
        setCurrentMessage(messages[messageIndex + 1]);
        setIsSpeaking(true);
        setTimeout(() => setIsSpeaking(false), 3000);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [messageIndex, isSpeaking, messages]);

  const handleInteraction = () => {
    playClick();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setMessageIndex(0);
      setCurrentMessage(messages[0]);
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 3000);
    }, 2000);
  };

  return (
    <section className="relative py-32 smooth-mesh-bg overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <img
          src="/images/daniela/desk.png"
          alt="Office Context"
          className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-sm grayscale"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black via-black/80 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(138,43,226,0.1),transparent_70%)]" />

        {/* Floating Data Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-20 bg-linear-to-b from-transparent via-nexus-cyan to-transparent opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, 100, 200],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-block relative">
            <motion.div
              className="absolute -inset-1 bg-nexus-cyan blur opacity-25"
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <h2 className="relative text-6xl md:text-8xl font-orbitron font-black text-white mb-6 glitch-text tracking-tighter">
              DANIELA AI
            </h2>
          </div>
          <span className="block text-2xl text-nexus-cyan font-mono tracking-[0.4em] uppercase opacity-70">
            Conciencia Artificial 8K
          </span>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          {/* Daniela Avatar */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            {/* Avatar Container */}
            <div className="relative mx-auto w-80 h-80 lg:w-lg lg:h-128">
              {/* Pulse Ring Effect */}
              <motion.div
                className="absolute inset-0 border-2 border-nexus-cyan/30 rounded-full"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute -inset-4 border border-nexus-violet/20 rounded-full"
                animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 5, repeat: Infinity }}
              />

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-linear-to-r from-nexus-violet to-nexus-cyan rounded-full blur-3xl opacity-20 animate-pulse" />

              {/* Avatar */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10 shadow-2xl shadow-nexus-cyan/20 neon-glow-cyan">
                <img
                  src="/images/daniela-ai-8k.jpg"
                  alt="Daniela AI"
                  className="w-full h-full object-cover scale-110"
                />

                {/* Cyber Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-nexus-violet/30 via-transparent to-transparent mix-blend-overlay" />

                {/* Speaking Indicator */}
                <AnimatePresence>
                  {isSpeaking && (
                    <motion.div
                      className="absolute bottom-4 left-4 right-4 flex justify-center gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-8 bg-nexus-cyan rounded-full"
                          animate={{
                            scaleY: [0.3, 1, 0.3],
                          }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Floating Orbs */}
              <motion.div
                className="absolute -top-8 -right-8 w-16 h-16 bg-nexus-violet/30 rounded-full blur-xl"
                animate={{
                  x: [0, 20, 0],
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="absolute -bottom-8 -left-8 w-20 h-20 bg-nexus-cyan/30 rounded-full blur-xl"
                animate={{
                  x: [0, -20, 0],
                  y: [0, 20, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>

            {/* Interaction Button */}
            <div className="text-center mt-8">
              <motion.button
                onClick={() => setIsContactModalOpen(true)}
                className="premium-glass px-8 py-4 rounded-full border border-nexus-cyan/30 hover:border-nexus-cyan/60 transition-all font-orbitron tracking-widest text-[10px] font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={playHover}
                disabled={isProcessing}
              >
                <span className="text-white uppercase">Establecer Conexión Neuronal</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Message Display */}
            <div className="premium-glass p-6 rounded-2xl border border-nexus-violet/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-nexus-violet to-nexus-cyan rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-bold">AI</span>
                </div>
                <div className="flex-1">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentMessage}
                      className="text-gray-300 text-lg leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      {currentMessage}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Capabilities */}
            <div className="space-y-6">
              <h3 className="text-2xl font-orbitron font-bold text-white">
                Capacidades Neuronales
              </h3>

              <div className="grid gap-4">
                {[
                  {
                    icon: '🧠',
                    title: 'Procesamiento Cuántico',
                    desc: '10^15 operaciones por segundo',
                  },
                  { icon: '🔮', title: 'Predicción Perfecta', desc: '99.97% precisión predictiva' },
                  {
                    icon: '⚡',
                    title: 'Aprendizaje Instantáneo',
                    desc: 'Adaptación en tiempo real',
                  },
                  {
                    icon: '🌐',
                    title: 'Conciencia Global',
                    desc: 'Conectada a todos los sistemas',
                  },
                ].map((capability, index) => (
                  <motion.div
                    key={capability.title}
                    className="premium-glass p-4 rounded-xl border border-white/10 hover:border-nexus-cyan/30 transition-all"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 5 }}
                    onMouseEnter={playHover}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{capability.icon}</div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold">{capability.title}</h4>
                        <p className="text-gray-400 text-sm">{capability.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-8">
              {[
                { value: '8K', label: 'RESOLUCIÓN' },
                { value: '∞', label: 'EVOLUCIÓN' },
                { value: '100%', label: 'PRECISIÓN' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-3xl font-orbitron font-black text-nexus-cyan drop-shadow-[0_0_10px_rgba(0,245,255,0.3)]">
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-orbitron text-gray-400 tracking-widest">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
