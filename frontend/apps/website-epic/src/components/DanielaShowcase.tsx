import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../hooks/useAudio';
import { DanielaAvatar } from './DanielaAvatar';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';

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
            stop();
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
                        start(); // Connect to Vapi after intro
                    };
                    introAudioRef.current.onerror = () => {
                        console.warn("Intro audio failed to load, skipping to Vapi");
                        setIsIntroPlaying(false);
                        start();
                    };
                }

                setIsIntroPlaying(true);
                introAudioRef.current.play().catch(e => {
                    console.error("Audio playback error:", e);
                    setIsIntroPlaying(false);
                    start(); // Fallback to direct start
                });
            } else {
                // No intro configured, straight to Vapi
                start();
            }
        }
    };

    return (
        <section className="py-32 bg-nexus-obsidian text-white text-center relative overflow-hidden">
            <div className="grain-overlay" />

            {/* Background Ambience */}
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-nexus-violet/20 to-transparent" />
            <div className="absolute inset-0 bg-radial-at-center from-nexus-violet/5 via-transparent to-transparent pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
            >
                <h2 className="text-5xl md:text-6xl font-orbitron font-black mb-8 text-nexus-violet-glow text-glow">DANIELA AI</h2>
                <p className="text-nexus-silver/60 max-w-2xl mx-auto mb-16 text-lg font-light tracking-wide">
                    La asistente virtual capaz de negociar y cerrar ventas por ti.
                    <br />
                    <span className="text-xs font-mono text-nexus-cyan/40 mt-4 block uppercase tracking-[0.3em]">
                        Protocolo de Seducción Comercial v2.4 Activo
                    </span>
                </p>
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
                                        <span className="text-blue-300 text-xs font-orbitron tracking-widest uppercase">Saludando...</span>
                                    </>
                                )}
                                {!isIntroPlaying && status === 'connecting' && (
                                    <>
                                        <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                                        <span className="text-yellow-300 text-xs font-orbitron tracking-widest uppercase">Sincronizando...</span>
                                    </>
                                )}
                                {!isIntroPlaying && status === 'active' && (
                                    <>
                                        <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,1)]" />
                                        <span className="text-green-300 text-xs font-orbitron tracking-widest uppercase">Cerebro Activo</span>
                                    </>
                                )}
                                {!isIntroPlaying && status === 'error' && (
                                    <>
                                        <div className="w-2 h-2 rounded-full bg-red-400" />
                                        <span className="text-red-300 text-xs font-orbitron tracking-widest uppercase truncate">{error || "Error Nodo"}</span>
                                    </>
                                )}
                                {!isIntroPlaying && status === 'idle' && (
                                    <>
                                        <div className="w-2 h-2 rounded-full bg-nexus-cyan/40" />
                                        <span className="text-nexus-cyan text-xs font-orbitron tracking-widest uppercase">Frecuencia Lista</span>
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
                            ${(isConnected || isIntroPlaying)
                                ? 'before:bg-red-500/20! border-red-500/30!'
                                : ''
                            }
                        `}
                    >
                        {(isConnected || isIntroPlaying) ? 'DESCONECTAR' : 'HABLAR CON DANIELA'}
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
