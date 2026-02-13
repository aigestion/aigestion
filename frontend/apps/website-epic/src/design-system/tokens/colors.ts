/**
 * Design System - Color Tokens
 * Tokens de color para AIGestion Design System
 */

export const colors = {
  // Primary Colors - Brand AIGestion
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },

  // Secondary Colors - Purple Theme
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764',
  },

  // Accent Colors - Pink Gradient
  accent: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
    950: '#500724',
  },

  // Neutral Colors
  neutral: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },

  // Semantic Colors
  semantic: {
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a',
    },
    info: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
  },

  // Dark Mode Backgrounds
  dark: {
    background: {
      primary: '#0f0f23',
      secondary: '#1a1a3e',
      tertiary: '#16213e',
      surface: '#1e1e2e',
      elevated: '#2a2a3e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#e4e4e7',
      tertiary: '#a1a1aa',
      disabled: '#71717a',
    },
    border: {
      primary: '#27272a',
      secondary: '#3f3f46',
      tertiary: '#52525b',
    },
  },

  // Gradient Colors
  gradients: {
    primary: 'linear-gradient(135deg, #0ea5e9 0%, #a855f7 50%, #ec4899 100%)',
    secondary: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
    accent: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    success: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    dark: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #16213e 100%)',
    cosmic:
      'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
  },

  // Gaming Theme Colors
  gaming: {
    neon: {
      blue: '#00d4ff',
      purple: '#bf00ff',
      pink: '#ff006e',
      green: '#00ff88',
      yellow: '#ffeb3b',
      orange: '#ff6b35',
    },
    cyberpunk: {
      background: '#0a0a0f',
      grid: '#1a1a2e',
      accent: '#00ff41',
      danger: '#ff0040',
      warning: '#ffaa00',
    },
  },
};

// Color utilities
export const colorUtils = {
  // Get color by path
  getColor: (path: string): string => {
    const keys = path.split('.');
    let value: any = colors;

    for (const key of keys) {
      value = value[key];
      if (!value) return '#000000';
    }

    return value;
  },

  // Get contrast color
  getContrast: (bgColor: string): string => {
    // Simple contrast calculation
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 128 ? '#000000' : '#ffffff';
  },

  // Check if color is light
  isLight: (color: string): boolean => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 128;
  },

  // Generate color palette variations
  generatePalette: (baseColor: string) => {
    // Implement palette generation logic
    return {
      light: colorUtils.lighten(baseColor, 20),
      base: baseColor,
      dark: colorUtils.darken(baseColor, 20),
    };
  },

  // Lighten color
  lighten: (color: string, percent: number): string => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;

    return (
      '#' +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  },

  // Darken color
  darken: (color: string, percent: number): string => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00ff) - amt;
    const B = (num & 0x0000ff) - amt;

    return (
      '#' +
      (0x1000000 + (R > 0 ? R : 0) * 0x10000 + (G > 0 ? G : 0) * 0x100 + (B > 0 ? B : 0))
        .toString(16)
        .slice(1)
    );
  },
};

// CSS Custom Properties
export const cssColors = {
  ':root': {
    '--color-primary-50': colors.primary[50],
    '--color-primary-500': colors.primary[500],
    '--color-primary-600': colors.primary[600],
    '--color-primary-700': colors.primary[700],
    '--color-secondary-500': colors.secondary[500],
    '--color-secondary-600': colors.secondary[600],
    '--color-secondary-700': colors.secondary[700],
    '--color-accent-500': colors.accent[500],
    '--color-accent-600': colors.accent[600],
    '--color-neutral-50': colors.neutral[50],
    '--color-neutral-100': colors.neutral[100],
    '--color-neutral-200': colors.neutral[200],
    '--color-neutral-300': colors.neutral[300],
    '--color-neutral-400': colors.neutral[400],
    '--color-neutral-500': colors.neutral[500],
    '--color-neutral-600': colors.neutral[600],
    '--color-neutral-700': colors.neutral[700],
    '--color-neutral-800': colors.neutral[800],
    '--color-neutral-900': colors.neutral[900],
    '--color-success-500': colors.semantic.success[500],
    '--color-warning-500': colors.semantic.warning[500],
    '--color-error-500': colors.semantic.error[500],
    '--color-info-500': colors.semantic.info[500],
    '--gradient-primary': colors.gradients.primary,
    '--gradient-secondary': colors.gradients.secondary,
    '--gradient-accent': colors.gradients.accent,
    '--gradient-success': colors.gradients.success,
    '--gradient-dark': colors.gradients.dark,
    '--gradient-cosmic': colors.gradients.cosmic,
  },
};

export default colors;
