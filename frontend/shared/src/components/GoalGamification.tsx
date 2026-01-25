import { motion } from 'framer-motion';
import React from 'react';

export const GoalGamification: React.FC = () => {
    const goals = [
        { id: 1, title: 'Optimización Neuronal', progress: 85, color: 'bg-nexus-cyan', icon: '🧠' },
        { id: 2, title: 'Expansión de Nodos', progress: 42, color: 'bg-nexus-violet', icon: '🌐' },
        { id: 3, title: 'Eficiencia Energética', progress: 92, color: 'bg-green-400', icon: '⚡' },
    ];

    return (
        <div className="premium-glass p-8 rounded-3xl border border-white/5 h-full">
            <h3 className="text-xl font-orbitron font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-2xl">🏆</span> OBJETIVOS QUANTUM
            </h3>

            <div className="space-y-6">
                {goals.map((goal, index) => (
                    <div key={goal.id} className="relative group">
                        <div className="flex justify-between items-end mb-2">
                            <span className="font-orbitron text-xs tracking-wider text-nexus-silver group-hover:text-white transition-colors">
                                {goal.icon} {goal.title}
                            </span>
                            <span className="font-mono text-xs text-white">{goal.progress}%</span>
                        </div>

                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full ${goal.color} shadow-[0_0_10px_currentColor]`}
                                initial={{ width: 0 }}
                                animate={{ width: `${goal.progress}%` }}
                                transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
                            />
                        </div>

                        {goal.progress >= 90 && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -right-2 -top-2 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] shadow-[0_0_10px_rgba(250,204,21,0.8)]"
                            >
                                ⭐
                            </motion.div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-[10px] text-gray-500 font-mono block">NIVEL ACTUAL</span>
                        <span className="text-2xl font-black font-orbitron text-white">MASTER</span>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-nexus-gold/30 flex items-center justify-center bg-nexus-gold/10">
                        <span className="text-xl">👑</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
