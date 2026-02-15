import { motion } from 'framer-motion';
import React from 'react';

const cases = [
  {
    sector: 'Taller Hermanos García',
    title: 'De los papeles acumulados al control total',
    impact: [
      'Facturas listas en 2 minutos hablando al móvil',
      'Control de piezas y recambios sin errores',
      'Antonio ahora llega a cenar con su familia',
    ],
  },
  {
    sector: 'Sara, Diseñadora Freelance',
    title: 'Volver a disfrutar del trabajo creativo',
    impact: [
      'Contabilidad automática mientras trabaja',
      'Gestión de clientes sin estrés ni olvidos',
      'Sábados y domingos de descanso real',
    ],
  },
  {
    sector: 'Familia Martínez',
    title: 'El fin de la confusión en casa',
    impact: [
      'Citas médicas y recados siempre a mano',
      'Gastos del hogar bajo control y compartidos',
      'Se acabaron las dudas de "¿quién tenía que comprar esto?"',
    ],
  },
];

export const CaseStudies: React.FC = () => (
  <section
    id="cases"
    className="py-32 bg-gradient-to-b from-black via-gray-900/30 to-black relative"
  >
    <div className="absolute inset-0 bg-radial-at-center from-nexus-cyan/10 via-transparent to-transparent" />

    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-5xl md:text-7xl font-orbitron font-black text-white mb-4">
          HISTORIAS DE <span className="text-nexus-violet text-glow">ÉXITO</span>
        </h2>
        <p className="text-lg text-nexus-silver/70 max-w-3xl mx-auto">
          Resultados reales para personas reales. Mira cómo ayudamos a simplificar el día a día.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {cases.map((item, index) => (
          <motion.div
            key={item.title}
            className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="text-xs font-orbitron tracking-[0.3em] text-nexus-cyan-glow mb-4 uppercase">
              {item.sector}
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
            <ul className="space-y-3 text-sm text-nexus-silver/70">
              {item.impact.map(point => (
                <li key={point} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-nexus-cyan" />
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
