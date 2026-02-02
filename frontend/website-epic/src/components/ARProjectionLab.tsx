
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Scan, BoxSelect, Maximize2, Info } from 'lucide-react';
import SpatialPresentation from './SpatialPresentation';

interface ARAsset {
  id: string;
  name: string;
  description: string;
  modelUrl: string;
  posterUrl: string;
  category: string;
}

const AR_ASSETS: ARAsset[] = [
  {
    id: 'core-server',
    name: 'Nexus Nucleus v1',
    description: 'El corazón de AIGestion. Procesamiento neuronal distribuido de alto rendimiento.',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', // Placeholder for actual assets
    posterUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.png',
    category: 'HARDWARE'
  },
  {
    id: 'drone',
    name: 'AIG Sentinel Drone',
    description: 'Vigilancia y mantenimiento automatizado en entornos XR.',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb',
    posterUrl: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.png',
    category: 'INFRASTRUCTURE'
  },
  {
    id: 'satellite',
    name: 'Neural Satellite',
    description: 'Nodo orbital para la sincronización global de inteligencia soberana.',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb',
    posterUrl: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.png',
    category: 'ORBITAL'
  }
];

export const ARProjectionLab: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<ARAsset>(AR_ASSETS[0]);
  const [isScanning, setIsScanning] = useState(false);

  const handleProjection = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-12 items-center lg:items-start">
      {/* Left: 3D Visualization */}
      <div className="w-full lg:w-2/3 relative">
        <AnimatePresence mode="wait">
          {!isScanning ? (
            <motion.div
              key={selectedAsset.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative aspect-video rounded-3xl overflow-hidden glass-morphism border border-white/10"
            >
              <SpatialPresentation
                modelUrl={selectedAsset.modelUrl}
                posterUrl={selectedAsset.posterUrl}
                title={selectedAsset.name}
              />

              {/* Context Overlay */}
              <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none">
                <span className="bg-cyan-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full self-start">
                  ASSET READY
                </span>
                <span className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em]">
                  ID: {selectedAsset.id.toUpperCase()}
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative aspect-video rounded-3xl overflow-hidden glass-morphism border border-cyan-400/30 flex flex-col items-center justify-center bg-cyan-400/5"
            >
              <div className="relative">
                <motion.div
                  className="w-32 h-32 border-2 border-cyan-400/40 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <Scan className="w-12 h-12 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <div className="mt-8 text-cyan-400 font-orbitron tracking-[0.4em] text-xs">
                CALIBRANDO ESPACIO REAL...
              </div>
              <motion.div
                className="absolute left-0 right-0 h-1 bg-cyan-400/50 shadow-[0_0_15px_#00f5ff]"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right: Controls & Selection */}
      <div className="w-full lg:w-1/3 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <BoxSelect className="w-6 h-6 text-cyan-400" />
             <h3 className="text-2xl font-orbitron font-bold text-white uppercase tracking-tighter">LABORATORIO DE PROYECCIÓN</h3>
          </div>
          <p className="text-nexus-silver/70 text-sm leading-relaxed">
            Selecciona un activo de la infraestructura Nexus y proyéctalo en tu entorno físico para análisis detallado.
          </p>
        </div>

        {/* Asset Grid */}
        <div className="grid grid-cols-1 gap-4">
          {AR_ASSETS.map((asset) => (
            <button
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-4 text-left group
                ${selectedAsset.id === asset.id
                  ? 'bg-cyan-400/10 border-cyan-400/50 shadow-[0_0_20px_rgba(0,245,255,0.1)]'
                  : 'bg-white/5 border-white/10 hover:border-white/30'}`}
            >
              <div className={`p-3 rounded-xl transition-colors ${selectedAsset.id === asset.id ? 'bg-cyan-400 text-black' : 'bg-white/5 text-white/50 group-hover:text-white'}`}>
                <Box className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white mb-1">{asset.name}</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest">{asset.category}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Asset Details */}
        <div className="glass-morphism p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400">
            <Info className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Detalles del Activo</span>
          </div>
          <p className="text-xs text-nexus-silver/90 leading-relaxed italic">
            "{selectedAsset.description}"
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <div>
              <div className="text-[10px] text-white/40 uppercase mb-1">Escala</div>
              <div className="text-xs font-bold text-white text-glow">1:1 REAL</div>
            </div>
            <div>
              <div className="text-[10px] text-white/40 uppercase mb-1">Tracking</div>
              <div className="text-xs font-bold text-white text-glow">SPATIAL+</div>
            </div>
          </div>
        </div>

        <motion.button
          onClick={handleProjection}
          disabled={isScanning}
          className="w-full py-6 rounded-full glass-morphism border border-cyan-400/50 text-cyan-400 font-orbitron font-bold tracking-[0.2em] flex items-center justify-center gap-3 group hover:bg-cyan-400 hover:text-black transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Maximize2 className="w-5 h-5 group-hover:scale-125 transition-transform" />
          {isScanning ? 'DIAGNOSTICANDO...' : 'PROYECTAR EN MI MAPA'}
        </motion.button>
      </div>
    </div>
  );
};
