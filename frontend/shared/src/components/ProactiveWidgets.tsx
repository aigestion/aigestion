import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Zap, MessageSquare } from 'lucide-react';

export const ProactiveWidgets: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 lg:hidden">
      {/* Widget Daniela */}
      <motion.div
        whileHover={{ y: -5 }}
        className="p-6 rounded-[2rem] bg-linear-to-br from-nexus-violet/20 to-black/40 border border-white/5 backdrop-blur-xl relative overflow-hidden group"
      >
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-nexus-violet/10 text-nexus-violet-glow">
                <Brain size={20} />
            </div>
            <span className="text-[8px] font-orbitron text-white/20 uppercase tracking-widest">IA_WIDGET</span>
        </div>
        <p className="text-[10px] font-mono text-white/60 italic">"Sugerencia: Optimizar Nodo 4 para ahorro energético."</p>
        <div className="absolute top-0 right-0 w-32 h-32 bg-nexus-violet/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>

      {/* Widget Metrics */}
      <motion.div
        whileHover={{ y: -5 }}
        className="p-6 rounded-[2rem] bg-linear-to-br from-nexus-cyan/20 to-black/40 border border-white/5 backdrop-blur-xl"
      >
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-nexus-cyan/10 text-nexus-cyan-glow">
                <TrendingUp size={20} />
            </div>
            <span className="text-[8px] font-orbitron text-white/20 uppercase tracking-widest">PERF_WIDGET</span>
        </div>
        <div className="flex items-end gap-2">
            <span className="text-2xl font-black font-orbitron">94.2%</span>
            <span className="text-[8px] text-green-400 mb-2">+2.4%</span>
        </div>
      </motion.div>
    </div>
  );
};
