import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, FileText, Globe, Cloud, Map as MapIcon } from 'lucide-react';
import { NeonCard } from './NeonCard';

export const GoogleServiceHub: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <NeonCard title="GOOGLE MAPS // NEURAL VIEW" accentColor="rgba(0, 245, 255, 0.4)">
                <div className="h-48 bg-white/5 rounded-2xl relative overflow-hidden border border-white/10 group cursor-crosshair">
                    <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/-74.006,40.7128,12/400x300?access_token=pk.placeholder')] bg-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-linear-to-t from-nexus-obsidian via-transparent to-transparent" />
                    <div className="absolute top-4 right-4 flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-nexus-cyan-glow animate-ping" />
                        <span className="text-[8px] font-orbitron text-nexus-cyan-glow tracking-widest uppercase">Live Node-NY</span>
                    </div>
                </div>
            </NeonCard>

            <NeonCard title="WORKSPACE // PREVIEW" accentColor="rgba(168, 85, 247, 0.4)">
                <div className="space-y-3">
                    {[
                        { icon: Mail, label: 'Email Urgente', desc: 'Daniela: Proyección ROI Q1', time: '2m' },
                        { icon: Calendar, label: 'Google Meet', desc: 'Sync Ecosistema IoT', time: '15:00' },
                        { icon: FileText, label: 'Docs', desc: 'Especificación n8n Core', time: '1h' }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                            <item.icon size={16} className="text-nexus-violet-glow" />
                            <div className="flex-1">
                                <p className="text-[10px] font-bold text-white">{item.label}</p>
                                <p className="text-[9px] text-nexus-silver/40 truncate">{item.desc}</p>
                            </div>
                            <span className="text-[8px] font-mono text-nexus-silver/20">{item.time}</span>
                        </div>
                    ))}
                </div>
            </NeonCard>

            <NeonCard title="CLOUD STATUS" accentColor="rgba(255, 215, 0, 0.4)">
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-orbitron text-nexus-silver/40 px-2 py-1 rounded-md bg-white/5">Compute Engine</span>
                        <div className="text-right">
                            <p className="text-2xl font-orbitron font-black text-white">12%</p>
                            <p className="text-[8px] text-green-400 font-mono tracking-widest">NORMAL</p>
                        </div>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '12%' }} className="h-full bg-nexus-gold" />
                    </div>
                    <div className="flex gap-4 pt-2">
                        <div className="flex-1 p-2 rounded-lg bg-white/2 text-center">
                            <Cloud size={14} className="mx-auto mb-1 opacity-40" />
                            <span className="text-[8px] font-mono text-nexus-silver/40 underline">RECURSOS</span>
                        </div>
                        <div className="flex-1 p-2 rounded-lg bg-white/2 text-center">
                            <Globe size={14} className="mx-auto mb-1 opacity-40" />
                            <span className="text-[8px] font-mono text-nexus-silver/40 underline">REGIONES</span>
                        </div>
                    </div>
                </div>
            </NeonCard>
        </div>
    );
};
