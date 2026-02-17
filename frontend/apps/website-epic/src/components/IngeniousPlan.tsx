import { motion } from 'framer-motion';
import React from 'react';

const phases = [
  {
    title: 'Fase 1 · Diagnóstico Inteligente',
    description:
      'Mapeamos procesos, riesgos y oportunidades. Creamos un blueprint con prioridades y quick wins.',
    outcomes: ['Mapa de procesos críticos', 'Matriz de impacto', 'Propuesta de pilotos'],
  },
  {
    title: 'Fase 2 · Piloto de Alto Impacto',
    description:
      'Implementamos un MVP con IA aplicada y métricas claras para validar el ROI en semanas.',
    outcomes: ['Automatización inicial', 'KPIs con tablero', 'Validación ejecutiva'],
  },
  {
    title: 'Fase 3 · Escala Soberana',
    description:
      'Extendemos la IA al resto del ecosistema con gobernanza, seguridad y optimización continua.',
    outcomes: ['Orquestación multi-área', 'Gobernanza y compliance', 'Centro de excelencia'],
  },
];

import { GodModeText } from './design-system/GodModeText';
import { TiltCard } from './design-system/TiltCard';

export const IngeniousPlan: React.FC = () => (
  <section
    id="plan"
    className="py-32 bg-gradient-to-b from-black via-nexus-obsidian to-black relative"
  >
    <div className="absolute inset-0 bg-radial-at-center from-nexus-violet/10 via-transparent to-transparent" />

    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="mb-4">
          <GodModeText text="PLAN" className="text-5xl md:text-7xl mr-4" effect="none" />
          <GodModeText
            text="INGENIOSO"
            className="text-5xl md:text-7xl text-nexus-violet"
            effect="glitch"
          />
        </div>
        <p className="text-lg text-nexus-silver/70 max-w-3xl mx-auto font-orbitron">
          Un enfoque estratégico para desplegar IA con resultados rápidos y escalables.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {phases.map((phase, index) => (
          <TiltCard key={phase.title} className="h-full" tiltMaxAngleX={5} tiltMaxAngleY={5}>
            <motion.div
              className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md h-full group hover:border-nexus-violet/30 transition-colors"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-white mb-4 font-orbitron group-hover:text-nexus-violet transition-colors">
                {phase.title}
              </h3>
              <p className="text-sm text-nexus-silver/70 mb-6 font-sans">{phase.description}</p>
              <ul className="space-y-2 text-xs text-nexus-silver/60 pt-4 border-t border-white/5">
                {phase.outcomes.map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-nexus-violet shadow-[0_0_5px_#8b5cf6]" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </TiltCard>
        ))}
      </div>
    </div>
  </section>
);
