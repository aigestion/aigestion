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
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: {
          // Core React runtime (~45 KB)
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // 3D engine (~150 KB) - lazy loaded pages only
          'vendor-3d': ['three', '@react-three/fiber', '@react-three/drei'],
          // Animation engine (~60 KB)
          'vendor-motion': ['framer-motion'],
          // UI utilities (~30 KB)
          'vendor-ui': ['lucide-react', 'clsx', 'tailwind-merge', 'zod'],
          // Data layer (~40 KB)
          'vendor-data': ['zustand', '@tanstack/react-query', '@supabase/supabase-js'],
        },
        // Consistent chunk naming for caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 200,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: {
        safari10: true,
      },
      format: {
        ascii_only: true,
      },
    },
    reportCompressedSize: true,
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
