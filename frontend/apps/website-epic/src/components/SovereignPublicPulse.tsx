import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Cpu, Globe, Shield, Server } from 'lucide-react';
import { GodModeText } from './design-system/GodModeText';
import { TiltCard } from './design-system/TiltCard';

export const SovereignPublicPulse: React.FC = () => {
  const [swarmActivity, setSwarmActivity] = useState<number[]>(Array(20).fill(10)); // Initialize with non-zero

  // Simulate live swarm telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setSwarmActivity(prev => {
        const next = [...prev.slice(1), Math.max(10, Math.random() * 80 + 10)]; // Keep it lively
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const [activeNodes, setActiveNodes] = useState(124);
  const [threatsBlocked, setThreatsBlocked] = useState(8432);

  // Stats drift
  useEffect(() => {
    const statsInterval = setInterval(() => {
      setActiveNodes(prev => prev + (Math.random() > 0.7 ? 1 : Math.random() > 0.7 ? -1 : 0));
      setThreatsBlocked(prev => prev + (Math.random() > 0.6 ? 1 : 0));
    }, 3000);
    return () => clearInterval(statsInterval);
  }, []);

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Grid */}
      <div
        className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-size-[40px_40px] opacity-20"
        style={{ backgroundSize: '40px 40px' }}
      />
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-black" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Text Content */}
          <div className="flex-1 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-nexus-cyan animate-pulse shadow-[0_0_10px_#22d3ee]" />
                <span className="text-nexus-cyan font-mono text-xs tracking-[0.3em] uppercase">
                  Sovereign Intelligence Network
                </span>
                <div className="h-px bg-nexus-cyan/20 w-12" />
              </div>
              <div className="space-y-2">
                <GodModeText
                  text="EL PULSO"
                  className="text-5xl md:text-7xl font-black block"
                  effect="glitch"
                />
                <GodModeText
                  text="DEL ENJAMBRE"
                  className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-nexus-violet to-nexus-cyan block"
                  effect="neon"
                />
              </div>

              <p className="mt-8 text-nexus-silver/70 text-lg leading-relaxed font-sans max-w-xl">
                Nuestra red neuronal autónoma trabaja 24/7 protegiendo tus datos y optimizando tu
                negocio. Mientras tú descansas, el enjambre evoluciona y aprende para servirte
                mejor.
              </p>
            </motion.div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <TiltCard className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-nexus-cyan/30 transition-colors backdrop-blur-sm group">
                <div className="flex items-center gap-3 mb-2 text-nexus-silver/50 uppercase text-[10px] tracking-widest font-bold group-hover:text-nexus-cyan transition-colors">
                  <Server size={14} /> Nodos Activos
                </div>
                <div className="text-4xl font-orbitron font-bold text-white flex items-baseline gap-2">
                  {activeNodes}
                  <span className="text-[10px] text-green-500 font-mono">▲ ONLINE</span>
                </div>
              </TiltCard>

              <TiltCard className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-nexus-violet/30 transition-colors backdrop-blur-sm group">
                <div className="flex items-center gap-3 mb-2 text-nexus-silver/50 uppercase text-[10px] tracking-widest font-bold group-hover:text-nexus-violet transition-colors">
                  <Shield size={14} /> Amenazas Neutralizadas
                </div>
                <div className="text-4xl font-orbitron font-bold text-nexus-cyan flex items-baseline gap-2">
                  {threatsBlocked.toLocaleString()}
                  <span className="text-[10px] text-nexus-cyan animate-pulse font-mono">
                    ● LIVE
                  </span>
                </div>
              </TiltCard>
            </div>
          </div>

          {/* Visualization */}
          <div className="flex-1 w-full relative">
            {/* 3D Wireframe Globe simulation - or Pulse Graph */}
            <TiltCard
              tiltMaxAngleY={10}
              tiltMaxAngleX={10}
              className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl shadow-nexus-cyan/10 group"
            >
              {/* Scanline Overlay */}
              <div
                className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] pointer-events-none z-20 opacity-50"
                style={{ backgroundSize: '100% 4px, 3px 100%' }}
              />

              {/* Header HUD */}
              <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center border-b border-white/10 z-30 bg-black/40 backdrop-blur-sm">
                <div className="text-[10px] font-mono text-nexus-cyan flex items-center gap-2">
                  <Activity size={12} className="animate-pulse" />
                  TELEM_STREAM_V2 :: EU-WEST-1
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                  <div className="w-2 h-2 rounded-full bg-nexus-cyan animate-pulse shadow-[0_0_8px_#22d3ee]" />
                </div>
              </div>

              {/* Data Visualization Area */}
              <div className="absolute inset-0 pt-16 px-6 pb-20 flex items-end justify-between gap-1 z-10">
                {swarmActivity.map((val, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-nexus-cyan/20 border-t border-nexus-cyan/60 relative group-hover:bg-nexus-cyan/40 transition-colors duration-500 rounded-t-sm"
                    initial={{ height: '5%' }}
                    animate={{ height: `${val}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {/* Bar Glow */}
                    <div className="absolute top-0 left-0 right-0 h-[4px] bg-nexus-cyan shadow-[0_0_15px_#22d3ee] opacity-80" />
                  </motion.div>
                ))}
              </div>

              {/* Footer HUD */}
              <div className="absolute bottom-0 left-0 right-0 h-12 border-t border-white/5 bg-white/5 flex items-center px-6 justify-between text-[9px] font-mono text-nexus-silver/40 z-30">
                <span>LATENCY: 12ms</span>
                <span className="text-nexus-cyan">ENCRYPTION: QUANTUM-READY</span>
              </div>

              {/* Central Globe/Cortex Icon Effect */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-30">
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 border border-nexus-cyan/20 rounded-full animate-[spin_10s_linear_infinite]" />
                  <div className="absolute inset-4 border border-nexus-violet/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                  <div className="absolute inset-0 bg-nexus-cyan/5 blur-3xl rounded-full animate-pulse" />
                  <Globe
                    size={120}
                    className="text-white/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    strokeWidth={0.5}
                  />
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
};
