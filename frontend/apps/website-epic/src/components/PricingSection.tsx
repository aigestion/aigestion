import { AnimatePresence, motion } from 'framer-motion';
import {
  Building2,
  Home,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Lock,
  Trophy,
} from 'lucide-react';
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { TiltCard } from './design-system/TiltCard';
import { GodModeText } from './design-system/GodModeText';

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

  const { setIsContactModalOpen } = useAppContext();

  return (
    <section id="pricing" className="py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-at-bottom from-nexus-cyan/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[url('/images/nexus/grid.svg')] bg-center opacity-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center mb-4">
            <span className="px-4 py-1 rounded-full border border-nexus-cyan/30 bg-nexus-cyan/5 text-nexus-cyan text-[10px] font-orbitron tracking-[0.2em] uppercase backdrop-blur-md">
              Protocolos de Acceso
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter flex flex-col items-center gap-4">
            <GodModeText
              text="PLAN EMPRESA O FAMILIAR"
              effect="holographic"
              className="font-orbitron"
            />
            <div className="flex gap-4 opacity-50">
              <Home className="w-8 h-8 text-nexus-cyan" />
              <Building2 className="w-8 h-8 text-nexus-violet" />
            </div>
          </h2>
          <p className="text-nexus-silver/60 max-w-2xl mx-auto text-lg font-light tracking-wide">
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
                  ? `border-white/20 bg-white/5 shadow-[0_0_30px_rgba(255,255,255,0.05)]`
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
              <p className="text-nexus-silver/40 text-sm leading-relaxed relative z-10 font-light">
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
              <TiltCard key={plan.name} className="h-full">
                <div className="premium-glass p-8 rounded-3xl h-full border-white/5 hover:border-nexus-cyan/30 transition-all duration-500 flex flex-col relative overflow-hidden group">
                  {/* Hover Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${categoryData[selectedCategory].color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-8">
                      <h4 className="font-orbitron text-[10px] tracking-[0.4em] text-nexus-silver/40 mb-4 uppercase">
                        {plan.name}
                      </h4>
                      <div className="text-4xl font-black text-white mb-2 tracking-tight">
                        <GodModeText text={plan.price} effect="neon" className="font-orbitron" />
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-4">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(idx + 1) * 33}%` }}
                          className={`h-full bg-linear-to-r ${categoryData[selectedCategory].color} shadow-[0_0_10px_rgba(255,255,255,0.5)]`}
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
                          <span className="font-light tracking-wide">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => setIsContactModalOpen(true)}
                      className="w-full mt-8 py-4 rounded-xl border border-white/10 hover:border-nexus-cyan/50 text-[10px] tracking-[0.4em] uppercase font-bold transition-all hover:bg-nexus-cyan/10 flex items-center justify-center gap-2 group/btn relative overflow-hidden"
                    >
                      <span className="relative z-10">Adquirir Protocolo</span>
                      <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform relative z-10" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
                    </button>
                  </div>
                </div>
              </TiltCard>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Trust Signals Section */}
        <motion.div
          className="mt-20 pt-10 border-t border-white/5 flex flex-wrap justify-center items-center gap-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 text-nexus-silver/30 group hover:text-nexus-cyan/80 transition-colors">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] tracking-widest uppercase font-bold">
              Infraestructura Segura
            </span>
          </div>
          <div className="flex items-center gap-3 text-nexus-silver/30 group hover:text-nexus-violet/80 transition-colors">
            <Lock className="w-5 h-5" />
            <span className="text-[10px] tracking-widest uppercase font-bold">
              Bóveda Soberana Cifrada
            </span>
          </div>
          <div className="flex items-center gap-3 text-nexus-silver/30 group hover:text-white/80 transition-colors">
            <Trophy className="w-5 h-5" />
            <span className="text-[10px] tracking-widest uppercase font-bold">
              Excelencia Garantizada
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
