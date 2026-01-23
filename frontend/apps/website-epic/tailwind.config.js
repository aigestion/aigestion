/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'nexus-obsidian': '#020202',
        'nexus-obsidian-light': '#0a0a0a',
        'nexus-obsidian-deep': '#010101',
        'nexus-violet': '#8A2BE2',
        'nexus-violet-glow': '#a855f7',
        'nexus-cyan': '#00F5FF',
        'nexus-cyan-glow': '#22d3ee',
        'nexus-gold': '#FFD700',
        'nexus-silver': '#C0C0C0',
        'nexus-accent': '#00F5FF',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
      },
      boxShadow: {
        glow: '0 0 20px rgba(138, 43, 226, 0.5)',
        'glow-cyan': '0 0 20px rgba(0, 245, 255, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};