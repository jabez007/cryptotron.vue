import { createApp } from 'vue'
//import App from './App.vue'
import router from './router'
import CryptoTronPlugin from './index.ts'

CryptoTronPlugin.app().then((App) => {
  const app = createApp(App.default)

  app.use(CryptoTronPlugin, { router })
  app.use(router)

  app.mount('#app')
})


