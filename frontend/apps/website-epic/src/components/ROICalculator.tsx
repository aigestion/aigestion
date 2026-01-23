import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const ROICalculator: React.FC = () => {
    const [monthlyRevenue, setMonthlyRevenue] = useState(10000);
    const [staffCount, setStaffCount] = useState(5);

    const operationalCost = staffCount * 2500;
    const aiSavings = operationalCost * 0.7;
    const efficiencyBoost = monthlyRevenue * 0.3;
    const totalImpact = aiSavings + efficiencyBoost;

    return (
        <section className="py-32 bg-nexus-obsidian text-white relative overflow-hidden" id="roi-calculator">
            <div className="absolute inset-0 bg-radial-at-top from-nexus-violet/5 via-transparent to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-4xl md:text-6xl font-orbitron font-black mb-8 text-glow-cyan text-nexus-cyan-glow">
                            CALCULADOR DE IMPACTO ROI
                        </h2>
                        <p className="text-nexus-silver/60 text-lg mb-12 font-light max-w-xl">
                            Descubre cómo la Arquitectura de Inteligencia Soberana puede optimizar tus recursos y escalar tu facturación de forma exponencial.
                        </p>

                        <div className="space-y-10">
                            <div className="space-y-4">
                                <div className="flex justify-between text-xs font-orbitron tracking-[0.2em] text-nexus-silver/40 uppercase">
                                    <span>Facturación Mensual</span>
                                    <span className="text-white">${monthlyRevenue.toLocaleString()}</span>
                                </div>
                                <input
                                    type="range"
                                    min="1000"
                                    max="500000"
                                    step="1000"
                                    value={monthlyRevenue}
                                    onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                                    className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-nexus-cyan-glow"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between text-xs font-orbitron tracking-[0.2em] text-nexus-silver/40 uppercase">
                                    <span>Personal Operativo</span>
                                    <span className="text-white">{staffCount} Agentes</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    step="1"
                                    value={staffCount}
                                    onChange={(e) => setStaffCount(Number(e.target.value))}
                                    className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-nexus-violet-glow"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="premium-glass p-12 rounded-[2.5rem] border-white/5 relative bg-linear-to-br from-white/2 to-transparent">
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-nexus-cyan/10 blur-3xl animate-pulse" />

                        <div className="space-y-12">
                            <div>
                                <span className="text-[10px] font-orbitron tracking-[0.4em] text-nexus-cyan-glow uppercase block mb-2">Impacto Total Estimado</span>
                                <div className="text-6xl font-orbitron font-black text-white text-glow">
                                    ${totalImpact.toLocaleString()}
                                    <span className="text-xs text-nexus-silver/40 font-normal tracking-normal ml-3">/mes</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
                                <div>
                                    <span className="text-[9px] font-orbitron tracking-[0.3em] text-nexus-silver/40 uppercase block mb-2">Ahorro Operativo</span>
                                    <div className="text-2xl font-orbitron font-bold text-nexus-cyan-glow">
                                        +70%
                                    </div>
                                    <span className="text-[10px] text-nexus-silver/30 font-mono mt-1 block">(-${aiSavings.toLocaleString()})</span>
                                </div>
                                <div>
                                    <span className="text-[9px] font-orbitron tracking-[0.3em] text-nexus-silver/40 uppercase block mb-2">Escalabilidad</span>
                                    <div className="text-2xl font-orbitron font-bold text-nexus-violet-glow">
                                        +30%
                                    </div>
                                    <span className="text-[10px] text-nexus-silver/30 font-mono mt-1 block">(+${efficiencyBoost.toLocaleString()})</span>
                                </div>
                            </div>

                            <button className="btn-enterprise w-full py-5 rounded-2xl font-orbitron tracking-[0.3em] text-xs uppercase group">
                                DESCARGAR REPORTE NEURONAL
                                <motion.span
                                    className="inline-block ml-3"
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                >
                                    →
                                </motion.span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
