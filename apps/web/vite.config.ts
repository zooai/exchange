import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Zoo Exchange — Vite config.
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    outDir: 'build',
    sourcemap: false,
  },
})
