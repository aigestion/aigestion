import { motion } from 'framer-motion';
import { Brain, ShieldCheck, Workflow, LineChart, PlugZap, GraduationCap, Layout, Cpu, Database, Shield } from 'lucide-react';
import React from 'react';

const services = [
  {
    title: 'Tu Oficina en el Móvil',
    description: 'Lleva todo el control de tu negocio en tu bolsillo. Facturas, citas y recados, todo listo para que lo consultes hablando.',
    icon: Layout,
    bullets: ['Facturas rápidas', 'Control de stock', 'Citas y recados'],
  },
  {
    title: 'Atención a Clientes',
    description: 'Daniela ayuda a tus clientes por ti, resolviendo dudas y anotando pedidos mientras tú descansas.',
    icon: Cpu,
    bullets: ['Ayuda 24 horas', 'Pedidos automáticos', 'Trato cariñoso'],
  },
  {
    title: 'Saber cuánto ganas',
    description: 'Informes que se entienden a la primera. Mira cuánto has ganado hoy y qué gastos tienes pendientes sin líos.',
    icon: Database,
    bullets: ['Cuentas claras', 'Aviso de gastos', 'Simulador de ahorro'],
  },
  {
    title: 'Seguridad Máxima',
    description: 'Tus datos están más seguros que en un banco. Copias de seguridad automáticas para que nunca pierdas nada.',
    icon: Shield,
    bullets: ['Copia de seguridad', 'Privacidad total', 'Acceso con huella/cara'],
  },
  {
    title: 'Capacitación & Acompañamiento',
    description: 'Te enseñamos paso a paso a sacar el máximo partido a Daniela. Nunca estarás solo.',
    icon: GraduationCap,
    bullets: ['Academia AIGestion', 'Guías paso a paso', 'Soporte premium'],
  },
];

import { GodModeText } from './design-system/GodModeText';
import { TiltCard } from './design-system/TiltCard';

export const ServicesDeepDive: React.FC = () => (
  <section id="services" className="relative py-32 bg-black overflow-hidden">
    <div className="absolute inset-0 bg-radial-at-top from-nexus-violet/10 via-transparent to-transparent" />

    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="mb-4">
          <GodModeText text="SERVICIOS" className="text-5xl md:text-7xl mr-4" effect="none" />
          <GodModeText
            text="INTEGRALES"
            className="text-5xl md:text-7xl text-nexus-cyan"
            effect="neon"
          />
        </div>
        <p className="text-lg text-nexus-silver/70 max-w-3xl mx-auto font-orbitron">
          AIGestion.net entrega una plataforma completa: estrategia, tecnología, automatización y
          adopción. Cada módulo está diseñado para resultados medibles y escalables.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <TiltCard key={service.title} className="h-full" tiltMaxAngleX={8} tiltMaxAngleY={8}>
            <motion.div
              className="relative p-8 rounded-[32px] border-2 border-white/5 bg-nexus-obsidian/40 backdrop-blur-2xl overflow-hidden h-full group hover:border-nexus-cyan/30 transition-all duration-700 shadow-2xl hover:shadow-[0_0_50px_rgba(0,240,255,0.15)]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              {/* Holographic Scanlines & Noise */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20 z-0 mix-blend-overlay group-hover:opacity-40 transition-opacity duration-700"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(34, 211, 238, 0.1) 2px)',
                  backgroundSize: '100% 3px',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-nexus-cyan/5 via-transparent to-nexus-violet/10 opacity-30 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 bg-nexus-cyan blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative w-full h-full rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center group-hover:border-nexus-cyan/50 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-6">
                    <service.icon className="w-8 h-8 text-nexus-cyan group-hover:text-white transition-colors" />
                  </div>
                </div>

                <div>
                  <GodModeText
                    text={service.title.toUpperCase()}
                    className="text-2xl font-black tracking-tight mb-2 block"
                    effect={index % 2 === 0 ? 'neon' : 'glitch'}
                  />
                  <p className="text-sm text-nexus-silver/50 leading-relaxed font-sans group-hover:text-nexus-silver/80 transition-colors duration-500">
                    {service.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 relative">
                  {/* Neon Line Sweep */}
                  <motion.div
                    className="absolute top-0 left-0 h-px bg-nexus-cyan shadow-[0_0_15px_#22d3ee]"
                    initial={{ width: '0%' }}
                    whileInView={{ width: '100%' }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />

                  <ul className="grid grid-cols-1 gap-3">
                    {service.bullets.map((bullet, bIdx) => (
                      <motion.li
                        key={bullet}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + bIdx * 0.1 }}
                        className="flex items-center gap-3 text-[11px] font-orbitron tracking-widest text-nexus-silver/40 group-hover:text-white/60 transition-colors"
                      >
                        <div className="h-1 w-1 rounded-full bg-nexus-cyan animate-pulse shadow-[0_0_8px_#22d3ee]" />
                        {bullet}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* HUD Decoration */}
              <div className="absolute bottom-4 right-4 text-[8px] font-mono text-white/5 group-hover:text-nexus-cyan/20 transition-colors">
                NEXU_SVC_{index.toString().padStart(3, '0')}
              </div>
            </motion.div>
          </TiltCard>
        ))}
      </div>
    </div>
  </section>
);
