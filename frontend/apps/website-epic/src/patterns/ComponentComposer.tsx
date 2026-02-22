import { ComponentType, ReactNode, useEffect, useMemo, useState } from 'react';

// Component composition utilities
export interface ComponentProps {
  readonly [key: string]: any;
}

export interface ComposableComponent<P = ComponentProps> {
  readonly Component: ComponentType<P>;
  readonly props?: P;
}

export interface CompositionContext {
  readonly components: Map<string, ComposableComponent>;
  readonly hooks: Map<string, () => any>;
  readonly providers: Map<string, ComponentType<any>>;
}

// Global composition context
const compositionContext: CompositionContext = {
  components: new Map(),
  hooks: new Map(),
  providers: new Map(),
};

// Component registry
export class ComponentRegistry {
  static register<P = ComponentProps>(
    name: string,
    component: ComponentType<P>,
    defaultProps?: P
  ): void {
    compositionContext.components.set(name, {
      Component: component as any,
      props: defaultProps as any,
    });
  }

  static get(name: string): ComposableComponent | undefined {
    return compositionContext.components.get(name);
  }

  static has(name: string): boolean {
    return compositionContext.components.has(name);
  }

  static list(): string[] {
    return Array.from(compositionContext.components.keys());
  }

  static unregister(name: string): boolean {
    return compositionContext.components.delete(name);
  }
}

// Hook registry
export class HookRegistry {
  static register<T = any>(name: string, hook: () => T): void {
    compositionContext.hooks.set(name, hook);
  }

  static get<T = any>(name: string): (() => T) | undefined {
    return compositionContext.hooks.get(name) as (() => T) | undefined;
  }

  static has(name: string): boolean {
    return compositionContext.hooks.has(name);
  }

  static list(): string[] {
    return Array.from(compositionContext.hooks.keys());
  }

  static unregister(name: string): boolean {
    return compositionContext.hooks.delete(name);
  }
}

// Provider registry
export class ProviderRegistry {
  static register<P = ComponentProps>(name: string, provider: ComponentType<P>): void {
    compositionContext.providers.set(name, provider);
  }

  static get(name: string): ComponentType<any> | undefined {
    return compositionContext.providers.get(name);
  }

  static has(name: string): boolean {
    return compositionContext.providers.has(name);
  }

  static list(): string[] {
    return Array.from(compositionContext.providers.keys());
  }

  static unregister(name: string): boolean {
    return compositionContext.providers.delete(name);
  }
}

// Component composer utility
export function composeComponent<P = ComponentProps>(
  name: string,
  overrides?: Partial<P>
): ComponentType<P> | null {
  const registered = ComponentRegistry.get(name);
  if (!registered) return null;

  const { Component, props: defaultProps } = registered;
  const finalProps = { ...defaultProps, ...overrides };

  return (props: P) => <Component {...(finalProps as any)} {...props} />;
}

// Multi-component composer
export function composeComponents(
  components: Array<{ name: string; props?: ComponentProps }>
): ReactNode {
  return components
    .map(({ name, props }) => {
      const Component = composeComponent(name, props);
      return Component ? <Component key={name} /> : null;
    })
    .filter(Boolean);
}

// Provider wrapper composer
export function composeProviders(
  providers: Array<{ name: string; props?: ComponentProps }>,
  children: ReactNode
): ReactNode {
  return providers.reduceRight((acc, { name, props }) => {
    const Provider = ProviderRegistry.get(name);
    if (!Provider) return acc;

    return <Provider {...props}>{acc}</Provider>;
  }, children);
}

// Hook composer
export function composeHook<T = any>(
  hookName: string,
  wrapper?: (hook: () => T) => () => T
): (() => T) | null {
  const registeredHook = HookRegistry.get<T>(hookName);
  if (!registeredHook) return null;

  return wrapper ? wrapper(registeredHook) : registeredHook;
}

// Conditional component renderer
export function ConditionalComponent({
  condition,
  component,
  fallback,
}: {
  readonly condition: boolean;
  readonly component: ReactNode;
  readonly fallback?: ReactNode;
}) {
  return condition ? component : fallback || null;
}

