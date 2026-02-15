import { motion } from 'framer-motion';
import React from 'react';

const faqs = [
  {
    q: '¿Tengo que saber de informática?',
    a: 'Nada de nada. Si sabes enviar un audio por WhatsApp o usar el móvil para llamar, ya sabes usar AIGestion. Daniela te guía en todo.',
  },
  {
    q: '¿Mis datos están seguros?',
    a: 'Totalmente. Es como una caja fuerte digital. Tus datos son solo tuyos y nadie más puede ver tus cosas privadas.',
  },
  {
    q: '¿Esto es solo para empresas grandes?',
    a: 'Al revés. Está hecho para autónomos, familias y pequeñas tiendas que no tienen tiempo de aprender programas complejos.',
  },
  {
    q: '¿Es difícil de instalar?',
    a: 'No hay que instalar nada raro. Pulsas un botón, entras con tu correo y ya puedes empezar a organizar tu vida.',
  },
];

export const FAQSection: React.FC = () => (
  <section id="faq" className="py-32 bg-gradient-to-b from-black via-gray-900/40 to-black">
    <div className="max-w-6xl mx-auto px-6">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-6xl font-orbitron font-black text-white mb-4">
          PREGUNTAS <span className="text-nexus-violet text-glow">CLAVE</span>
        </h2>
        <p className="text-nexus-silver/70">Resolvemos dudas críticas antes de implementar.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {faqs.map((item, index) => (
          <motion.div
            key={item.q}
            className="p-6 rounded-2xl border border-white/10 bg-white/5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white font-semibold mb-2">{item.q}</h3>
            <p className="text-sm text-nexus-silver/70">{item.a}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
