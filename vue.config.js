const path = require('path');
const { name } = require('./package.json');

const basePath = process.env.NODE_ENV === 'production'
  ? `/${name}/`
  : '/';

module.exports = {
  // baseUrl: basePath,
  publicPath: basePath,
  chainWebpack: (config) => {
    // alias to lib directory
    config.resolve.alias.set('_', path.resolve(__dirname, './src/lib'));
  },
};
