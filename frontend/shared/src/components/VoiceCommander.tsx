import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2 } from 'lucide-react';

export const VoiceCommander: React.FC = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');

    const toggleListening = () => {
        setIsListening(!isListening);
        if (!isListening) {
            setTranscript('DANIELA_LISTENING...');
            setTimeout(() => setTranscript('COMANDO_DETECTADO: "MOSTRAR_NODOS"'), 2000);
            setTimeout(() => {
                setTranscript('');
                setIsListening(false);
            }, 4000);
        }
    };

    return (
        <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col items-center gap-4 group">
            <div
                onClick={toggleListening}
                className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                    isListening ? 'bg-nexus-cyan-glow text-black shadow-[0_0_30px_rgba(0,245,255,0.6)]' : 'bg-white/5 text-white/40 hover:bg-white/10'
                }`}
            >
                {isListening ? <Mic size={24} /> : <MicOff size={24} />}
            </div>

            <div className="flex gap-1 h-4 items-center">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ height: isListening ? [4, 12, 4] : 4 }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                        className="w-1 bg-nexus-cyan-glow/40 rounded-full"
                    />
                ))}
            </div>

            <AnimatePresence>
                {transcript && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[8px] font-mono text-nexus-cyan-glow tracking-widest uppercase text-center"
                    >
                        {transcript}
                    </motion.div>
                )}
            </AnimatePresence>

            {!transcript && (
                <span className="text-[7px] font-orbitron text-white/20 uppercase tracking-[0.3em] group-hover:text-white/40 transition-colors">
                    VOICE_CONTROL_OFFLINE
                </span>
            )}
        </div>
    );
};
