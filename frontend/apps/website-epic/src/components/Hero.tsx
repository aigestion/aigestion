import React from 'react';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Video Background Placeholder */}
            <div className="absolute inset-0 z-0 bg-black">
                {/* In a real scenario, we would use <video src="/videos/hero.mp4" autoPlay muted loop /> */}
                <div className="absolute inset-0 bg-linear-to-b from-nexus-obsidian/40 via-transparent to-nexus-obsidian z-10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-nexus-violet)_0%,transparent_70%)] opacity-20" />

                {/* Animated Noise/Glow as fallback for video */}
                <motion.div
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-10"
                />
            </div>

            {/* Hero Content */}
            <div className="relative z-20 text-center px-6 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-8xl font-orbitron font-bold tracking-tighter mb-6">
                        <span className="text-white">TRANSFORMACIÓN</span><br />
                        <span className="text-nexus-cyan text-glow">NEURONAL</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-nexus-silver/80 font-sans max-w-2xl mx-auto mb-10 leading-relaxed">
                        Soberanía digital escalable para empresas que lideran el futuro.
                        Arquitectura de IA integrada en el borde del metaverso.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <button className="group relative px-10 py-4 bg-nexus-violet text-white font-orbitron tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95">
                            <span className="relative z-10 uppercase">Iniciar Expansión</span>
                            <div className="absolute inset-0 bg-linear-to-r from-nexus-cyan to-nexus-violet opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>

                        <button className="px-10 py-4 border border-white/20 hover:border-nexus-cyan transition-colors font-orbitron tracking-widest uppercase hover:bg-white/5">
                            Ver Ecosistema
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Down Arrow Animation */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
            >
                <div className="w-px h-12 bg-linear-to-b from-nexus-cyan to-transparent mx-auto" />
            </motion.div>
        </section>
    );
};
