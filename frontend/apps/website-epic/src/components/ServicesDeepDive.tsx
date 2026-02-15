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
        <h2 className="text-5xl md:text-7xl font-orbitron font-black text-white mb-4">
          SERVICIOS <span className="text-nexus-cyan text-glow">INTEGRALES</span>
        </h2>
        <p className="text-lg text-nexus-silver/70 max-w-3xl mx-auto">
          AIGestion entrega una plataforma completa: estrategia, tecnología, automatización y
          adopción. Cada módulo está diseñado para resultados medibles y escalables.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            className="relative p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-nexus-violet/10 via-transparent to-nexus-cyan/10 opacity-50" />
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-nexus-violet/10 border border-nexus-violet/30 flex items-center justify-center">
                <service.icon className="w-6 h-6 text-nexus-cyan-glow" />
              </div>
              <h3 className="text-xl font-orbitron text-white font-bold">{service.title}</h3>
              <p className="text-sm text-nexus-silver/70 leading-relaxed">{service.description}</p>
              <ul className="space-y-2 text-xs text-nexus-silver/60">
                {service.bullets.map(bullet => (
                  <li key={bullet} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-nexus-cyan" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
