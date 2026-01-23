import React from 'react';
import { motion } from 'framer-motion';

interface OracleChartProps {
  title: string;
  data: number[];
  labels: string[];
  accentColor?: string;
}

export const OracleChart: React.FC<OracleChartProps> = ({ title, data, labels, accentColor = '#00f5ff' }) => {
  const max = Math.max(...data) * 1.2;
  const prediction = data[data.length - 1] * (1 + (Math.random() * 0.2 - 0.05));

  return (
    <div className="relative p-6 rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden group">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h5 className="text-[10px] font-orbitron tracking-widest text-nexus-silver/40 uppercase mb-1">{title}</h5>
          <span className="text-xl font-orbitron font-black text-white">$ {data[data.length - 1].toLocaleString()}</span>
        </div>
        <div className="text-right">
          <span className="text-[8px] font-mono text-nexus-cyan-glow tracking-[0.2em] uppercase block">AI_PROJECTION</span>
          <span className="text-sm font-orbitron font-bold text-nexus-cyan-glow/60">$ {prediction.toFixed(2)}</span>
        </div>
      </div>

      <div className="h-40 flex items-end gap-2 relative">
        {data.map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(val / max) * 100}%` }}
              className="w-full bg-white/10 rounded-t-lg group-hover/bar:bg-white/20 transition-colors relative"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20" />
            </motion.div>
            <span className="text-[7px] font-mono text-white/20 uppercase">{labels[i]}</span>
          </div>
        ))}

        {/* Neural Prediction Line */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full overflow-visible">
            <motion.path
              d={`M ${data.length * 10} 40 L ${(data.length + 1) * 10} 20`}
              stroke={accentColor}
              strokeWidth="1"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity }}
              className="opacity-40"
            />
          </svg>
        </div>
      </div>

      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/[0.01] to-transparent h-1 opacity-0 group-hover:animate-scan-y" />
    </div>
  );
};
