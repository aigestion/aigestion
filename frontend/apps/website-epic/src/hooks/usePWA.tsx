import { useEffect, useState, useCallback } from 'react';

export interface PWAInstallPrompt {
  readonly prompt: () => Promise<void>;
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAInfo {
  readonly isInstallable: boolean;
  readonly isInstalled: boolean;
  readonly isStandalone: boolean;
  readonly supportsInstall: boolean;
  readonly platform: string;
  readonly userAgent: string;
}

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: readonly string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  prompt(): Promise<void>;
}

export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(null);
  const [pwaInfo, setPwaInfo] = useState<PWAInfo>({
    isInstallable: false,
    isInstalled: false,
    isStandalone: false,
    supportsInstall: false,
    platform: '',
    userAgent: '',
  });

  // Check PWA capabilities
  useEffect(() => {
    const checkPWACapabilities = () => {
      const userAgent = navigator.userAgent;
      const platform = navigator.platform || 'unknown';

      // Check if running as PWA
      const isStandalone =
        (globalThis as any).matchMedia?.('(display-mode: standalone)')?.matches ||
        (globalThis as any).matchMedia?.('(display-mode: minimal-ui)')?.matches ||
        (globalThis as any).navigator?.standalone === true ||
        document.referrer.includes('android-app://');

      // Check if installed (iOS specific)
      const isInstalled =
        isStandalone &&
        (/iphone|ipad|ipod/.test(userAgent.toLowerCase()) ||
          document.referrer.includes('android-app://'));

      // Check if supports install
      const supportsInstall =
        'BeforeInstallPromptEvent' in globalThis || 'onbeforeinstallprompt' in globalThis;

      setPwaInfo({
        isInstallable: !!installPrompt || supportsInstall,
        isInstalled,
        isStandalone,
        supportsInstall,
        platform,
        userAgent,
      });
    };

    checkPWACapabilities();

    // Listen for display mode changes
    const mediaQuery = (globalThis as any).matchMedia?.('(display-mode: standalone)');
    if (mediaQuery) {
      mediaQuery.addEventListener('change', checkPWACapabilities);
      return () => {
        mediaQuery.removeEventListener('change', checkPWACapabilities);
      };
    }
  }, [installPrompt]);

  // Listen for beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      const promptEvent = event as BeforeInstallPromptEvent;

      setInstallPrompt({
        prompt: () => promptEvent.prompt(),
        userChoice: promptEvent.userChoice,
      });

      setPwaInfo(prev => ({
        ...prev,
        isInstallable: true,
        supportsInstall: true,
      }));
    };

    globalThis.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      globalThis.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Install PWA
  const install = useCallback(async (): Promise<boolean> => {
    if (!installPrompt) {
      return false;
    }

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;

      if (outcome === 'accepted') {
        setInstallPrompt(null);
        setPwaInfo(prev => ({
          ...prev,
          isInstallable: false,
          isInstalled: true,
        }));
        return true;
      }

      return false;
    } catch (error) {
      console.error('PWA installation failed:', error);
      return false;
    }
  }, [installPrompt]);

  // Dismiss install prompt
  const dismissInstall = useCallback(() => {
    setInstallPrompt(null);
    setPwaInfo(prev => ({
      ...prev,
      isInstallable: false,
    }));
  }, []);

  // Check if app is installed (iOS method)
  const checkIOSInstall = useCallback((): boolean => {
    // iOS doesn't have a reliable way to check if PWA is installed
    // This is a heuristic based on standalone mode and referrer
    return (
      pwaInfo.isStandalone &&
      /iphone|ipad|ipod/.test(pwaInfo.userAgent.toLowerCase()) &&
      !document.referrer.includes('http')
    );
  }, [pwaInfo]);

  // Get install instructions based on platform
  const getInstallInstructions = useCallback(() => {
    const { userAgent, platform } = pwaInfo;

    if (/iphone|ipad|ipod/.test(userAgent.toLowerCase())) {
      return {
        title: 'Install on iOS',
        steps: [
          'Tap the Share button in Safari',
          'Scroll down and tap "Add to Home Screen"',
          'Tap "Add" to install the app',
        ],
        icon: '🍎',
      };
    }

    if (/android/.test(userAgent.toLowerCase())) {
      return {
        title: 'Install on Android',
        steps: [
          'Tap the menu button (three dots)',
          'Tap "Install app" or "Add to Home screen"',
          'Tap "Install" to confirm',
        ],
        icon: '🤖',
      };
    }

    if (/chrome/.test(userAgent.toLowerCase())) {
      return {
        title: 'Install on Desktop',
        steps: [
          'Click the install icon in the address bar',
          'Click "Install" to add to your device',
          'Launch from your applications',
        ],
        icon: '💻',
      };
    }

    return {
      title: 'Install PWA',
      steps: [
        'Look for the install option in your browser',
        'Follow the prompts to install',
        'Enjoy the app experience!',
      ],
      icon: '📱',
    };
  }, [pwaInfo]);

  return {
    installPrompt,
    pwaInfo,
    install,
    dismissInstall,
    checkIOSInstall,
    getInstallInstructions,
    canInstall: !!installPrompt,
    isInstalled: pwaInfo.isInstalled,
    isStandalone: pwaInfo.isStandalone,
  };
}

