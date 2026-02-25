import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  triggerOnce?: boolean;
}

/**
 * Hook para Intersection Observer avanzado
 * Optimiza lazy loading y animaciones basadas en visibilidad
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    root = null,
    triggerOnce = false,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Create observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isVisible = entry.isIntersecting;

        setIsIntersecting(isVisible);

        // Handle triggerOnce logic
        if (triggerOnce && isVisible && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold,
        rootMargin,
        root,
      }
    );

    // Start observing
    observerRef.current.observe(element);

    return () => {
      // Cleanup
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, root, triggerOnce, hasIntersected]);

  return {
    ref: elementRef,
    isIntersecting,
    hasIntersected,
  };
}

/**
 * Hook para lazy loading con Intersection Observer
 */
export function useLazyLoad(
  loader: () => Promise<void>,
  options: UseIntersectionObserverOptions = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { ref, isIntersecting } = useIntersectionObserver({
    triggerOnce: true,
    ...options,
  });

  useEffect(() => {
    if (isIntersecting && !isLoaded && !isLoading) {
      setIsLoading(true);
      setError(null);

      loader()
        .then(() => {
          setIsLoaded(true);
        })
        .catch((err) => {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isIntersecting, isLoaded, isLoading, loader]);

  return {
    ref,
    isLoading,
    isLoaded,
    error,
  };
}

/**
 * Hook para animaciones basadas en scroll
 */
export function useScrollAnimation(
  animationClass: string,
  options: UseIntersectionObserverOptions = {}
) {
  const { ref, isIntersecting } = useIntersectionObserver(options);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isIntersecting && !shouldAnimate) {
      setShouldAnimate(true);
    }
  }, [isIntersecting, shouldAnimate]);

  return {
    ref,
    shouldAnimate,
    className: shouldAnimate ? animationClass : '',
  };
}

/**
 * Hook para múltiples elementos con Intersection Observer
 */
export function useMultipleIntersectionObservers(
  selectors: string[],
  options: UseIntersectionObserverOptions = {}
) {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const { threshold = 0.1, rootMargin = '0px', root = null } = options;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const selector = `[data-observe-id="${entry.target.getAttribute('data-observe-id')}"]`;
          
          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set([...prev, selector]));
          } else {
            setVisibleElements(prev => {
              const newSet = new Set(prev);
              newSet.delete(selector);
              return newSet;
            });
          }
        });
      },
      {
        threshold,
        rootMargin,
        root,
      }
    );

    // Observe all elements
    const elements = document.querySelectorAll(selectors.join(','));
    elements.forEach((element, index) => {
      element.setAttribute('data-observe-id', `element-${index}`);
      observerRef.current?.observe(element);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [selectors, options]);

  return {
    visibleElements,
    isVisible: (selector: string) => visibleElements.has(selector),
  };
}

/**
 * Hook para performance optimization con Intersection Observer
 * Detiene animaciones y cálculos cuando elementos no son visibles
 */
export function usePerformanceOptimization(
  options: UseIntersectionObserverOptions = {}
) {
  const { isIntersecting } = useIntersectionObserver(options);
  const [isOptimized, setIsOptimized] = useState(false);

  useEffect(() => {
    // Optimize performance when not visible
    if (!isIntersecting && !isOptimized) {
      setIsOptimized(true);
      // Add performance optimization logic here
      // e.g., pause animations, reduce update frequency
    } else if (isIntersecting && isOptimized) {
      setIsOptimized(false);
      // Resume normal performance
    }
  }, [isIntersecting, isOptimized]);

  return {
    isIntersecting,
    isOptimized,
    shouldUpdate: isIntersecting,
  };
}
