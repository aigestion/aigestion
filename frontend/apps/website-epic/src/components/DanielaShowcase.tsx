import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useAudio } from '../hooks/useAudio';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { AITypingFlutter } from './AITypingFlutter';
import { DanielaAvatar } from './DanielaAvatar';
import { NeuralSignal } from './NeuralSignal';

export const DanielaShowcase: React.FC = () => {
  const { play } = useAudio();
  const [isIntroPlaying, setIsIntroPlaying] = React.useState(false);
  const introAudioRef = React.useRef<HTMLAudioElement | null>(null);

  const {
    status,
    start,
    stop,
    isSpeaking: isVapiSpeaking,
    volume: vapiVolume,
    error,
    isConnected,
  } = useVoiceAssistant({
    idleTimeoutSeconds: 45,
    maxDurationSeconds: 180,
  });

  // Combine states for the avatar
  const isSpeaking = isVapiSpeaking || isIntroPlaying;
  // Simulate volume for intro if needed, or just set a static active level
  const volume = isIntroPlaying ? 0.5 : vapiVolume;

  const handleToggleConversation = () => {
    if (isConnected || isIntroPlaying) {
      // Stop everything
      stop?.();
      if (introAudioRef.current) {
        introAudioRef.current.pause();
        introAudioRef.current.currentTime = 0;
      }
      setIsIntroPlaying(false);
      play('success');
    } else {
      // Start Flow: Intro -> Vapi
      play('click_activate');
      const introUrl = import.meta.env.VITE_DANIELA_INTRO_AUDIO_URL;

      if (introUrl) {
        // Try to play intro
        if (!introAudioRef.current) {
          introAudioRef.current = new Audio(introUrl);
          introAudioRef.current.onended = () => {
            setIsIntroPlaying(false);
            start?.(); // Connect to Vapi after intro
          };
          introAudioRef.current.onerror = () => {
            console.warn('Intro audio failed to load, skipping to Vapi');
            setIsIntroPlaying(false);
            start?.();
          };
        }

        setIsIntroPlaying(true);
        introAudioRef.current.play().catch(e => {
          console.error('Audio playback error:', e);
          setIsIntroPlaying(false);
          start?.(); // Fallback to direct start
        });
      } else {
        // No intro configured, straight to Vapi
        start?.();
      }
    }
  };

  return (
    <section className="py-32 bg-nexus-obsidian text-white text-center relative overflow-hidden">
      <div className="grain-overlay" />

      {/* Background Ambience */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-nexus-violet/20 to-transparent" />
      <div className="absolute inset-0 bg-radial-at-center from-nexus-violet/5 via-transparent to-transparent pointer-events-none" />

      {/* Reactive Neural Signal Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <NeuralSignal volume={volume} isSpeaking={isSpeaking} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <h2 className="text-5xl md:text-7xl font-orbitron font-black mb-8 text-nexus-violet-glow text-glow tracking-tighter">
          SYNTHETIC CONSCIOUSNESS: <span className="text-white">DANIELA.AI</span>
        </h2>
        <p className="text-nexus-silver/60 max-w-2xl mx-auto mb-16 text-xl font-light tracking-wide italic">
          "La inteligencia no es solo lógica, es conexión. <br />
          Redefiniendo la interacción humana a través de la red neuronal soberana."
          <br />
          <span className="text-xs font-mono text-nexus-cyan/40 mt-4 block uppercase tracking-[0.3em] not-italic">
            <AITypingFlutter
              text="Protocolos de Conciencia v4.2 • Nodo Global God Mode Online"
              speed={50}
            />
          </span>
        </p>
        {/* Daniela Deep Focus Showcase */}
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Main Visual Focus */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl"
            >
              <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent z-10" />
              <img
                src="/images/daniela/lobby.png"
                alt="Daniela AI - Lobby Estratégico"
                className="w-full h-[600px] object-cover transform group-hover:scale-105 transition-transform duration-1000 filter brightness-110"
              />
              <div className="absolute bottom-10 left-10 z-20 text-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-0.5 bg-nexus-violet-glow" />
                  <span className="text-nexus-violet-glow text-[10px] font-orbitron tracking-[0.4em] uppercase">
                    Deep Neural Interface
                  </span>
                </div>
                <p className="text-white font-orbitron text-4xl font-black drop-shadow-2xl">
                  LOBBY ESTRATÉGICO
                </p>
              </div>
            </motion.div>

            {/* Capabilities Matrix */}
            <div className="text-left space-y-10">
              <div className="space-y-4">
                <h3 className="text-3xl font-orbitron font-bold text-white">CAPACIDADES TOTALES</h3>
                <p className="text-nexus-silver/60 font-light">
                  Daniela no es un chatbot, es una entidad cognitiva integrada en el núcleo de su
                  negocio.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Gestión CRM',
                    desc: 'Seguimiento inteligente de clientes y cierre de ventas.',
                  },
                  {
                    title: 'Voz Natural',
                    desc: 'Conversación fluida y humana en más de 50 idiomas.',
                  },
                  {
                    title: 'Agenda God Mode',
                    desc: 'Delegación total de citas, tareas y recordatorios.',
                  },
                  {
                    title: 'Análisis de Datos',
                    desc: 'Reportes de ROI y métricas de negocio en tiempo real.',
                  },
                  {
                    title: 'Control Nexus',
                    desc: 'Gestión de infraestructuras físicas por comandos de voz.',
                  },
                  {
                    title: 'Soporte 24/7',
                    desc: 'Asistencia técnica soberana sin tiempos de espera.',
                  },
                ].map((cap, i) => (
                  <motion.div
                    key={cap.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 premium-glass rounded-2xl border-white/5 hover:border-nexus-violet/30 transition-colors"
                  >
                    <h4 className="text-nexus-violet-glow font-orbitron text-xs tracking-widest mb-2 uppercase">
                      {cap.title}
                    </h4>
                    <p className="text-nexus-silver/70 text-sm leading-relaxed">{cap.desc}</p>
                  </motion.div>
                ))}
              </div>

              <div className="p-8 rounded-3xl bg-linear-to-r from-nexus-violet/10 to-transparent border border-nexus-violet/20 backdrop-blur-sm">
                <p className="text-sm text-nexus-silver italic font-light">
                  "Daniela procesa millones de parámetros por segundo para asegurar que su empresa
                  opere con una eficiencia quirúrgica."
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col items-center justify-center space-y-16 relative z-10">
        {/* Avatar Container */}
        <motion.div
          className="relative"
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute -inset-24 bg-nexus-violet/10 blur-[100px] rounded-full animate-pulse-glow" />

          <div className="relative premium-glass p-4 rounded-full border-white/5 shadow-2xl">
            <DanielaAvatar
              size="xl"
              isSpeaking={isSpeaking}
              volume={volume}
              onClick={handleToggleConversation}
            />
          </div>
        </motion.div>

        {/* Interaction Controls */}
        <div className="mt-12 flex flex-col items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleConversation}
            className={`
                            btn-enterprise px-12! py-5! rounded-full! font-orbitron tracking-[0.2em] text-lg
                            ${
                              isConnected || isIntroPlaying
                                ? 'before:bg-red-500/20! border-red-500/30!'
                                : ''
                            }
                        `}
          >
            {isConnected || isIntroPlaying ? 'DESCONECTAR' : 'HABLAR CON DANIELA'}
          </motion.button>

          <AnimatePresence>
            {isConnected && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.4, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-[10px] font-mono text-nexus-silver mt-6 uppercase tracking-[0.2em]"
              >
                Sesión Encriptada • Nodo v1.0.4-beta
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
