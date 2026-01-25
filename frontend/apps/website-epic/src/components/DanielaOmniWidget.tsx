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
                            <div className="w-2 h-2 rounded-full bg-nexus-cyan animate-pulse" />
                            <span className="text-[10px] font-orbitron tracking-widest text-nexus-cyan uppercase">Daniela Core v2.4</span>
                        </div>

                        <div className="min-h-[100px] text-sm text-gray-300">
                            {transcript ? (
                                <p className="italic text-white">"{transcript}"</p>
                            ) : (
                                <p className="opacity-50">Hola, soy Daniela. ¿Quieres ver una demo personalizada?</p>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                            <button
                                onClick={toggleListening}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                            >
                                {isListening ? '● ESCUCHANDO' : '🎙️ HABLAR'}
                            </button>
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
                <div className="relative w-full h-full bg-black/40 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center overflow-hidden">
                    <img src="/images/brand/icon.png" alt="AI" className="w-10 h-10 object-contain" />
                    <div className="absolute inset-0 border-2 border-transparent border-t-nexus-cyan rounded-full animate-spin duration-3000" />
                </div>
            </motion.button>
        </div>
    );
};
