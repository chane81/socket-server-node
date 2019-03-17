const path = require('path');
const Webpack = require( "webpack" );
var nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  // externals: ['ws'],
  devtool: 'source-map',
  target: 'node',
  externals: [nodeExternals()],
  // externals: {
  //   uws: "uws",
  //   ws: "ws",
  // },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    modules: [
      "./node_modules"
    ]
  },
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, '../dist')
  },
  plugins: [
		new Webpack.IgnorePlugin( /uws/ )
  ],
  resolveLoader: {
    "modules": [
      "./node_modules"
    ]
  }
};