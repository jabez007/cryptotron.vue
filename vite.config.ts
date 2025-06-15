import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import { name } from './package.json'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const base = mode === 'production' ? `/${name.split('/').pop()}/` : '/'

  console.debug(`Base path set to: ${base}`)

  return {
    base,
    plugins: [vue(), vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
