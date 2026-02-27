import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  base: '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    global: 'window',
  },
  build: {
    outDir: 'dist',
    sourcemap: 'hidden', // 🌌 Sentry needs source maps, but 'hidden' prevents serving them to users
    minify: 'terser',
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
        client: resolve(__dirname, 'client.html'),
        demo: resolve(__dirname, 'demo.html'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'vendor-3d';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('react-router-dom')
            ) {
              return 'vendor-react';
            }
            if (
              id.includes('lucide-react') ||
              id.includes('clsx') ||
              id.includes('tailwind-merge')
            ) {
              return 'vendor-ui';
            }
            if (id.includes('@sentry')) {
              return 'vendor-sentry';
            }
            if (id.includes('@supabase') || id.includes('supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('@tanstack') || id.includes('recharts') || id.includes('d3')) {
              return 'vendor-data';
            }
            if (id.includes('socket.io') || id.includes('@vapi-ai')) {
              return 'vendor-realtime';
            }
            if (
              id.includes('crystals-kyber') ||
              id.includes('tweetnacl') ||
              id.includes('@simplewebauthn')
            ) {
              return 'vendor-crypto';
            }
            if (id.includes('axios') || id.includes('zod') || id.includes('zustand')) {
              return 'vendor-core';
            }
            return 'vendor-others';
          }
        },
        // Consistent chunk naming for caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 200,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 3,
        ecma: 2020,
      },
      mangle: {
        safari10: true,
        toplevel: true,
      },
      format: {
        comments: false,
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
