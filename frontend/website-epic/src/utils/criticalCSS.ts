// Critical CSS extraction utilities
export const extractCriticalCSS = () => {
  // Critical CSS for above-the-fold content
  const criticalCSS = `
    /* Critical CSS - Above the Fold */
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: #0a0a0f;
      color: #ffffff;
    }

    #root {
      min-height: 100vh;
    }

    /* Loading state */
    .min-h-screen {
      min-height: 100vh;
    }

    .bg-nexus-obsidian-deep {
      background-color: #0a0a0f;
    }

    .flex {
      display: flex;
    }

    .items-center {
      align-items: center;
    }

    .justify-center {
      justify-content: center;
    }

    .text-nexus-cyan-glow {
      color: #00f5ff;
      text-shadow: 0 0 20px rgba(0, 245, 255, 0.5);
    }

    .font-orbitron {
      font-family: 'Orbitron', monospace;
    }

    .tracking-\[0\.5em\] {
      letter-spacing: 0.5em;
    }

    .text-xs {
      font-size: 0.75rem;
    }

    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: .5;
      }
    }

    /* Hero section critical styles */
    .absolute {
      position: absolute;
    }

    .inset-0 {
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }

    .w-full {
      width: 100%;
    }

    .h-full {
      height: 100%;
    }

    .object-cover {
      object-fit: cover;
    }

    .relative {
      position: relative;
    }

    .z-10 {
      z-index: 10;
    }

    /* Navigation critical styles */
    .fixed {
      position: fixed;
    }

    .top-0 {
      top: 0;
    }

    .left-0 {
      left: 0;
    }

    .right-0 {
      right: 0;
    }

    .backdrop-blur-md {
      backdrop-filter: blur(12px);
    }

    .border-b {
      border-bottom-width: 1px;
    }

    .border-white\\/10 {
      border-color: rgba(255, 255, 255, 0.1);
    }

    .px-6 {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }

    .py-4 {
      padding-top: 1rem;
      padding-bottom: 1rem;
    }

    /* Typography critical styles */
    .text-4xl {
      font-size: 2.25rem;
      line-height: 2.5rem;
    }

    .text-6xl {
      font-size: 3.75rem;
      line-height: 1;
    }

    .font-bold {
      font-weight: 700;
    }

    .text-center {
      text-align: center;
    }

    .mb-8 {
      margin-bottom: 2rem;
    }

    /* Button critical styles */
    .inline-block {
      display: inline-block;
    }

    .px-8 {
      padding-left: 2rem;
      padding-right: 2rem;
    }

    .py-4 {
      padding-top: 1rem;
      padding-bottom: 1rem;
    }

    .rounded-full {
      border-radius: 9999px;
    }

    .bg-nexus-violet {
      background-color: #8a2be2;
    }

    .hover\:bg-nexus-violet\/80:hover {
      background-color: rgba(138, 43, 226, 0.8);
    }

    .transition-colors {
      transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 150ms;
    }

    /* Loading animation */
    .animate-[pulse_1s_infinite] {
      animation: pulse 1s infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  `;

  return criticalCSS.trim();
};

// Inject critical CSS into head
export const injectCriticalCSS = () => {
  if (typeof document === 'undefined') return;

  const criticalCSS = extractCriticalCSS();
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  style.setAttribute('data-critical', 'true');
  document.head.appendChild(style);
};

// Preload critical resources
export const preloadCriticalResources = () => {
  if (typeof document === 'undefined') return;

  // Preload critical fonts
  const fonts = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap',
  ];

  fonts.forEach((fontUrl) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = fontUrl;
    link.onload = () => {
      link.onload = null;
      link.rel = 'stylesheet';
    };
    document.head.appendChild(link);
  });

  // Preload critical images
  const criticalImages = ['/images/nexus/hero.png', '/images/brand/logo.png'];

  criticalImages.forEach((imgUrl) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imgUrl;
    document.head.appendChild(link);
  });
};
