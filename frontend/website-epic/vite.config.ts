import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: id => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('three') || id.includes('@react-three')) {
              return 'vendor-three';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('zustand') || id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'vendor-utils';
            }
            return 'vendor';
          }

          // App chunks
          if (id.includes('src/components')) {
            if (id.includes('dashboard')) {
              return 'dashboard';
            }
            if (id.includes('CinematicPresentation') || id.includes('DanielaShowcase')) {
              return 'hero';
            }
            if (id.includes('DecentralandOffice') || id.includes('SpatialPresentation')) {
              return 'metaverse';
            }
            return 'components';
          }

          if (id.includes('src/pages')) {
            return 'pages';
          }

          if (id.includes('src/services')) {
            return 'services';
          }
        },
        chunkFileNames: chunkInfo => {
          const facadeModuleId = chunkInfo.facadeModuleId;
          if (facadeModuleId) {
            const fileName = facadeModuleId
              .split('/')
              .pop()
              ?.replace(/\.[^.]*$/, '');
            return `assets/${fileName}-[hash].js`;
          }
          return 'assets/[name]-[hash].js';
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: {
        safari10: true,
      },
    },
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
