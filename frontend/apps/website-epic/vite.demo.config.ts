import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist/demo',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        demo: resolve(__dirname, 'demo.html'),
      },
    },
  },
});
