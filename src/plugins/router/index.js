import Vue from 'vue';
import Router from 'vue-router';
// sections
import cryptotron from './cryptotron';

Vue.use(Router);

export default new Router({
  routes: [
    cryptotron(),
  ],
});
