import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

// Testes da lógica pura (a12): sem os plugins do site, nem o vault no build
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'scripts/**/*.test.mjs'],
    environment: 'node'
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
