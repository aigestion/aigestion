import { lazy } from 'react';

// Enhanced lazy loading with error handling and loading states
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  return lazy(() => {
    return importFunc().catch(error => {
      console.error('Failed to load component:', error);
      // Return a fallback component or throw the error
      throw error;
    });
  });
}

// Predefined lazy components with loading states
export const LazyComponents = {
  // Main presentation components
  CinematicPresentation: createLazyComponent(
    () => import('../components/CinematicPresentation').then(m => ({ default: m.CinematicPresentation }))
  ),
  
  ClientShowcase: createLazyComponent(
    () => import('../components/ClientShowcase').then(m => ({ default: m.ClientShowcase }))
  ),
  
  DanielaShowcase: createLazyComponent(
    () => import('../components/DanielaShowcase').then(m => ({ default: m.DanielaShowcase }))
  ),
  
  // Interactive components
  CommandPalette: createLazyComponent(
    () => import('../components/CommandPalette').then(m => ({ default: m.CommandPalette }))
  ),
  
  ContactSection: createLazyComponent(
    () => import('../components/ContactSection').then(m => ({ default: m.ContactSection }))
  ),
  
  // Advanced features
  DecentralandOffice: createLazyComponent(
    () => import('../components/DecentralandOffice').then(m => ({ default: m.DecentralandOffice }))
  ),
  
  EnhancedROI: createLazyComponent(
    () => import('../components/EnhancedROI').then(m => ({ default: m.EnhancedROI }))
  ),
  
  NexusAndroid: createLazyComponent(
    () => import('../components/NexusAndroid').then(m => ({ default: m.NexusAndroid }))
  ),
  
  VitureXRExperience: createLazyComponent(
    () => import('../components/VitureXRExperience').then(m => ({ default: m.VitureXRExperience }))
  ),
  
  // Pages
  DanielaDemo: createLazyComponent(
    () => import('../pages/DanielaDemo').then(m => ({ default: m.DanielaDemo }))
  ),
  
  VirtualOfficePreview: createLazyComponent(
    () => import('../pages/VirtualOfficePreview').then(m => ({ default: m.VirtualOfficePreview }))
  ),
  
  // Workbench components
  WorkbenchLayout: createLazyComponent(
    () => import('../components/workbench/WorkbenchLayout').then(m => ({ default: m.WorkbenchLayout }))
  ),
  
  // 3D and XR components (heavier, load on demand)
  ThreeJSComponents: createLazyComponent(
    () => import('../components/3d/ThreeJSScene').then(m => ({ default: m.ThreeJSScene }))
  ),
  
  XRComponents: createLazyComponent(
    () => import('../components/xr/XRExperience').then(m => ({ default: m.XRExperience }))
  ),
};

// Preload function for critical components
export function preloadComponent(componentName: keyof typeof LazyComponents) {
  const component = LazyComponents[componentName];
  if (component && 'preload' in component) {
    (component as any).preload?.();
  }
}

// Batch preload for multiple components
export function preloadComponents(components: (keyof typeof LazyComponents)[]) {
  components.forEach(preloadComponent);
}

// Intersection Observer based lazy loading for components
export function createIntersectionLazyComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options?: {
    rootMargin?: string;
    threshold?: number;
  }
) {
  const LazyComp = createLazyComponent(importFunc);
  
  return (props: React.ComponentProps<T>) => {
    const [shouldLoad, setShouldLoad] = React.useState(false);
    const elementRef = React.useRef<HTMLDivElement>(null);
    
    React.useEffect(() => {
      const element = elementRef.current;
      if (!element) return;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        },
        {
          rootMargin: options?.rootMargin || '50px',
          threshold: options?.threshold || 0.1,
        }
      );
      
      observer.observe(element);
      
      return () => observer.disconnect();
    }, []);
    
    return (
      <div ref={elementRef}>
        {shouldLoad ? <LazyComp {...props} /> : null}
      </div>
    );
  };
}
