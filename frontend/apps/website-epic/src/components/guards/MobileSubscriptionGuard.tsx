import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  Lock,
  Crown,
  AlertTriangle,
  WifiOff,
  RefreshCw,
  X,
  CheckCircle,
  CreditCard,
  Rocket,
  Shield,
  Star,
} from 'lucide-react';
import { subscriptionService, SubscriptionValidation } from '../../services/subscription-service';
import { useAuth } from '../../hooks/useAuth';
import { GodModeText } from '../design-system/GodModeText';

interface MobileSubscriptionGuardProps {
  children: React.ReactNode;
  onValidationComplete?: (isValid: boolean) => void;
  showOfflineMode?: boolean;
}

const MobileSubscriptionGuard: React.FC<MobileSubscriptionGuardProps> = ({
  children,
  onValidationComplete,
  showOfflineMode = true,
}) => {
  const { user } = useAuth();
  const [validation, setValidation] = useState<SubscriptionValidation | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);
  const [showBlockedScreen, setShowBlockedScreen] = useState(false);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Validate subscription
  useEffect(() => {
    const validateMobileAccess = async () => {
      if (!user?.id) {
        setLoading(false);
        setShowBlockedScreen(true);
        onValidationComplete?.(false);
        return;
      }

      setLoading(true);
      
      try {
        const result = await subscriptionService.validateAccess(user.id, 'mobile');
        setValidation(result);
        
        const hasAccess = result.restrictions.canAccessMobile;
        setShowBlockedScreen(!hasAccess);
        onValidationComplete?.(hasAccess);
        
        console.log('[MobileSubscriptionGuard] Mobile access validation:', {
          userId: user.id,
          hasAccess,
          plan: result.plan?.name,
          isExpired: result.restrictions.isExpired,
          isTrial: result.restrictions.isTrial,
        });
      } catch (error) {
        console.error('[MobileSubscriptionGuard] Error validating mobile access:', error);
        
        // Si hay error de red y está en modo offline, permitir acceso limitado
        if (!isOnline && showOfflineMode) {
          setValidation({
            isValid: true,
            plan: null,
            subscription: null,
            restrictions: {
              canAccessDashboard: false,
              canAccessMobile: true,
              canAccessAPI: false,
              maxProjectsReached: false,
              maxUsersReached: false,
              daysUntilExpiry: 0,
              isTrial: false,
              isExpired: false,
            },
            messages: ['Modo offline: Funcionalidad limitada'],
          });
          setShowBlockedScreen(false);
          onValidationComplete?.(true);
        } else {
          setShowBlockedScreen(true);
          onValidationComplete?.(false);
        }
      } finally {
        setLoading(false);
      }
    };

    validateMobileAccess();
  }, [user?.id, isOnline, showOfflineMode, onValidationComplete]);

  const handleRetry = async () => {
    setRetryCount(prev => prev + 1);
    setLoading(true);
    
    // Esperar un momento antes de reintentar
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const result = await subscriptionService.validateAccess(user!.id, 'mobile');
      setValidation(result);
      
      const hasAccess = result.restrictions.canAccessMobile;
      setShowBlockedScreen(!hasAccess);
      onValidationComplete?.(hasAccess);
    } catch (error) {
      console.error('[MobileSubscriptionGuard] Retry failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    // Redirigir a página de pago o abrir modal de upgrade
    window.location.href = '/subscription?plan=basic&source=mobile';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-nexus-obsidian flex flex-col items-center justify-center p-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-nexus-cyan/20 border-t-nexus-cyan rounded-full mb-6"
        />
        
        <GodModeText
          text="VERIFICANDO SUSCRIPCIÓN"
          effect="glitch"
          className="text-xl font-bold text-white mb-2"
        />
        
        <p className="text-nexus-silver/60 text-center">
          Validando acceso a la aplicación móvil...
        </p>
      </div>
    );
  }

  // Si tiene acceso, mostrar children
  if (!showBlockedScreen) {
    return (
      <>
        {children}
        
        {/* Indicator de modo offline si aplica */}
        {!isOnline && validation?.messages.includes('Modo offline') && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-4 left-4 right-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 flex items-center gap-3 z-50"
          >
            <WifiOff className="w-5 h-5 text-yellow-400" />
            <div className="flex-1">
              <p className="text-yellow-400 font-medium text-sm">Modo Offline</p>
              <p className="text-nexus-silver/60 text-xs">Funcionalidad limitada sin conexión</p>
            </div>
          </motion.div>
        )}
      </>
    );
  }

  // Blocked screen
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-nexus-obsidian flex flex-col items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="max-w-md w-full"
        >
          {/* Icon and Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl mb-6"
            >
              <Lock className="w-12 h-12 text-white" />
            </motion.div>
            
            <Smartphone className="w-12 h-12 text-nexus-cyan mx-auto mb-4" />
            
            <GodModeText
              text="ACCESO RESTRINGIDO"
              effect="hologram"
              className="text-2xl font-bold text-white mb-2"
            />
            
            <p className="text-nexus-silver/60 text-lg">
              La aplicación móvil requiere una suscripción activa
            </p>
          </div>

          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse" />
              <span className="text-white font-semibold">
                {validation?.plan?.name || 'Sin suscripción'}
              </span>
            </div>

            {validation?.messages.map((message, index) => (
              <div key={index} className="flex items-start gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-nexus-silver/80 text-sm">{message}</p>
              </div>
            ))}

            {!isOnline && (
              <div className="flex items-start gap-2 mt-4 p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                <WifiOff className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 font-medium text-sm">Sin conexión</p>
                  <p className="text-nexus-silver/60 text-xs">Conéctate a internet para verificar tu suscripción</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Features Included */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-nexus-cyan/5 to-nexus-violet/5 rounded-2xl p-6 border border-nexus-cyan/20 mb-6"
          >
            <h3 className="text-lg font-semibold text-nexus-cyan mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5" />
              ¿Qué obtienes con el plan Básico?
            </h3>
            
            <div className="space-y-3">
              {[
                'Dashboard completo',
                'Aplicación móvil premium',
                'Hasta 10 proyectos',
                '3 usuarios',
                'Soporte por email',
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-nexus-silver/80 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpgrade}
              className="w-full py-4 bg-gradient-to-r from-nexus-cyan to-nexus-violet text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              ACTIVAR SUSCRIPCIÓN BÁSICA
              <span className="text-sm opacity-80">($29.99/mes)</span>
            </motion.button>

            {!isOnline && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRetry}
                disabled={retryCount >= 3}
                className="w-full py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors border border-white/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${retryCount > 0 ? 'animate-spin' : ''}`} />
                {retryCount === 0 ? 'Reintentar' : `Reintentar (${retryCount}/3)`}
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = 'mailto:soporte@aigestion.net?subject=Problema%20con%20suscripción%20móvil'}
              className="w-full py-3 bg-white/5 text-nexus-silver/60 rounded-xl font-medium hover:bg-white/10 transition-colors border border-white/10 flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Contactar Soporte Técnico
            </motion.button>
          </div>

          {/* Close button for development */}
          {import.meta.env.DEV && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowBlockedScreen(false)}
              className="mt-4 w-full py-2 bg-red-500/10 text-red-400 rounded-xl text-sm hover:bg-red-500/20 transition-colors border border-red-500/20"
            >
              (DEV) Saltar verificación
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileSubscriptionGuard;
