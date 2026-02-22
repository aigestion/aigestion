/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        nexus: {
          obsidian: '#000000',
          'obsidian-light': '#050505',
          'obsidian-deep': '#000000',
          void: '#030005', // Ultra-dark purple/black for depth
          plasma: '#1a0b2e', // Deep plasma background
          violet: '#8a2be2',
          'violet-glow': '#a855f7',
          'violet-dim': 'rgba(138, 43, 226, 0.1)',
          cyan: '#00f5ff',
          'cyan-glow': '#22d3ee',
          'cyan-dim': 'rgba(0, 245, 255, 0.1)',
          gold: '#ffd700',
          silver: '#f5f5f7',
          'silver-mute': 'rgba(245, 245, 247, 0.4)',
        },
        // Phase 18: Sovereign Intelligence Aesthetic
        sovereign: {
          black: '#050505', // Deepest Void
          void: '#0A0A0A', // Background
          'neon-cyan': '#00F0FF', // AI/Logic
          'neon-purple': '#BD00FF', // Creative/Swarm
          'glass-surface': 'rgba(255, 255, 255, 0.03)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'], // For code/data aesthetics
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'nexus-gradient': 'linear-gradient(135deg, #000000 0%, #1a0b2e 100%)',
        holographic:
          'linear-gradient(135deg, rgba(0, 245, 255, 0.1) 0%, rgba(138, 43, 226, 0.1) 100%)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-border': 'pulse-border 4s ease-in-out infinite',
        'stack-reveal': 'stack-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'grain-dance': 'grain-dance 8s steps(10) infinite',
        'hologram-flicker': 'hologram-flicker 3s infinite',
        'void-spin': 'spin 20s linear infinite',
        'data-flow': 'data-flow 3s linear infinite',
        'scanner-line': 'scanner-line 4s linear infinite',
        'metric-count': 'metric-count 0.6s ease-out',
        'border-trace': 'border-trace 4s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.5)' },
        },
        'pulse-border': {
          '0%, 100%': { borderColor: 'rgba(0, 245, 255, 0.1)' },
          '50%': { borderColor: 'rgba(0, 245, 255, 0.5)' },
        },
        'stack-reveal': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'grain-dance': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -5%)' },
          '20%': { transform: 'translate(-10%, 5%)' },
          '30%': { transform: 'translate(5%, -10%)' },
          '40%': { transform: 'translate(-5%, 15%)' },
          '50%': { transform: 'translate(-10%, 5%)' },
          '60%': { transform: 'translate(15%, 0)' },
          '70%': { transform: 'translate(0, 10%)' },
          '80%': { transform: 'translate(-15%, 0)' },
          '90%': { transform: 'translate(10%, 5%)' },
        },
        'hologram-flicker': {
          '0%, 100%': { opacity: 1 },
          '33%': { opacity: 0.9 },
          '66%': { opacity: 0.95 },
          '70%': { opacity: 0.7 },
          '72%': { opacity: 1 },
        },
        'data-flow': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'scanner-line': {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        },
        'metric-count': {
          '0%': { opacity: '0', transform: 'scale(0.8) translateY(4px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'border-trace': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      boxShadow: {
        'nexus-glow':
          '0 0 30px -5px rgba(138, 43, 226, 0.15), 0 0 60px -10px rgba(0, 245, 255, 0.1)',
        'nexus-cyan': '0 0 20px -5px rgba(0, 245, 255, 0.3)',
        'nexus-violet': '0 0 20px -5px rgba(138, 43, 226, 0.3)',
        'nexus-gold': '0 0 20px -5px rgba(255, 215, 0, 0.3)',
      },
    },
  },
  plugins: [
    // 3D Transforms Plugin
    function ({ addUtilities }) {
      addUtilities({
        '.perspective-1000': { perspective: '1000px' },
        '.transform-style-3d': { transformStyle: 'preserve-3d' },
        '.backface-hidden': { backfaceVisibility: 'hidden' },
        '.rotate-y-180': { transform: 'rotateY(180deg)' },
      });
    },
  ],
};
