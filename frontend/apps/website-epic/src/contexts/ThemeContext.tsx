import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  readonly primary: string;
  readonly secondary: string;
  readonly background: string;
  readonly surface: string;
  readonly text: string;
  readonly textSecondary: string;
  readonly border: string;
  readonly accent: string;
  readonly success: string;
  readonly warning: string;
  readonly error: string;
  readonly info: string;
}

export interface Theme {
  readonly mode: 'light' | 'dark';
  readonly colors: ThemeColors;
  readonly transitions: {
    readonly duration: string;
    readonly easing: string;
  };
  readonly shadows: {
    readonly sm: string;
    readonly md: string;
    readonly lg: string;
    readonly xl: string;
  };
}

const lightTheme: Theme = {
  mode: 'light',
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    accent: '#06b6d4',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  transitions: {
    duration: '200ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
};

const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    primary: '#60a5fa',
    secondary: '#a78bfa',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#334155',
    accent: '#22d3ee',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
  },
  transitions: {
    duration: '200ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
  },
};

interface ThemeContextType {
  readonly theme: Theme;
  readonly themeMode: ThemeMode;
  readonly setThemeMode: (mode: ThemeMode) => void;
  readonly toggleTheme: () => void;
  readonly systemTheme: 'light' | 'dark';
  readonly isSystemTheme: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  readonly children: ReactNode;
  readonly defaultTheme?: ThemeMode;
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme-mode') as ThemeMode;
      return saved || defaultTheme;
    }
    return defaultTheme;
  });

  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    // Set initial system theme
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Determine current theme
  const currentTheme = themeMode === 'system' ? systemTheme : themeMode;
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');

    // Add current theme class
    root.classList.add(currentTheme);

    // Set CSS custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Set transition properties
    root.style.setProperty('--transition-duration', theme.transitions.duration);
    root.style.setProperty('--transition-easing', theme.transitions.easing);

    // Set shadow properties
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });

    // Set theme mode in meta tag for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme.colors.background);
    }
  }, [theme, currentTheme]);

  // Save theme preference
  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-mode', mode);
    }
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    if (themeMode === 'system') {
      setThemeMode(systemTheme === 'light' ? 'dark' : 'light');
    } else {
      setThemeMode(themeMode === 'light' ? 'dark' : 'light');
    }
  };

  const value: ThemeContextType = {
    theme,
    themeMode,
    setThemeMode,
    toggleTheme,
    systemTheme,
    isSystemTheme: themeMode === 'system',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Hook for theme-aware styles
export function useThemeStyles() {
  const { theme } = useTheme();

  return {
    getColor: (colorName: keyof ThemeColors) => theme.colors[colorName],
    getShadow: (shadowName: keyof Theme['shadows']) => theme.shadows[shadowName],
    getTransition: () => `${theme.transitions.duration} ${theme.transitions.easing}`,
    isDark: theme.mode === 'dark',
    isLight: theme.mode === 'light',
    theme,
  };
}

// Hook for responsive theme switching
export function useResponsiveTheme() {
  const { themeMode, setThemeMode, systemTheme } = useTheme();

  // Auto-switch to system theme based on time of day
  useEffect(() => {
    if (themeMode !== 'system') return;

    const hour = new Date().getHours();
    const isDaytime = hour >= 6 && hour < 18;

    // Optional: Override system theme based on time
    // This is commented out by default, but can be enabled
    /*
    if (isDaytime && systemTheme === 'dark') {
      // Force light theme during day
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else if (!isDaytime && systemTheme === 'light') {
      // Force dark theme during night
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
    */
  }, [themeMode, systemTheme]);

  return {
    themeMode,
    setThemeMode,
    systemTheme,
    isAutoMode: themeMode === 'system',
  };
}

// Theme utilities
export const themeUtils = {
  // Get contrasting text color for background
  getContrastColor: (backgroundColor: string): string => {
    // Simple contrast calculation
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  },

  // Generate theme-aware CSS variables
  generateCSSVariables: (theme: Theme): Record<string, string> => {
    const variables: Record<string, string> = {};

    Object.entries(theme.colors).forEach(([key, value]) => {
      variables[`--color-${key}`] = value;
    });

    Object.entries(theme.shadows).forEach(([key, value]) => {
      variables[`--shadow-${key}`] = value;
    });

    variables['--transition-duration'] = theme.transitions.duration;
    variables['--transition-easing'] = theme.transitions.easing;

    return variables;
  },

  // Check if color is light
  isLightColor: (color: string): boolean => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  },
};
