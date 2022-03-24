import VueClipboard from 'vue-clipboard2';
import Vuetify from 'vuetify/lib';
import 'vuetify/src/stylus/app.styl';
import routes from './router/cryptotron';

const CryptoTron = {
  install(Vue, options) {
    const { vuetify, basePath, router } = options;

    Vue.use(VueClipboard);

    Vue.use(Vuetify, vuetify || {
      iconfont: 'md',
      options: {
        /*
         * will generate a css variable for each theme color, which can then use in a component's style.
         *
         * ex:
         *    .something {
         *      color: var(--v-primary-base)
         *      background-color: var(--v-accent-lighten2)
         *    }
         */
        customProperties: true,
      },
    });

    const newRoutes = routes(basePath || '/cryptotron');

    if (router.addRoute) {
      router.addRoute(newRoutes);
    } else {
      router.addRoutes([newRoutes]);
    }
  },
};

// Automatic installation if Vue has been added to the global scope.
// if (typeof window !== 'undefined' && window.Vue) {
//   window.Vue.use(CryptoTron);
// }

export default CryptoTron;
