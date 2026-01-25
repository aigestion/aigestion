import { motion } from 'framer-motion';
import React, { useState } from 'react';

export const ROISimulator: React.FC = () => {
    const [monthlyRevenue, setMonthlyRevenue] = useState(50000);
    const [automationLevel, setAutomationLevel] = useState(50);

    const projectedSavings = (monthlyRevenue * (automationLevel / 100)) * 0.4;
    const projectedGrowth = (monthlyRevenue * (automationLevel / 100)) * 0.25;
    const totalImpact = projectedSavings + projectedGrowth;

    return (
        <div className="premium-glass p-8 rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-nexus-violet/10 blur-[80px] pointer-events-none" />

            <h3 className="text-xl font-orbitron font-bold text-white mb-8 flex items-center gap-3">
                <span className="text-2xl">📈</span> SIMULADOR DE IMPACTO
            </h3>

            <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div>
                        <div className="flex justify-between text-xs font-orbitron text-nexus-silver/60 mb-2 uppercase tracking-widest">
                            <span>Facturación Mensual</span>
                            <span className="text-white">${monthlyRevenue.toLocaleString()}</span>
                        </div>
                        <input
                            type="range"
                            min="10000"
                            max="500000"
                            step="5000"
                            value={monthlyRevenue}
                            onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-nexus-cyan"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between text-xs font-orbitron text-nexus-silver/60 mb-2 uppercase tracking-widest">
                            <span>Nivel de Automatización</span>
                            <span className="text-white">{automationLevel}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={automationLevel}
                            onChange={(e) => setAutomationLevel(Number(e.target.value))}
                            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-nexus-violet"
                        />
                    </div>
                </div>

                <div className="flex flex-col justify-center space-y-6">
                    <div className="bg-black/40 p-6 rounded-2xl border border-nexus-cyan/20">
                        <span className="text-[10px] font-orbitron tracking-widest text-nexus-cyan block mb-2">PROYECCIÓN MENSUAL</span>
                        <div className="text-4xl font-orbitron font-black text-white glow-text-cyan">
                            +${totalImpact.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <span className="text-[9px] font-mono text-gray-400 block">AHORRO COSTOS</span>
                            <span className="text-lg font-bold text-green-400">+${projectedSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                        <div className="text-center">
                            <span className="text-[9px] font-mono text-gray-400 block">NUEVOS INGRESOS</span>
                            <span className="text-lg font-bold text-nexus-violet">+${projectedGrowth.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
