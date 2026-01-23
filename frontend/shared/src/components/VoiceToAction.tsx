import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Zap, BrainCircuit, Waves } from 'lucide-react';
import { useSound } from '../hooks/useSound';

export const VoiceToAction: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const { playWuaw, playHover } = useSound();

  const handleToggle = () => {
    playWuaw();
    setIsListening(!isListening);
  };

  return (
    <div className="relative group">
      <motion.button
        onMouseEnter={playHover}
        onClick={handleToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
          ${isListening ? 'bg-nexus-cyan-glow text-black shadow-[0_0_30px_rgba(0,245,255,0.6)]' : 'bg-white/5 border border-white/10 text-white/40 hover:text-white'}`}
      >
        {isListening ? <Mic size={20} /> : <BrainCircuit size={20} />}
      </motion.button>

      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 w-64 bg-black/80 backdrop-blur-3xl border border-nexus-cyan/20 p-6 rounded-[2rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] z-50 text-center"
          >
            <div className="flex justify-center mb-4">
                <div className="flex items-center gap-1 h-8">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ height: [10, 32, 10] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                            className="w-1 bg-nexus-cyan-glow rounded-full"
                        />
                    ))}
                </div>
            </div>

            <p className="text-[9px] font-orbitron font-black text-nexus-cyan-glow tracking-[0.3em] uppercase mb-1">DANIELA_LISTENING</p>
            <p className="text-[7px] font-mono text-white/40 uppercase italic italic">"A la espera de un comando de soberanía..."</p>

            <div className="mt-4 flex flex-col gap-2">
                <div className="text-[6px] font-mono text-white/20 uppercase border-t border-white/5 pt-2">EJEMPLOS:</div>
                <div className="text-[8px] text-nexus-cyan/60 italic">"CERRAR TODOS LOS NODOS"</div>
                <div className="text-[8px] text-nexus-cyan/60 italic">"ACTIVAR MODO GUERRA"</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
