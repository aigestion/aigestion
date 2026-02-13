import { useEffect, useRef, useState } from 'react';

export interface HapticPattern {
  readonly pattern: number[];
  readonly interval?: number;
}

export interface HapticOptions {
  readonly intensity?: 'light' | 'medium' | 'heavy';
  readonly duration?: number;
  readonly pattern?: HapticPattern;
}

// Haptic patterns for different feedback types
const HAPTIC_PATTERNS = {
  success: { pattern: [10, 50, 10] },
  error: { pattern: [100, 50, 100, 50, 100] },
  warning: { pattern: [50, 30, 50] },
  notification: { pattern: [20, 100, 20] },
  click: { pattern: [10] },
  longPress: { pattern: [50] },
  swipe: { pattern: [5] },
  doubleTap: { pattern: [10, 50, 10] },
};

// Intensity levels for vibration
const INTENSITY_MAP = {
  light: 0.3,
  medium: 0.6,
  heavy: 1.0,
};

export function useHapticFeedback() {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const vibrationQueue = useRef<Array<() => void>>([]);
  const isVibrating = useRef(false);

  // Check if haptic feedback is supported
  useEffect(() => {
    const checkSupport = () => {
      const supported = 'vibrate' in navigator;
      setIsSupported(supported);

      // Also check for iOS device which has limited haptic support
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        // iOS has limited haptic support through the Vibration API
        // but we can still provide basic feedback
        setIsSupported(true);
      }
    };

    checkSupport();
  }, []);

  // Process vibration queue
  const processQueue = () => {
    if (isVibrating.current || vibrationQueue.current.length === 0) {
      return;
    }

    isVibrating.current = true;
    const nextVibration = vibrationQueue.current.shift();

    if (nextVibration) {
      nextVibration();

      // Reset flag after vibration completes
      setTimeout(() => {
        isVibrating.current = false;
        processQueue(); // Process next in queue
      }, 100);
    }
  };

  // Queue a vibration function
  const queueVibration = (vibrationFunc: () => void) => {
    vibrationQueue.current.push(vibrationFunc);
    processQueue();
  };

  // Basic vibration
  const vibrate = (options: HapticOptions = {}) => {
    if (!isSupported || !isEnabled) return;

    const { intensity = 'medium', duration = 10, pattern } = options;

    const vibrationFunc = () => {
      if (pattern) {
        // Pattern-based vibration
        const adjustedPattern = pattern.pattern.map(value =>
          Math.round(value * INTENSITY_MAP[intensity])
        );
        navigator.vibrate(adjustedPattern);
      } else {
        // Simple vibration
        const adjustedDuration = Math.round(duration * INTENSITY_MAP[intensity]);
        navigator.vibrate(adjustedDuration);
      }
    };

    queueVibration(vibrationFunc);
  };

  // Predefined haptic feedback types
  const hapticSuccess = () => {
    vibrate({ pattern: HAPTIC_PATTERNS.success, intensity: 'light' });
  };

  const hapticError = () => {
    vibrate({ pattern: HAPTIC_PATTERNS.error, intensity: 'heavy' });
  };

  const hapticWarning = () => {
    vibrate({ pattern: HAPTIC_PATTERNS.warning, intensity: 'medium' });
  };

  const hapticNotification = () => {
    vibrate({ pattern: HAPTIC_PATTERNS.notification, intensity: 'medium' });
  };

  const hapticClick = () => {
    vibrate({ pattern: HAPTIC_PATTERNS.click, intensity: 'light' });
  };

  const hapticLongPress = () => {
    vibrate({ pattern: HAPTIC_PATTERNS.longPress, intensity: 'medium' });
  };

  const hapticSwipe = () => {
    vibrate({ pattern: HAPTIC_PATTERNS.swipe, intensity: 'light' });
  };

  const hapticDoubleTap = () => {
    vibrate({ pattern: HAPTIC_PATTERNS.doubleTap, intensity: 'medium' });
  };

  // Custom haptic pattern
  const hapticCustom = (pattern: number[], intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
    vibrate({ pattern: { pattern }, intensity });
  };

  // Continuous vibration (for progress indicators)
  const startContinuousVibration = (intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!isSupported || !isEnabled) return;

    const continuousPattern = [50, 50]; // On-off pattern
    const adjustedPattern = continuousPattern.map(value =>
      Math.round(value * INTENSITY_MAP[intensity])
    );

    // Start continuous vibration
    navigator.vibrate(adjustedPattern);
  };

  const stopContinuousVibration = () => {
    if (!isSupported) return;
    navigator.vibrate(0); // Stop any ongoing vibration
  };

  // Toggle haptic feedback
  const toggle = () => {
    setIsEnabled(prev => !prev);
  };

  // Enable/disable haptic feedback
  const enable = () => setIsEnabled(true);
  const disable = () => setIsEnabled(false);

  // Clear vibration queue
  const clearQueue = () => {
    vibrationQueue.current = [];
    isVibrating.current = false;
  };

  return {
    isSupported,
    isEnabled,
    vibrate,
    hapticSuccess,
    hapticError,
    hapticWarning,
    hapticNotification,
    hapticClick,
    hapticLongPress,
    hapticSwipe,
    hapticDoubleTap,
    hapticCustom,
    startContinuousVibration,
    stopContinuousVibration,
    toggle,
    enable,
    disable,
    clearQueue,
  };
}

