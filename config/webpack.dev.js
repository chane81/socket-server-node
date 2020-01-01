const merge = require('webpack-merge');
const config = require('./webpack.config');
const nodemonPlugin = require('nodemon-webpack-plugin');
const path = require('path');
const rootPath = path.resolve(__dirname, '../');

module.exports = merge(config, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    ...config.plugins,
    new nodemonPlugin({
      //nodeArgs: ['-r', 'dotenv/config', '--inspect=0.0.0.0:9229'],
      watch: path.resolve(rootPath, 'dist'),
      script: path.resolve(rootPath, 'dist/server.js')
    })
  ]
});