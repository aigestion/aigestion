import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Box,
  Layers,
  ArrowRight,
  ExternalLink,
  Ruler,
  DraftingCompass,
  Link2,
} from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { NexusCard } from './design-system/NexusCard';
import { NexusStatusBadge } from './design-system/NexusStatusBadge';
import { SpotlightWrapper } from './design-system/SpotlightWrapper';

type MetaverseMode = 'hq' | 'real-estate';

export const MetaverseSection: React.FC = () => {
  const { setIsContactModalOpen } = useAppContext();
  const [activeTab, setActiveTab] = useState<MetaverseMode>('hq');
  const navigate = useNavigate();

  // Live Bridge Status — simulated telemetry (mirrors TelemetryBridge in the DCL parcel)
  const [bridgeStats, setBridgeStats] = useState({
    users: 3,
    latency: 18,
    aiLoad: 72,
    health: 'OPTIMAL' as 'OPTIMAL' | 'WARNING' | 'CRITICAL',
  });
  useEffect(() => {
    const interval = setInterval(() => {
      const users = Math.floor(1 + Math.abs(Math.sin(Date.now() * 0.0001)) * 6);
      const latency = Math.floor(12 + Math.abs(Math.sin(Date.now() * 0.00015)) * 40);
      const aiLoad = Math.floor(55 + Math.sin(Date.now() * 0.00008) * 35);
      const health = aiLoad > 88 ? 'CRITICAL' : aiLoad > 75 ? 'WARNING' : 'OPTIMAL';
      setBridgeStats({ users, latency, aiLoad, health });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-40 bg-nexus-obsidian text-white relative overflow-hidden" id="metaverse">
      <SpotlightWrapper>
        {/* Architectural Background Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
          <div className="absolute top-0 left-1/4 w-px h-full bg-linear-to-b from-transparent via-nexus-cyan to-transparent">
            <div className="w-full h-20 bg-linear-to-b from-transparent via-nexus-cyan to-transparent animate-scanner-line opacity-50" />
          </div>
          <div className="absolute top-0 right-1/4 w-px h-full bg-linear-to-b from-transparent via-nexus-violet to-transparent">
            <div className="w-full h-20 bg-linear-to-b from-transparent via-nexus-violet to-transparent animate-scanner-line opacity-50 [animation-delay:2s]" />
          </div>
          <div className="absolute top-1/3 left-0 w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent overflow-hidden">
            <div className="w-40 h-full bg-linear-to-r from-transparent via-white to-transparent animate-data-flow" />
          </div>
          <div className="absolute bottom-1/3 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent overflow-hidden">
            <div className="w-60 h-full bg-linear-to-r from-transparent via-nexus-cyan to-transparent animate-data-flow [animation-delay:1.5s]" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section Header */}
          <motion.div
            className="text-center mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 border border-white/10 rounded-full bg-white/5 backdrop-blur-md">
              <Box className="w-4 h-4 text-nexus-cyan animate-pulse" />
              <span className="text-xs font-orbitron tracking-[0.3em] text-white/80 uppercase">
                Sovereign Bridge | Infraestructura Virtual
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-orbitron font-black text-white mb-6 tracking-tight">
              ARQUITECTURA{' '}
              <span className="kinetic-text bg-linear-to-r from-nexus-cyan to-nexus-violet bg-clip-text text-transparent">
                PERSISTENTE
              </span>
            </h2>
            <p className="text-xl text-nexus-silver/60 max-w-2xl mx-auto font-light leading-relaxed">
              Extienda su presencia corporativa a los distritos financieros digitales más
              exclusivos. Nexo de conexión entre el mundo físico y el{' '}
              <span className="text-white border-b border-nexus-cyan/30">espacio sintético</span>.
            </p>
          </motion.div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-16">
            <div className="p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex relative">
              {/* Gliding Background */}
              <motion.div
                className="absolute top-1 bottom-1 bg-white/10 rounded-full"
                initial={false}
                animate={{
                  left: activeTab === 'hq' ? '4px' : '50%',
                  width: 'calc(50% - 4px)',
                  x: activeTab === 'hq' ? 0 : 0, // Adjust if needed
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />

              <button
                onClick={() => setActiveTab('hq')}
                className={`relative z-10 px-8 py-3 rounded-full text-sm font-orbitron tracking-widest transition-colors ${activeTab === 'hq' ? 'text-white' : 'text-nexus-silver/50 hover:text-white'}`}
              >
                DECENTRALAND HQ
              </button>
              <button
                onClick={() => setActiveTab('real-estate')}
                className={`relative z-10 px-8 py-3 rounded-full text-sm font-orbitron tracking-widest transition-colors ${activeTab === 'real-estate' ? 'text-white' : 'text-nexus-silver/50 hover:text-white'}`}
              >
                THE SANDBOX ESTATE
              </button>
            </div>
          </div>

          {/* Content Display */}
          <AnimatePresence mode="wait">
            {activeTab === 'hq' ? (
              <motion.div
                key="hq"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="grid lg:grid-cols-2 gap-16 items-center"
              >
                {/* HQ Visual - Portal Style */}
                <div className="relative group perspective-1000">
                  <div className="absolute -inset-4 bg-nexus-cyan/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                  <NexusCard
                    variant="cyan"
                    glow
                    className="relative p-1 overflow-hidden"
                    padding="none"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <div className="absolute inset-0 bg-linear-to-t from-nexus-obsidian via-transparent to-transparent z-10" />

                      {/* Bridge Entrance Visual */}
                      <div className="absolute inset-0 bg-gray-900 grid-overlay opacity-30 group-hover:opacity-50 transition-opacity" />

                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          className="w-48 h-48 border border-nexus-cyan/40 rounded-full bg-nexus-cyan/5 flex items-center justify-center"
                          animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 90, 180, 270, 360],
                            boxShadow: [
                              '0 0 20px rgba(0,245,255,0.1)',
                              '0 0 50px rgba(0,245,255,0.3)',
                              '0 0 20px rgba(0,245,255,0.1)',
                            ],
                          }}
                          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        >
                          <div className="w-40 h-40 border border-nexus-cyan/20 rounded-full flex items-center justify-center">
                            <MapPin className="w-12 h-12 text-nexus-cyan animate-pulse" />
                          </div>
                        </motion.div>
                      </div>

                      {/* Scanning Line overlay */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                        <div className="w-full h-1 bg-nexus-cyan/30 shadow-[0_0_15px_rgba(0,245,255,0.5)] absolute animate-scanner-line" />
                      </div>

                      <div className="absolute bottom-6 left-6 z-20">
                        <div className="flex flex-col gap-2">
                          <NexusStatusBadge
                            status="online"
                            label="STITCH BRIDGE ACTIVE"
                            size="sm"
                          />
                          <div className="px-3 py-1 bg-black/60 border border-white/10 rounded font-mono text-[10px] tracking-widest">
                            COORD: -51, 114 | PARCEL 2841
                          </div>
                        </div>
                      </div>
                    </div>
                  </NexusCard>

                  {/* Floating Elements */}
                  <motion.div
                    className="absolute -top-10 -right-10 w-24 h-24 glass-premium flex items-center justify-center p-4 rounded-2xl border-nexus-cyan/30 shadow-2xl"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Box className="w-8 h-8 text-nexus-cyan opacity-40" />
                  </motion.div>
                </div>

                {/* HQ Info */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-4xl font-orbitron font-black mb-6 tracking-tight">
                      SEDE CENTRAL <span className="text-nexus-cyan">STITCH</span>
                    </h3>
                    <p className="text-nexus-silver/70 leading-relaxed text-lg font-light">
                      Nuestra flagship office en Decentraland funciona como el nexo principal del
                      ecosistema. Un espacio diseñado para reuniones inmersivas de alta fidelidad y
                      gobernanza descentralizada.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { label: 'Auditorio Neural', status: '500 CAPACITY' },
                      { label: 'Salas de Juntas', status: 'E2E ENCRYPTED' },
                      { label: 'Galería de Activos', status: 'NFT COMPLIANT' },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 glass-premium rounded-xl border-white/5 hover:border-nexus-cyan/20 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-nexus-cyan rounded-full shadow-[0_0_8px_rgba(0,245,255,0.8)]" />
                          <span className="text-sm font-orbitron tracking-wider text-white/80">
                            {item.label}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-nexus-cyan/60 tracking-widest">
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* ── Live Bridge Status Panel ── */}
                  <motion.div
                    className="mt-2 p-4 rounded-xl border border-nexus-cyan/20 bg-nexus-cyan/5 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-orbitron tracking-[0.25em] text-nexus-cyan/70 uppercase">
                        Live Bridge Status
                      </span>
                      <NexusStatusBadge
                        status={
                          bridgeStats.health === 'OPTIMAL'
                            ? 'online'
                            : bridgeStats.health === 'WARNING'
                              ? 'warning'
                              : 'critical'
                        }
                        label={bridgeStats.health}
                        size="sm"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'SESSIONS', value: bridgeStats.users, unit: '' },
                        { label: 'LATENCY', value: bridgeStats.latency, unit: 'ms' },
                        { label: 'AI LOAD', value: bridgeStats.aiLoad, unit: '%' },
                      ].map(stat => (
                        <div key={stat.label} className="text-center">
                          <div className="text-lg font-orbitron font-black text-white tabular-nums">
                            {stat.value}
                            <span className="text-[10px] text-white/40 ml-0.5">{stat.unit}</span>
                          </div>
                          <div className="text-[9px] font-mono text-nexus-silver/40 tracking-widest mt-0.5">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <div className="flex items-center gap-6 pt-4">
                    <button
                      onClick={() => navigate('/virtual-office')}
                      className="group relative flex items-center gap-4 px-10 py-5 bg-nexus-cyan text-black font-black font-orbitron tracking-[0.2em] hover:bg-nexus-cyan/80 transition-all rounded-sm overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      <span className="relative z-10">IR A LA SEDE</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                    </button>
                    <button className="p-5 border border-white/10 hover:border-nexus-cyan/50 hover:bg-white/5 transition-all text-white/40 hover:text-nexus-cyan flex items-center gap-3 group">
                      <Link2 size={20} className="group-hover:rotate-45 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="real-estate"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="space-y-12"
              >
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <h3 className="text-3xl font-orbitron font-bold mb-4 text-nexus-violet-glow">
                    DESARROLLO INMOBILIARIO DIGITAL
                  </h3>
                  <p className="text-nexus-silver/70 mb-8 leading-relaxed">
                    ¿Quieres lanzar tu Marca en el Metaverso de forma fácil? Hemos reservado
                    parcelas estratégicas en <strong>The Sandbox</strong> para emprendedores y
                    empresas que quieran empezar hoy mismo. Te ofrecemos un modelo de alquiler
                    flexible y amigable, con todo el soporte técnico que necesites.
                  </p>
                  {/* Sandbox Land Coordinates */}
                  <div className="inline-flex items-center gap-4 px-6 py-3 bg-nexus-violet/10 border border-nexus-violet/30 rounded-full">
                    <MapPin className="w-5 h-5 text-nexus-violet" />
                    <span className="font-orbitron tracking-[0.2em] text-sm text-white">
                      SANDBOX LAND:{' '}
                      <span className="text-nexus-violet-glow font-bold">(-141, 25)</span>
                    </span>
                    <a
                      href="https://www.sandbox.game/en/map/?x=-141&y=25"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 p-2 bg-nexus-violet/20 hover:bg-nexus-violet/40 rounded-full transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-nexus-violet-glow" />
                    </a>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* CARD 1: RENTAL */}
                  <NexusCard variant="violet" glow className="p-10 group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-nexus-violet/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-start justify-between mb-8 relative z-10">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:border-nexus-violet/40 transition-colors">
                        <Layers className="w-8 h-8 text-nexus-violet animate-float" />
                      </div>
                      <NexusStatusBadge status="online" label="LEASING ACTIVE" size="sm" />
                    </div>

                    <h4 className="text-2xl font-orbitron font-black mb-2 tracking-tight group-hover:text-nexus-violet-glow transition-colors">
                      ALQUILER DE ESPACIO
                    </h4>
                    <p className="text-sm text-nexus-silver/50 mb-8 h-12 leading-relaxed">
                      Parcelas premium en distritos comerciales de alto tráfico. Listas para
                      despliegue inmediato con conectividad multiversal.
                    </p>

                    <div className="space-y-6 mb-10 relative z-10">
                      <div className="flex justify-between items-baseline border-b border-white/5 pb-4 group-hover:border-nexus-violet/20 transition-colors">
                        <span className="text-sm text-nexus-silver/80">Parcela 1x1 (Standard)</span>
                        <div className="text-right">
                          <span className="text-xl font-black font-orbitron text-white">€99</span>
                          <span className="text-[10px] font-mono text-white/30 ml-1 uppercase">
                            /mes
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-baseline border-b border-white/5 pb-4 group-hover:border-nexus-violet/20 transition-colors">
                        <span className="text-sm text-nexus-silver/80">Parcela 3x3 (Estate)</span>
                        <div className="text-right">
                          <span className="text-xl font-black font-orbitron text-white">€290</span>
                          <span className="text-[10px] font-mono text-white/30 ml-1 uppercase">
                            /mes
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsContactModalOpen(true)}
                      className="w-full py-4 border border-nexus-violet/40 hover:bg-nexus-violet/20 hover:border-nexus-violet text-white transition-all font-orbitron font-bold tracking-[0.2em] text-[10px] uppercase flex justify-center items-center gap-2"
                    >
                      CONSULTAR DISPONIBILIDAD
                    </button>
                  </NexusCard>

                  {/* CARD 2: CONSTRUCTION */}
                  <NexusCard variant="cyan" glow className="p-10 group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-nexus-cyan/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-start justify-between mb-8 relative z-10">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:border-nexus-cyan/40 transition-colors">
                        <DraftingCompass className="w-8 h-8 text-nexus-cyan" />
                      </div>
                      <NexusStatusBadge status="online" label="BUILD OPS READY" size="sm" />
                    </div>

                    <h4 className="text-2xl font-orbitron font-black mb-2 tracking-tight group-hover:text-nexus-cyan-glow transition-colors">
                      ARQUITECTURA NEXUS
                    </h4>
                    <p className="text-sm text-nexus-silver/50 mb-8 h-12 leading-relaxed">
                      Ingeniería y diseño de activos digitales persistentes, showrooms y
                      experiencias multimodales para la marca.
                    </p>

                    <div className="space-y-6 mb-10 relative z-10">
                      <div className="flex justify-between items-baseline border-b border-white/5 pb-4 group-hover:border-nexus-cyan/20 transition-colors">
                        <span className="text-sm text-nexus-silver/80">Micro-Store (Template)</span>
                        <span className="text-xl font-black font-orbitron text-white">€890+</span>
                      </div>
                      <div className="flex justify-between items-baseline border-b border-white/5 pb-4 group-hover:border-nexus-cyan/20 transition-colors">
                        <span className="text-sm text-nexus-silver/80">Flagship Experience</span>
                        <span className="text-[10px] font-mono text-nexus-cyan/60 tracking-[0.2em] uppercase">
                          CUSTOM QUOTE
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsContactModalOpen(true)}
                      className="w-full py-4 bg-nexus-cyan text-black hover:bg-nexus-cyan/80 hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] transition-all font-orbitron font-black tracking-[0.2em] text-[10px] uppercase flex justify-center items-center gap-2"
                    >
                      INICIAR PROYECTO
                      <Ruler className="w-3 h-3" />
                    </button>
                  </NexusCard>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SpotlightWrapper>
    </section>
  );
};
