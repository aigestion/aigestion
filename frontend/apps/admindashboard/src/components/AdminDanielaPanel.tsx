import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DanielaConversationPanel } from '@shared/components/DanielaConversationPanel';
import { Brain, Activity, Users, Zap, Shield, Globe } from 'lucide-react';

export const AdminDanielaPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'conversation' | 'analytics' | 'settings'>('conversation');

  const stats = [
    { label: 'Conversaciones Activas', value: '24', icon: <Users className="w-5 h-5" />, color: 'text-nexus-cyan-glow' },
    { label: 'Procesamiento IA', value: '98.2%', icon: <Brain className="w-5 h-5" />, color: 'text-nexus-violet-glow' },
    { label: 'Respuesta Promedio', value: '120ms', icon: <Zap className="w-5 h-5" />, color: 'text-nexus-gold' },
    { label: 'Satisfacción', value: '4.9/5', icon: <Activity className="w-5 h-5" />, color: 'text-green-400' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-orbitron font-black text-white mb-2">
            PANEL DE CONTROL <span className="text-nexus-cyan-glow">DANIELA</span>
          </h2>
          <p className="text-nexus-silver/60 font-mono text-sm">
            Gestión avanzada de asistente IA futurista
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
            <span className="text-green-400 text-sm font-orbitron font-black">SISTEMA ACTIVO</span>
          </div>
          <div className="px-4 py-2 bg-nexus-cyan/10 border border-nexus-cyan/20 rounded-full">
            <span className="text-nexus-cyan-glow text-sm font-orbitron font-black">MODO ADMIN</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
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
              <div className={stat.color}>
                {stat.icon}
              </div>
              <div className="text-xs font-mono text-nexus-silver/40">LIVE</div>
            </div>
            <div className="text-2xl font-orbitron font-black text-white mb-1">
              {stat.value}
            </div>
            <div className="text-xs text-nexus-silver/60">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        {[
          { id: 'conversation', label: 'Conversación', icon: <Brain className="w-4 h-4" /> },
          { id: 'analytics', label: 'Analítica', icon: <Activity className="w-4 h-4" /> },
          { id: 'settings', label: 'Configuración', icon: <Shield className="w-4 h-4" /> }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 font-orbitron font-black text-sm transition-all border-b-2 ${
              activeTab === tab.id
                ? 'text-nexus-cyan-glow border-nexus-cyan-glow'
                : 'text-nexus-silver/60 border-transparent hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'conversation' && (
          <motion.div
            key="conversation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-[600px]"
          >
            <DanielaConversationPanel />
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Metrics */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-orbitron font-bold mb-4 text-nexus-cyan-glow">
                  Métricas de Rendimiento
                </h3>
                <div className="space-y-4">
                  {[
                    { metric: 'Tiempo de Respuesta', value: '120ms', trend: '-15%', status: 'good' },
                    { metric: 'Precisión IA', value: '99.7%', trend: '+2%', status: 'good' },
                    { metric: 'Conversaciones/Hora', value: '147', trend: '+23%', status: 'good' },
                    { metric: 'Uso CPU', value: '34%', trend: '-5%', status: 'normal' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-nexus-silver/60">{item.metric}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-orbitron font-black text-white">{item.value}</span>
                        <span className={`text-xs font-mono ${
                          item.status === 'good' ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          {item.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emotional Analysis */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-orbitron font-bold mb-4 text-nexus-violet-glow">
                  Análisis Emocional
                </h3>
                <div className="space-y-4">
                  {[
                    { emotion: 'Positivo', percentage: 68, color: 'bg-green-500' },
                    { emotion: 'Neutral', percentage: 24, color: 'bg-blue-500' },
                    { emotion: 'Preocupado', percentage: 5, color: 'bg-yellow-500' },
                    { emotion: 'Excitado', percentage: 3, color: 'bg-purple-500' }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-nexus-silver/60">{item.emotion}</span>
                        <span className="text-sm font-orbitron font-black text-white">{item.percentage}%</span>
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
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
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
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Configuration */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-orbitron font-bold mb-4 text-nexus-cyan-glow">
                  Configuración IA
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-nexus-silver/60 block mb-2">Modelo Principal</label>
                    <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
                      <option>GPT-4o</option>
                      <option>Claude-3.5</option>
                      <option>Gemini-Pro</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-nexus-silver/60 block mb-2">Temperatura</label>
                    <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="w-full" />
                  </div>
                  <div>
                    <label className="text-sm text-nexus-silver/60 block mb-2">Tokens Máximos</label>
                    <input type="number" defaultValue="2048" className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" />
                  </div>
                </div>
              </div>

              {/* Voice Configuration */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-orbitron font-bold mb-4 text-nexus-violet-glow">
                  Configuración Voz
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-nexus-silver/60 block mb-2">Proveedor Voz</label>
                    <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
                      <option>ElevenLabs</option>
                      <option>Google TTS</option>
                      <option>Azure Speech</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-nexus-silver/60 block mb-2">Voice ID</label>
                    <input type="text" defaultValue="Bella" className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="text-sm text-nexus-silver/60 block mb-2">Velocidad</label>
                    <input type="range" min="0.5" max="2" step="0.1" defaultValue="1" className="w-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* System Controls */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-orbitron font-bold mb-4 text-nexus-gold">
                Controles del Sistema
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 font-orbitron font-black hover:bg-green-500/20 transition-colors"
                >
                  Reiniciar Sistema
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 font-orbitron font-black hover:bg-yellow-500/20 transition-colors"
                >
                  Limpiar Caché
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 font-orbitron font-black hover:bg-red-500/20 transition-colors"
                >
                  Modo Mantenimiento
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
