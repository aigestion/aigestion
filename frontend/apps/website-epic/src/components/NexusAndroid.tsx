import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, ShieldCheck, Cpu, Download, Lock, Settings2 } from 'lucide-react';
import React, { useState } from 'react';
import { useSound } from '../hooks/useSound';

export const NexusAndroid: React.FC = () => {
  const [activeMode, setActiveMode] = useState('mobile');
  const { playHover, playClick } = useSound();

  const modes = [
    {
      id: 'mobile',
      name: 'CONTROL TOTAL MÓVIL',
      description:
        'Tu suscripción incluye la APK exclusiva de Nexus Android. Gestiona toda tu casa o empresa desde tu mano.',
      icon: <Smartphone className="w-6 h-6" />,
      color: 'from-nexus-cyan to-blue-600',
      accent: 'text-nexus-cyan-glow',
      image: '/images/nexus/nexus_guardian_godmode.png', // Placeholder, using premium assets
      benefits: ['Control desde el móvil', 'Gestión de tareas', 'Acceso remoto seguro'],
    },
    {
      id: 'security',
      name: 'ESCUDO DE PRIVACIDAD',
      description:
        'Seguridad de grado militar simplificada para que no tengas que configurar nada. Tus datos nunca salen de tu control.',
      icon: <ShieldCheck className="w-6 h-6" />,
      color: 'from-nexus-violet to-purple-600',
      accent: 'text-nexus-violet-glow',
      image: '/images/nexus/collaboration.png',
      benefits: ['Datos 100% locales', 'Sin espionaje', 'Bloqueo proactivo'],
    },
    {
      id: 'assistant',
      name: 'ASISTENTE INTELIGENTE',
      description:
        'No necesitas saber de IA. Nexus aprende de ti para hacerte la vida más fácil, ahorrándote horas de trabajo.',
      icon: <Cpu className="w-6 h-6" />,
      color: 'from-green-400 to-emerald-600',
      accent: 'text-green-400-glow',
      image: '/images/nexus/hero.png',
      benefits: ['Aprende tus rutinas', 'Habla como tú', 'Simplificación total'],
    },
  ];

  const currentMode = modes.find(m => m.id === activeMode) || modes[0];

  return (
    <section className="relative py-32 bg-black overflow-hidden">
      <div className="grain-overlay" />

      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-nexus-cyan/5 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Simplified Header for better understanding */}
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-nexus-cyan/20 bg-nexus-cyan/5 mb-8">
            <Download className="w-4 h-4 text-nexus-cyan-glow" />
            <span className="text-[10px] font-orbitron tracking-[0.2em] text-nexus-cyan-glow uppercase">
              INCLUYE NEXUS APP (APK)
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-orbitron font-black text-white mb-8 tracking-tighter uppercase">
            TU SISTEMA <span className="kinetic-text">SOBERANO</span>
          </h2>
          <p className="text-lg text-nexus-silver/60 max-w-3xl mx-auto font-light leading-relaxed">
            Hemos convertido la tecnología más avanzada del mundo en algo tan sencillo como usar tu
            teléfono. Sin complicaciones, sin riesgos de privacidad. solo control absoluto.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual Showcase */}
          <motion.div
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="relative aspect-square max-w-[500px] mx-auto">
              {/* Smartphone-like representation */}
              <div className="absolute inset-0 rounded-[3rem] border border-white/10 bg-black/40 backdrop-blur-3xl p-4 overflow-hidden shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMode}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full relative"
                  >
                    <img
                      src={currentMode.image}
                      alt={currentMode.name}
                      className="w-full h-full object-cover rounded-4xl opacity-70"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />

                    {/* Simplified HUD Overlay */}
                    <div className="absolute bottom-10 left-10 right-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg bg-linear-to-br ${currentMode.color}`}>
                          {currentMode.icon}
                        </div>
                        <h4 className="text-xl font-orbitron font-bold text-white uppercase tracking-wider">
                          {currentMode.name}
                        </h4>
                      </div>
                      <p className="text-sm text-nexus-silver/50">
                        SISTEMA ACTIVO: PROTECCIÓN NIVEL GOD MODE
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Floating Security Badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-6 -right-6 p-4 premium-glass rounded-2xl border-nexus-cyan/30 flex items-center gap-3"
              >
                <Lock className="w-5 h-5 text-nexus-cyan-glow" />
                <span className="text-[10px] font-orbitron font-bold text-white uppercase tracking-widest">
                  Encriptación 100% Local
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Interactive Information */}
          <div className="space-y-6 order-1 lg:order-2">
            <h3 className="text-2xl font-orbitron font-bold text-white uppercase tracking-widest mb-8">
              ¿Qué obtienes con tu suscripción?
            </h3>

            <div className="space-y-4">
              {modes.map(mode => (
                <motion.div
                  key={mode.id}
                  onClick={() => {
                    playClick();
                    setActiveMode(mode.id);
                  }}
                  onMouseEnter={playHover}
                  className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer group ${
                    activeMode === mode.id
                      ? `bg-white/5 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]`
                      : 'bg-transparent border-white/5 hover:border-white/10'
                  }`}
                  whileHover={{ x: 10 }}
                >
                  <div className="flex gap-6 items-center">
                    <div
                      className={`p-3 rounded-xl bg-linear-to-br ${mode.color} text-white shadow-lg`}
                    >
                      {mode.icon}
                    </div>
                    <div>
                      <h4
                        className={`text-lg font-orbitron font-bold transition-colors ${activeMode === mode.id ? 'text-white' : 'text-nexus-silver/40 group-hover:text-nexus-silver'}`}
                      >
                        {mode.name}
                      </h4>
                      <p className="text-sm text-nexus-silver/40 mt-1">{mode.description}</p>
                    </div>
                  </div>

                  {/* Detailed benefits when active */}
                  <AnimatePresence>
                    {activeMode === mode.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-6 pt-6 border-t border-white/5 overflow-hidden"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {mode.benefits.map(benefit => (
                            <div
                              key={benefit}
                              className="flex items-center gap-2 text-xs text-nexus-silver/60"
                            >
                              <Settings2 className="w-3 h-3 text-nexus-cyan" />
                              {benefit}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* APK Badge */}
            <div className="mt-12 p-8 premium-glass rounded-3xl border-nexus-cyan/10 bg-linear-to-r from-nexus-cyan/5 to-transparent">
              <div className="flex items-center gap-4 mb-4">
                <Smartphone className="w-10 h-10 text-white" />
                <div>
                  <h4 className="font-orbitron font-bold text-white tracking-widest text-lg">
                    MÓVIL TOTAL
                  </h4>
                  <p className="text-xs text-nexus-cyan-glow uppercase tracking-[0.2em] font-bold">
                    APK ANDROID INCLUIDA
                  </p>
                </div>
              </div>
              <p className="text-sm text-nexus-silver/40 leading-relaxed italic">
                "Instala Nexus en tu Android y toma las riendas de tu vida digital. Privacidad
                extrema sin necesidad de ser un experto."
              </p>
              <button className="btn-enterprise mt-8 w-full group">
                OBTENER NEXUS + APP MÓVIL
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
