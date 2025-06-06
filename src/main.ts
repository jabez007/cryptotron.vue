import { createApp } from 'vue'
//import App from './App.vue'
import router from './router'
import CryptoTronPlugin from './index.ts'

const app = createApp(CryptoTronPlugin.app)

app.use(CryptoTronPlugin, { router })
app.use(router)
app.mount('#app')
