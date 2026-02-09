import { motion } from 'framer-motion';
import React from 'react';

const faqs = [
  {
    q: '¿Cuánto tarda la implementación?',
    a: 'Entre 2 y 6 semanas según complejidad. Empezamos con un piloto rápido para medir impacto.',
  },
  {
    q: '¿Cómo se protege la información?',
    a: 'Usamos gobernanza, cifrado, roles y auditoría completa. También podemos operar en infraestructura privada.',
  },
  {
    q: '¿AIGestion se integra con mis sistemas?',
    a: 'Sí. Integración con ERP, CRM, BI, data lakes y APIs personalizadas sin fricción.',
  },
  {
    q: '¿Tienen planes para gremios o asociaciones?',
    a: 'Sí. Contamos con planes por miembro y funcionalidades específicas para gestión gremial.',
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
