import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useAudio } from '../hooks/useAudio';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { AITypingFlutter } from './AITypingFlutter';
import { DanielaAvatar } from './DanielaAvatar';
import { NeuralSignal } from './NeuralSignal';
import { GodModeText } from './design-system/GodModeText';
import { TiltCard } from './design-system/TiltCard';

export const DanielaShowcase: React.FC = React.memo(() => {
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
    <section className="py-32 smooth-mesh-bg text-white text-center relative overflow-hidden">
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
        <div className="mb-8 flex flex-col items-center justify-center gap-2">
          <GodModeText
            text="TU ASISTENTE PERSONAL:"
            effect="none"
            className="text-white/40 font-orbitron tracking-[0.5em] text-[10px] uppercase mb-4"
          />
          <GodModeText
            text="DANIELA"
            effect="neon"
            className="text-5xl md:text-8xl font-orbitron font-black text-white tracking-tighter"
          />
        </div>

        <p className="text-nexus-silver/80 max-w-2xl mx-auto mb-16 text-xl font-light tracking-wide leading-relaxed">
          "Daniela no es un robot frío. Es tu aliada estratégica que gestiona la complejidad por ti.{' '}
          <br />
          <span className="text-nexus-violet-glow font-bold">
            No necesitas tener conocimientos técnicos
          </span>{' '}
          para liderar la revolución de la IA."
          <br />
          <span className="text-xs font-mono text-nexus-cyan/40 mt-6 block uppercase tracking-[0.4em] font-bold">
            <AITypingFlutter
              text="Soberanía Digital • Potencia Sin Esfuerzo • Grado Militar"
              speed={50}
            />
          </span>
        </p>

        {/* Daniela Deep Focus Showcase */}
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Main Visual Focus */}
            <TiltCard
              tiltMaxAngleX={5}
              tiltMaxAngleY={5}
              className="relative group overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl h-[600px]"
            >
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="w-full h-full relative"
              >
                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent z-10" />
                <img
                  src="/images/daniela/lobby.png"
                  alt="Daniela AI - Lobby Estratégico"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 filter brightness-110"
                />
                <div className="absolute bottom-10 left-10 z-20 text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-0.5 bg-nexus-violet-glow" />
                    <GodModeText
                      text="AYUDA CERCANA Y SEGURA"
                      effect="hologram"
                      className="text-nexus-violet-glow text-[10px] font-orbitron tracking-[0.4em] uppercase"
                    />
                  </div>
                  <GodModeText
                    text="TU OFICINA AL DÍA"
                    effect="glitch"
                    className="text-white font-orbitron text-4xl font-black drop-shadow-2xl"
                  />
                </div>
              </motion.div>
            </TiltCard>

            {/* Capabilities Matrix */}
            <div className="text-left space-y-10">
              <div className="space-y-4">
                <GodModeText
                  text="¿CÓMO TE AYUDA?"
                  effect="neon"
                  className="text-3xl font-orbitron font-bold text-white"
                />
                <p className="text-nexus-silver/60 font-light">
                  Daniela no es solo una máquina, es una parte fundamental de tu equipo que te
                  ahorra tiempo y esfuerzo.
                </p>
              </div>

              <div className="bento-grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3">
                {[
                  {
                    title: 'Gestión Inteligente',
                    desc: 'Daniela organiza tu agenda y recuerda cada detalle por ti.',
                    size: 'small',
                  },
                  {
                    title: 'Lenguaje Natural',
                    description:
                      'Interacción fluida con conciencia emocional. Daniela entiende matices, jerga técnica y responde con precisión humana.',
                    size: 'small',
                  },
                  {
                    title: 'Sincronización Total',
                    desc: 'Toda tu empresa en la palma de tu mano, lista para actuar.',
                    size: 'small',
                  },
                  {
                    title: 'Métricas de Éxito',
                    desc: 'Informes claros y directos sobre el rendimiento de tu negocio.',
                    size: 'small',
                  },
                  {
                    title: 'Control por Voz',
                    desc: 'Gestiona operaciones complejas simplemente hablando.',
                    size: 'small',
                  },
                  {
                    title: 'Disponibilidad 24/7',
                    desc: 'Tu asistente nunca descansa. Siempre lista, siempre eficiente.',
                    size: 'small',
                  },
                ].map((cap, i) => (
                  <motion.div
                    key={cap.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bento-item !p-0 overflow-hidden"
                  >
                    <TiltCard className="p-8 h-full bg-transparent border-none">
                      <div className="mb-4 w-10 h-10 rounded-full bg-nexus-violet/20 flex items-center justify-center border border-nexus-violet/30">
                        <div className="w-2 h-2 rounded-full bg-nexus-violet-glow animate-pulse" />
                      </div>
                      <h4 className="text-nexus-violet-glow font-orbitron text-sm tracking-widest mb-3 uppercase font-bold">
                        {cap.title}
                      </h4>
                      <p className="text-nexus-silver/70 text-sm leading-relaxed font-light">
                        {cap.desc}
                      </p>
                    </TiltCard>
                  </motion.div>
                ))}
              </div>

              <div className="p-8 rounded-3xl bg-linear-to-r from-nexus-violet/20 to-transparent border border-nexus-violet/30 backdrop-blur-md shadow-2xl">
                <p className="text-sm text-nexus-silver italic font-light leading-relaxed">
                  "Daniela trabaja incansablemente para que tú puedas centrarte en lo que de verdad
                  importa. Seguridad, eficiencia y soberanía en cada interacción."
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
            {isConnected || isIntroPlaying ? 'DETENER AYUDA' : 'HABLAR CON DANIELA'}
          </motion.button>

          <AnimatePresence>
            {isConnected && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.4, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-[10px] font-mono text-nexus-silver mt-6 uppercase tracking-[0.2em]"
              >
                Conexión Segura e Inteligente
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
});

DanielaShowcase.displayName = 'DanielaShowcase';
