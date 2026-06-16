import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// Use function form to access env and wire a dev proxy to avoid browser CORS
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const pid = env.VITE_FIREBASE_PROJECT_ID
  const functionsProxyTarget = env.VITE_FUNCTIONS_PROXY_TARGET || (pid ? `https://us-central1-${pid}.cloudfunctions.net` : undefined)
  const backendProxyTarget = env.VITE_DEV_BACKEND_TARGET || env.VITE_BACKEND_URL || 'http://localhost:3000'

  const proxy = {}

  if (functionsProxyTarget) {
    proxy['/__api'] = {
      target: functionsProxyTarget,
      changeOrigin: true,
      secure: true,
      rewrite: (path) => path.replace(/^\/__api/, '/api'),
    }
  }

  proxy['/api'] = {
    target: backendProxyTarget,
    changeOrigin: true,
    secure: false,
  }

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom']
          }
        }
      },
  // Increase Vite's chunk size warning limit to avoid noisy warnings for
  // larger vendor/admin bundles. Set to 2000 KB (2 MB).
  chunkSizeWarningLimit: 2000,
    }
  }
})