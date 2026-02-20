import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Crown,
  Shield,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  CreditCard,
  ArrowRight,
  Star,
  Rocket,
  Users,
  Smartphone,
  BarChart3,
} from 'lucide-react';
import { subscriptionService, SubscriptionValidation, SUBSCRIPTION_PLANS } from '../../services/subscription-service';
import { useAuth } from '../../hooks/useAuth';
import { GodModeText } from '../design-system/GodModeText';
import { TiltCard } from '../design-system/TiltCard';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  accessType: 'dashboard' | 'mobile' | 'api';
  fallback?: React.ReactNode;
  onAccessDenied?: (validation: SubscriptionValidation) => void;
  showUpgradePrompt?: boolean;
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({
  children,
  accessType,
  fallback,
  onAccessDenied,
  showUpgradePrompt = true,
}) => {
  const { user } = useAuth();
  const [validation, setValidation] = useState<SubscriptionValidation | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    const validateSubscription = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const result = await subscriptionService.validateAccess(user.id, accessType);
        setValidation(result);
        
        if (!result.restrictions[`canAccess${accessType.charAt(0).toUpperCase() + accessType.slice(1)}` as keyof typeof result.restrictions]) {
          onAccessDenied?.(result);
          if (showUpgradePrompt) {
            setShowUpgradeModal(true);
          }
        }
      } catch (error) {
        console.error('[SubscriptionGuard] Error validating subscription:', error);
        // En caso de error, permitir acceso (fail-safe)
        setValidation({
          isValid: true,
          plan: SUBSCRIPTION_PLANS.free,
          subscription: null,
          restrictions: {
            canAccessDashboard: true,
            canAccessMobile: true,
            canAccessAPI: true,
            maxProjectsReached: false,
            maxUsersReached: false,
            daysUntilExpiry: Infinity,
            isTrial: false,
            isExpired: false,
          },
          messages: [],
        });
      } finally {
        setLoading(false);
      }
    };

    validateSubscription();
  }, [user?.id, accessType, onAccessDenied, showUpgradePrompt]);

  const canAccess = validation?.restrictions[`canAccess${accessType.charAt(0).toUpperCase() + accessType.slice(1)}` as keyof typeof validation.restrictions];

  if (loading) {
    return (
      <div className="min-h-screen bg-nexus-obsidian flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-nexus-cyan/20 border-t-nexus-cyan rounded-full"
        />
      </div>
    );
  }

  if (canAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <AnimatePresence mode="wait">
      {showUpgradeModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setShowUpgradeModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-nexus-obsidian border border-nexus-cyan/20 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-nexus-cyan to-nexus-violet rounded-2xl mb-4"
              >
                <Lock className="w-10 h-10 text-white" />
              </motion.div>
              
              <GodModeText
                text="CONTENIDO PREMIUM"
                effect="hologram"
                className="text-3xl md:text-4xl font-bold text-white mb-2"
              />
              
              <p className="text-nexus-silver/60 text-lg">
                {validation?.messages[0] || 'Esta función requiere una suscripción activa'}
              </p>
            </div>

            {/* Current Status */}
            {validation?.subscription && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      validation.isValid ? 'bg-emerald-400' : 'bg-red-400'
                    } animate-pulse`} />
                    <span className="text-white font-semibold">
                      Plan Actual: {validation.plan?.name || 'Gratis'}
                    </span>
                  </div>
                  
                  {validation.restrictions.isTrial && (
                    <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">
                      PERIODO DE PRUEBA
                    </span>
                  )}
                  
                  {validation.restrictions.isExpired && (
                    <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                      EXPIRADO
                    </span>
                  )}
                </div>

                {validation.restrictions.daysUntilExpiry < Infinity && validation.restrictions.daysUntilExpiry > 0 && (
                  <div className="text-nexus-silver/60 text-sm">
                    Expira en {validation.restrictions.daysUntilExpiry} días
                  </div>
                )}
              </motion.div>
            )}

            {/* Upgrade Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {Object.values(SUBSCRIPTION_PLANS)
                .filter(plan => plan.id !== 'free')
                .map((plan, index) => {
                  const isPopular = plan.id === 'professional';
                  const canUpgrade = validation?.plan && 
                    (SUBSCRIPTION_PLANS[plan.id].price > SUBSCRIPTION_PLANS[validation.plan.id].price);
                  
                  return (
                    <TiltCard key={plan.id} className="h-full" tiltMaxAngleX={3} tiltMaxAngleY={3}>
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className={`relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border-2 h-full ${
                          isPopular 
                            ? 'border-nexus-cyan shadow-[0_0_30px_rgba(34,211,238,0.3)]' 
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

                        <div className="text-center mb-6">
                          <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                          <div className="flex items-baseline justify-center gap-1">
                            <span className="text-3xl font-bold text-nexus-cyan">${plan.price}</span>
                            <span className="text-nexus-silver/60">/mes</span>
                          </div>
                        </div>

                        <div className="space-y-3 mb-6">
                          {plan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                              <span className="text-nexus-silver/80 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleUpgrade(plan.id)}
                          disabled={!canUpgrade && validation?.plan?.id !== 'free'}
                          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                            isPopular
                              ? 'bg-gradient-to-r from-nexus-cyan to-nexus-violet text-white shadow-lg hover:shadow-xl'
                              : canUpgrade || validation?.plan?.id === 'free'
                                ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                                : 'bg-white/5 text-nexus-silver/40 cursor-not-allowed'
                          }`}
                        >
                          {validation?.plan?.id === plan.id ? 'PLAN ACTUAL' :
                           canUpgrade || validation?.plan?.id === 'free' ? 'ACTUALIZAR' : 'NO DISPONIBLE'}
                        </motion.button>
                      </motion.div>
                    </TiltCard>
                  );
                })}
            </div>

            {/* Access Requirements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-nexus-cyan/5 border border-nexus-cyan/20 rounded-2xl p-6 mb-6"
            >
              <h4 className="text-lg font-semibold text-nexus-cyan mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Requisitos de Acceso
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Smartphone className={`w-5 h-5 ${
                    accessType === 'mobile' ? 'text-nexus-cyan' : 'text-nexus-silver/40'
                  }`} />
                  <div>
                    <p className="text-white font-medium">App Móvil</p>
                    <p className="text-nexus-silver/60 text-sm">Requiere plan Básico o superior</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <BarChart3 className={`w-5 h-5 ${
                    accessType === 'dashboard' ? 'text-nexus-cyan' : 'text-nexus-silver/40'
                  }`} />
                  <div>
                    <p className="text-white font-medium">Dashboard</p>
                    <p className="text-nexus-silver/60 text-sm">Requiere plan Básico o superior</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Zap className={`w-5 h-5 ${
                    accessType === 'api' ? 'text-nexus-cyan' : 'text-nexus-silver/40'
                  }`} />
                  <div>
                    <p className="text-white font-medium">API Access</p>
                    <p className="text-nexus-silver/60 text-sm">Requiere plan Profesional o Empresarial</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowUpgradeModal(false)}
                className="px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors border border-white/20"
              >
                Cancelar
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = 'mailto:soporte@aigestion.net?subject=Consulta%20de%20Suscripción'}
                className="px-6 py-3 bg-gradient-to-r from-nexus-cyan to-nexus-violet text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Contactar Soporte
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionGuard;
