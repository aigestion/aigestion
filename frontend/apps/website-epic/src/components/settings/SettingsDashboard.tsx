import React from 'react';
import { motion } from 'framer-motion';
import { GodModeText } from '../design-system/GodModeText';
import { TiltCard } from '../design-system/TiltCard';
import { Settings, Shield, Cpu, Activity, Bell, Eye } from 'lucide-react';

export const SettingsDashboard: React.FC = () => {
  return (
    <div className="p-8 md:p-12 min-h-full font-sans text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-nexus-violet/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-nexus-cyan/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto relative z-10"
      >
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-xl bg-nexus-cyan/10 border border-nexus-cyan/30 text-nexus-cyan shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Settings className="w-6 h-6 animate-spin-slow" />
            </div>
            <GodModeText text="CONFIGURACIÓN" className="text-4xl md:text-5xl" effect="glitch" />
          </div>
          <p className="text-nexus-silver/70 font-orbitron tracking-wide ml-16">
            Ajustes del Sistema y Preferencias de Soberanía
          </p>
        </div>

        <div className="grid gap-8">
          {/* Appearance Section */}
          <section>
            <h3 className="text-nexus-cyan text-sm font-bold font-orbitron tracking-widest uppercase mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Interfaz Visual
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <TiltCard className="h-full" tiltMaxAngleX={3} tiltMaxAngleY={3}>
                <div className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md hover:border-nexus-cyan/30 transition-all group h-full">
                  <div className="flex justify-between items-start mb-4">
                    <label htmlFor="theme-select" className="text-white font-bold font-orbitron">
                      Tema del Sistema
                    </label>
                    <div className="w-2 h-2 rounded-full bg-nexus-cyan shadow-[0_0_8px_#22d3ee]" />
                  </div>
                  <select
                    id="theme-select"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-nexus-silver focus:border-nexus-cyan/50 focus:bg-black/80 outline-none transition-all font-mono"
                  >
                    <option>Cyberpunk Dark (Default)</option>
                    <option>Nebula Blue</option>
                    <option>Matrix Green</option>
                  </select>
                  <p className="text-[10px] text-nexus-silver/40 mt-3 uppercase tracking-wider">
                    Define la atmósfera visual de tu entorno de trabajo.
                  </p>
                </div>
              </TiltCard>

              <TiltCard className="h-full" tiltMaxAngleX={3} tiltMaxAngleY={3}>
                <div className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md hover:border-nexus-violet/30 transition-all group h-full">
                  <div className="flex justify-between items-start mb-4">
                    <label
                      htmlFor="personality-select"
                      className="text-white font-bold font-orbitron"
                    >
                      Personalidad Daniela
                    </label>
                    <div className="w-2 h-2 rounded-full bg-nexus-violet shadow-[0_0_8px_#8b5cf6]" />
                  </div>
                  <select
                    id="personality-select"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-nexus-silver focus:border-nexus-violet/50 focus:bg-black/80 outline-none transition-all font-mono"
                  >
                    <option>Profesional (Técnico)</option>
                    <option>Casual (Amigable)</option>
                    <option>Creativo (Lluvia de ideas)</option>
                  </select>
                  <p className="text-[10px] text-nexus-silver/40 mt-3 uppercase tracking-wider">
                    Ajusta el tono y estilo de comunicación de tu IA.
                  </p>
                </div>
              </TiltCard>
            </div>
          </section>

          {/* System & Security Section */}
          <section>
            <h3 className="text-nexus-violet text-sm font-bold font-orbitron tracking-widest uppercase mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Seguridad & Sistema
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <TiltCard className="h-full" tiltMaxAngleX={2} tiltMaxAngleY={2}>
                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md hover:border-red-500/30 transition-all h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Activity className="w-5 h-5 text-red-400" />
                      <span className="font-bold text-sm text-white">Modo Estricto</span>
                    </div>
                    <p className="text-xs text-nexus-silver/60 leading-relaxed">
                      Fuerza verificación biométrica para acciones críticas.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] uppercase text-red-500 font-bold tracking-wider">
                      Desactivado
                    </span>
                    <div className="w-10 h-5 rounded-full bg-white/10 relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-3 h-3 rounded-full bg-nexus-silver/50" />
                    </div>
                  </div>
                </div>
              </TiltCard>

              <TiltCard className="h-full" tiltMaxAngleX={2} tiltMaxAngleY={2}>
                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md hover:border-emerald-500/30 transition-all h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Cpu className="w-5 h-5 text-emerald-400" />
                      <span className="font-bold text-sm text-white">Alto Rendimiento</span>
                    </div>
                    <p className="text-xs text-nexus-silver/60 leading-relaxed">
                      Prioriza recursos de GPU para respuestas de Daniela.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] uppercase text-emerald-500 font-bold tracking-wider animate-pulse">
                      Activado
                    </span>
                    <div className="w-10 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/50 relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_5px_#34d399]" />
                    </div>
                  </div>
                </div>
              </TiltCard>

              <TiltCard className="h-full" tiltMaxAngleX={2} tiltMaxAngleY={2}>
                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md hover:border-yellow-500/30 transition-all h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Bell className="w-5 h-5 text-yellow-400" />
                      <span className="font-bold text-sm text-white">Notificaciones</span>
                    </div>
                    <p className="text-xs text-nexus-silver/60 leading-relaxed">
                      Alertas silenciosas (solo visuales) durante trabajo profundo.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] uppercase text-yellow-500 font-bold tracking-wider">
                      Personalizado
                    </span>
                    <div className="w-10 h-5 rounded-full bg-yellow-500/20 border border-yellow-500/50 relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_5px_#facc15]" />
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
};
