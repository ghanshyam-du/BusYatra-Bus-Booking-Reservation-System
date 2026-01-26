import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  
  // Exclude Node.js built-in modules
  optimizeDeps: {
    exclude: ['crypto', 'path', 'fs', 'os']
  },
  
  // Don't bundle backend files
  build: {
    rollupOptions: {
      external: ['crypto', 'path', 'fs', 'os']
    }
  },
  
  // Explicitly set root to frontend only
  root: process.cwd(),
})