// Hook for gesture-based haptic feedback
export function useGestureHaptics() {
  const haptic = useHapticFeedback();

  const hapticOnSwipe = () => {
    haptic.hapticSwipe();
  };

  const hapticOnTap = () => {
    haptic.hapticClick();
  };

  const hapticOnLongPress = () => {
    haptic.hapticLongPress();
  };

  const hapticOnDoubleTap = () => {
    haptic.hapticDoubleTap();
  };

  const hapticOnPinch = () => {
    haptic.hapticCustom([20, 30, 20], 'medium');
  };

  const hapticOnRotate = () => {
    haptic.hapticCustom([15, 25, 15], 'light');
  };

  return {
    ...haptic,
    hapticOnSwipe,
    hapticOnTap,
    hapticOnLongPress,
    hapticOnDoubleTap,
    hapticOnPinch,
    hapticOnRotate,
  };
}

// Hook for progress-based haptic feedback
export function useProgressHaptics() {
  const haptic = useHapticFeedback();
  const [lastProgress, setLastProgress] = useState(0);

  const hapticProgress = (progress: number, milestones: number[] = [25, 50, 75, 100]) => {
    // Check if we've reached a new milestone
    for (const milestone of milestones) {
      if (progress >= milestone && lastProgress < milestone) {
        if (milestone === 100) {
          haptic.hapticSuccess();
        } else if (milestone >= 75) {
          haptic.hapticCustom([30, 20, 30], 'medium');
        } else if (milestone >= 50) {
          haptic.hapticCustom([20, 15, 20], 'light');
        } else {
          haptic.hapticClick();
        }
        break;
      }
    }

    setLastProgress(progress);
  };

  const resetProgress = () => {
    setLastProgress(0);
  };

  return {
    ...haptic,
    hapticProgress,
    resetProgress,
  };
}

// Hook for form haptic feedback
export function useFormHaptics() {
  const haptic = useHapticFeedback();

  const hapticFieldFocus = () => {
    haptic.hapticClick();
  };

  const hapticFieldError = () => {
    haptic.hapticError();
  };

  const hapticFieldSuccess = () => {
    haptic.hapticSuccess();
  };

  const hapticFormSubmit = () => {
    haptic.hapticCustom([10, 50, 10, 50, 20], 'medium');
  };

  const hapticFormReset = () => {
    haptic.hapticCustom([50, 30, 50], 'light');
  };

  return {
    ...haptic,
    hapticFieldFocus,
    hapticFieldError,
    hapticFieldSuccess,
    hapticFormSubmit,
    hapticFormReset,
  };
}

// Hook for gaming haptic feedback
export function useGamingHaptics() {
  const haptic = useHapticFeedback();

  const hapticCollision = (intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
    haptic.hapticCustom([100], intensity);
  };

  const hapticExplosion = () => {
    haptic.hapticCustom([200, 100, 200], 'heavy');
  };

  const hapticPowerUp = () => {
    haptic.hapticCustom([10, 20, 30, 40, 50], 'light');
  };

  const hapticLevelComplete = () => {
    haptic.hapticCustom([20, 50, 20, 50, 30, 100, 50], 'medium');
  };

  const hapticGameOver = () => {
    haptic.hapticError();
  };

  const hapticJump = () => {
    haptic.hapticCustom([30], 'light');
  };

  const hapticLand = () => {
    haptic.hapticCustom([50], 'medium');
  };

  return {
    ...haptic,
    hapticCollision,
    hapticExplosion,
    hapticPowerUp,
    hapticLevelComplete,
    hapticGameOver,
    hapticJump,
    hapticLand,
  };
}

// Component for haptic feedback settings
export function HapticSettings({
  onToggle,
  defaultEnabled = true,
}: {
  readonly onToggle?: (enabled: boolean) => void;
  readonly defaultEnabled?: boolean;
}) {
  const { isSupported, isEnabled, toggle, enable, disable } = useHapticFeedback();

  useEffect(() => {
    if (defaultEnabled) {
      enable();
    } else {
      disable();
    }
  }, [defaultEnabled, enable, disable]);

  const handleToggle = () => {
    toggle();
    onToggle?.(!isEnabled);
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id="haptic-feedback"
        checked={isEnabled}
        onChange={handleToggle}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
      />
      <label htmlFor="haptic-feedback" className="text-sm font-medium text-gray-700">
        Haptic Feedback
      </label>
    </div>
  );
}
