import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
    global: 'window',
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    target: 'es2020',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
    chunkSizeWarningLimit: 1000,
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
        // pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
      },
      mangle: {
        safari10: true,
        properties: {
          '^_': '',
        },
      },
    },
    reportCompressedSize: false,
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
    ],
  },
});
