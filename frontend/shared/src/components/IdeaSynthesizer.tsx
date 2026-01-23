import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Rocket, Target, ArrowRight } from 'lucide-react';
import { NeonCard } from './NeonCard';

export const IdeaSynthesizer: React.FC = () => {
    const ideas = [
        {
            title: 'Expansión IoT Vertical',
            desc: 'Detectamos un 40% de mejora si conectamos el hub a sensores de temperatura externos.',
            impact: 'ROI +12%',
            icon: Target
        },
        {
            title: 'Automatización de Stock v2',
            desc: 'Daniela sugiere pre-comprar insumos basándose en el calendario estelar de ventas.',
            impact: 'Ahorro 15%',
            icon: Rocket
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-nexus-gold rounded-full" />
                <h3 className="text-xl font-orbitron font-black text-white uppercase tracking-widest">PROPUESTAS_DE_LEGADO</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {ideas.map((idea, i) => (
                    <NeonCard key={i} title="IDEA_GENERATIVA_DANIELA" accentColor="rgba(255, 215, 0, 0.4)">
                        <div className="flex gap-6 items-start">
                            <div className="w-12 h-12 rounded-2xl bg-nexus-gold/10 flex items-center justify-center text-nexus-gold border border-nexus-gold/20">
                                <idea.icon size={24} />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-lg font-bold text-white mb-2">{idea.title}</h4>
                                <p className="text-nexus-silver/60 text-xs mb-4 leading-relaxed">{idea.desc}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-mono text-nexus-gold">{idea.impact}</span>
                                    <button className="flex items-center gap-2 text-[8px] font-orbitron font-black text-white/40 hover:text-white transition-colors uppercase">
                                        DETALLES_PROTOCOLO <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </NeonCard>
                ))}
            </div>
        </div>
    );
};
