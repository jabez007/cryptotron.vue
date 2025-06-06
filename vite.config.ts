import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import { name } from './package.json';

const basePath = process.env.NODE_ENV === 'production'
  ? `/${name.split('/').slice(-1)[0]}/`
  : '/';

// https://vite.dev/config/
export default defineConfig({
  base: basePath,
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
