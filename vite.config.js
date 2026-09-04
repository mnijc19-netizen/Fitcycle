import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITEST ? '/' : './',
  plugins: [
    vue(),
    tailwindcss(),
  ],
  server: {
    host: true,
    port: 5173,
  },
  test: {
    environment: 'happy-dom',
    restoreMocks: true,
  },
})

