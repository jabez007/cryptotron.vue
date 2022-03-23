const path = require('path');

const basePath = process.env.NODE_ENV === 'production'
  ? '/cryptotron/'
  : '/';

module.exports = {
  baseUrl: basePath,
  publicPath: basePath,
  chainWebpack: (config) => {
    // alias to lib directory
    config.resolve.alias.set('_', path.resolve(__dirname, './src/lib'));
  },
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'service-worker.js',
    },
  },
};
