import { useEffect, useState } from 'react';

/**
 * Hook para gestionar Service Worker avanzado
 * Proporciona control granular sobre caching y offline features
 */
export function useServiceWorker() {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    // Check if Service Worker is supported
    if ('serviceWorker' in navigator) {
      setIsSupported(true);
      
      // Register enhanced service worker
      registerServiceWorker();
      
      // Listen for online/offline events
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    } else {
      console.warn('Service Worker is not supported in this browser');
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw-enhanced.js', {
        scope: '/'
      });
      
      console.log('✅ Service Worker registered successfully');
      setRegistration(reg);
      setIsRegistered(true);
      
      // Check for waiting worker (update available)
      if (reg.waiting) {
        setWaitingWorker(reg.waiting);
        setShowUpdatePrompt(true);
      }
      
      // Listen for updates
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New worker available, show update prompt
              setWaitingWorker(newWorker);
              setShowUpdatePrompt(true);
            }
          });
        }
      });
      
      // Listen for controller changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Page will be reloaded automatically
        console.log('🔄 Service Worker controller changed');
        window.location.reload();
      });
      
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  };

  const applyUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setShowUpdatePrompt(false);
    }
  };

  const dismissUpdate = () => {
    setShowUpdatePrompt(false);
    setWaitingWorker(null);
  };

  const forceCacheUpdate = () => {
    if (registration) {
      registration.active?.postMessage({ type: 'CACHE_UPDATE' });
    }
  };

  const clearCache = async () => {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('🗑️ All caches cleared successfully');
    } catch (error) {
      console.error('❌ Failed to clear caches:', error);
    }
  };

  const unregister = async () => {
    try {
      if (registration) {
        const result = await registration.unregister();
        console.log('Service Worker unregistered:', result);
        setIsRegistered(false);
        setRegistration(null);
      }
    } catch (error) {
      console.error('❌ Failed to unregister Service Worker:', error);
    }
  };

  return {
    isSupported,
    isRegistered,
    registration,
    isOnline,
    showUpdatePrompt,
    applyUpdate,
    dismissUpdate,
    forceCacheUpdate,
    clearCache,
    unregister,
  };
}

/**
 * Hook para notificaciones push
 */
export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if push notifications are supported
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
      
      // Get existing subscription
      navigator.serviceWorker.ready.then(registration => {
        return registration.pushManager.getSubscription();
      }).then(sub => {
        setSubscription(sub);
      });
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      throw new Error('Push notifications are not supported');
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    
    if (result === 'granted') {
      await subscribeToPush();
    }
    
    return result;
  };

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')
      });
      
      setSubscription(sub);
      
      // Send subscription to server
      await sendSubscriptionToServer(sub);
      
      return sub;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      throw error;
    }
  };

  const unsubscribe = async () => {
    if (subscription) {
      await subscription.unsubscribe();
      setSubscription(null);
    }
  };

  const sendSubscriptionToServer = async (subscription: PushSubscription) => {
    // Implementation to send subscription to your server
    console.log('Sending subscription to server:', subscription);
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    
    return outputArray;
  };

  return {
    isSupported,
    permission,
    subscription,
    requestPermission,
    subscribeToPush,
    unsubscribe,
  };
}

/**
 * Hook para background sync
 */
export function useBackgroundSync() {
  const [isSupported, setIsSupported] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      setIsSupported(true);
      
      navigator.serviceWorker.ready.then(reg => {
        setRegistration(reg);
      });
    }
  }, []);

  const registerSync = async (tag: string) => {
    if (!isSupported || !registration) {
      throw new Error('Background sync is not supported');
    }

    try {
      await registration.sync.register(tag);
      console.log(`Background sync registered for tag: ${tag}`);
    } catch (error) {
      console.error('Failed to register background sync:', error);
      throw error;
    }
  };

  const registerPeriodicSync = async (tag: string, minInterval: number) => {
    if (!isSupported || !registration) {
      throw new Error('Periodic sync is not supported');
    }

    try {
      await registration.periodicSync.register(tag, {
        minInterval: minInterval // in milliseconds
      });
      console.log(`Periodic sync registered for tag: ${tag}`);
    } catch (error) {
      console.error('Failed to register periodic sync:', error);
      throw error;
    }
  };

  return {
    isSupported,
    registration,
    registerSync,
    registerPeriodicSync,
  };
}
