import { motion } from 'framer-motion';
import { Briefcase, Heart, Check, ArrowRight } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const SelectRole: React.FC = () => {
  const { user, updateRole } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'family' | 'professional' | null>(null);

  const handleContinue = async () => {
    if (!selectedRole || !user?.id) return;

    setLoading(true);
    try {
      await updateRole(user.id, selectedRole);
      navigate('/onboarding/plan');
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nexus-obsidian flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-nexus-violet/10 via-transparent to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 relative z-10"
      >
        <h1 className="text-4xl font-orbitron font-black text-white mb-4 tracking-wider text-glow">
          IDENTIDAD DIGITAL
        </h1>
        <p className="text-nexus-silver/60 max-w-xl mx-auto">
          Define el propósito de tu inteligencia soberana. Cada camino desbloquea capacidades
          únicas.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full relative z-10">
        {/* Family Role */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => setSelectedRole('family')}
          className={`cursor-pointer premium-glass p-8 rounded-2xl border transition-all duration-300 relative group overflow-hidden ${
            selectedRole === 'family'
              ? 'border-nexus-cyan shadow-[0_0_30px_rgba(0,245,255,0.2)] bg-nexus-cyan/5'
              : 'border-white/5 hover:border-nexus-cyan/30'
          }`}
        >
          {selectedRole === 'family' && (
            <div className="absolute top-4 right-4">
              <div className="bg-nexus-cyan rounded-full p-1">
                <Check className="h-4 w-4 text-nexus-obsidian" />
              </div>
            </div>
          )}
          <div className="bg-nexus-cyan/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-nexus-cyan/30 shadow-[0_0_20px_rgba(0,245,255,0.2)]">
            <Heart className="h-8 w-8 text-nexus-cyan" />
          </div>
          <h3 className="text-2xl font-orbitron font-bold text-white mb-2">FAMILY</h3>
          <p className="text-nexus-silver/60 text-sm mb-6">
            Gestión integral del hogar, finanzas familiares, calendario compartido y seguridad
            digital para tus seres queridos.
          </p>
          <ul className="space-y-3">
            {[
              'Control Financiero',
              'Calendario Inteligente',
              'Protección de Datos',
              'Asistente del Hogar',
            ].map(item => (
              <li key={item} className="flex items-center text-sm text-nexus-silver/80">
                <div className="w-1.5 h-1.5 rounded-full bg-nexus-cyan mr-3" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Professional Role */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => setSelectedRole('professional')}
          className={`cursor-pointer premium-glass p-8 rounded-2xl border transition-all duration-300 relative group overflow-hidden ${
            selectedRole === 'professional'
              ? 'border-nexus-violet shadow-[0_0_30px_rgba(138,43,226,0.2)] bg-nexus-violet/5'
              : 'border-white/5 hover:border-nexus-violet/30'
          }`}
        >
          {selectedRole === 'professional' && (
            <div className="absolute top-4 right-4">
              <div className="bg-nexus-violet rounded-full p-1">
                <Check className="h-4 w-4 text-white" />
              </div>
            </div>
          )}
          <div className="bg-nexus-violet/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-nexus-violet/30 shadow-[0_0_20px_rgba(138,43,226,0.2)]">
            <Briefcase className="h-8 w-8 text-nexus-violet" />
          </div>
          <h3 className="text-2xl font-orbitron font-bold text-white mb-2">PROFESSIONAL</h3>
          <p className="text-nexus-silver/60 text-sm mb-6">
            Optimización de flujo de trabajo, gestión de proyectos, análisis avanzado y herramientas
            de productividad ejecutiva.
          </p>
          <ul className="space-y-3">
            {[
              'Gestión de Proyectos',
              'Análisis de Datos',
              'Automatización de Tareas',
              'Reportes Avanzados',
            ].map(item => (
              <li key={item} className="flex items-center text-sm text-nexus-silver/80">
                <div className="w-1.5 h-1.5 rounded-full bg-nexus-violet mr-3" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: selectedRole ? 1 : 0 }}
        className="mt-12"
      >
        <button
          onClick={handleContinue}
          disabled={!selectedRole || loading}
          className="px-12 py-4 bg-nexus-cyan text-black font-orbitron font-bold tracking-[0.2em] rounded-xl hover:shadow-[0_0_30px_rgba(0,245,255,0.5)] hover:bg-nexus-cyan/90 transition-all transform hover:scale-[1.02] flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'PROCESANDO...' : 'CONTINUAR'} <ArrowRight className="h-5 w-5" />
        </button>
      </motion.div>
    </div>
  );
};
