import Vue from 'vue';
import './plugins/vuetify';
import './plugins/vueClipboard';
import router from './plugins/router';
import App from './App.vue';

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
