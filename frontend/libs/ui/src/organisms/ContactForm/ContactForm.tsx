import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { Input } from '../../atoms/Input';
import { Button } from '../../atoms/Button';
import { Card } from '../../atoms/Card';

export interface ContactFormProps {
  title?: string;
  description?: string;
  onSubmit: (data: any) => Promise<void>;
  variant?: 'glass' | 'neon';
  className?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  title = "INICIAR CONEXIÓN",
  description = "Completa el protocolo para establecer comunicación con el Nexus.",
  onSubmit,
  variant = 'glass',
  className,
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

  if (isSuccess) {
    return (
      <Card variant={variant} className={cn('p-12 text-center', className)}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-20 h-20 bg-nexus-cyan/20 rounded-full flex items-center justify-center border border-nexus-cyan">
            <span className="text-4xl">✓</span>
          </div>
          <h3 className="text-2xl font-orbitron font-black text-white uppercase tracking-widest">
            Protocolo Completado
          </h3>
          <p className="text-gray-400">
            Tu mensaje ha sido transmitido a través de la red neural. Contactaremos en breve.
          </p>
          <Button variant="outline" onClick={() => setIsSuccess(false)}>
            Nueva Conexión
          </Button>
        </motion.div>
      </Card>
    );
  }

  return (
    <Card variant={variant} className={cn('p-8 md:p-12', className)}>
      <div className="mb-10 text-center">
        <h3 className="text-2xl font-orbitron font-black text-white uppercase tracking-widest mb-4">
          {title}
        </h3>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          {description}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Identificación"
            placeholder="Introduce tu nombre"
            variant="glass"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Dirección Neural"
            type="email"
            placeholder="tu@email.com"
            variant="glass"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <Input
          label="Módulo"
          placeholder="Asunto de la comunicación"
          variant="glass"
          required
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        />

        <div className="flex flex-col gap-2">
          <label htmlFor="message-data" className="block text-sm font-medium text-white/80">Mensaje de Datos</label>
          <textarea
            id="message-data"
            required
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-nexus-violet transition-all"
            placeholder="Tu mensaje..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full h-14"
          isLoading={isSubmitting}
        >
          EJECUTAR TRANSMISIÓN
        </Button>
      </form>
    </Card>
  );
};
