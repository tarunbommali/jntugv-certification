import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// Use function form to access env and wire a dev proxy to avoid browser CORS
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const pid = env.VITE_FIREBASE_PROJECT_ID
  const proxyTarget = env.VITE_API_PROXY_TARGET || (pid ? `https://us-central1-${pid}.cloudfunctions.net` : undefined)

  return {
    plugins: [react(), tailwindcss()],
    server: proxyTarget
      ? {
          proxy: {
            // Route client requests starting with /__api to Cloud Functions
            '/__api': {
              target: proxyTarget,
              changeOrigin: true,
              secure: true,
              rewrite: (path) => path.replace(/^\/__api/, '/api'),
            },
          },
        }
      : undefined,
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks
            vendor: ['react', 'react-dom', 'react-router-dom'],
            // Admin chunks
            admin: [
              './src/pages/admin/AdminPage.jsx',
              './src/pages/admin/Analytics.jsx',
              './src/pages/admin/CourseForm.jsx',
              './src/pages/admin/UsersManagement.jsx',
              './src/pages/admin/AdminCoupons.jsx',
              './src/pages/admin/CourseManagement.jsx'
            ],
            // UI components
            ui: [
              './src/components/Header.jsx',
              './src/components/Footer.jsx',
              './src/components/Course/CourseCard.jsx'
            ]
          }
        }
      },
      chunkSizeWarningLimit: 1000, // Increase warning limit to 1000 kB
    }
  }
})