import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, Activity, ShieldAlert, Zap, X } from 'lucide-react';

interface WarRoomOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export const WarRoomOverlay: React.FC<WarRoomOverlayProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[10000] bg-red-600/10 backdrop-blur-3xl flex flex-col p-12 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

                    <header className="flex justify-between items-center mb-12 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-red-500 animate-ping absolute opacity-20" />
                            <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center text-white border border-red-400/30 relative z-10">
                                <AlertOctagon size={32} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-orbitron font-black text-white tracking-widest uppercase mb-1">WAR ROOM STATUS: CRITICO</h1>
                                <p className="text-red-400 font-mono text-xs tracking-[0.5em] animate-pulse">PROTOCOLO_S.O.S_ACTIVO // NIVEL_ALPHA</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                            <X size={24} className="text-white" />
                        </button>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 flex-1">
                        <div className="lg:col-span-8 grid grid-cols-2 gap-8">
                            {[
                                { label: 'Node-01 Intrusion', status: 'BLOCKING', color: 'text-red-500' },
                                { label: 'Sync Latency', status: '142ms', color: 'text-orange-500' },
                                { label: 'n8n Overflow', status: 'WARNING', color: 'text-yellow-500' },
                                { label: 'Satellite Link', status: 'STABLE', color: 'text-green-500' }
                            ].map((alert, i) => (
                                <div key={i} className="p-8 rounded-[2.5rem] bg-black/40 border border-white/5 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[10px] font-orbitron text-white/40 uppercase tracking-widest">{alert.label}</span>
                                        <Activity size={16} className={alert.color} />
                                    </div>
                                    <div className={`text-2xl font-orbitron font-black ${alert.color} mt-4`}>{alert.status}</div>
                                </div>
                            ))}
                            <div className="col-span-2 p-8 rounded-[3rem] bg-red-600/20 border border-red-500/30 flex items-center justify-between">
                                <div>
                                    <h4 className="text-xl font-orbitron font-black text-white mb-2 uppercase">PLAN DE ACCIÓN_DANIELA</h4>
                                    <p className="text-red-400/80 text-xs font-mono">EJECUTANDO CIERRE DE PUERTOS EN CLOUD-REGION-1...</p>
                                </div>
                                <Zap size={40} className="text-red-500 animate-pulse" />
                            </div>
                        </div>

                        <div className="lg:col-span-4 p-8 rounded-[3rem] bg-black/40 border border-white/5 relative overflow-hidden">
                             <h4 className="text-[10px] font-orbitron text-white/40 uppercase tracking-widest mb-12">RED_RADAR_GEOLOCALIZADA</h4>
                             <div className="aspect-square rounded-full border border-red-500/20 relative flex items-center justify-center">
                                 <div className="w-1 h-3/4 bg-linear-to-t from-transparent to-red-500 absolute top-0 animate-[spin_4s_linear_infinite] origin-bottom" />
                                 <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]"
                                 />
                                 <div className="absolute top-1/4 right-1/4 w-2 h-2 rounded-full bg-nexus-cyan-glow" />
                                 <div className="absolute bottom-1/3 left-1/4 w-2 h-2 rounded-full bg-nexus-gold" />
                             </div>
                        </div>
                    </div>

                    <div className="mt-12 flex justify-center gap-6 relative z-10">
                        <button className="px-12 py-5 rounded-2xl bg-white text-black font-orbitron font-black text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all uppercase">
                            SOLUCIONAR_TODO_DANIELA
                        </button>
                        <button className="px-12 py-5 rounded-2xl bg-red-600/20 border border-red-500/50 text-red-500 font-orbitron font-black text-[10px] tracking-widest hover:bg-red-600/40 transition-all uppercase">
                            MODO_SILENCIO_TOTAL
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
