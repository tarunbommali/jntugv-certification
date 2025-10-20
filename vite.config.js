import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
            './src/pages/admin/Courses.jsx'
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
})