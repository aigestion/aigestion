import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Thermometer, ShieldCheck, Zap, Power, Home } from 'lucide-react';
import { NeonCard } from './NeonCard';

export const NexusHome: React.FC = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <NeonCard title="NEXUS HOME // IOT FLOOR MAP" accentColor="rgba(255, 255, 255, 0.4)" className="lg:col-span-8">
                <div className="h-80 bg-white/[0.02] rounded-[2.5rem] border border-white/5 relative flex items-center justify-center p-12 group">
                    <div className="w-full h-full border-2 border-white/10 rounded-xl relative">
                        {/* Mock Floor Plan Shapes */}
                        <div className="absolute top-0 left-0 w-1/2 h-1/2 border-r border-b border-white/5 p-4">
                            <span className="text-[8px] font-orbitron text-white/20 uppercase tracking-widest">Master Suite</span>
                        </div>
                        <div className="absolute top-1/2 left-0 w-1/3 h-1/2 border-r border-white/5 p-4">
                            <span className="text-[8px] font-orbitron text-white/20 uppercase tracking-widest">Daniela Hub</span>
                        </div>
                        {/* Interactive Nodes */}
                        <motion.div
                            whileHover={{ scale: 1.2 }}
                            className="absolute top-1/4 left-1/4 w-3 h-3 bg-nexus-cyan-glow rounded-full shadow-[0_0_15px_rgba(0,245,255,0.8)] cursor-pointer"
                        />
                        <motion.div
                            whileHover={{ scale: 1.2 }}
                            className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-nexus-violet-glow rounded-full shadow-[0_0_15px_rgba(138,43,226,0.8)] cursor-pointer"
                        />
                        <div className="absolute bottom-8 left-8 flex gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-orbitron text-white/60">
                                <Thermometer size={12} className="text-nexus-cyan-glow" /> 22.4°C
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-orbitron text-white/60">
                                <Zap size={12} className="text-nexus-gold" /> 1.2 kW/h
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 py-6 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[9px] font-orbitron tracking-widest text-nexus-cyan-glow">MODO GESTIÓN DINÁMICA ACTIVADO</span>
                    </div>
                </div>
            </NeonCard>

            <NeonCard title="QUICK CONTROLS" accentColor="rgba(0, 245, 255, 0.3)" className="lg:col-span-4">
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: 'Luces Hub', icon: Lightbulb, color: 'text-nexus-gold' },
                        { label: 'Clima Master', icon: Thermometer, color: 'text-nexus-cyan-glow' },
                        { label: 'Seguridad', icon: ShieldCheck, color: 'text-green-400' },
                        { label: 'Energía', icon: Zap, color: 'text-nexus-gold' }
                    ].map((item, i) => (
                        <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-nexus-cyan/20 transition-all cursor-pointer group text-center">
                            <item.icon size={24} className={`${item.color} mx-auto mb-4 group-hover:scale-110 transition-transform`} />
                            <p className="text-[9px] font-orbitron font-black text-white/60 uppercase">{item.label}</p>
                            <div className="mt-4 flex justify-center">
                                <div className="w-10 h-5 bg-white/5 rounded-full p-1 relative">
                                    <div className="w-3 h-3 bg-white/20 rounded-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className="col-span-2 mt-4 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-nexus-cyan/10 hover:border-nexus-cyan/30 transition-all flex items-center justify-center gap-3">
                        <Home size={16} className="text-nexus-cyan-glow" />
                        <span className="text-[10px] font-orbitron font-black tracking-widest">MODO CASA TOTAL</span>
                    </button>
                </div>
            </NeonCard>
        </div>
    );
};
