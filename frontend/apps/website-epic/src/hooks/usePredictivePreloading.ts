import { useEffect, useRef, useState, useCallback } from 'react';

interface UserBehavior {
  readonly timestamp: number;
  readonly action: 'hover' | 'click' | 'scroll' | 'navigation';
  readonly target: string;
  readonly duration?: number;
  readonly position?: { x: number; y: number };
}

interface PreloadPrediction {
  readonly component: string;
  readonly probability: number;
  readonly urgency: 'low' | 'medium' | 'high';
  readonly reason: string;
}

interface PredictivePreloaderOptions {
  readonly enableHoverPreloading?: boolean;
  readonly enableScrollPreloading?: boolean;
  readonly enableNavigationPrediction?: boolean;
  readonly behaviorHistorySize?: number;
  readonly preloadThreshold?: number;
  readonly maxPreloads?: number;
}

export function usePredictivePreloading(options: PredictivePreloaderOptions = {}) {
  const {
    enableHoverPreloading = true,
    enableScrollPreloading = true,
    enableNavigationPrediction = true,
    behaviorHistorySize = 100,
    preloadThreshold = 0.7,
    maxPreloads = 5,
  } = options;

  const [behaviorHistory, setBehaviorHistory] = useState<UserBehavior[]>([]);
  const [predictions, setPredictions] = useState<PreloadPrediction[]>([]);
  const [preloadedComponents, setPreloadedComponents] = useState<Set<string>>(new Set());
  
  const hoverTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const scrollObserverRef = useRef<IntersectionObserver | null>(null);
  const navigationPatternsRef = useRef<Map<string, number>>(new Map());

  // Track user behavior
  const trackBehavior = useCallback((behavior: UserBehavior) => {
    setBehaviorHistory(prev => {
      const updated = [...prev, behavior].slice(-behaviorHistorySize);
      analyzeBehaviorPatterns(updated);
      return updated;
    });
  }, [behaviorHistorySize]);

  // Analyze behavior patterns to predict next actions
  const analyzeBehaviorPatterns = useCallback((behaviors: UserBehavior[]) => {
    const newPredictions: PreloadPrediction[] = [];
    const now = Date.now();

    // Analyze hover patterns
    if (enableHoverPreloading) {
      const hoverPatterns = behaviors
        .filter(b => b.action === 'hover' && now - b.timestamp < 5000)
        .reduce((acc, behavior) => {
          acc[behavior.target] = (acc[behavior.target] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

      Object.entries(hoverPatterns).forEach(([target, count]) => {
        const probability = Math.min(count / 3, 1); // Max probability after 3 hovers
        if (probability > preloadThreshold) {
          newPredictions.push({
            component: target,
            probability,
            urgency: probability > 0.9 ? 'high' : 'medium',
            reason: 'Frequent hovering detected',
          });
        }
      });
    }

    // Analyze scroll patterns
    if (enableScrollPreloading) {
      const scrollPatterns = behaviors
        .filter(b => b.action === 'scroll' && now - b.timestamp < 10000)
        .map(b => b.target);

      const scrollFrequency = scrollPatterns.reduce((acc, target) => {
        acc[target] = (acc[target] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      Object.entries(scrollFrequency).forEach(([target, count]) => {
        const probability = Math.min(count / 5, 1);
        if (probability > preloadThreshold) {
          newPredictions.push({
            component: target,
            probability,
            urgency: 'low',
            reason: 'Scroll proximity detected',
          });
        }
      });
    }

    // Analyze navigation patterns
    if (enableNavigationPrediction) {
      const navigationPatterns = behaviors
        .filter(b => b.action === 'navigation')
        .slice(-20); // Last 20 navigations

      if (navigationPatterns.length > 1) {
        for (let i = 1; i < navigationPatterns.length; i++) {
          const from = navigationPatterns[i - 1].target;
          const to = navigationPatterns[i].target;
          const pattern = `${from}->${to}`;
          
          navigationPatternsRef.current.set(pattern, 
            (navigationPatternsRef.current.get(pattern) || 0) + 1
          );
        }

        // Predict next navigation based on current location
        const currentLocation = behaviors[behaviors.length - 1]?.target;
        if (currentLocation) {
          const possibleNext = Array.from(navigationPatternsRef.current.entries())
            .filter(([pattern]) => pattern.startsWith(`${currentLocation}->`))
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3);

          possibleNext.forEach(([pattern, count]) => {
            const nextComponent = pattern.split('->')[1];
            const probability = Math.min(count / 10, 1);
            
            if (probability > preloadThreshold) {
              newPredictions.push({
                component: nextComponent,
                probability,
                urgency: 'high',
                reason: 'Navigation pattern detected',
              });
            }
          });
        }
      }
    }

    // Sort by probability and urgency
    const sortedPredictions = newPredictions
      .sort((a, b) => {
        const urgencyOrder = { high: 3, medium: 2, low: 1 };
        const urgencyDiff = urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
        return urgencyDiff !== 0 ? urgencyDiff : b.probability - a.probability;
      })
      .slice(0, maxPreloads);

    setPredictions(sortedPredictions);
    executePreloads(sortedPredictions);
  }, [enableHoverPreloading, enableScrollPreloading, enableNavigationPrediction, preloadThreshold, maxPreloads]);

  // Execute preloads based on predictions
  const executePreloads = useCallback((predictions: PreloadPrediction[]) => {
    predictions.forEach(prediction => {
      if (!preloadedComponents.has(prediction.component)) {
        preloadComponent(prediction.component, prediction.urgency);
        setPreloadedComponents(prev => new Set([...prev, prediction.component]));
      }
    });
  }, [preloadedComponents]);

  // Preload component function
  const preloadComponent = useCallback((componentName: string, urgency: 'low' | 'medium' | 'high') => {
    const delay = urgency === 'high' ? 0 : urgency === 'medium' ? 100 : 500;
    
    setTimeout(() => {
      // Dynamic import based on component name
      const importMap: Record<string, () => Promise<any>> = {
        'CinematicPresentation': () => import('../components/CinematicPresentation'),
        'DanielaShowcase': () => import('../components/DanielaShowcase'),
        'ClientShowcase': () => import('../components/ClientShowcase'),
        'EnhancedROI': () => import('../components/EnhancedROI'),
        'DecentralandOffice': () => import('../components/DecentralandOffice'),
        'NexusAndroid': () => import('../components/NexusAndroid'),
        'VitureXRExperience': () => import('../components/VitureXRExperience'),
        'CommandPalette': () => import('../components/CommandPalette'),
        'ContactSection': () => import('../components/ContactSection'),
      };

      const importFunc = importMap[componentName];
      if (importFunc) {
        importFunc().catch(error => {
          console.warn(`Failed to preload ${componentName}:`, error);
        });
      }
    }, delay);
  }, []);

  // Hover event handler
  const handleHover = useCallback((target: string) => {
    if (!enableHoverPreloading) return;

    trackBehavior({
      timestamp: Date.now(),
      action: 'hover',
      target,
    });

    // Clear existing timeout for this target
    const existingTimeout = hoverTimeoutsRef.current.get(target);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new timeout for preload
    const timeout = setTimeout(() => {
      if (!preloadedComponents.has(target)) {
        preloadComponent(target, 'medium');
        setPreloadedComponents(prev => new Set([...prev, target]));
      }
    }, 200); // 200ms hover delay

    hoverTimeoutsRef.current.set(target, timeout);
  }, [enableHoverPreloading, preloadedComponents, preloadComponent, trackBehavior]);

  // Click event handler
  const handleClick = useCallback((target: string) => {
    trackBehavior({
      timestamp: Date.now(),
      action: 'click',
      target,
    });
  }, [trackBehavior]);

  // Scroll event handler
  const handleScroll = useCallback((target: string, position: { x: number; y: number }) => {
    if (!enableScrollPreloading) return;

    trackBehavior({
      timestamp: Date.now(),
      action: 'scroll',
      target,
      position,
    });
  }, [enableScrollPreloading, trackBehavior]);

  // Navigation event handler
  const handleNavigation = useCallback((from: string, to: string) => {
    if (!enableNavigationPrediction) return;

    trackBehavior({
      timestamp: Date.now(),
      action: 'navigation',
      target: to,
    });
  }, [enableNavigationPrediction, trackBehavior]);

  // Set up intersection observer for scroll-based preloading
  useEffect(() => {
    if (!enableScrollPreloading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = entry.target.getAttribute('data-preload-target');
            if (target) {
              handleScroll(target, { x: 0, y: entry.boundingClientRect.top });
            }
          }
        });
      },
      {
        rootMargin: '200px', // Start preloading 200px before element comes into view
        threshold: 0.1,
      }
    );

    scrollObserverRef.current = observer;

    // Observe elements with data-preload-target attribute
    const elements = document.querySelectorAll('[data-preload-target]');
    elements.forEach(element => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [enableScrollPreloading, handleScroll]);

  // Cleanup hover timeouts on unmount
  useEffect(() => {
    return () => {
      hoverTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  // Clear preloaded components periodically (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      setPreloadedComponents(new Set());
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    predictions,
    preloadedComponents: Array.from(preloadedComponents),
    behaviorHistory,
    handleHover,
    handleClick,
    handleScroll,
    handleNavigation,
    preloadComponent,
    clearPreloadedComponents: () => setPreloadedComponents(new Set()),
  };
}

// Hook for component-level preloading
export function useComponentPreload(componentName: string, options: { readonly preloadOnHover?: boolean } = {}) {
  const { preloadOnHover = true } = options;
  const { handleHover } = usePredictivePreloading();

  const preloadRef = useCallback((element: HTMLElement | null) => {
    if (!element || !preloadOnHover) return;

    const handleMouseEnter = () => {
      handleHover(componentName);
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [componentName, handleHover, preloadOnHover]);

  return { preloadRef };
}

// Hook for route-based preloading
export function useRoutePreloading() {
  const { handleNavigation } = usePredictivePreloading();

  const preloadRoute = useCallback((route: string) => {
    // Preload route components
    const routeComponents: Record<string, string[]> = {
      '/': ['CinematicPresentation', 'DanielaShowcase'],
      '/dashboard': ['MiniDashboard', 'DataVisualization'],
      '/roi': ['EnhancedROI'],
      '/metaverse': ['DecentralandOffice'],
      '/xr': ['VitureXRExperience'],
      '/contact': ['ContactSection'],
    };

    const components = routeComponents[route];
    if (components) {
      components.forEach(component => {
        // Trigger hover simulation for preloading
        handleNavigation(window.location.pathname, route);
      });
    }
  }, [handleNavigation]);

  return { preloadRoute };
}
