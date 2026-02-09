import { AnimatePresence, motion } from 'framer-motion';
import { Building2, Home, CheckCircle2, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

type PlanCategory = 'familias' | 'empresas';

const categoryData = {
  familias: {
    title: 'NÚCLEO FAMILIAR',
    description:
      'Inteligencia soberana para la gestión doméstica, seguridad personal y coordinación familiar.',
    icon: <Home className="w-8 h-8" />,
    color: 'from-nexus-cyan to-blue-500',
    accent: 'nexus-cyan',
    plans: [
      {
        name: 'Nexus Home',
        price: '€29/mes',
        features: ['Domótica Autónoma', 'Control con Daniela AI', 'Privacidad Estricta Local'],
      },
      {
        name: 'Guardian Family',
        price: '€59/mes',
        features: ['Seguridad Perimetral IA', 'Asistente Educativo', 'Coordinación de Salud'],
      },
      {
        name: 'Sovereign Clan',
        price: '€129/mes',
        features: ['Nube Privada Familiar', 'Gobernanza Digital', 'Soporte Concierge'],
      },
    ],
  },
  empresas: {
    title: 'ENTORNO EMPRESARIAL',
    description:
      'Sistemas avanzados de automatización industrial y orquestación de inteligencia para negocios.',
    icon: <Building2 className="w-8 h-8" />,
    color: 'from-nexus-violet to-fuchsia-600',
    accent: 'nexus-violet',
    plans: [
      {
        name: 'Enterprise Core',
        price: 'Desde €490/mes',
        features: ['Automatización de Procesos', 'Panel de Control Nexus', 'Soporte 24/7'],
      },
      {
        name: 'Strategic Pulse',
        price: 'Desde €1.490/mes',
        features: ['IA Aplicada por Área', 'Integración CRM/ERP', 'Analítica Predictiva'],
      },
      {
        name: 'God Mode Sovereign',
        price: 'Cotización',
        features: ['Modelos Propietarios', 'Nube Soberana', 'Ingeniería Dedicada'],
      },
    ],
  },
};

export const PricingSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<PlanCategory>('empresas');

  return (
    <section id="pricing" className="py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-at-bottom from-nexus-cyan/5 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-orbitron font-black text-white mb-6 uppercase tracking-tighter">
            SELECCIONE SU <span className="kinetic-text italic">DOMINIO</span>
          </h2>
          <p className="text-nexus-silver/60 max-w-2xl mx-auto text-lg">
            Arquitecturas de inteligencia diseñadas para escalar con su ecosistema, ya sea personal
            o institucional.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {(['familias', 'empresas'] as PlanCategory[]).map(cat => (
            <motion.button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`relative p-10 rounded-3xl border transition-all duration-500 text-left overflow-hidden group ${
                selectedCategory === cat
                  ? `border-white/20 bg-white/5`
                  : 'border-white/5 bg-transparent grayscale opacity-50 hover:opacity-80'
              }`}
            >
              <div className="flex items-center gap-6 mb-4 relative z-10">
                <div
                  className={`p-4 rounded-2xl bg-linear-to-br ${categoryData[cat].color} text-white shadow-lg shadow-white/5`}
                >
                  {categoryData[cat].icon}
                </div>
                <div>
                  <h3 className="text-2xl font-orbitron font-bold text-white tracking-widest uppercase">
                    {categoryData[cat].title}
                  </h3>
                  <div className={`h-1 w-12 mt-2 bg-linear-to-r ${categoryData[cat].color}`} />
                </div>
              </div>
              <p className="text-nexus-silver/40 text-sm leading-relaxed relative z-10">
                {categoryData[cat].description}
              </p>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: 'circOut' }}
            className="grid lg:grid-cols-3 gap-8"
          >
            {categoryData[selectedCategory].plans.map((plan, idx) => (
              <div key={plan.name} className="flex flex-col group">
                <div className="premium-glass p-8 rounded-3xl h-full border-white/5 hover:border-white/20 transition-all duration-500 flex flex-col">
                  <div className="mb-8">
                    <h4 className="font-orbitron text-[10px] tracking-[0.4em] text-nexus-silver/40 mb-4 uppercase">
                      {plan.name}
                    </h4>
                    <div className="text-4xl font-black text-white mb-2 tracking-tight">
                      {plan.price}
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-4">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(idx + 1) * 33}%` }}
                        className={`h-full bg-linear-to-r ${categoryData[selectedCategory].color}`}
                      />
                    </div>
                  </div>

                  <ul className="space-y-4 mb-10 grow">
                    {plan.features.map(f => (
                      <li
                        key={f}
                        className="flex items-start gap-3 text-sm text-nexus-silver/60 group-hover:text-nexus-silver transition-colors"
                      >
                        <CheckCircle2
                          className={`w-4 h-4 mt-0.5 shrink-0 text-white/20 group-hover:text-nexus-cyan-glow`}
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button className="w-full mt-8 py-4 rounded-xl border border-white/10 hover:border-white/30 text-[10px] tracking-[0.4em] uppercase font-bold transition-all hover:bg-white/5 flex items-center justify-center gap-2 group/btn">
                    Adquirir Protocolo
                    <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
