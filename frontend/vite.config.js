// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  
  // This is the new part
  server: {
    proxy: {
      // Any request starting with "/api"
      // will be forwarded to the backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    }
  }
})