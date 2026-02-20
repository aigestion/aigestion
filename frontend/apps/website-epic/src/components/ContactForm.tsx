import { motion } from 'framer-motion';
import React, { useState } from 'react';

export interface ContactFormProps {
  title?: string;
  description?: string;
  onSubmit: (data: any) => Promise<void>;
  variant?: 'glass' | 'neon';
  className?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  title = 'INICIAR CONEXIÓN',
  description = 'Completa el protocolo para establecer comunicación con el Nexus.',
  onSubmit,
  variant = 'glass',
  className = '',
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setIsSuccess(true);
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-nexus-violet transition-all font-orbitron text-sm';
  const labelClasses =
    'block text-xs font-orbitron font-bold text-nexus-cyan mb-2 tracking-wider uppercase';

  if (isSuccess) {
    return (
      <div
        className={`p-12 text-center rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md ${className}`}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-20 h-20 bg-nexus-cyan/20 rounded-full flex items-center justify-center border border-nexus-cyan box-shadow-glow">
            <span className="text-4xl text-nexus-cyan">✓</span>
          </div>
          <h3 className="text-2xl font-orbitron font-black text-white uppercase tracking-widest">
            Protocolo Completado
          </h3>
          <p className="text-gray-400">
            Tu mensaje ha sido transmitido a través de la red neural. Contactaremos en breve.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="px-6 py-3 border border-nexus-cyan/50 text-nexus-cyan font-orbitron font-bold rounded hover:bg-nexus-cyan/10 transition-colors uppercase tracking-widest text-xs"
          >
            Nueva Conexión
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={`p-8 md:p-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md ${className}`}
    >
      <div className="mb-10 text-center">
        <h3 className="text-2xl font-orbitron font-black text-white uppercase tracking-widest mb-4">
          {title}
        </h3>
        <p className="text-gray-400 text-sm max-w-md mx-auto">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClasses}>Identificación</label>
            <input
              type="text"
              placeholder="Introduce tu nombre"
              required
              className={inputClasses}
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClasses}>Dirección Neural</label>
            <input
              type="email"
              placeholder="tu@email.com"
              required
              className={inputClasses}
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className={labelClasses}>Módulo</label>
          <input
            type="text"
            placeholder="Asunto de la comunicación"
            required
            className={inputClasses}
            value={formData.subject}
            onChange={e => setFormData({ ...formData, subject: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClasses}>Mensaje de Datos</label>
          <textarea
            required
            rows={4}
            className={inputClasses}
            placeholder="Tu mensaje..."
            value={formData.message}
            onChange={e => setFormData({ ...formData, message: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full h-14 bg-gradient-to-r from-nexus-violet to-nexus-cyan text-white font-orbitron font-bold text-lg tracking-widest uppercase rounded-lg hover:shadow-[0_0_20px_rgba(138,43,226,0.5)] transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'TRANSMITIENDO...' : 'EJECUTAR TRANSMISIÓN'}
        </button>
      </form>
    </div>
  );
};
