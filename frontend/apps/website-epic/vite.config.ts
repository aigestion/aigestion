import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  base: '/website-epic/',
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  define: {
    'process.env': {},
  },
  build: {
    outDir: 'dist',
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
  },
});
