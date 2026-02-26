import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json' assert { type: 'json' }

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // Main extension entries are handled by CRX plugin
      },
      output: {
        manualChunks: undefined,
      },
    },
    emptyOutDir: true,
  },
  plugins: [
    crx({ manifest }),
  ],
  publicDir: 'public',
  // HMR configuration for Chrome Extension development
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
  legacy: {
    // Skip the legacy plugin for modern browsers
  },
})
