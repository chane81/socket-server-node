const path = require('path');
const webpack = require( "webpack" );
var nodeExternals = require('webpack-node-externals');
const env = require('./env')();

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
    modules: [path.resolve(__dirname, '../node_modules')]
  },
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, '../dist')
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