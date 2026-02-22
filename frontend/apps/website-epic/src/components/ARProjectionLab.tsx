import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Scan, BoxSelect, Maximize2, Info, QrCode, Smartphone, X, Zap } from 'lucide-react';
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
    category: 'HARDWARE',
  },
  {
    id: 'drone',
    name: 'AIG Sentinel Drone',
    description: 'Vigilancia y mantenimiento automatizado en entornos XR.',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb',
    posterUrl: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.png',
    category: 'INFRASTRUCTURE',
  },
  {
    id: 'satellite',
    name: 'Neural Satellite',
    description: 'Nodo orbital para la sincronización global de inteligencia soberana.',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb',
    posterUrl: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.png',
    category: 'ORBITAL',
  },
];

export const ARProjectionLab: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<ARAsset>(AR_ASSETS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleProjection = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  const handleAssetSelect = (asset: ARAsset) => {
    setIsLoading(true);
    setSelectedAsset(asset);
    setTimeout(() => setIsLoading(false), 1200); // Simulate model loading
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-12 items-center lg:items-start">
      {/* Left: 3D Visualization */}
      <div className="w-full lg:w-2/3 relative">
        <AnimatePresence mode="wait">
          {!isScanning ? (
            <motion.div
              key={selectedAsset.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "relative aspect-video rounded-3xl overflow-hidden premium-glass border border-white/10 shadow-2xl",
                isLoading && "skeleton-glitch"
              )}
            >
              {!isLoading && (
                <SpatialPresentation
                  modelUrl={selectedAsset.modelUrl}
                  posterUrl={selectedAsset.posterUrl}
                  title={selectedAsset.name}
                />
              )}
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <Zap className="text-nexus-cyan animate-pulse" size={48} />
                  <span className="text-[10px] font-orbitron tracking-[0.3em] text-nexus-cyan/60 animate-pulse">CARGANDO GEOMETRÍA SOBERANA...</span>
                </div>
              )}

              {/* Context Overlay */}
              <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none">
                <span className="bg-nexus-cyan text-black text-[10px] font-bold px-3 py-1 rounded-full self-start shadow-cyan-glow/50 uppercase tracking-tighter">
                  ACTIVO LISTO
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
              className="relative aspect-video rounded-3xl overflow-hidden premium-glass border border-nexus-cyan/40 flex flex-col items-center justify-center bg-nexus-cyan/10"
            >
              <div className="relative">
                <motion.div
                  className="w-32 h-32 border-2 border-nexus-cyan/40 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <Scan className="w-12 h-12 text-nexus-cyan absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              </div>
              <div className="mt-8 text-nexus-cyan font-orbitron tracking-[0.5em] text-[10px] uppercase">
                CALIBRANDO ESPACIO REAL...
              </div>
              <motion.div
                className="absolute left-0 right-0 h-1 bg-nexus-cyan/60 shadow-[0_0_25px_rgba(6,182,212,1)]"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right: Controls & Selection */}
      <div className="w-full lg:w-1/3 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <BoxSelect className="w-8 h-8 text-nexus-cyan" />
            <h3 className="text-3xl md:text-4xl font-orbitron font-black text-white uppercase tracking-tighter">
              LABORATORIO DE <span className="text-nexus-cyan">PROYECCIÓN</span>
            </h3>
          </div>
          <p className="text-nexus-silver/70 text-sm leading-relaxed">
            Selecciona un activo de la infraestructura Nexus y proyéctalo en tu entorno físico para
            análisis detallado.
          </p>
        </div>

        {/* Asset Grid */}
        <div className="grid grid-cols-1 gap-4">
          {AR_ASSETS.map(asset => (
            <button
              key={asset.id}
              onClick={() => handleAssetSelect(asset)}
              className={cn(
                "p-4 rounded-2xl border transition-all flex items-start gap-4 text-left group",
                selectedAsset.id === asset.id
                  ? 'bg-cyan-400/10 border-cyan-400/50 shadow-[0_0_20px_rgba(0,245,255,0.1)]'
                  : 'bg-white/5 border-white/10 hover:border-white/30'
              )}
            >
              <div
                className={`p-3 rounded-xl transition-all ${selectedAsset.id === asset.id ? 'bg-nexus-cyan text-black shadow-cyan-glow' : 'bg-white/5 text-white/50 group-hover:text-white group-hover:bg-white/10'}`}
              >
                <Box className="w-5 h-5 transition-transform group-hover:scale-110" />
              </div>
              <div>
                <div className="text-sm font-bold text-white mb-1">{asset.name}</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest">
                  {asset.category}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Asset Details */}
        <div className="premium-glass p-8 rounded-3xl border border-white/5 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Info size={80} className="text-nexus-cyan" />
          </div>
          <div className="flex items-center gap-2 text-nexus-cyan relative z-10">
            <Info className="w-4 h-4" />
            <span className="text-[10px] font-orbitron font-bold uppercase tracking-[0.2em]">
              ESPECIFICACIONES DEL ACTIVO
            </span>
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

        <div className="flex gap-4">
          <motion.button
            onClick={handleProjection}
            disabled={isScanning || isLoading}
            className="flex-[2] py-6 rounded-full premium-glass border border-nexus-cyan/40 text-nexus-cyan font-orbitron font-bold tracking-[0.3em] flex items-center justify-center gap-3 group hover:bg-nexus-cyan hover:text-black transition-all hover:shadow-cyan-glow uppercase text-xs"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Maximize2 className="w-5 h-5 group-hover:scale-125 transition-transform" />
            {isScanning ? 'ESTABLECIENDO ANCLAJE...' : 'PROYECTAR EN MI ENTORNO'}
          </motion.button>

          <motion.button
            onClick={() => setShowQR(!showQR)}
            className={cn(
              "flex-1 py-6 rounded-full border flex items-center justify-center gap-2 group transition-all",
              showQR
                ? "bg-nexus-cyan border-nexus-cyan text-black shadow-cyan-glow"
                : "premium-glass border-white/10 text-white hover:border-nexus-cyan/50"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showQR ? <X size={20} /> : <QrCode size={20} className="group-hover:scale-110 transition-transform" />}
            <span className="text-[10px] font-orbitron font-bold uppercase tracking-widest hidden xl:inline">BRIDGE</span>
          </motion.button>
        </div>

        {/* QR Bridge Overlay */}
        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-6 rounded-3xl premium-glass border border-nexus-cyan/30 flex flex-col items-center gap-6 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-nexus-cyan/5 pointer-events-none" />
              <div className="flex items-center gap-3 text-nexus-cyan z-10 w-full">
                <Smartphone size={18} />
                <span className="text-[10px] font-orbitron font-black tracking-widest uppercase">AR MOBILE BRIDGE</span>
              </div>

              <div className="w-48 h-48 bg-white p-4 rounded-3xl shadow-2xl relative z-10">
                {/* Simulated QR Code with high-end look */}
                <div className="w-full h-full border-[12px] border-black rounded-xl flex items-center justify-center overflow-hidden">
                  <div className="grid grid-cols-4 grid-rows-4 gap-2 w-full h-full p-2 bg-white">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className={cn("rounded-sm", Math.random() > 0.4 ? "bg-black" : "bg-white")} />
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 border-2 border-nexus-cyan/40 rounded-3xl animate-pulse" />
              </div>

              <div className="text-center space-y-2 z-10">
                <p className="text-[10px] text-white font-bold uppercase tracking-tight">Escanea para sincronizar Nexus</p>
                <p className="text-[9px] text-nexus-silver/50 leading-tight">Acceso instantáneo a visualización espacial sin aplicaciones adicionales.</p>
              </div>

              <div className="w-full pt-4 border-t border-white/5 z-10 flex justify-center">
                <div className="flex items-center gap-2 px-3 py-1 bg-nexus-cyan/10 rounded-full border border-nexus-cyan/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-nexus-cyan animate-pulse" />
                  <span className="text-[8px] font-mono text-nexus-cyan uppercase">Link seguro SSL/PQC</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
