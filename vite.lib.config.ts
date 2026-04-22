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
    assetsInlineLimit: 409600, // 400KB to ensure logo is inlined
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
    },
    rollupOptions: {
      external: ["vue", "vue-router"],
      output: [
        {
          format: 'es',
          entryFileNames: 'cryptotron-app.es.js',
          chunkFileNames: '[name]-[hash].js',
          manualChunks(id) {
            if (id.includes('cryptotron.js/dist/cjs/ngrams') || id.includes('cryptotron.js/dist/esm/ngrams')) {
              return 'ngrams-data';
            }
            if (id.includes('node_modules/@vue-flow')) {
              return 'vue-flow';
            }
          },
          globals: {
            vue: "Vue",
            "vue-router": "VueRouter",
          }
        },
        {
          format: 'umd',
          name: "CryptoTronApp",
          entryFileNames: 'cryptotron-app.umd.js',
          inlineDynamicImports: true,
          globals: {
            vue: "Vue",
            "vue-router": "VueRouter",
          }
        }
      ]
    }
  }
})
