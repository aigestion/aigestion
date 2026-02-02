import React from 'react';
import { motion } from 'framer-motion';

export const MetaverseSection: React.FC = () => {
    return (
        <section className="py-40 bg-nexus-obsidian text-white text-center relative overflow-hidden">
            <div className="grain-overlay" />

            {/* Immersive Background */}
            <div className="absolute inset-0 bg-radial-at-center from-nexus-cyan/10 via-transparent to-transparent opacity-50 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-nexus-cyan/20 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <motion.h2
                        className="text-5xl md:text-7xl font-orbitron font-black mb-12 text-nexus-cyan-glow text-glow-cyan tracking-tight"
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        METAVERSO CORPORATIVO
                    </motion.h2>

                    <div className="premium-glass p-12 rounded-[2rem] border-white/5 max-w-3xl mx-auto mb-16 backdrop-blur-3xl overflow-visible">
                        <p className="text-xl md:text-2xl text-nexus-silver/70 font-light leading-relaxed tracking-wide">
                            Trasciende los límites físicos de tu empresa. <br />
                            <span className="text-white font-medium">Sincroniza tus operaciones</span> en un entorno virtual persistente, diseñado para la colaboración de alto nivel.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-enterprise px-12! py-5! rounded-full! font-orbitron tracking-[0.2em] text-lg hover:shadow-[0_0_40px_rgba(0,245,255,0.4)] transition-all"
                        >
                            EXPLORAR NODOS
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="premium-glass px-12 py-5 rounded-full font-orbitron tracking-[0.2em] text-lg text-nexus-silver hover:text-white border-white/10 transition-all"
                        >
                            ACCESO VR
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            {/* Floating Cyber Elements */}
            <motion.div
                className="absolute top-1/4 -right-12 w-64 h-64 bg-nexus-cyan/5 blur-3xl rounded-full"
                animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -50, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
                className="absolute bottom-1/4 -left-12 w-96 h-96 bg-nexus-violet/5 blur-3xl rounded-full"
                animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, 60, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            />
        </section>
    );
};
