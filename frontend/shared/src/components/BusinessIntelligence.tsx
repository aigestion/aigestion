import React from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, CheckSquare, TrendingUp, BarChart, Plus } from 'lucide-react';
import { NeonCard } from './NeonCard';

export const BusinessIntelligence: React.FC = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <NeonCard title="CRM // NEXUS RELATIONSHIPS" accentColor="rgba(168, 85, 247, 0.4)" className="lg:col-span-2">
                <div className="space-y-4">
                    {[
                        { name: 'Corp Ventures S.A.', deal: '$142k', status: 'CERRADO', rep: 'Daniela AI' },
                        { name: 'Global Tech Hub', deal: '$85k', status: 'NEGOCIANDO', rep: 'Daniela AI' },
                        { name: 'Quantum Core', deal: '$210k', status: 'PENDIENTE', rep: 'Daniela AI' }
                    ].map((deal, i) => (
                        <div key={i} className="flex justify-between items-center p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-nexus-violet/10 flex items-center justify-center text-nexus-violet-glow border border-nexus-violet/20">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <h6 className="text-[12px] font-bold text-white uppercase tracking-tight">{deal.name}</h6>
                                    <p className="text-[10px] text-nexus-silver/40 font-mono">Deal Hub: {deal.rep}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-orbitron font-bold text-white">{deal.deal}</p>
                                <span className="text-[8px] font-orbitron text-green-400 tracking-widest">{deal.status}</span>
                            </div>
                        </div>
                    ))}
                    <button className="w-full py-4 rounded-2xl border border-dashed border-white/10 text-nexus-silver/20 hover:text-nexus-violet-glow hover:border-nexus-violet-glow/40 transition-all flex items-center justify-center gap-2 mt-4 text-[10px] font-orbitron tracking-widest">
                        <Plus size={14} /> NUEVA OPORTUNIDAD CRM
                    </button>
                </div>
            </NeonCard>

            <NeonCard title="TODO // NEXUS PRODUCTIVITY" accentColor="rgba(255, 255, 255, 0.2)">
                <div className="space-y-6">
                    <div className="flex gap-2">
                        {['TODO', 'COMPLETED'].map(tab => (
                            <button key={tab} className={`flex-1 py-1.5 rounded-lg text-[9px] font-orbitron tracking-widest ${tab === 'TODO' ? 'bg-white text-black font-black' : 'text-nexus-silver/20 uppercase'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="space-y-4">
                        {[
                            { task: 'Verificar despliegue n8n', priority: 'ALTA' },
                            { task: 'Update Google Workspace API', priority: 'MEDIA' },
                            { task: 'Sync Daniela Hub IoT', priority: 'BAJA' }
                        ].map((todo, i) => (
                            <div key={i} className="p-5 rounded-[2rem] bg-white/[0.03] border border-white/5 group relative overflow-hidden">
                                <div className="flex items-start gap-4">
                                    <div className="w-5 h-5 rounded-lg border border-white/20 group-hover:border-nexus-violet-glow transition-colors cursor-pointer mt-1" />
                                    <div className="flex-1">
                                        <p className="text-xs text-white/80 leading-snug">{todo.task}</p>
                                        <span className={`text-[8px] font-mono mt-2 block ${todo.priority === 'ALTA' ? 'text-red-400' : 'text-nexus-silver/40'}`}>PRIORIDAD {todo.priority}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </NeonCard>
        </div>
    );
};
