import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {          // ← di dalam server
      host: 'localhost',
      clientPort: 5173,
      protocol: 'ws',
    },
    watch: {        // ← di dalam server
      usePolling: true,
      interval: 1000,
    }
  }
})