// Lazy component loader
export function LazyComponent({
  name,
  loader,
  fallback,
}: {
  readonly name: string;
  readonly loader: () => Promise<{ default: ComponentType<any> }>;
  readonly fallback?: ReactNode;
}) {
  const [Component, setComponent] = useState<ComponentType<any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loader()
      .then(module => {
        if (module.default) {
          ComponentRegistry.register(name, module.default);
          setComponent(() => module.default);
        } else {
          setError('No default export found');
        }
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [name, loader]);

  if (loading) return fallback || <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!Component) return null;

  return <Component />;
}

// Component factory
export function createComponentFactory<P = ComponentProps>(defaultConfig: {
  readonly wrapper?: ComponentType<{ children: ReactNode }>;
  readonly providers?: Array<{ name: string; props?: ComponentProps }>;
  readonly hooks?: Array<string>;
}) {
  return function FactoryComponent({
    name,
    props,
    children,
  }: {
    readonly name: string;
    readonly props?: P;
    readonly children?: ReactNode;
  }) {
    const Component = composeComponent<P>(name, props);
    if (!Component) return null;

    let content = <Component {...(props as P)}>{children}</Component>;

    // Apply providers
    if (defaultConfig.providers) {
      content = composeProviders(defaultConfig.providers, content) as React.ReactElement;
    }

    // Apply wrapper
    if (defaultConfig.wrapper) {
      const Wrapper = defaultConfig.wrapper;
      content = <Wrapper>{content}</Wrapper>;
    }

    return <>{content}</>;
  };
}

// Theme-based component composer
export function ThemeComposer({
  theme,
  components,
}: {
  readonly theme: string;
  readonly components: Array<{ name: string; props?: ComponentProps }>;
}) {
  const themedComponents = useMemo(() => {
    return components.map(({ name, props }) => ({
      name: `${name}-${theme}`,
      props: { ...props, theme },
    }));
  }, [theme, components]);

  return <>{composeComponents(themedComponents)}</>;
}

// Layout composer
export function LayoutComposer({
  layout,
  sections,
}: {
  readonly layout: string;
  readonly sections: Array<{ name: string; props?: ComponentProps }>;
}) {
  const layoutComponent = ComponentRegistry.get(`layout-${layout}`);
  if (!layoutComponent) return null;

  const { Component: Layout, props: layoutProps } = layoutComponent;

  return (
    <Layout {...layoutProps}>
      {sections.map(({ name, props }) => {
        const Component = composeComponent(name, props);
        return Component ? <Component key={name} /> : null;
      })}
    </Layout>
  );
}

// Pipeline composer for data flow
export function PipelineComposer({
  pipeline,
  data,
}: {
  readonly pipeline: Array<{ name: string; transform?: (data: any) => any }>;
  readonly data: any;
}) {
  const result = useMemo(() => {
    return pipeline.reduce((acc, { name, transform }) => {
      const Component = composeComponent(name);
      if (!Component) return acc;

      const transformedData = transform ? transform(acc) : acc;
      return <Component key={name} data={transformedData} />;
    }, data);
  }, [pipeline, data]);

  return <>{result}</>;
}

// Higher-order component composer
export function withComposition<P extends ComponentProps>(
  Component: ComponentType<P>,
  composition: {
    readonly providers?: Array<{ name: string; props?: ComponentProps }>;
    readonly hooks?: Array<string>;
    readonly wrapper?: ComponentType<{ children: ReactNode }>;
  }
): ComponentType<P> {
  return function ComposedComponent(props: P) {
    let content = <Component {...props} />;

    // Apply hooks
    composition.hooks?.forEach(hookName => {
      const hook = composeHook(hookName);
      if (hook) {
        // Hook would be used inside the component
        // This is a simplified example
      }
    });

    // Apply providers
    if (composition.providers) {
      content = composeProviders(composition.providers, content) as React.ReactElement;
    }

    // Apply wrapper
    if (composition.wrapper) {
      const Wrapper = composition.wrapper;
      content = <Wrapper>{content}</Wrapper>;
    }

    return <>{content}</>;
  };
}

// Component composition hook
export function useComponentComposition() {
  return {
    register: ComponentRegistry.register,
    get: ComponentRegistry.get,
    has: ComponentRegistry.has,
    list: ComponentRegistry.list,
    unregister: ComponentRegistry.unregister,
    compose: composeComponent,
    composeMultiple: composeComponents,
    composeProviders,
    createFactory: createComponentFactory,
    withComposition,
  };
}

// Export registries for external access
export { compositionContext };
