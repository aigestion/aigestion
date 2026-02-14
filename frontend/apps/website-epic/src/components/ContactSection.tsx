import { useSoundEffects } from '../hooks/useSoundEffects';
import { motion } from 'framer-motion';
import { ContactForm } from './ContactForm';
import { GlitchText } from './GlitchText';

export const ContactSection: React.FC = () => {
  const { playHover, playSuccess } = useSoundEffects();

  return (
    <section
      id="contact"
      className="relative py-32 bg-gradient-to-b from-black via-nexus-obsidian to-black overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(138,43,226,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(0,245,255,0.1),transparent_60%)]" />

        {/* Floating Elements */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-nexus-cyan rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 2, 1],
              y: [0, -100, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-7xl font-orbitron font-black text-white mb-6">
            CONECTA CON EL
            <span className="block text-nexus-cyan text-glow">
              <GlitchText text="FUTURO HOY" />
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Da el primer paso hacia la transformación digital cuántica
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <ContactForm
              title="INICIA TU TRANSFORMACIÓN"
              description="Establece el protocolo de conexión con el Nexus para integrar IA soberana en tu ecosistema."
              variant="glass"
              onSubmit={async data => {
                console.log('Establishing connection...', data);
                try {
                  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/contact`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'x-api-key': import.meta.env.VITE_API_KEY || '',
                    },
                    body: JSON.stringify(data),
                  });
                  if (!response.ok) throw new Error('Transmission failed');
                  playSuccess();
                } catch (error) {
                  console.error('Matriz error:', error);
                  throw error; // Let the form component handle the error state if it has one
                }
              }}
            />
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Quick Contact */}
            <div className="p-8 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl">
              <h3 className="text-2xl font-orbitron font-bold text-white mb-6">Contacto Rápido</h3>

              <div className="space-y-6">
                <motion.div
                  className="flex items-center gap-4"
                  whileHover={{ x: 5 }}
                  onMouseEnter={playHover}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-nexus-violet to-nexus-cyan rounded-lg flex items-center justify-center">
                    <span className="text-xl">📧</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">Email</div>
                    <div className="text-nexus-cyan">contact@aigestion.net</div>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center gap-4"
                  whileHover={{ x: 5 }}
                  onMouseEnter={playHover}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-nexus-violet to-nexus-cyan rounded-lg flex items-center justify-center">
                    <span className="text-xl">📱</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">WhatsApp</div>
                    <div className="text-nexus-cyan">+34 600 000 000</div>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center gap-4"
                  whileHover={{ x: 5 }}
                  onMouseEnter={playHover}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-nexus-violet to-nexus-cyan rounded-lg flex items-center justify-center">
                    <span className="text-xl">📍</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">Sede Global</div>
                    <div className="text-nexus-cyan">Madrid, España & NYC, USA</div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Office Hours */}
            <div className="p-8 bg-white/5 border border-nexus-cyan/30 backdrop-blur-sm rounded-2xl">
              <h3 className="text-2xl font-orbitron font-bold text-white mb-6">
                Horario de Atención
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Lunes - Viernes</span>
                  <span className="text-nexus-cyan font-medium">9:00 - 18:00 CET</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Sábados</span>
                  <span className="text-nexus-cyan font-medium">10:00 - 14:00 CET</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Soporte 24/7</span>
                  <span className="text-green-400 font-medium">SIEMPRE ACTIVO</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="p-8 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl">
              <h3 className="text-2xl font-orbitron font-bold text-white mb-6">
                Conecta con Nosotros
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'LinkedIn', icon: '💼', color: 'from-blue-500 to-blue-700' },
                  { name: 'Twitter', icon: '🐦', color: 'from-sky-400 to-sky-600' },
                  { name: 'GitHub', icon: '🐙', color: 'from-gray-600 to-gray-800' },
                  { name: 'YouTube', icon: '📺', color: 'from-red-500 to-red-700' },
                ].map(social => (
                  <motion.button
                    key={social.name}
                    className={`p-4 bg-gradient-to-br ${social.color} rounded-xl text-white font-medium hover:scale-105 transition-transform`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={playHover}
                  >
                    <div className="text-2xl mb-1">{social.icon}</div>
                    <div className="text-sm">{social.name}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
