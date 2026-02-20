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
  Zap,
} from 'lucide-react';
import { Capacitor } from '@capacitor/core';

interface MobileSubscriptionData {
  userId: string;
  subscriptionStatus: 'active' | 'inactive' | 'expired' | 'trial';
  planType: 'free' | 'basic' | 'professional' | 'enterprise';
  expiryDate?: string;
  trialEnd?: string;
  lastValidated: string;
}

interface MobileSubscriptionGuardProps {
  children: React.ReactNode;
  onValidationComplete?: (isValid: boolean) => void;
  onSubscriptionRequired?: () => void;
}

const MobileSubscriptionGuard: React.FC<MobileSubscriptionGuardProps> = ({
  children,
  onValidationComplete,
  onSubscriptionRequired,
}) => {
  const [validation, setValidation] = useState<MobileSubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);
  const [showBlockedScreen, setShowBlockedScreen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setValidationError(null);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Validate subscription on mount
  useEffect(() => {
    validateMobileSubscription();
  }, []);

  const validateMobileSubscription = async () => {
    setLoading(true);
    setValidationError(null);

    try {
      // Get user data from local storage (stored during login)
      const userData = localStorage.getItem('aigestion_user_data');
      const authToken = localStorage.getItem('aigestion_auth_token');

      if (!userData || !authToken) {
        console.error('[MobileSubscriptionGuard] No user data or auth token found');
        setShowBlockedScreen(true);
        setLoading(false);
        onValidationComplete?.(false);
        return;
      }

      const user = JSON.parse(userData);
      
      // Check if we have cached validation data that's still valid
      const cachedValidation = localStorage.getItem('aigestion_subscription_cache');
      if (cachedValidation) {
        const cached = JSON.parse(cachedValidation);
        const cacheAge = Date.now() - new Date(cached.lastValidated).getTime();
        
        // Cache is valid for 5 minutes when online, 1 hour when offline
        const cacheDuration = isOnline ? 5 * 60 * 1000 : 60 * 60 * 1000;
        
        if (cacheAge < cacheDuration) {
          console.log('[MobileSubscriptionGuard] Using cached validation');
          setValidation(cached);
          const hasAccess = checkMobileAccess(cached);
          setShowBlockedScreen(!hasAccess);
          onValidationComplete?.(hasAccess);
          setLoading(false);
          return;
        }
      }

      // If online, validate with server
      if (isOnline) {
        await validateWithServer(user.id, authToken);
      } else {
        // If offline, use cached data or allow limited access
        if (cachedValidation) {
          setValidation(cachedValidation);
          const hasAccess = checkMobileAccess(cachedValidation);
          setShowBlockedScreen(!hasAccess);
          onValidationComplete?.(hasAccess);
        } else {
          // No cached data and offline - show error
          setValidationError('No se puede verificar la suscripción sin conexión a internet');
          setShowBlockedScreen(true);
          onValidationComplete?.(false);
        }
      }
    } catch (error) {
      console.error('[MobileSubscriptionGuard] Error validating subscription:', error);
      setValidationError('Error al validar la suscripción');
      setShowBlockedScreen(true);
      onValidationComplete?.(false);
    } finally {
      setLoading(false);
    }
  };

  const validateWithServer = async (userId: string, authToken: string) => {
    try {
      const API_URL = Capacitor.isNativePlatform() 
        ? 'https://aigestion.net/api' 
        : '/api';

      const response = await fetch(`${API_URL}/subscription/validate-mobile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'X-Platform': Capacitor.getPlatform(),
          'X-App-Version': '1.0.0',
        },
        body: JSON.stringify({
          userId,
          platform: Capacitor.getPlatform(),
          appVersion: '1.0.0',
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      const subscriptionData: MobileSubscriptionData = {
        userId: data.userId,
        subscriptionStatus: data.subscriptionStatus,
        planType: data.planType,
        expiryDate: data.expiryDate,
        trialEnd: data.trialEnd,
        lastValidated: new Date().toISOString(),
      };

      // Cache the validation result
      localStorage.setItem('aigestion_subscription_cache', JSON.stringify(subscriptionData));
      
      setValidation(subscriptionData);
      
      const hasAccess = checkMobileAccess(subscriptionData);
      setShowBlockedScreen(!hasAccess);
      onValidationComplete?.(hasAccess);
      
      console.log('[MobileSubscriptionGuard] Server validation successful:', subscriptionData);
    } catch (error) {
      console.error('[MobileSubscriptionGuard] Server validation failed:', error);
      
      // Try to use cached data as fallback
      const cachedValidation = localStorage.getItem('aigestion_subscription_cache');
      if (cachedValidation) {
        const cached = JSON.parse(cachedValidation);
        setValidation(cached);
        const hasAccess = checkMobileAccess(cached);
        setShowBlockedScreen(!hasAccess);
        onValidationComplete?.(hasAccess);
      } else {
        setValidationError('No se pudo conectar con el servidor');
        setShowBlockedScreen(true);
        onValidationComplete?.(false);
      }
    }
  };

  const checkMobileAccess = (subscriptionData: MobileSubscriptionData): boolean => {
    const { subscriptionStatus, planType, expiryDate, trialEnd } = subscriptionData;
    
    // Check if subscription is active
    if (subscriptionStatus !== 'active') {
      return false;
    }
    
    // Check if plan allows mobile access
    if (planType === 'free') {
      return false;
    }
    
    // Check if subscription has expired
    if (expiryDate) {
      const expiry = new Date(expiryDate);
      if (expiry < new Date()) {
        return false;
      }
    }
    
    // Check if trial is still valid
    if (subscriptionStatus === 'trial' && trialEnd) {
      const trial = new Date(trialEnd);
      if (trial < new Date()) {
        return false;
      }
    }
    
    return true;
  };

  const handleRetry = async () => {
    setRetryCount(prev => prev + 1);
    await validateMobileSubscription();
  };

  const handleUpgrade = () => {
    onSubscriptionRequired?.();
    
    // Open subscription page in browser
    const upgradeUrl = 'https://aigestion.net/subscription?plan=basic&source=mobile';
    if (Capacitor.isNativePlatform()) {
      // Use Capacitor's Browser API for native apps
      import('@capacitor/browser').then(({ Browser }) => {
        Browser.open({ url: upgradeUrl });
      });
    } else {
      window.open(upgradeUrl, '_blank');
    }
  };

  const handleContactSupport = () => {
    const supportUrl = 'mailto:soporte@aigestion.net?subject=Problema%20con%20suscripción%20móvil';
    if (Capacitor.isNativePlatform()) {
      import('@capacitor/browser').then(({ Browser }) => {
        Browser.open({ url: supportUrl });
      });
    } else {
      window.location.href = supportUrl;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full mb-6"
        />
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-white mb-2 text-center"
        >
          Verificando Suscripción
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-center"
        >
          Validando acceso a la aplicación móvil...
        </motion.p>
      </div>
    );
  }

  // If has access, show children
  if (!showBlockedScreen) {
    return <>{children}</>;
  }

  // Blocked screen
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-6"
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
            
            <Smartphone className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold text-white mb-2"
            >
              Acceso Restringido
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg"
            >
              La aplicación móvil requiere una suscripción activa
            </motion.p>
          </div>

          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700 mb-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse" />
              <span className="text-white font-semibold">
                {validation?.planType === 'free' ? 'Plan Gratis' : 
                 validation?.subscriptionStatus === 'expired' ? 'Suscripción Expirada' :
                 validation?.subscriptionStatus === 'trial' ? 'Período de Prueba' :
                 'Sin Suscripción'}
              </span>
            </div>

            {validationError && (
              <div className="flex items-start gap-2 mb-4 p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{validationError}</p>
              </div>
            )}

            {!isOnline && (
              <div className="flex items-start gap-2 mt-4 p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                <WifiOff className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-400 font-medium text-sm">Sin conexión</p>
                  <p className="text-gray-400 text-xs">Conéctate a internet para verificar tu suscripción</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Features Included */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl p-6 border border-cyan-500/20 mb-6"
          >
            <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5" />
              Plan Básico - $29.99/mes
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
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{feature}</span>
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
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              Activar Suscripción Básica
            </motion.button>

            {!isOnline && retryCount < 3 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRetry}
                className="w-full py-3 bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${retryCount > 0 ? 'animate-spin' : ''}`} />
                {retryCount === 0 ? 'Reintentar' : `Reintentar (${retryCount}/3)`}
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContactSupport}
              className="w-full py-3 bg-gray-800 text-gray-300 rounded-xl font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Contactar Soporte
            </motion.button>
          </div>

          {/* Development bypass */}
          {process.env.NODE_ENV === 'development' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const mockData: MobileSubscriptionData = {
                  userId: 'dev-user',
                  subscriptionStatus: 'active',
                  planType: 'professional',
                  lastValidated: new Date().toISOString(),
                };
                localStorage.setItem('aigestion_subscription_cache', JSON.stringify(mockData));
                setValidation(mockData);
                setShowBlockedScreen(false);
                onValidationComplete?.(true);
              }}
              className="mt-4 w-full py-2 bg-red-500/10 text-red-400 rounded-xl text-sm hover:bg-red-500/20 transition-colors border border-red-500/20"
            >
              (DEV) Bypass Validación
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileSubscriptionGuard;
