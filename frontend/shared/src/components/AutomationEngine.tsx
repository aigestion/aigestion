import React from 'react';
import { motion } from 'framer-motion';
import { Play, Settings, History, Activity, Zap, Share2 } from 'lucide-react';
import { NeonCard } from './NeonCard';

export const AutomationEngine: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <NeonCard title="N8N WORKFLOW MONITOR" accentColor="rgba(255, 100, 0, 0.4)" className="lg:col-span-2">
                    <div className="h-64 bg-black/40 rounded-[2rem] border border-white/5 relative flex items-center justify-center group overflow-hidden">
                        <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 gap-2 p-8 opacity-20 pointer-events-none">
                            {Array.from({ length: 24 }).map((_, i) => (
                                <div key={i} className="rounded-sm bg-nexus-cyan/20 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                            ))}
                        </div>
                        <div className="relative text-center">
                            <Share2 size={40} className="mx-auto mb-4 text-nexus-cyan-glow animate-pulse" />
                            <h5 className="font-orbitron text-xs tracking-[0.4em] text-white/60 mb-2 uppercase">Core Automation Flux</h5>
                            <p className="text-[9px] font-mono text-nexus-silver/40">Status: 12 Workflows Running // Latency: 45ms</p>
                        </div>
                        <div className="absolute bottom-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                <Settings size={16} />
                            </button>
                            <button className="p-3 bg-nexus-cyan/20 rounded-xl border border-nexus-cyan/30 text-nexus-cyan-glow hover:bg-nexus-cyan/40 transition-colors">
                                <Play size={16} />
                            </button>
                        </div>
                    </div>
                </NeonCard>

                <NeonCard title="TRIGGER HUB" accentColor="rgba(255, 255, 255, 0.2)">
                    <div className="space-y-4">
                        {[
                            { label: 'Sync Stock Google', status: 'READY' },
                            { label: 'Daniela AI Report', status: 'IDLE' },
                            { label: 'IOT Emergency Reset', status: 'SECURE' },
                            { label: 'n8n Cloud Backup', status: 'AUTO' }
                        ].map((trigger, i) => (
                            <button key={i} className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-nexus-cyan/30 text-left group transition-all">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-bold text-white/80">{trigger.label}</span>
                                    <span className="text-[8px] font-mono text-nexus-cyan-glow">{trigger.status}</span>
                                </div>
                                <div className="h-1 w-0 group-hover:w-full bg-nexus-cyan-glow transition-all duration-500 rounded-full" />
                            </button>
                        ))}
                    </div>
                </NeonCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'EXECUCIONES OK', value: '4,291', icon: Activity, color: 'text-green-400' },
                    { label: 'FALLOS DETECTADOS', value: '0', icon: History, color: 'text-red-400' },
                    { label: 'DANIELA TRIGGERS', value: '142', icon: Zap, color: 'text-nexus-violet-glow' },
                    { label: 'API CALLS n8n', value: '85.2k', icon: Share2, color: 'text-nexus-cyan-glow' }
                ].map((stat, i) => (
                    <div key={i} className="premium-glass p-6 rounded-3xl border-white/5 bg-linear-to-br from-white/[0.02] to-transparent">
                        <stat.icon size={16} className={`${stat.color} mb-3`} />
                        <div className="text-2xl font-orbitron font-black text-white">{stat.value}</div>
                        <span className="text-[8px] font-orbitron tracking-widest text-nexus-silver/20 uppercase">{stat.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
