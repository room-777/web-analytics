import { defineConfig, loadEnv } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// Built assets land in the Go module so `go:embed all:dist` picks them up.
export default defineConfig(({ mode }) => {
  const envDir = '../..'
  const apiTarget = loadEnv(mode, envDir, '').VITE_API_TARGET || 'http://localhost:8080'

  return {
    plugins: [svelte()],
    envDir,
    build: {
      outDir: '../internal/web/dist',
      emptyOutDir: true,
    },
    server: {
      port: 5173,
      proxy: {
        '/api': { target: apiTarget, changeOrigin: true, secure: apiTarget.startsWith('https://') },
        '/health': { target: apiTarget, changeOrigin: true, secure: apiTarget.startsWith('https://') },
        '/glance.js': { target: apiTarget, changeOrigin: true, secure: apiTarget.startsWith('https://') },
      },
    },
    test: {
      include: ['src/**/*.test.ts'],
    },
  }
})
