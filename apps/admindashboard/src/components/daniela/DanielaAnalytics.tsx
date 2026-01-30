import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

export const DanielaAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="premium-glass rounded-xl p-6">
          <h3 className="text-lg font-orbitron font-bold mb-4 text-nexus-cyan-glow">
            Métricas de Rendimiento
          </h3>
          <div className="space-y-4">
            {[
              {
                metric: 'Tiempo de Respuesta',
                value: '120ms',
                trend: '-15%',
                status: 'good',
              },
              { metric: 'Precisión IA', value: '99.7%', trend: '+2%', status: 'good' },
              { metric: 'Conversaciones/Hora', value: '147', trend: '+23%', status: 'good' },
              { metric: 'Uso CPU', value: '34%', trend: '-5%', status: 'normal' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-nexus-silver/60">{item.metric}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-orbitron font-black text-white">
                    {item.value}
                  </span>
                  <span
                    className={`text-xs font-mono ${
                      item.status === 'good' ? 'text-green-400' : 'text-yellow-400'
                    }`}
                  >
                    {item.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emotional Analysis */}
        <div className="premium-glass rounded-xl p-6">
          <h3 className="text-lg font-orbitron font-bold mb-4 text-nexus-violet-glow">
            Análisis Emocional
          </h3>
          <div className="space-y-4">
            {[
              { emotion: 'Positivo', percentage: 68, color: 'bg-green-500' },
              { emotion: 'Neutral', percentage: 24, color: 'bg-blue-500' },
              { emotion: 'Preocupado', percentage: 5, color: 'bg-yellow-500' },
              { emotion: 'Excitado', percentage: 3, color: 'bg-purple-500' },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-nexus-silver/60">{item.emotion}</span>
                  <span className="text-sm font-orbitron font-black text-white">
                    {item.percentage}%
                  </span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${item.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Global Activity */}
      <div className="premium-glass rounded-xl p-6">
        <h3 className="text-lg font-orbitron font-bold mb-4 text-nexus-gold">
          Actividad Global
        </h3>
        <div className="h-48 flex items-center justify-center">
          <div className="text-center">
            <Globe className="w-16 h-16 text-nexus-gold mx-auto mb-4" />
            <p className="text-nexus-silver/60">
              Visualización de actividad global en tiempo real
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
