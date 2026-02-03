export const tokens = {
  colors: {
    primary: {
      DEFAULT: '#8a2be2',
      light: '#a052ee',
      dark: '#711db1',
    },
    secondary: {
      DEFAULT: '#00d1ff',
      light: '#33dbff',
      dark: '#00a7cc',
    },
    background: {
      dark: '#0a0a0c',
      panel: '#16161a',
      light: '#f8fafc',
    },
    accent: {
      gold: '#ffb700',
      neon: '#ccff00',
    },
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
    }
  },
  shadows: {
    glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    glow: '0 0 15px rgba(138, 43, 226, 0.5)',
  }
} as const;
