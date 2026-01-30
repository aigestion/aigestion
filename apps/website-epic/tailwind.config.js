/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', '../../libs/ui/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'nexus-violet': '#8A2BE2',
        'nexus-violet-glow': '#a855f7',
        'nexus-cyan': '#00F5FF',
        'nexus-cyan-glow': '#22d3ee',
        'nexus-gold': '#FFD700',
        'nexus-silver': '#C0C0C0',
        'nexus-obsidian': '#0a0a0a',
        'nexus-obsidian-light': '#0a0a0a',
        'nexus-obsidian-deep': '#010101',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'monospace'],
      },
    },
  },
  plugins: [],
};
