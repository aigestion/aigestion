import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { useDanielaVoice } from '../hooks/useDanielaVoice';

export const DanielaOmniWidget: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { isListening, transcript, toggleListening } = useDanielaVoice();

    return (
      <div className="fixed bottom-8 right-8 z-[9000] font-sans">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="absolute bottom-20 right-0 w-80 bg-black/60 backdrop-blur-xl p-6 rounded-3xl mb-4 border border-nexus-cyan/30 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
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
                  <p className="italic text-white border-l-2 border-nexus-cyan/30 pl-3">
                    "{transcript}"
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="opacity-70">¡Hola! Soy Daniela. Estoy aquí para ayudarte con tu negocio.</p>
                    <p className="text-[10px] uppercase tracking-widest text-nexus-cyan/40">
                      Dime algo, te escucho...
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleListening}
                  className={`px-6 py-2 rounded-full text-[10px] font-orbitron tracking-widest transition-all duration-500 ${isListening ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-nexus-cyan/10 hover:bg-nexus-cyan/20 text-nexus-cyan border border-nexus-cyan/30'}`}
                >
                  {isListening ? '● PARAR' : '🎙️ HABLAR CON ELLA'}
                </motion.button>
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`w-1 h-1 rounded-full ${isListening ? 'bg-nexus-cyan animate-pulse' : 'bg-white/10'}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-16 h-16 rounded-full flex items-center justify-center group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-nexus-violet to-nexus-cyan rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity animate-pulse" />
          <div className="relative w-full h-full bg-black/40 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center overflow-hidden group-hover:border-nexus-cyan/50 transition-colors">
            <img
              src="/images/brand/icon.png"
              alt="AI"
              className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-500"
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
    );
};