// Hook for PWA updates
export function usePWAUpdates() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // New service worker is active, reload the page
        globalThis.location.reload();
      });

      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'SW_UPDATE_AVAILABLE') {
          setUpdateAvailable(true);
        }
      });
    }
  }, []);

  const applyUpdate = useCallback(async () => {
    if (!('serviceWorker' in navigator)) {
      return false;
    }

    setIsUpdating(true);
    setUpdateError(null);

    try {
      const registration = await navigator.serviceWorker.ready;

      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        return true;
      }

      return false;
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : 'Update failed');
      setIsUpdating(false);
      return false;
    }
  }, []);

  const dismissUpdate = useCallback(() => {
    setUpdateAvailable(false);
    setUpdateError(null);
  }, []);

  return {
    updateAvailable,
    isUpdating,
    updateError,
    applyUpdate,
    dismissUpdate,
  };
}

// Hook for PWA notifications
export function usePWANotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const supported = 'Notification' in globalThis && 'serviceWorker' in navigator;
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Notification permission request failed:', error);
      return false;
    }
  }, [isSupported]);

  const showNotification = useCallback(
    async (title: string, options?: NotificationOptions): Promise<boolean> => {
      if (!isSupported || permission !== 'granted') {
        return false;
      }

      try {
        await navigator.serviceWorker.ready;

        if ('showNotification' in Notification) {
          new Notification(title, options);
        } else {
          // Fallback for older browsers
          await navigator.serviceWorker.controller?.postMessage({
            type: 'SHOW_NOTIFICATION',
            title,
            options,
          });
        }

        return true;
      } catch (error) {
        console.error('Failed to show notification:', error);
        return false;
      }
    },
    [isSupported, permission]
  );

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification,
    canShow: permission === 'granted',
  };
}

// Hook for PWA background sync
export function usePWABackgroundSync() {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const supported =
      'serviceWorker' in navigator && 'SyncManager' in globalThis && 'serviceWorker' in navigator;

    setIsSupported(supported);
  }, []);

  const registerSync = useCallback(
    async (tag: string): Promise<boolean> => {
      if (!isSupported) {
        return false;
      }

      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register(tag);
        return true;
      } catch (error) {
        console.error('Background sync registration failed:', error);
        return false;
      }
    },
    [isSupported]
  );

  return {
    isSupported,
    registerSync,
  };
}

// PWA install prompt component
export function PWAInstallPrompt() {
  const { installPrompt, install, dismissInstall, getInstallInstructions, canInstall } = usePWA();

  if (!canInstall || !installPrompt) {
    return null;
  }

  const instructions = getInstallInstructions();

  const handleInstall = async () => {
    const success = await install();
    if (success) {
      console.log('PWA installed successfully');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-start space-x-3">
        <div className="text-2xl">{instructions.icon}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{instructions.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Install this app for a better experience
          </p>

          <div className="space-y-2">
            <button
              onClick={handleInstall}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Install App
            </button>

            <button
              onClick={dismissInstall}
              className="w-full text-gray-600 dark:text-gray-400 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>

        <button
          onClick={dismissInstall}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ×
        </button>
      </div>
    </div>
  );
}

// PWA update banner component
export function PWAUpdateBanner() {
  const { updateAvailable, applyUpdate, isUpdating, updateError, dismissUpdate } = usePWAUpdates();

  if (!updateAvailable) {
    return null;
  }

  const handleUpdate = async () => {
    const success = await applyUpdate();
    if (success) {
      console.log('Update applied successfully');
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-blue-600 text-white rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-start space-x-3">
        <div className="text-xl">🔄</div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Update Available</h3>
          <p className="text-sm opacity-90 mb-3">A new version of the app is available</p>

          {updateError && (
            <div className="text-xs bg-red-500 bg-opacity-20 rounded p-2 mb-3">
              Error: {updateError}
            </div>
          )}

          <div className="flex space-x-2">
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="bg-white text-blue-600 px-3 py-1 rounded text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {isUpdating ? 'Updating...' : 'Update Now'}
            </button>

            <button
              onClick={dismissUpdate}
              className="text-white opacity-75 hover:opacity-100 px-3 py-1 rounded text-sm transition-opacity"
            >
              Dismiss
            </button>
          </div>
        </div>

        <button onClick={dismissUpdate} className="text-white opacity-75 hover:opacity-100">
          ×
        </button>
      </div>
    </div>
  );
}
