import React, { useState } from 'react';
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
} from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

type MetaverseMode = 'hq' | 'real-estate';

export const MetaverseSection: React.FC = () => {
  const { setIsContactModalOpen } = useAppContext();
  const [activeTab, setActiveTab] = useState<MetaverseMode>('hq');
  const navigate = useNavigate();

  return (
    <section className="py-40 smooth-mesh-bg text-white relative overflow-hidden" id="metaverse">
      {/* Architectural Background Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-px h-full bg-linear-to-b from-transparent via-nexus-cyan to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-linear-to-b from-transparent via-nexus-violet to-transparent" />
        <div className="absolute top-1/3 left-0 w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
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
            <Box className="w-4 h-4 text-nexus-cyan" />
            <span className="text-xs font-orbitron tracking-[0.3em] text-white/80 uppercase">
              Infraestructura Virtual
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-orbitron font-black text-white mb-6 tracking-tight">
            ARQUITECTURA <span className="kinetic-text">PERSISTENTE</span>
          </h2>
          <p className="text-xl text-nexus-silver/60 max-w-2xl mx-auto font-light leading-relaxed">
            Extienda su presencia corporativa a los distritos financieros digitales más exclusivos.
            Presencia global, operación descentralizada.
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
              {/* HQ Visual */}
              <div className="relative group">
                <div className="absolute inset-0 bg-nexus-cyan/20 blur-[100px] rounded-full opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-video">
                  <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent z-10" />
                  {/* Placeholder for Decentraland HQ Image */}
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-50 grayscale hover:grayscale-0 transition-all duration-700 transform hover:scale-105" />
                    <div className="z-20 p-8 border border-white/20 bg-black/40 backdrop-blur-xl rounded-2xl flex flex-col items-center gap-4">
                      <MapPin className="w-8 h-8 text-nexus-cyan" />
                      <span className="font-orbitron tracking-[0.2em] text-sm">
                        COORD: -51, 114
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* HQ Info */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-3xl font-orbitron font-bold mb-4">SEDE CENTRAL VIRTUAL</h3>
                  <p className="text-nexus-silver/70 leading-relaxed">
                    Nuestra flagship office en Decentraland. Un espacio diseñado para reuniones
                    inmersivas, demostraciones de producto y networking de alto nivel sin barreras
                    geográficas.
                  </p>
                </div>

                <ul className="space-y-4">
                  {[
                    'Auditorio Neural para 500 asistentes',
                    'Salas de Juntas Privadas Encriptadas',
                    'Galería de Activos Digitales NFT',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-nexus-silver">
                      <div className="w-1.5 h-1.5 bg-nexus-cyan rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/virtual-office')}
                  className="group flex items-center gap-3 px-8 py-4 bg-nexus-cyan text-black font-bold font-orbitron tracking-widest hover:bg-nexus-cyan/80 hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] transition-all rounded-sm"
                >
                  IR A LA OFICINA
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
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
                  ¿Quieres lanzar tu Marca en el Metaverso de forma fácil? Hemos reservado parcelas
                  estratégicas en <strong>The Sandbox</strong> para emprendedores y empresas que
                  quieran empezar hoy mismo. Te ofrecemos un modelo de alquiler flexible y amigable,
                  con todo el soporte técnico que necesites.
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
                <div className="premium-glass p-10 rounded-3xl border border-white/10 hover:border-nexus-violet/50 transition-all group">
                  <div className="flex items-start justify-between mb-8">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <Layers className="w-8 h-8 text-nexus-violet" />
                    </div>
                    <span className="px-4 py-1 rounded-full border border-white/10 text-[10px] font-orbitron tracking-widest uppercase text-white/60">
                      Leasing
                    </span>
                  </div>

                  <h4 className="text-2xl font-orbitron font-bold mb-2">ALQUILER DE ESPACIO</h4>
                  <p className="text-sm text-nexus-silver/50 mb-8 h-12">
                    Parcelas premium en distritos comerciales de alto tráfico. Listas para
                    despliegue inmediato.
                  </p>

                  <div className="space-y-6 mb-10">
                    <div className="flex justify-between items-baseline border-b border-white/5 pb-4">
                      <span className="text-sm text-nexus-silver">Parcela 1x1 (Standard)</span>
                      <span className="text-xl font-bold font-orbitron text-white">
                        €99<span className="text-xs font-sans font-normal text-white/40">/mes</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline border-b border-white/5 pb-4">
                      <span className="text-sm text-nexus-silver">Parcela 3x3 (Estate)</span>
                      <span className="text-xl font-bold font-orbitron text-white">
                        €290
                        <span className="text-xs font-sans font-normal text-white/40">/mes</span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="w-full py-4 border-2 border-nexus-violet/40 hover:bg-nexus-violet/20 hover:border-nexus-violet text-white transition-all font-orbitron tracking-widest text-xs uppercase flex justify-center items-center gap-2"
                  >
                    Consultar Disponibilidad
                  </button>
                </div>

                {/* CARD 2: CONSTRUCTION */}
                <div className="premium-glass p-10 rounded-3xl border border-white/10 hover:border-nexus-cyan/50 transition-all group">
                  <div className="flex items-start justify-between mb-8">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <DraftingCompass className="w-8 h-8 text-nexus-cyan" />
                    </div>
                    <span className="px-4 py-1 rounded-full border border-white/10 text-[10px] font-orbitron tracking-widest uppercase text-white/60">
                      Build Ops
                    </span>
                  </div>

                  <h4 className="text-2xl font-orbitron font-bold mb-2">ARQUITECTURA A MEDIDA</h4>
                  <p className="text-sm text-nexus-silver/50 mb-8 h-12">
                    Diseño y desarrollo de tiendas virtuales, showrooms y experiencias gamificadas.
                  </p>

                  <div className="space-y-6 mb-10">
                    <div className="flex justify-between items-baseline border-b border-white/5 pb-4">
                      <span className="text-sm text-nexus-silver">Micro-Store (Template)</span>
                      <span className="text-xl font-bold font-orbitron text-white">Desde €890</span>
                    </div>
                    <div className="flex justify-between items-baseline border-b border-white/5 pb-4">
                      <span className="text-sm text-nexus-silver">Flagship Experience</span>
                      <span className="text-xl font-bold font-orbitron text-white">Cotización</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="w-full py-4 bg-nexus-cyan text-black hover:bg-nexus-cyan/80 hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all font-orbitron tracking-widest text-xs uppercase flex justify-center items-center gap-2"
                  >
                    Iniciar Proyecto
                    <Ruler className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
