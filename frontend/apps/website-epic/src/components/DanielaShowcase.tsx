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
    isConnected
  } = useVoiceAssistant({
    idleTimeoutSeconds: 45,
    maxDurationSeconds: 180
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
            console.warn("Intro audio failed to load, skipping to Vapi");
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
        {/* Galería de Imágenes de Daniela */}
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Imagen principal grande */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:col-span-2 relative group overflow-hidden rounded-3xl"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-nexus-obsidian via-transparent to-transparent z-10" />
              <img
                src="/images/daniela/daniela_lab_godmode.png"
                alt="Daniela AI - Neural Interface"
                className="w-full h-[600px] object-cover transform group-hover:scale-105 transition-transform duration-1000 filter brightness-110 contrast-110"
              />
              {/* Holographic Overlays */}
              <div
                className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30"
                style={{
                  background:
                    'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
                }}
              />
              <motion.div
                animate={{ opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-nexus-cyan/10 via-transparent to-nexus-violet/10 pointer-events-none"
              />
              <div className="absolute bottom-10 left-10 z-20 text-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-0.5 bg-nexus-cyan-glow" />
                  <span className="text-nexus-cyan text-[10px] font-orbitron tracking-[0.4em] uppercase">Laboratorio de Conciencia</span>
                </div>
                <p className="text-white font-orbitron text-4xl font-black drop-shadow-2xl">
                  NÚCLEO NEURONAL 8K
                </p>
                <p className="text-nexus-silver/60 text-sm tracking-widest mt-2">Sincronización total en tiempo real</p>
              </div>
            </motion.div>

            {/* Imágenes secundarias */}
            <div className="flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="relative group overflow-hidden rounded-3xl"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-nexus-obsidian/80 to-transparent z-10" />
                <img
                  src="/images/daniela/daniela_office_godmode.png"
                  alt="Daniela - Entorno Corporativo"
                  className="w-full h-[288px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-6 left-6 z-20 text-left">
                  <p className="text-nexus-violet-glow text-[10px] font-orbitron tracking-widest mb-1 uppercase">Sede Virtual</p>
                  <p className="text-white font-orbitron text-xl font-bold">Oficina Cuántica</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="relative group overflow-hidden rounded-3xl"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-nexus-obsidian/80 to-transparent z-10" />
                <img
                  src="/images/daniela/lobby.png"
                  alt="Daniela - Lobby de Integración"
                  className="w-full h-[288px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-6 left-6 z-20 text-left">
                  <p className="text-nexus-cyan-glow text-[10px] font-orbitron tracking-widest mb-1 uppercase">Integración</p>
                  <p className="text-white font-orbitron text-xl font-bold">Lobby Estratégico</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Características técnicas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {[
              { label: 'Imagen', value: 'Súper Clara' },
              { label: 'Pensamiento', value: 'Rápido' },
              { label: 'Charla', value: 'Al Instante' },
              { label: 'Acierto', value: 'Casi 100%' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="premium-glass p-4 rounded-xl text-center"
              >
                <p className="text-nexus-cyan text-2xl font-orbitron font-bold">{stat.value}</p>
                <p className="text-nexus-silver/60 text-xs uppercase tracking-wider mt-1">
                  {stat.label}
                </p>
              </motion.div>
            ))}
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
                            ${isConnected || isIntroPlaying
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
