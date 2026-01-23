/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nexus-violet': '#8A2BE2',
        'nexus-cyan': '#00F5FF',
        'nexus-obsidian': '#0a0a0a',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
      },
    },
  },
  plugins: [],
}