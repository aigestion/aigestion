import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Activity, Users, Zap } from 'lucide-react';

export const DanielaStats: React.FC = () => {
  const stats = [
    {
      label: 'Conversaciones Activas',
      value: '24',
      icon: <Users className="w-5 h-5" />,
      color: 'text-nexus-cyan-glow',
    },
    {
      label: 'Procesamiento IA',
      value: '98.2%',
      icon: <Brain className="w-5 h-5" />,
      color: 'text-nexus-violet-glow',
    },
    {
      label: 'Respuesta Promedio',
      value: '120ms',
      icon: <Zap className="w-5 h-5" />,
      color: 'text-nexus-gold',
    },
    {
      label: 'Satisfacción',
      value: '4.9/5',
      icon: <Activity className="w-5 h-5" />,
      color: 'text-green-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/5 border border-white/10 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className={stat.color}>{stat.icon}</div>
            <div className="text-xs font-mono text-nexus-silver/40">LIVE</div>
          </div>
          <div className="text-2xl font-orbitron font-black text-white mb-1">{stat.value}</div>
          <div className="text-xs text-nexus-silver/60">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
};
