import VueClipboard from 'vue-clipboard2';
import Vuesax from 'vuesax';
import routes from './router/cryptotron';
import 'vuesax/dist/vuesax.css'; // Vuesax styles
import 'material-icons/iconfont/material-icons.css';

const CryptoTron = {
  install(Vue, options) {
    const { basePath, router } = options;

    Vue.use(VueClipboard);

    Vue.use(Vuesax, {
      // options here
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
