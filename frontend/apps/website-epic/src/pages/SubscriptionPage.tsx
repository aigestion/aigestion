import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  CheckCircle,
  X,
  CreditCard,
  Shield,
  Zap,
  Star,
  Users,
  Smartphone,
  BarChart3,
  Rocket,
  Award,
  Loader2,
} from 'lucide-react';
import {
  subscriptionService,
  SUBSCRIPTION_PLANS,
  SubscriptionPlan,
} from '../services/subscription-service';
import { useAuth } from '../hooks/useAuth';
import { GodModeText } from '../components/design-system/GodModeText';
import { TiltCard } from '../components/design-system/TiltCard';

const SubscriptionPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string>('basic');
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    const loadCurrentSubscription = async () => {
      if (!user?.id) return;

      try {
        const subscription = await subscriptionService.getUserSubscription(user.id);
        setCurrentSubscription(subscription);

        if (subscription?.planId) {
          setSelectedPlan(subscription.planId);
        }
      } catch (error) {
        console.error('[SubscriptionPage] Error loading subscription:', error);
      }
    };

    loadCurrentSubscription();
  }, [user?.id]);

  const handleUpgrade = async (planId: string) => {
    if (!user?.id) return;

    setPaymentLoading(true);

    try {
      // Create payment session
      const { url } = await subscriptionService.createPaymentSession(user.id, planId);

      // Redirect to payment page
      window.location.href = url;
    } catch (error) {
      console.error('[SubscriptionPage] Error creating payment session:', error);
      setPaymentLoading(false);
    }
  };

  const getPlanPrice = (plan: SubscriptionPlan) => {
    if (billingCycle === 'yearly') {
      return {
        monthly: (plan.price * 12 * 0.8).toFixed(2), // 20% discount for yearly
        total: (plan.price * 12 * 0.8).toFixed(2),
        savings: plan.price * 12 * 0.2,
      };
    }
    return {
      monthly: plan.price.toFixed(2),
      total: (plan.price * 12).toFixed(2),
      savings: 0,
    };
  };

  const isCurrentPlan = (planId: string) => {
    return currentSubscription?.planId === planId && currentSubscription?.status === 'active';
  };

  const canUpgrade = (planId: string) => {
    if (!currentSubscription) return true;

    const currentPlan = SUBSCRIPTION_PLANS[currentSubscription.planId];
    const targetPlan = SUBSCRIPTION_PLANS[planId];

    return targetPlan.price > currentPlan.price;
  };

  return (
    <div className="min-h-screen bg-nexus-obsidian text-white">
      <div className="absolute inset-0 z-0">
        <div className="grain-overlay opacity-20" />
        <div className="absolute inset-0 bg-[url('/images/nexus/grid.svg')] bg-center opacity-10" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center py-12 px-6"
        >
          <Crown className="w-16 h-16 text-nexus-cyan mx-auto mb-6" />
          <GodModeText
            text="SUSCRIPCIONES AIGESTION"
            effect="hologram"
            className="text-4xl md:text-5xl font-bold mb-4"
          />
          <p className="text-nexus-silver/60 text-lg max-w-2xl mx-auto">
            Desbloquea todo el potencial de la inteligencia artificial con nuestros planes premium
          </p>
        </motion.div>

        {/* Billing Cycle Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-1 border border-white/10">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-nexus-cyan text-white'
                  : 'text-nexus-silver/60 hover:text-white'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-3 rounded-xl font-medium transition-all relative ${
                billingCycle === 'yearly'
                  ? 'bg-nexus-cyan text-white'
                  : 'text-nexus-silver/60 hover:text-white'
              }`}
            >
              Anual
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                AHORRA 20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.values(SUBSCRIPTION_PLANS).map((plan, index) => {
              const isPopular = plan.id === 'professional';
              const isCurrent = isCurrentPlan(plan.id);
              const canUpgradeTo = canUpgrade(plan.id);
              const price = getPlanPrice(plan);

              return (
                <TiltCard key={plan.id} className="h-full" tiltMaxAngleX={3} tiltMaxAngleY={3}>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`relative bg-black/40 backdrop-blur-xl rounded-2xl p-8 border-2 h-full flex flex-col ${
                      isPopular
                        ? 'border-nexus-cyan shadow-[0_0_30px_rgba(34,211,238,0.3)]'
                        : isCurrent
                          ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                          : 'border-white/10 hover:border-white/20'
                    } transition-all duration-300`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-nexus-cyan to-nexus-violet text-white px-4 py-1 rounded-full text-xs font-bold">
                          MÁS POPULAR
                        </span>
                      </div>
                    )}

                    {isCurrent && (
                      <div className="absolute -top-3 right-4">
                        <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          ACTUAL
                        </div>
                      </div>
                    )}

                    {/* Plan Header */}
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-nexus-cyan">
                          ${billingCycle === 'yearly' ? price.monthly : plan.price}
                        </span>
                        <span className="text-nexus-silver/60">
                          {billingCycle === 'yearly' ? '/mes (facturado anualmente)' : '/mes'}
                        </span>
                      </div>
                      {billingCycle === 'yearly' && price.savings > 0 && (
                        <p className="text-emerald-400 text-sm mt-2">
                          Ahorra ${price.savings.toFixed(2)} al año
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <div className="space-y-4 mb-8 flex-1">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          <span className="text-nexus-silver/80">{feature}</span>
                        </div>
                      ))}

                      {/* Additional Feature Icons */}
                      <div className="pt-4 border-t border-white/10">
                        <div className="grid grid-cols-2 gap-4">
                          {plan.hasDashboardAccess && (
                            <div className="flex items-center gap-2 text-cyan-400">
                              <BarChart3 className="w-4 h-4" />
                              <span className="text-xs">Dashboard</span>
                            </div>
                          )}
                          {plan.hasMobileAccess && (
                            <div className="flex items-center gap-2 text-purple-400">
                              <Smartphone className="w-4 h-4" />
                              <span className="text-xs">App Móvil</span>
                            </div>
                          )}
                          {plan.hasAPIAccess && (
                            <div className="flex items-center gap-2 text-orange-400">
                              <Zap className="w-4 h-4" />
                              <span className="text-xs">API</span>
                            </div>
                          )}
                          {plan.hasPrioritySupport && (
                            <div className="flex items-center gap-2 text-emerald-400">
                              <Shield className="w-4 h-4" />
                              <span className="text-xs">Soporte 24/7</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      whileHover={{ scale: isCurrent || !canUpgradeTo ? 1 : 1.02 }}
                      whileTap={{ scale: isCurrent || !canUpgradeTo ? 1 : 0.98 }}
                      onClick={() => (isCurrent ? {} : handleUpgrade(plan.id))}
                      disabled={isCurrent || !canUpgradeTo || paymentLoading}
                      className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                        isCurrent
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                          : canUpgradeTo
                            ? isPopular
                              ? 'bg-gradient-to-r from-nexus-cyan to-nexus-violet text-white shadow-lg hover:shadow-xl'
                              : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                            : 'bg-white/5 text-nexus-silver/40 cursor-not-allowed'
                      }`}
                    >
                      {paymentLoading && selectedPlan === plan.id ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Procesando...
                        </div>
                      ) : isCurrent ? (
                        'PLAN ACTUAL'
                      ) : canUpgradeTo ? (
                        <div className="flex items-center justify-center gap-2">
                          <Rocket className="w-4 h-4" />
                          ACTUALIZAR AHORA
                        </div>
                      ) : (
                        'NO DISPONIBLE'
                      )}
                    </motion.button>
                  </motion.div>
                </TiltCard>
              );
            })}
          </div>
        </div>

        {/* Current Subscription Status */}
        {currentSubscription && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="max-w-4xl mx-auto px-6 pb-12"
          >
            <TiltCard className="h-full" tiltMaxAngleX={2} tiltMaxAngleY={2}>
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Award className="w-6 h-6 text-nexus-cyan" />
                  Estado Actual de tu Suscripción
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-nexus-silver/60 text-sm mb-1">Plan Actual</p>
                    <p className="text-xl font-bold text-white">
                      {SUBSCRIPTION_PLANS[currentSubscription.planId]?.name || 'Gratis'}
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-nexus-silver/60 text-sm mb-1">Estado</p>
                    <p
                      className={`text-xl font-bold ${
                        currentSubscription.status === 'active'
                          ? 'text-emerald-400'
                          : 'text-red-400'
                      }`}
                    >
                      {currentSubscription.status === 'active'
                        ? 'Activa'
                        : currentSubscription.status === 'expired'
                          ? 'Expirada'
                          : currentSubscription.status === 'cancelled'
                            ? 'Cancelada'
                            : currentSubscription.status}
                    </p>
                  </div>

                  {currentSubscription.endDate && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-nexus-silver/60 text-sm mb-1">Próximo Renovación</p>
                      <p className="text-xl font-bold text-white">
                        {new Date(currentSubscription.endDate).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() =>
                      (window.location.href =
                        'mailto:soporte@aigestion.net?subject=Consulta%20de%20Suscripción')
                    }
                    className="px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors border border-white/20 flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    Contactar Soporte
                  </button>

                  {currentSubscription.status === 'active' &&
                    currentSubscription.planId !== 'free' && (
                      <button
                        onClick={() => {
                          if (confirm('¿Estás seguro de que quieres cancelar tu suscripción?')) {
                            subscriptionService.cancelSubscription(user!.id);
                          }
                        }}
                        className="px-6 py-3 bg-red-500/10 text-red-400 rounded-xl font-medium hover:bg-red-500/20 transition-colors border border-red-500/20"
                      >
                        Cancelar Suscripción
                      </button>
                    )}
                </div>
              </div>
            </TiltCard>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;
