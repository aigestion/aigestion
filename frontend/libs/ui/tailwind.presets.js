/** @type {import('tailwindcss').Config} */
module.exports = {
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
        'nexus-obsidian-light': '#1a1a1a', // Adjusted for slightly lighter background
        'nexus-obsidian-deep': '#010101',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'monospace'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
