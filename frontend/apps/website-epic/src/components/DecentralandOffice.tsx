import { motion } from 'framer-motion';
import { Box, ExternalLink, MapPin, Shield, Users, Wifi } from 'lucide-react';
import React, { useState } from 'react';
import SpatialPresentation from './SpatialPresentation';

export const DecentralandOffice: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);

  const handleEnterDecentraland = () => {
    window.open('https://play.decentraland.org/?position=-51%2C114', '_blank');
  };

  return (
    <div className="relative min-h-screen bg-nexus-obsidian overflow-hidden flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-nexus-obsidian/90 to-black" />
        <div className="absolute inset-0 bg-[url('/images/nexus/grid.svg')] opacity-20 bg-repeat" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(138,43,226,0.1),transparent_70%)] blur-3xl animate-pulse-slow" />
      </div>

      <motion.div
        className="relative z-10 max-w-7xl w-full bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Decorative Top Line with Scan Effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-transparent via-nexus-cyan to-transparent w-1/3"
            animate={{ x: ['-100%', '300%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Info & Stats */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-nexus-violet/10 rounded-xl flex items-center justify-center border border-nexus-violet/30">
                <Box className="w-6 h-6 text-nexus-violet-glow" />
              </div>
              <div>
                <h3 className="text-xs font-orbitron tracking-[0.3em] font-bold text-nexus-violet-glow uppercase">
                  Metaverso Corporativo
                </h3>
                <div className="text-[10px] text-gray-400 font-mono">ESTADO: ONLINE // V.3.0.1</div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-orbitron font-black text-white leading-[0.9]">
              AIGESTION <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-cyan via-white to-nexus-violet animate-gradient-flow">
                VIRTUAL HQ
              </span>
            </h1>

            <p className="text-nexus-silver/70 text-lg leading-relaxed max-w-md">
              La sede de gobernanza automatizada. Supervisa el estado global de la red, asiste a
              reuniones holográficas y gestiona activos desde el metaverso.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-2 mb-2 text-nexus-cyan">
                  <MapPin size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="font-mono text-sm font-bold text-glow">-51, 114</span>
                </div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  Coordenadas DCL
                </span>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-2 mb-2 text-green-400">
                  <Users size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="font-mono text-sm font-bold text-glow">12 ACTIVOS</span>
                </div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  Usuarios Online
                </span>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-2 mb-2 text-purple-400">
                  <Wifi size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="font-mono text-sm font-bold text-glow">10 Gbps</span>
                </div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  Ancho de Banda Neural
                </span>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-2 mb-2 text-yellow-400">
                  <Shield size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="font-mono text-sm font-bold text-glow">NIVEL 5</span>
                </div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  Seguridad Perimetral
                </span>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <motion.button
                onClick={handleEnterDecentraland}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-8 py-5 bg-gradient-to-r from-nexus-violet to-purple-600 rounded-full flex items-center justify-center gap-3 text-white font-bold tracking-wider shadow-lg shadow-purple-900/30 hover:shadow-purple-500/50 transition-shadow"
              >
                <ExternalLink size={20} />
                ENTRAR AL MUNDO
              </motion.button>
            </div>
          </div>

          {/* Right Column: 3D Visualization */}
          <div
            className="relative aspect-square lg:aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/50 shadow-2xl"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* 3D Scene Wrapper */}
            <div className="absolute inset-0 z-10 cursor-move">
              <SpatialPresentation
                title="AIG Headquarters"
                modelUrl="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
                posterUrl="/images/dcl-thumbnail.png"
              />
            </div>

            {/* Interactive Overlay UI */}
            <div
              className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-500 ${isHovering ? 'opacity-0' : 'opacity-100'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/30 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold tracking-widest uppercase mb-2 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Live Preview
                </div>
                <h4 className="text-white font-orbitron text-xl">Vista Aérea del Campus</h4>
              </div>

              {/* Central "Drag to Explore" hint */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full flex items-center gap-3">
                <Box className="text-white/80 animate-bounce" size={20} />
                <span className="text-white/80 text-xs font-bold uppercase tracking-widest">
                  Arrastra para explorar 3D
                </span>
              </div>
            </div>

            {/* Grid Overlay for "Tech" feel */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
