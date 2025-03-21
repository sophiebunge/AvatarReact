import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Bind to all interfaces
    port: process.env.PORT || 5173, // Use the port provided by Render or fallback to 5173
    allowedHosts: ['avatarreact-2.onrender.com'], // Allow your deployed host
  },
})
