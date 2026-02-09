/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nexus: {
          obsidian: "#000000",
          "obsidian-light": "#050505",
          "obsidian-deep": "#000000",
          violet: "#8a2be2",
          "violet-glow": "#a855f7",
          cyan: "#00f5ff",
          "cyan-glow": "#22d3ee",
          "cyan-mute": "rgba(0, 245, 255, 0.1)",
          gold: "#ffd700",
          silver: "#f5f5f7",
          "silver-mute": "rgba(245, 245, 247, 0.4)",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        orbitron: ["Orbitron", "sans-serif"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-border": "pulse-border 4s ease-in-out infinite",
        "stack-reveal": "stack-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "grain-dance": "grain-dance 8s steps(10) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", filter: "brightness(1)" },
          "50%": { opacity: "0.8", filter: "brightness(1.5)" },
        },
        "pulse-border": {
          "0%, 100%": { borderColor: "rgba(0, 245, 255, 0.1)" },
          "50%": { borderColor: "rgba(0, 245, 255, 0.5)" },
        },
        "stack-reveal": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "grain-dance": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-5%, -5%)" },
          "20%": { transform: "translate(-10%, 5%)" },
          "30%": { transform: "translate(5%, -10%)" },
          "40%": { transform: "translate(-5%, 15%)" },
          "50%": { transform: "translate(-10%, 5%)" },
          "60%": { transform: "translate(15%, 0)" },
          "70%": { transform: "translate(0, 10%)" },
          "80%": { transform: "translate(-15%, 0)" },
          "90%": { transform: "translate(10%, 5%)" },
        },
      },
    },
  },
  plugins: [],
}
