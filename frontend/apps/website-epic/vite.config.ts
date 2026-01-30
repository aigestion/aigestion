import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react({
      // Enable React optimization
      jsxRuntime: 'automatic',
    }),
  ],
  base: '/',
  resolve: {},
  build: {
    outDir: 'dist',
    // Enable optimizations for GitHub Pages
    minify: 'terser',
    terserOptions: {
      compress: {
        pure_funcs: [],
        drop_console: false,
      },
      output: {
        comments: false,
      },
    },
    // Enable dead code elimination
    rollupOptions: {
      input: './index.html',
      output: {
        format: 'es',
        manualChunks: {
          vendor: ['react', 'react-dom'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          framer: ['framer-motion'],
          lucide: ['lucide-react'],
          supabase: ['@supabase/supabase-js'],
          utils: ['clsx', 'tailwind-merge'],
          modelViewer: ['@google/model-viewer'],
        },
      },
      onwarn(warning, warn) {
        // Ignore unresolved external dependencies
        if (warning.code === 'UNRESOLVED_IMPORT') {
          return;
        }
        warn(warning);
      },
    },
    chunkSizeWarningLimit: 1000,
    // Disable sourcemaps for production GitHub Pages
    sourcemap: false,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize chunk loading
    modulePreload: {
      polyfill: true,
    },
  },
  // Environment variables
  server: {
    port: 5173,
    strictPort: false,
  },
  // Build optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion'],
  },
});
