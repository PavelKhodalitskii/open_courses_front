import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const API_CONFIG = {
  protocol: process.env.REQUESTS_PROTOCOL,
  host: process.env.BACKEND_HOST,
  port: process.env.BACKEND_PORT,
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        // target: `${API_CONFIG.protocol}://${API_CONFIG.host}:${API_CONFIG.port}/api`,
        target: `http://localhost:8080/api`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})

