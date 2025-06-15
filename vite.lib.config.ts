import { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    outDir: 'lib',
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "CryptoTronApp",
      fileName: (format) => `cryptotron-app.${format}.js`,
      formats: ["es", 'umd']
    },
    rollupOptions: {
      external: ["vue", "vue-router"],
      output: {
        globals: {
          vue: "Vue",
          "vue-router": "VueRouter",
        }
      }
    }
  }
})
