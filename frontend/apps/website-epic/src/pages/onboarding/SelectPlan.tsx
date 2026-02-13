import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown, ArrowRight } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const plans = [
  {
    id: 'free',
    name: 'INITIATE',
    price: '$0',
    period: '/mes',
    description: 'Acceso esencial al sistema Nexus.',
    features: ['Acceso Básico', '5 Consultas/día', 'Soporte Comunitario', 'Almacenamiento 1GB'],
    color: 'nexus-silver',
    icon: Star,
  },
  {
    id: 'pro',
    name: 'OPERATOR',
    price: '$29',
    period: '/mes',
    description: 'Capacidades ampliadas para usuarios activos.',
    features: [
      'Consultas Ilimitadas',
      'Prioridad de Proceso',
      'Soporte Prioritario',
      'Almacenamiento 50GB',
      'Acceso a Herramientas Beta',
    ],
    color: 'nexus-cyan',
    icon: Zap,
    popular: true,
  },
  {
    id: 'god',
    name: 'GOD MODE',
    price: '$99',
    period: '/mes',
    description: 'Poder absoluto sobre tu ecosistema digital.',
    features: [
      'Infraestructura Dedicada',
      'Soporte 24/7 Dedicado',
      'Almacenamiento Ilimitado',
      'Acceso API Completo',
      'Consultoría Personalizada',
      'Hardware Integration',
    ],
    color: 'nexus-violet',
    icon: Crown,
  },
];

export const SelectPlan: React.FC = () => {
  const { user, updatePlan } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId);
    if (!user?.id) return;

    setLoading(true);
    try {
      // Simulate processing or Stripe redirection here
      await updatePlan(user.id, planId);
      // After plan selection, go to dashboard or onboarding complete
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating plan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nexus-obsidian flex flex-col items-center justify-center p-4 relative overflow-y-auto">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-nexus-violet/20 via-nexus-obsidian to-nexus-obsidian pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center my-12 relative z-10"
      >
        <h1 className="text-4xl font-orbitron font-black text-white mb-4 tracking-wider text-glow">
          NIVEL DE ACCESO
        </h1>
        <p className="text-nexus-silver/60">
          Selecciona la potencia de cómputo asignada a tu nodo.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl w-full relative z-10 pb-12">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          const isSelected = selectedPlan === plan.id;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`premium-glass p-8 rounded-2xl border transition-all duration-300 relative group flex flex-col ${
                plan.popular
                  ? 'border-nexus-cyan/50 shadow-[0_0_30px_rgba(0,245,255,0.1)]'
                  : 'border-white/5'
              } ${isSelected ? 'ring-2 ring-white scale-[1.02]' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-nexus-cyan text-nexus-obsidian text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                  RECOMENDADO
                </div>
              )}

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-${plan.color === 'nexus-violet' ? 'nexus-violet' : plan.color === 'nexus-cyan' ? 'nexus-cyan' : 'white'}/10`}
              >
                <Icon
                  className={`h-6 w-6 text-${plan.color === 'nexus-silver' ? 'white' : plan.color}`}
                />
              </div>

              <h3 className="text-xl font-orbitron font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold text-white tracking-tight">{plan.price}</span>
                <span className="text-nexus-silver/60 ml-1">{plan.period}</span>
              </div>

              <p className="text-nexus-silver/60 text-sm mb-8 border-b border-white/5 pb-8 min-h-[60px]">
                {plan.description}
              </p>

              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-start text-sm text-nexus-silver/80">
                    <Check
                      className={`h-4 w-4 mr-3 shrink-0 ${plan.color === 'nexus-violet' ? 'text-nexus-violet' : 'text-nexus-cyan'}`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={loading && isSelected}
                className={`w-full py-3 font-orbitron font-bold tracking-widest rounded-xl transition-all border ${
                  plan.id === 'god'
                    ? 'bg-gradient-to-r from-nexus-violet to-nexus-cyan text-white hover:shadow-[0_0_20px_rgba(138,43,226,0.4)] border-transparent'
                    : 'bg-white/5 hover:bg-white text-white hover:text-nexus-obsidian border-white/10'
                }`}
              >
                {loading && isSelected ? 'PROCESANDO' : 'SELECCIONAR'}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
