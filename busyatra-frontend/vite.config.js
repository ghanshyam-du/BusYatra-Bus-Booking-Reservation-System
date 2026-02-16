import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const PORT = parseInt(env.VITE_PORT) || 5173;
  const API_URL = env.VITE_API_URL || 'http://localhost:5001/api';
  // Extract the target without the /api suffix if needed for proxy, or just use the base URL
  const API_TARGET = API_URL.replace('/api', ''); 

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": `${process.cwd()}/src`,
      },
    },
    server: {
      port: PORT,
      open: true,
      proxy: {
        '/api': {
          target: API_TARGET || 'http://localhost:5001',
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
  }
})