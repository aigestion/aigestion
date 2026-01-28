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
    // Enable optimizations for production
    minify: false,
    terserOptions: {
      compress: {
        pure_funcs: [],
        drop_console: false,
      },
      output: {
        comments: true,
      },
    },
    // Ensure dead code elimination
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
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    // Enable sourcemaps for debugging in production
    sourcemap: false,
  },
  // Environment variables
  server: {
    port: 5173,
    strictPort: false,
  },
});
