const merge = require('webpack-merge');
const config = require('./webpack.config');

module.exports = merge(config, {
  mode: 'development',
  devtool: 'cheap-eval-sourcemap',
  devServer: {
    port: 5000,
  },
});