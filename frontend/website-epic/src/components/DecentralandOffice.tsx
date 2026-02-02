import { motion } from 'framer-motion';
import {
  Activity,
  Box,
  Cpu,
  Gamepad2,
  Globe,
  MapPin,
  Rocket,
  Sparkles,
  Star,
  Users,
  Zap,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import SpatialPresentation from './SpatialPresentation';

export const DecentralandOffice: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [metaverseStatus, setMetaverseStatus] = useState({
    online: true,
    users: 12,
    performance: 95,
    aiStatus: 'active',
    visitors: 1247,
    rooms: 8,
    events: 3,
    nfts: 156,
  });

  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const [isExploring, setIsExploring] = useState(false);

  useEffect(() => {
    // Simulate real-time updates from metaverse with more data
    const interval = setInterval(() => {
      setMetaverseStatus(prev => ({
        ...prev,
        users: Math.max(8, prev.users + Math.floor(Math.random() * 5) - 2),
        visitors: prev.visitors + Math.floor(Math.random() * 3),
        performance: Math.max(
          85,
          Math.min(100, prev.performance + Math.floor(Math.random() * 10) - 5)
        ),
        events: Math.max(1, prev.events + Math.floor(Math.random() * 2) - 1),
        nfts: prev.nfts + Math.floor(Math.random() * 2),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleEnterDecentraland = () => {
    setIsExploring(true);
    setTimeout(() => {
      window.open('https://play.decentraland.org/?position=-51%2C114', '_blank');
      setIsExploring(false);
    }, 1000);
  };

  const features = [
    {
      id: 1,
      icon: <Gamepad2 className="w-6 h-6" />,
      title: '🎮 Sala de Juegos IA',
      description: 'Juega con Daniela IA en realidad virtual',
      color: 'from-purple-500 to-pink-500',
      status: 'ACTIVO',
    },
    {
      id: 2,
      icon: <Rocket className="w-6 h-6" />,
      title: '🚀 Laboratorio de Innovación',
      description: 'Experimenta con tecnología del futuro',
      color: 'from-blue-500 to-cyan-500',
      status: 'DISPONIBLE',
    },
    {
      id: 3,
      icon: <Globe className="w-6 h-6" />,
      title: '🌍 Centro de Reuniones',
      description: 'Conecta con personas de todo el mundo',
      color: 'from-green-500 to-emerald-500',
      status: 'ABIERTO',
    },
    {
      id: 4,
      icon: <Zap className="w-6 h-6" />,
      title: '⚡ Galería NFT',
      description: 'Colecciona arte digital único',
      color: 'from-yellow-500 to-orange-500',
      status: `${metaverseStatus.nfts} PIEZAS`,
    },
    {
      id: 5,
      icon: <Star className="w-6 h-6" />,
      title: '🌟 Cine Inmersivo',
      description: 'Películas y experiencias en 360°',
      color: 'from-red-500 to-pink-500',
      status: 'PROYECTANDO',
    },
    {
      id: 6,
      icon: <Sparkles className="w-6 h-6" />,
      title: '✨ Tienda Mágica',
      description: 'Compra items exclusivos del metaverso',
      color: 'from-indigo-500 to-purple-500',
      status: 'NUEVO',
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/50 to-black" />
        <div className="absolute inset-0 bg-[url('/images/nexus/grid.svg')] opacity-10 bg-repeat" />

        {/* Floating Particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400 rounded-full animate-ping" />
        <div className="absolute top-40 right-32 w-3 h-3 bg-blue-400 rounded-full animate-ping animation-delay-1000" />
        <div className="absolute bottom-32 left-40 w-2 h-2 bg-cyan-400 rounded-full animate-ping animation-delay-2000" />
        <div className="absolute top-60 right-20 w-4 h-4 bg-pink-400 rounded-full animate-ping animation-delay-3000" />

        {/* Central Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(138,43,226,0.2),transparent_60%)] blur-3xl animate-pulse-slow" />
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto p-6 md:p-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center border-2 border-white/20 shadow-lg shadow-purple-500/30">
              <Box className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider">
                🌐 Oficina Virtual Mágica
              </h3>
              <div className="text-xs text-gray-400 font-mono">
                ESTADO: ✅ SUPER ACTIVA // V.5.0 DIOS
              </div>
            </div>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl font-black text-white leading-[0.9] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            AIGESTION <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 animate-gradient-flow">
              METAVERSE HQ 🚀
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            🎮 ¡Bienvenido a la oficina más cool del metaverso! Aquí puedes jugar con Daniela IA,
            explorar mundos virtuales y conocer gente de todo el planeta. ¡Como un videojuego!
          </motion.p>
        </div>

        {/* Stats Dashboard */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30 backdrop-blur-sm hover:scale-105 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-lg font-bold text-purple-300">-51, 114</span>
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">
              📍 Coordenadas Secretas
            </div>
            <div className="text-xs text-purple-400 mt-1">🗺️ Encuéntranos!</div>
          </div>

          <div className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-500/30 backdrop-blur-sm hover:scale-105 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-lg font-bold text-green-300">
                {metaverseStatus.users}
              </span>
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">👥 Amigos Online</div>
            <div className="text-xs text-green-400 mt-1">🎮 ¡Juega con ellos!</div>
          </div>

          <div className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-500/30 backdrop-blur-sm hover:scale-105 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <Activity className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-lg font-bold text-blue-300">
                {metaverseStatus.performance}%
              </span>
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">
              ⚡ Velocidad Súper Rápida
            </div>
            <div className="text-xs text-blue-400 mt-1">🚀 Como un cohete</div>
          </div>

          <div className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl border border-yellow-500/30 backdrop-blur-sm hover:scale-105 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <Cpu className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-lg font-bold text-yellow-300">
                {metaverseStatus.aiStatus.toUpperCase()}
              </span>
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">
              🧠 Daniela IA Activa
            </div>
            <div className="text-xs text-yellow-400 mt-1">💬 ¡Habla con ella!</div>
          </div>
        </motion.div>

        {/* Interactive Features Grid */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center text-white mb-8">
            🎮 ¡Explora Nuestros Salones Mágicos!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                className={`p-6 rounded-2xl border backdrop-blur-sm cursor-pointer transition-all ${
                  selectedFeature === feature.id
                    ? 'bg-white/20 border-white/40 scale-105'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105'
                }`}
                style={{
                  backgroundImage: `linear-gradient(135deg, ${feature.color
                    .split(' ')[0]
                    .replace('from-', 'rgba(')
                    .replace('to-', ', ')}, ${feature.color
                    .split(' ')[1]
                    .replace('to-', 'rgba(')
                    .replace(')', ', ')}, 0.1))`,
                }}
                onClick={() =>
                  setSelectedFeature(selectedFeature === feature.id ? null : feature.id)
                }
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${feature.color}`}
                  >
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">{feature.title}</h3>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">
                      {feature.status}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">{feature.description}</p>

                {selectedFeature === feature.id && (
                  <motion.div
                    className="mt-4 p-3 bg-white/10 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <p className="text-xs text-gray-400">
                      ✨ ¡Este lugar está increíble! {feature.description.split('.')[0]} y mucho
                      más.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content: 3D Viewer and Actions */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 3D Visualization */}
          <motion.div
            className="relative aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden border-2 border-white/20 bg-black/60 shadow-2xl"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            {/* 3D Scene Wrapper */}
            <div className="absolute inset-0 z-10 cursor-move">
              <SpatialPresentation
                title="AIG MetaVerse HQ"
                modelUrl="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
                posterUrl="/images/dcl-thumbnail.png"
              />
            </div>

            {/* Interactive Overlay UI */}
            <div
              className={`absolute inset-0 z-20 pointer-events-none transition-all duration-500 ${
                isHovering ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/50 border border-purple-500/30 text-purple-300 text-xs font-bold tracking-widest uppercase mb-3 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  🎮 VISTA EN VIVO
                </div>
                <h4 className="text-white font-bold text-2xl mb-1">🏰 Nuestro Castillo Virtual</h4>
                <p className="text-gray-300 text-sm">Arrastra para explorar en 3D</p>
              </div>

              {/* Central "Drag to Explore" hint */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md border border-white/20 px-6 py-4 rounded-full flex items-center gap-3">
                <Gamepad2 className="text-white/80 animate-bounce" size={24} />
                <span className="text-white/80 text-sm font-bold uppercase tracking-widest">
                  🎮 Arrastra para explorar
                </span>
              </div>
            </div>

            {/* Grid Overlay for Tech feel */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:30px_30px] opacity-30 pointer-events-none" />
          </motion.div>

          {/* Actions and Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="p-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl border border-purple-500/30 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-4">🎪 ¿Qué Espera?</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">🎮</span>
                  <div>
                    <strong className="text-white">Juegos con IA:</strong> Juega con Daniela IA en
                    realidad virtual
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">👥</span>
                  <div>
                    <strong className="text-white">Amigos del mundo:</strong> Conoce gente de todos
                    los países
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">🎨</span>
                  <div>
                    <strong className="text-white">Arte digital:</strong> Colecciona NFTs únicos y
                    especiales
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400 mt-1">🚀</span>
                  <div>
                    <strong className="text-white">Tecnología futurista:</strong> Experimenta cosas
                    del futuro
                  </div>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <motion.button
                onClick={handleEnterDecentraland}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isExploring}
                className={`w-full px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center gap-3 text-white font-bold text-lg tracking-wider shadow-lg shadow-purple-900/30 hover:shadow-purple-500/50 transition-all ${
                  isExploring ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                }`}
              >
                {isExploring ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>🚀 Abriendo Portal...</span>
                  </>
                ) : (
                  <>
                    <Rocket size={24} />
                    <span>🎮 ¡ENTRAR AL MUNDO MÁGICO!</span>
                  </>
                )}
              </motion.button>

              <div className="text-center text-sm text-gray-400">
                <p>
                  💡 <strong>Tip:</strong> Usa tu mouse para explorar el edificio en 3D
                </p>
                <p className="mt-1">
                  🌟 {metaverseStatus.visitors.toLocaleString()} personas ya visitaron hoy
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
