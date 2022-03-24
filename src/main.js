import Vue from 'vue';
import router from './router';
import CryptoTron from './index';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(CryptoTron, { basePath: '/', router });

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
