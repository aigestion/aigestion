import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { useDanielaVoice } from '../hooks/useDanielaVoice';
import { useSound } from '../services/audio-service';

export const DanielaOmniWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isListening, transcript, toggleListening } = useDanielaVoice();
  const { playHover, playClick } = useSound();

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    playClick();
  };

  return (
    <div className="fixed bottom-8 right-8 z-9000 font-sans">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-80 bg-black/60 backdrop-blur-xl p-6 rounded-3xl mb-4 border border-nexus-violet/30 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-2">
              <div className="w-2 h-2 rounded-full bg-nexus-cyan animate-pulse shadow-[0_0_8px_rgba(34,211,238,1)]" />
              <span className="text-[10px] font-orbitron tracking-[0.3em] text-nexus-cyan-glow uppercase">
                Asistente Daniela
              </span>
              <div className="ml-auto w-12 h-px bg-nexus-cyan/20" />
            </div>

            <div className="min-h-[100px] text-sm text-nexus-silver/80 font-light leading-relaxed">
              {transcript ? (
                <p className="italic text-white border-l-2 border-nexus-violet/30 pl-3">
                  "{transcript}"
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="opacity-70">
                    Soy Daniela. Puedo gestionar tu CRM, agenda y sistemas Nexus.
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-nexus-violet-glow/40">
                    ¿En qué puedo ayudarte hoy?
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleListening}
                className={`px-6 py-2 rounded-full text-[10px] font-orbitron tracking-widest transition-all duration-500 ${
                  isListening
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-nexus-violet/10 hover:bg-nexus-violet/20 text-nexus-violet-glow border border-nexus-violet/30'
                }`}
              >
                {isListening ? '● PARAR' : '🎙️ HABLAR CON ELLA'}
              </motion.button>
              <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className={`w-1 h-1 rounded-full ${
                      isListening ? 'bg-nexus-violet-glow animate-pulse' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4">
        {/* Label visible to the left */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="px-5 py-3 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 hidden md:flex items-center gap-3 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:border-nexus-violet/30 transition-colors"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-nexus-cyan animate-pulse" />
          <span className="text-[9px] font-orbitron font-black tracking-[0.4em] text-white uppercase whitespace-nowrap">
            HABLAR CON DANIELA
          </span>
        </motion.div>

        <motion.button
          onClick={handleToggleExpand}
          whileHover={{ scale: 1.1 }}
          onMouseEnter={playHover}
          whileTap={{ scale: 0.95 }}
          className="relative w-16 h-16 rounded-full flex items-center justify-center group"
        >
          <div className="absolute inset-0 bg-linear-to-br from-nexus-violet to-nexus-blue-600 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity animate-pulse" />
          <div className="relative w-full h-full bg-black/40 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center overflow-hidden group-hover:border-nexus-violet/50 transition-colors">
            <img
              src="/images/daniela/lobby.png"
              alt="Daniela AI"
              className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
            />
            {/* HUD Orbit Ring */}
            <div className="absolute inset-0 border border-nexus-cyan/20 rounded-full scale-90" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 border-t-2 border-nexus-cyan/40 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-2 border-b-2 border-nexus-violet/30 rounded-full"
            />
          </div>
        </motion.button>
      </div>
    </div>
  );
};
