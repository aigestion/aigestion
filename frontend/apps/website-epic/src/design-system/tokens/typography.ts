/**
 * Design System - Typography Tokens
 * Tokens de tipografía para AIGestion Design System
 */

export const typography = {
  // Font Families
  fonts: {
    primary:
      '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    secondary: '"Space Grotesk", "Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", "Cascadia Code", Consolas, monospace',
    display: '"Clash Display", "Inter", system-ui, sans-serif',
    gaming: '"Orbitron", "Space Mono", monospace',
  },

  // Font Sizes
  sizes: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem', // 72px
    '8xl': '6rem', // 96px
    '9xl': '8rem', // 128px
  },

  // Font Weights
  weights: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  // Line Heights
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter Spacing
  letterSpacings: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Text Styles
  textStyles: {
    // Headings
    h1: {
      fontSize: '3.75rem',
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
      fontFamily: 'var(--font-display)',
    },
    h2: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: '-0.025em',
      fontFamily: 'var(--font-display)',
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.025em',
      fontFamily: 'var(--font-display)',
    },
    h4: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.35,
      letterSpacing: '-0.025em',
      fontFamily: 'var(--font-secondary)',
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      fontFamily: 'var(--font-secondary)',
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      fontFamily: 'var(--font-secondary)',
    },

    // Body Text
    body: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0em',
      fontFamily: 'var(--font-primary)',
    },
    bodyLarge: {
      fontSize: '1.125rem',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0em',
      fontFamily: 'var(--font-primary)',
    },
    bodySmall: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.025em',
      fontFamily: 'var(--font-primary)',
    },

    // UI Elements
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: '0.05em',
      fontFamily: 'var(--font-primary)',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0.1em',
      textTransform: 'uppercase' as const,
      fontFamily: 'var(--font-secondary)',
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.025em',
      fontFamily: 'var(--font-secondary)',
    },

    // Gaming Styles
    gaming: {
      title: {
        fontSize: '4rem',
        fontWeight: 900,
        lineHeight: 1.1,
        letterSpacing: '0.05em',
        fontFamily: 'var(--font-gaming)',
        textTransform: 'uppercase' as const,
      },
      subtitle: {
        fontSize: '2rem',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '0.025em',
        fontFamily: 'var(--font-gaming)',
        textTransform: 'uppercase' as const,
      },
      stat: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: '0.05em',
        fontFamily: 'var(--font-gaming)',
      },
    },

    // Code
    code: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
      fontFamily: 'var(--font-mono)',
    },
    codeInline: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.4,
      fontFamily: 'var(--font-mono)',
    },

    // Special
    hero: {
      fontSize: '5rem',
      fontWeight: 900,
      lineHeight: 1.1,
      letterSpacing: '-0.05em',
      fontFamily: 'var(--font-display)',
    },
    display: {
      fontSize: '6rem',
      fontWeight: 900,
      lineHeight: 1,
      letterSpacing: '-0.05em',
      fontFamily: 'var(--font-display)',
    },
  },

  // Responsive Typography
  responsive: {
    h1: {
      mobile: '2.5rem',
      tablet: '3rem',
      desktop: '3.75rem',
    },
    h2: {
      mobile: '2rem',
      tablet: '2.5rem',
      desktop: '3rem',
    },
    h3: {
      mobile: '1.5rem',
      tablet: '1.875rem',
      desktop: '2.25rem',
    },
    body: {
      mobile: '0.875rem',
      tablet: '1rem',
      desktop: '1rem',
    },
  },
};

// Typography utilities
export const typographyUtils = {
  // Get responsive font size
  getResponsiveSize: (baseSize: string, mobile?: string, tablet?: string) => {
    return {
      fontSize: mobile || baseSize,
      '@media (min-width: 768px)': {
        fontSize: tablet || baseSize,
      },
      '@media (min-width: 1024px)': {
        fontSize: baseSize,
      },
    };
  },

  // Clamp function for fluid typography
  fluid: (
    minSize: string,
    maxSize: string,
    minViewport: string = '320px',
    maxViewport: string = '1200px'
  ) => {
    return `clamp(${minSize}, ${minSize} + (${parseInt(maxSize) - parseInt(minSize)} * 100) / (${parseInt(maxViewport) - parseInt(minViewport)} * 100) * (100vw - ${minViewport}) / 100, ${maxSize})`;
  },

  // Get text style by name
  getTextStyle: (styleName: keyof typeof typography.textStyles) => {
    return typography.textStyles[styleName];
  },

  // Generate CSS custom properties
  generateCSSVars: () => {
    const vars: Record<string, string> = {};

    // Font families
    Object.entries(typography.fonts).forEach(([key, value]) => {
      vars[`--font-${key}`] = value;
    });

    // Font sizes
    Object.entries(typography.sizes).forEach(([key, value]) => {
      vars[`--text-${key}`] = value;
    });

    // Font weights
    Object.entries(typography.weights).forEach(([key, value]) => {
      vars[`--font-weight-${key}`] = value.toString();
    });

    // Line heights
    Object.entries(typography.lineHeights).forEach(([key, value]) => {
      vars[`--leading-${key}`] = value.toString();
    });

    // Letter spacings
    Object.entries(typography.letterSpacings).forEach(([key, value]) => {
      vars[`--tracking-${key}`] = value;
    });

    return vars;
  },
};

// CSS Custom Properties
export const cssTypography = {
  ':root': {
    ...typographyUtils.generateCSSVars(),
    '--font-primary': typography.fonts.primary,
    '--font-secondary': typography.fonts.secondary,
    '--font-mono': typography.fonts.mono,
    '--font-display': typography.fonts.display,
    '--font-gaming': typography.fonts.gaming,
  },
};

export default typography;
