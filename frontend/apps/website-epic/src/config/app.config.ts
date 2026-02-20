export interface AppConfig {
  app: {
    name: string;
    version: string;
    description: string;
    environment: 'development' | 'staging' | 'production';
  };
  auth: {
    supabaseUrl: string;
    supabaseAnonKey: string;
    adminEmails: string[];
    redirectUrls: {
      admin: string;
      client: string;
      demo: string;
    };
  };
  features: {
    enableAnalytics: boolean;
    enablePWA: boolean;
    enableDarkMode: boolean;
    enableSoundEffects: boolean;
    enableAnimations: boolean;
    enableDevTools: boolean;
  };
  ui: {
    theme: {
      defaultMode: 'light' | 'dark' | 'system';
      primaryColor: string;
      secondaryColor: string;
    };
    animations: {
      duration: {
        fast: number;
        normal: number;
        slow: number;
      };
      easing: string;
    };
  };
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
  };
  monitoring: {
    enableErrorReporting: boolean;
    enablePerformanceMonitoring: boolean;
    sentryDsn?: string;
  };
}

const defaultConfig: AppConfig = {
  app: {
    name: 'AIGestion Website',
    version: '2.0.0',
    description: 'AI-powered management platform',
    environment:
      (process.env.NODE_ENV as 'development' | 'staging' | 'production') || 'development',
  },
  auth: {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    adminEmails: ['admin@aigestion.net', 'nemisanalex@gmail.com'],
    redirectUrls: {
      admin: 'https://admin.aigestion.net',
      client: 'https://client.aigestion.net',
      demo: 'https://demo.aigestion.net',
    },
  },
  features: {
    enableAnalytics: process.env.NODE_ENV === 'production',
    enablePWA: true,
    enableDarkMode: true,
    enableSoundEffects: true,
    enableAnimations: true,
    enableDevTools: process.env.NODE_ENV === 'development',
  },
  ui: {
    theme: {
      defaultMode: 'system',
      primaryColor: '#3b82f6',
      secondaryColor: '#8b5cf6',
    },
    animations: {
      duration: {
        fast: 150,
        normal: 300,
        slow: 500,
      },
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 10000,
    retryAttempts: 3,
  },
  monitoring: {
    enableErrorReporting: process.env.NODE_ENV === 'production',
    enablePerformanceMonitoring: process.env.NODE_ENV === 'production',
    sentryDsn: import.meta.env.VITE_SENTRY_DSN,
  },
};

// Environment-specific overrides
const environmentConfigs: Record<string, Partial<AppConfig>> = {
  development: {
    features: {
      enableAnalytics: false,
      enablePWA: false,
      enableDevTools: true,
    },
    monitoring: {
      enableErrorReporting: false,
      enablePerformanceMonitoring: false,
    },
  },
  staging: {
    features: {
      enableAnalytics: true,
      enablePWA: true,
      enableDevTools: true,
    },
    monitoring: {
      enableErrorReporting: true,
      enablePerformanceMonitoring: true,
    },
  },
  production: {
    features: {
      enableAnalytics: true,
      enablePWA: true,
      enableDevTools: false,
      enableSoundEffects: false, // Optional: disable in production for performance
    },
    monitoring: {
      enableErrorReporting: true,
      enablePerformanceMonitoring: true,
    },
  },
};

// Merge default config with environment-specific overrides
function createConfig(): AppConfig {
  const env = defaultConfig.app.environment;
  const envConfig = environmentConfigs[env] || {};

  return {
    app: { ...defaultConfig.app, ...envConfig.app },
    auth: { ...defaultConfig.auth, ...envConfig.auth },
    features: { ...defaultConfig.features, ...envConfig.features },
    ui: { ...defaultConfig.ui, ...envConfig.ui },
    api: { ...defaultConfig.api, ...envConfig.api },
    monitoring: { ...defaultConfig.monitoring, ...envConfig.monitoring },
  };
}

export const config = createConfig();

// Type guards for runtime configuration validation
export function validateConfig(config: unknown): config is AppConfig {
  if (!config || typeof config !== 'object') return false;

  const cfg = config as any;

  return (
    cfg.app?.name &&
    cfg.app?.version &&
    cfg.auth?.supabaseUrl &&
    typeof cfg.features?.enableAnalytics === 'boolean' &&
    typeof cfg.ui?.theme?.defaultMode === 'string'
  );
}

// Feature flag helpers
export const isFeatureEnabled = (feature: keyof AppConfig['features']): boolean => {
  return config.features[feature];
};

export const isDevelopment = (): boolean => config.app.environment === 'development';
export const isProduction = (): boolean => config.app.environment === 'production';
export const isStaging = (): boolean => config.app.environment === 'staging';

// Export individual sections for easier imports
export const authConfig = config.auth;
export const uiConfig = config.ui;
export const apiConfig = config.api;
export const monitoringConfig = config.monitoring;
