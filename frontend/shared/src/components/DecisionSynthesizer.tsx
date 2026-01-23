import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Target, AlertTriangle, ChevronRight, X } from 'lucide-react';
import { useSound } from '../hooks/useSound';

interface Scenario {
  id: string;
  title: string;
  impact: string;
  probability: string;
  recommendation: string;
}

interface DecisionSynthesizerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DecisionSynthesizer: React.FC<DecisionSynthesizerProps> = ({ isOpen, onClose }) => {
  const { playWuaw } = useSound();

  const scenarios: Scenario[] = [
    {
      id: '1',
      title: 'Escalado Preventivo',
      impact: '+24% Eficiencia',
      probability: '82%',
      recommendation: 'Activar Nodos Secundarios en Región-EU West.'
    },
    {
      id: '2',
      title: 'Optimización de Costos',
      impact: '-15% Gasto Cloud',
      probability: '95%',
      recommendation: 'Migrar instancias Idle a Spot-Instances.'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0 }}
            className="w-full max-w-2xl bg-[#010103] border border-nexus-cyan/20 rounded-[3rem] p-12 relative overflow-hidden shadow-[0_0_100px_rgba(0,245,255,0.1)]"
          >
            <button onClick={onClose} className="absolute top-10 right-10 text-white/20 hover:text-white transition-colors">
              <X size={24} />
            </button>

            <div className="mb-12">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-nexus-cyan/10 flex items-center justify-center text-nexus-cyan-glow border border-nexus-cyan/20">
                  <Zap size={24} className="animate-pulse" />
                </div>
                <h3 className="text-2xl font-orbitron font-black tracking-widest text-white uppercase">DANIELA_DECISION_ENGINE</h3>
              </div>
              <p className="text-nexus-silver/40 font-mono text-xs italic">
                Sintetizando variables de mercado e infraestructura... Análisis completo.
              </p>
            </div>

            <div className="space-y-6">
              {scenarios.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.2 }}
                  className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-nexus-cyan/30 transition-all group cursor-pointer"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-orbitron font-black text-nexus-cyan-glow tracking-[0.3em] uppercase">{s.title}</span>
                    <span className="px-3 py-1 rounded-full bg-nexus-cyan/5 border border-nexus-cyan/20 text-[8px] font-mono text-nexus-cyan-glow">PROB: {s.probability}</span>
                  </div>
                  <h4 className="text-white text-lg font-bold mb-2">{s.impact}</h4>
                  <p className="text-nexus-silver/60 text-xs mb-6 leading-relaxed">
                    {s.recommendation}
                  </p>
                  <button className="flex items-center gap-2 text-white/40 group-hover:text-nexus-cyan-glow transition-colors text-[10px] font-orbitron tracking-widest uppercase">
                    EJECUTAR PROTOCOLO <ChevronRight size={14} />
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
               <button onClick={onClose} className="px-12 py-4 rounded-2xl bg-white text-black font-orbitron font-black text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all uppercase">
                  REGRESAR AL COMANDO
               </button>
            </div>

            {/* Background Glow */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-nexus-cyan/5 blur-[80px] rounded-full pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
