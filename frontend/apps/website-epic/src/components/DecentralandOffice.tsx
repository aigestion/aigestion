import { motion } from 'framer-motion';
import { ExternalLink, Users, MapPin, Box } from 'lucide-react';
import React from 'react';

export const DecentralandOffice: React.FC = () => {
    const handleEnterDecentraland = () => {
        window.open('https://play.decentraland.org/?position=-51%2C114', '_blank');
    };

    return (
        <div className="relative min-h-screen bg-nexus-obsidian overflow-hidden flex items-center justify-center p-6">
            {/* Background Video/Image */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
                <img
                    src="/images/dcl-thumbnail.png"
                    className="w-full h-full object-cover opacity-30 mix-blend-screen blur-sm"
                    alt="Decentraland Preview"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1),transparent_70%)]" />
            </div>

            <motion.div
                className="relative z-10 max-w-6xl w-full bg-black/60 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 shadow-2xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-nexus-violet via-nexus-cyan to-nexus-violet animate-gradient-x" />

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                                <Box className="w-5 h-5 text-nexus-violet" />
                            </div>
                            <span className="text-xs font-orbitron tracking-[0.3em] font-bold text-nexus-violet-glow uppercase">Metaverso Corporativo</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-orbitron font-black text-white mb-6 leading-tight">
                            AIGESTION <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">VIRTUAL OFFICE</span>
                        </h1>

                        <p className="text-nexus-silver/60 text-lg mb-8 leading-relaxed">
                            The official automated governance headquarters of AIGestion. Monitor system status in real-time.
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="flex items-center gap-2 mb-1 text-nexus-cyan">
                                    <MapPin size={16} />
                                    <span className="font-mono text-xs">-51, 114</span>
                                </div>
                                <span className="text-xs text-gray-400">Coordenadas Reales</span>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="flex items-center gap-2 mb-1 text-green-400">
                                    <Users size={16} />
                                    <span className="font-mono text-xs">VIVO</span>
                                </div>
                                <span className="text-xs text-gray-400">Estado del Parcel</span>
                            </div>
                        </div>

                        <motion.button
                            onClick={handleEnterDecentraland}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 rounded-2xl flex items-center gap-4 text-white font-bold tracking-wider overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                TELETRANSPORTARSE <ExternalLink size={18} />
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </motion.button>
                    </div>

                    <div className="relative h-[400px] rounded-3xl overflow-hidden border border-white/10 group shadow-2xl">
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors z-10" />
                        <img
                            src="/images/dcl-thumbnail.png"
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            alt="Decentraland Logo"
                        />

                        {/* Holographic overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)] bg-[size:100%_4px] opacity-20 pointer-events-none" />

                        <div className="absolute bottom-6 left-6 z-20">
                            <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-mono border border-white/10 text-white flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                PARCEL: -51, 114
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
