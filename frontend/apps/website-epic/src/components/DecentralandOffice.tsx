import { motion } from 'framer-motion';
import {
  Activity,
  Box,
  Cpu,
  Compass,
  Globe,
  MapPin,
  Rocket,
  Shield,
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
      icon: <Zap className="w-5 h-5" />,
      title: 'Protocolo Neural',
      description: 'Gestión asistida por Daniela IA de grado industrial',
      color: 'from-zinc-400 to-zinc-600',
      status: 'ACTIVO',
    },
    {
      id: 2,
      icon: <Shield className="w-5 h-5" />,
      title: 'Bóveda Soberana',
      description: 'Infraestructura de seguridad cuántica local',
      color: 'from-zinc-500 to-zinc-700',
      status: 'PROTEGIDO',
    },
    {
      id: 3,
      icon: <Globe className="w-5 h-5" />,
      title: 'Nexos Globales',
      description: 'Interconexión de activos distribuidos en el tiempo real',
      color: 'from-zinc-600 to-zinc-800',
      status: 'SINCRO',
    },
    {
      id: 4,
      icon: <Cpu className="w-5 h-5" />,
      title: 'Núcleo Operativo',
      description: 'Orquestación de procesos de alta disponibilidad',
      color: 'from-zinc-700 to-zinc-900',
      status: 'OPT-ON',
    },
    {
      id: 5,
      icon: <Star className="w-5 h-5" />,
      title: 'Laboratorio Alfa',

      description: 'Investigación y desarrollo de arquitecturas futuro',
      color: 'from-zinc-300 to-zinc-500',
      status: 'INVESTIGANDO',
    },
    {
      id: 6,
      icon: <Sparkles className="w-5 h-5" />,
      title: 'Ecosistema v5.0',
      description: 'Despliegues masivos con latencia ultra-baja',
      color: 'from-zinc-500 to-zinc-800',
      status: 'MODO DIOS',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#020205] overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050508] to-black" />
        <div className="absolute inset-0 bg-[url('/images/nexus/grid.svg')] opacity-[0.03] bg-repeat" />

        {/* Floating Particles - Subtle Silver */}
        <div className="absolute top-20 left-20 w-1 h-1 bg-white/20 rounded-full animate-ping" />
        <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-nexus-cyan/20 rounded-full animate-ping animation-delay-1000" />
        <div className="absolute bottom-32 left-40 w-1 h-1 bg-white/10 rounded-full animate-ping animation-delay-2000" />

        {/* Central Glow - Deep & Minimal */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.03),transparent_70%)] blur-3xl" />
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto p-6 md:p-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            className="inline-flex items-center gap-3 mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-md">
              <Box className="w-5 h-5 text-nexus-cyan" />
            </div>
            <div className="text-left">
              <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.5em] font-orbitron opacity-40">
                CENTRO DE MANDO NEXUS
              </h3>
              <div className="text-[9px] text-nexus-cyan font-mono font-bold tracking-[0.3em] uppercase">
                SISTEMA OPERATIVO // SOBERANO v.5.0
              </div>
            </div>
          </motion.div>

          <motion.h1
            className="text-7xl md:text-9xl font-black text-white leading-tight mb-8 tracking-tighter uppercase font-orbitron"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Sede <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-nexus-silver to-white/40">
              Soberana
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-nexus-silver/60 leading-relaxed max-w-3xl mx-auto mb-8 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            "Más que una oficina, es tu embajada en la frontera digital. Un espacio dinámico donde
            celebramos eventos, reuniones estratégicas y demostraciones de IA en vivo. Ven a conocernos
            en el corazón de Decentraland."
          </motion.p>
        </div>

        {/* Stats Dashboard */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { label: 'Coordenadas', value: '-51, 114', icon: MapPin },
            { label: 'Tokens Activos', value: metaverseStatus.users, icon: Users },
            { label: 'Latencia Red', value: '0.2ms', icon: Activity },
            { label: 'Núcleo Kortex', value: 'OPERATIVO', icon: Cpu },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-6 bg-white/[0.02] rounded-2xl border border-white/[0.05] backdrop-blur-3xl hover:border-nexus-cyan/20 transition-all group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-3 mb-3">
                <stat.icon className="w-4 h-4 text-nexus-cyan opacity-40 group-hover:opacity-100 transition-opacity" />
                <span className="font-mono text-sm font-bold text-white tracking-widest leading-none">
                  {stat.value}
                </span>
              </div>
              <div className="text-[8px] text-white/20 uppercase tracking-[0.3em] font-bold">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Interactive Features Grid */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px grow bg-white/5" />
            <h2 className="text-2xl font-bold font-orbitron text-white text-center tracking-[0.4em] uppercase">
              Centro de Gobernanza
            </h2>
            <div className="h-px grow bg-white/5" />
          </div>

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
            className="relative aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-[#050508] shadow-2xl group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
          >
            {/* Minimal Grid Overlay */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            {/* 3D Scene Wrapper */}
            <div className="absolute inset-4 z-10 cursor-move rounded-2xl overflow-hidden border border-white/5 shadow-inner bg-black/40">
              <SpatialPresentation
                title="Sede Metaverso AIG"
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
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-nexus-cyan animate-pulse" />
                  Visualización Central
                </div>
                <h4 className="text-white font-bold text-2xl mb-1 tracking-tight">
                  Arquitectura Digital
                </h4>
                <p className="text-nexus-silver/40 text-xs">Interacción dimensional 3D</p>
              </div>

              {/* Central "Drag to Explore" hint */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-full flex items-center gap-4 group-hover:scale-110 transition-transform">
                <Compass className="text-nexus-cyan animate-spin-slow" size={20} />
                <span className="text-white text-[10px] font-bold uppercase tracking-[0.3em]">
                  Navegación Espacial
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
            <div className="p-8 bg-white/[0.02] rounded-3xl border border-white/[0.05] backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-sm font-bold text-white mb-8 uppercase tracking-[0.4em] font-orbitron opacity-60">
                CAPACIDADES DEL NÚCLEO
              </h3>
              <ul className="space-y-6">
                {[
                  {
                    title: 'Asistencia Cognitiva',
                    desc: 'Sincronización neuronal con Daniela IA.',
                  },
                  { title: 'Conectividad Global', desc: 'Orquestación de nodos en tiempo real.' },
                  { title: 'Activos Inmutables', desc: 'Gobernanza de infraestructura soberana.' },
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 group/item">
                    <div className="w-1 h-1 rounded-full bg-nexus-cyan mt-2 opacity-20 group-hover/item:opacity-100 transition-opacity" />
                    <div>
                      <strong className="text-white text-xs font-bold block tracking-wider mb-1 uppercase opacity-80 group-hover/item:opacity-100 transition-opacity">
                        {item.title}
                      </strong>
                      <p className="text-[10px] text-white/30 leading-relaxed font-light group-hover/item:text-white/50 transition-colors">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 bg-linear-to-br from-nexus-violet/20 to-nexus-blue-600/20 rounded-3xl border border-nexus-violet/30 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <Sparkles className="text-nexus-violet-glow animate-pulse" size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-[0.2em] font-orbitron">
                ¡Únete al Vecindario! 🚀
              </h3>
              <p className="text-sm text-nexus-silver/80 mb-6 leading-relaxed">
                ¿Buscas tu propio espacio? Alquilamos parcelas en <strong>The Sandbox</strong> para
                que lances tu proyecto de forma fácil y económica. Te ayudamos con todo el montaje.
              </p>
              <div className="flex items-center gap-4 text-xs font-bold text-nexus-cyan mb-8">
                <span>DESDE €99/MES</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>SOPORTE TÉCNICO INCLUIDO</span>
              </div>
              <motion.button
                onClick={() => (window.location.href = '#contact')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-4 bg-white text-black rounded-xl font-bold font-orbitron text-[10px] tracking-[0.4em] uppercase hover:bg-nexus-violet hover:text-white transition-all shadow-xl"
              >
                Reservar mi Sandbox
              </motion.button>
            </div>

            <div className="space-y-6">
              <motion.button
                onClick={handleEnterDecentraland}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={isExploring}
                className={`w-full px-8 py-6 bg-white/5 border border-white/10 text-white rounded-2xl flex items-center justify-center gap-4 font-orbitron font-black text-[10px] tracking-[0.4em] uppercase transition-all shadow-2xl hover:bg-nexus-cyan hover:text-white ${
                  isExploring ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isExploring ? (
                  <>
                    <div className="w-3 h-3 border border-black border-t-transparent rounded-full animate-spin" />
                    <span>Teletransportando...</span>
                  </>
                ) : (
                  <>
                    <Rocket size={14} className="opacity-40" />
                    <span>Visitar Sede en Decentraland</span>
                  </>
                )}
              </motion.button>

              <div className="text-center space-y-2">
                <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-mono">
                  SISTEMA DE NAVEGACIÓN DIMENSIONAL v5.1
                </p>
                <p className="text-[8px] text-nexus-cyan/40 uppercase tracking-[0.2em] font-mono">
                  ESTADO: ONLINE // VISITANTES BIENVENIDOS
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
