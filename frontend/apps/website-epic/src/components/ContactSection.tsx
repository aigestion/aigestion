import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { MagneticWrapper } from './MagneticWrapper';
import { GlitchText } from './GlitchText';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    interest: 'demo'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { playHover, playClick, playSuccess, playWhoosh } = useSoundEffects();

  const interests = [
    { id: 'demo', label: 'Demo Personalizada', icon: '🎬' },
    { id: 'consultation', label: 'Consultoría', icon: '💼' },
    { id: 'partnership', label: 'Partnership', icon: '🤝' },
    { id: 'enterprise', label: 'Solución Enterprise', icon: '🏢' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    playSuccess();
    setIsSubmitted(true);
    setIsSubmitting(false);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        company: '',
        message: '',
        interest: 'demo',
      });
    }, 4000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    // Play tick on input focus/change could be annoying, so skip or use very subtle
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
            <div className="premium-glass p-8 rounded-3xl border border-white/20">
              <h3 className="text-2xl font-orbitron font-bold text-white mb-8">
                Inicia tu Transformación
              </h3>

              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Name and Email */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nombre *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-500 nexus-input-focus transition-colors"
                          placeholder="Tu nombre"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email *
                        </label>
                        <input
                          required
                          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 nexus-input-focus transition-all duration-300 hover:border-white/20 hover:bg-black/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>

                    {/* Company */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Empresa
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 nexus-input-focus-violet transition-all duration-300 hover:border-white/20 hover:bg-black/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
                        placeholder="Tu empresa"
                      />
                    </div>

                    {/* Interest */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Interés Principal
                      </label>
                      <select
                        name="interest"
                        value={formData.interest}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white nexus-input-focus transition-colors"
                      >
                        {interests.map((interest) => (
                          <option key={interest.id} value={interest.id}>
                            {interest.icon} {interest.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Mensaje
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-500 nexus-input-focus transition-colors resize-none"
                        placeholder="Cuéntanos sobre tus necesidades..."
                      />
                    </div>

                    {/* Submit Button */}
                    <MagneticWrapper strength={40}>
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        onMouseEnter={() => !isSubmitting && playHover()}
                        className="w-full btn-enterprise py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-3">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Enviando...
                          </span>
                        ) : (
                          'INICIAR TRANSFORMACIÓN'
                        )}
                      </motion.button>
                    </MagneticWrapper>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <div className="text-6xl mb-4">🚀</div>
                    <h4 className="text-2xl font-orbitron font-bold text-nexus-cyan mb-4">
                      ¡Mensaje Enviado!
                    </h4>
                    <p className="text-gray-300">
                      Nos pondremos en contacto contigo en menos de 24 horas
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
            <div className="premium-glass p-8 rounded-3xl border border-nexus-violet/30">
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
            <div className="premium-glass p-8 rounded-3xl border border-nexus-cyan/30">
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
            <div className="premium-glass p-8 rounded-3xl border border-white/20">
              <h3 className="text-2xl font-orbitron font-bold text-white mb-6">
                Conecta con Nosotros
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'LinkedIn', icon: '💼', color: 'from-blue-500 to-blue-700' },
                  { name: 'Twitter', icon: '🐦', color: 'from-sky-400 to-sky-600' },
                  { name: 'GitHub', icon: '🐙', color: 'from-gray-600 to-gray-800' },
                  { name: 'YouTube', icon: '📺', color: 'from-red-500 to-red-700' },
                ].map((social) => (
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
