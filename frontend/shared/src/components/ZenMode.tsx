import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, X, Zap } from 'lucide-react';

interface ZenModeProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ZenMode: React.FC<ZenModeProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[20000] bg-[#010103] flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Fractal Background Simulation */}
                    <div className="absolute inset-0 opacity-20">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    scale: [1, 1.5, 1],
                                    rotate: [0, 360],
                                    opacity: [0.1, 0.3, 0.1]
                                }}
                                transition={{
                                    duration: 10 + Math.random() * 10,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                className="absolute border border-white/10 rounded-full"
                                style={{
                                    width: `${20 + i * 5}%`,
                                    height: `${20 + i * 5}%`,
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)'
                                }}
                            />
                        ))}
                    </div>

                    <div className="relative z-10 text-center space-y-12">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="w-32 h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto"
                        >
                            <Wind size={48} className="text-white/20" />
                        </motion.div>

                        <div className="space-y-4">
                            <h2 className="text-4xl font-orbitron font-black text-white tracking-[1em] uppercase opacity-40">ZEN_MODE</h2>
                            <p className="text-nexus-silver/20 font-mono text-sm tracking-widest italic animate-pulse">
                                TODO_ESTÁ_EN_ORDEN. RESPIRA.
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="px-12 py-5 rounded-full border border-white/5 text-[10px] font-orbitron font-black text-white/20 hover:text-white hover:border-white/20 transition-all uppercase tracking-widest"
                        >
                            REGRESAR_AL_NUCLEO
                        </button>
                    </div>

                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white/10 italic text-[10px] font-mono">
                         <Zap size={14} />
                         SISTEMA_STABLE // 0_ALERTAS_DETECTADAS
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
