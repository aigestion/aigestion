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
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    target: 'es2020',
    mode: 'production',
    define: {
      'process.env': {},
      global: 'window',
      exports: {},
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[hash].[ext]',
        manualChunks: id => {
          if (id.includes('vendor')) return 'vendor';
          if (id.includes('router')) return 'router';
          if (id.includes('ui') || id.includes('framer') || id.includes('lucide')) return 'ui';
          if (id.includes('charts') || id.includes('recharts')) return 'charts';
          if (id.includes('three') || id.includes('@react-three')) return 'three';
          return 'main';
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: [
          'console.log',
          'console.info',
          'console.debug',
          'console.warn',
          'console.error',
        ],
      },
      mangle: {
        safari10: true,
      },
      format: {
        ascii_only: true,
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
