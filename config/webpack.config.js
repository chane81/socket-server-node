const path = require('path');
const webpack = require( "webpack" );
var nodeExternals = require('webpack-node-externals');
const env = require('./env')();
const rootPath = path.resolve(__dirname, '../');

module.exports = {
  entry: './src/server.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  target: 'node',
  externals: [nodeExternals()],
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    modules: [path.resolve(rootPath, 'node_modules')],
    alias: {
      '~/src': path.resolve(rootPath, 'src'),
      '~/models': path.resolve(rootPath, 'src/models'),
      '~/library': path.resolve(rootPath, 'src/library')
    }
  },
  output: {
    filename: 'server.js',
    path: path.resolve(rootPath, 'dist')
  },
  plugins: [
    new webpack.IgnorePlugin( /uws/ ),
    new webpack.DefinePlugin(env.stringified),
  ],
  resolveLoader: {
    "modules": [
      "./node_modules"
    ]
  },
  //devtool: 'source-map',
  // devServer: {
  //   hot: true,
  //   inline: true,
  //   compress: true,
  //   publicPath: '/dist/'
  // }
};