import React from 'react';
import { motion } from 'framer-motion';

export const DanielaSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Configuration */}
        <div className="premium-glass rounded-xl p-6">
          <h3 className="text-lg font-orbitron font-bold mb-4 text-nexus-cyan-glow">
            Configuración IA
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-nexus-silver/60 block mb-2">
                Modelo Principal
              </label>
              <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
                <option>GPT-4o</option>
                <option>Claude-3.5</option>
                <option>Gemini-Pro</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-nexus-silver/60 block mb-2">Temperatura</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="0.7"
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm text-nexus-silver/60 block mb-2">
                Tokens Máximos
              </label>
              <input
                type="number"
                defaultValue="2048"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Voice Configuration */}
        <div className="premium-glass rounded-xl p-6">
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
              <input
                type="text"
                defaultValue="Bella"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-nexus-silver/60 block mb-2">Velocidad</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                defaultValue="1"
                className="w-full"
              />
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
    </div>
  );
};
