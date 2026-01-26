import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../hooks/useAudio';
import { DanielaAvatar } from './DanielaAvatar';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { NeuralSignal } from './NeuralSignal';
import { AITypingFlutter } from './AITypingFlutter';

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
            play('click');
        } else {
            // Start Flow: Intro -> Vapi
            play('click');
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
          <h2 className="text-5xl md:text-6xl font-orbitron font-black mb-8 text-nexus-violet-glow text-glow">
            DANIELA: TU AYUDANTE
          </h2>
          <p className="text-nexus-silver/60 max-w-2xl mx-auto mb-16 text-lg font-light tracking-wide">
            Daniela es una chica virtual inteligente que ayuda a tu empresa a vender más sin que tú
            tengas que hacer nada.
            <br />
            <span className="text-xs font-mono text-nexus-cyan/40 mt-4 block uppercase tracking-[0.3em]">
              <AITypingFlutter
                text="Sistema de Ayuda Inteligente Activado • Nodo Global On"
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
                className="md:col-span-2 relative group overflow-hidden rounded-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-nexus-violet/60 via-transparent to-transparent z-10" />
                <img
                  src="/images/daniela/lab.png"
                  alt="Daniela AI - Neural Interface"
                  className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-1000 filter brightness-110 contrast-110"
                />
                {/* Holographic Overlays - CSS Implementation */}
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
                {/* SVG Grid Overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0iTTAgNDBoNDBWMEgwek0xIDM5VjFoMzh2MzhIMXoiIGZpbGw9IiMyMmQzZWUiIGZpbGwtb3BhY2l0eT0iLjMiLz48L2c+PC9zdmc+')] shadow-inner" />
                <div className="absolute bottom-6 left-6 z-20">
                  <p className="text-white font-orbitron text-2xl font-bold drop-shadow-lg">
                    Calidad Máxima
                  </p>
                  <p className="text-nexus-cyan text-sm tracking-wider">Parece una persona real</p>
                </div>
              </motion.div>

              {/* Imágenes secundarias */}
              <div className="flex flex-col gap-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="relative group overflow-hidden rounded-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <img
                    src="/images/daniela/lobby.png"
                    alt="Daniela - Lobby Corporativo"
                    className="w-full h-[240px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-3 left-3 z-20">
                    <p className="text-white font-orbitron text-sm font-bold">Oficina Nueva</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="relative group overflow-hidden rounded-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <img
                    src="/images/daniela/lab.png"
                    alt="Daniela - Laboratorio AI"
                    className="w-full h-[240px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-3 left-3 z-20">
                    <p className="text-white font-orbitron text-sm font-bold">
                      Laboratorio Espacial
                    </p>
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

            {/* Status Badge */}
            <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-80 flex justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={status + (isIntroPlaying ? '-intro' : '')}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="premium-glass px-6 py-2 rounded-full border-white/10 flex items-center gap-3 min-w-[200px] justify-center"
                >
                  {isIntroPlaying && (
                    <>
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                      <span className="text-blue-300 text-xs font-orbitron tracking-widest uppercase">
                        Saludando...
                      </span>
                    </>
                  )}
                  {!isIntroPlaying && status === 'connecting' && (
                    <>
                      <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                      <span className="text-yellow-300 text-xs font-orbitron tracking-widest uppercase">
                        Sincronizando...
                      </span>
                    </>
                  )}
                  {!isIntroPlaying && status === 'active' && (
                    <>
                      <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,1)]" />
                      <span className="text-green-300 text-xs font-orbitron tracking-widest uppercase">
                        Cerebro Activo
                      </span>
                    </>
                  )}
                  {!isIntroPlaying && status === 'error' && (
                    <>
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      <span className="text-red-300 text-xs font-orbitron tracking-widest uppercase truncate">
                        {error || 'Error Nodo'}
                      </span>
                    </>
                  )}
                  {!isIntroPlaying && status === 'idle' && (
                    <>
                      <div className="w-2 h-2 rounded-full bg-nexus-cyan/40" />
                      <span className="text-nexus-cyan text-xs font-orbitron tracking-widest uppercase">
                        Lista para hablar
                      </span>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
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
