import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  define: {
    'process.env': {}
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html',
      output: {
        format: 'es',
      }
    }
  }
})
