import { motion } from 'framer-motion';
import React from 'react';

const tiers = [
  {
    name: 'Esencial',
    price: 'Desde $490/mes',
    ideal: 'Startups y pymes en crecimiento',
    features: ['Automatización base', 'Panel de control', 'Soporte estándar', 'Implementación rápida'],
  },
  {
    name: 'Evolución',
    price: 'Desde $1.490/mes',
    ideal: 'Empresas con equipos multi-área',
    features: ['IA aplicada por área', 'Integraciones CRM/ERP', 'Reportes avanzados', 'Onboarding guiado'],
  },
  {
    name: 'Soberano',
    price: 'Cotización personalizada',
    ideal: 'Corporativos y sector público',
    features: ['Modelos privados', 'Gobernanza y compliance', 'Equipo dedicado', 'SLA premium'],
  },
];

const gremioOptions = [
  {
    name: 'Plan Gremial',
    price: 'Desde $2/miembro/mes',
    note: 'Ideal para asociaciones, colegios profesionales y cámaras.',
    features: ['Portal de miembros', 'Soporte multi-sede', 'Analítica de participación'],
  },
  {
    name: 'Plan Cooperativo',
    price: 'Desde $990/mes',
    note: 'Para cooperativas y organizaciones con múltiples unidades.',
    features: ['Gestión de procesos compartidos', 'Tableros por unidad', 'Automatización financiera'],
  },
  {
    name: 'Plan Educativo',
    price: 'Desde $750/mes',
    note: 'Instituciones educativas y formación continua.',
    features: ['Campus IA', 'Asistentes de aprendizaje', 'Seguimiento de cohortes'],
  },
];

export const PricingSection: React.FC = () => (
  <section id="pricing" className="py-32 bg-black relative overflow-hidden">
    <div className="absolute inset-0 bg-radial-at-top from-nexus-violet/15 via-transparent to-transparent" />

    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-5xl md:text-7xl font-orbitron font-black text-white mb-4">
          PRECIOS <span className="text-nexus-cyan text-glow">INTELIGENTES</span>
        </h2>
        <p className="text-lg text-nexus-silver/70 max-w-3xl mx-auto">
          Planes flexibles según tamaño, industria y gremio. Todos incluyen auditoría inicial y roadmap de adopción.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8 mb-20">
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="text-xs font-orbitron tracking-[0.3em] text-nexus-cyan-glow mb-3 uppercase">
              {tier.name}
            </div>
            <div className="text-3xl font-bold text-white mb-2">{tier.price}</div>
            <p className="text-sm text-nexus-silver/70 mb-6">{tier.ideal}</p>
            <ul className="space-y-3 text-sm text-nexus-silver/70">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-nexus-cyan" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div id="gremios" className="grid lg:grid-cols-3 gap-8">
        {gremioOptions.map((plan, index) => (
          <motion.div
            key={plan.name}
            className="p-8 rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="text-xs font-orbitron tracking-[0.3em] text-nexus-violet-glow mb-3 uppercase">
              {plan.name}
            </div>
            <div className="text-2xl font-bold text-white mb-2">{plan.price}</div>
            <p className="text-sm text-nexus-silver/70 mb-6">{plan.note}</p>
            <ul className="space-y-3 text-sm text-nexus-silver/70">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-nexus-violet" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
