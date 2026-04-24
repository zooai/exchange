import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Minimal Vite config. All optimization (code splitting, Tamagui
// extraction, polyfills, CSP) lives in the @luxfi/exchange package —
// Zoo only ships this 15-line shim + @zooai/brand overlay.
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    outDir: 'build',
    sourcemap: false,
  },
})
