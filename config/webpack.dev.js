var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
const path = require('path');

const devPlugins = [
  // Workaround for angular/angular#11580
  new webpack.ContextReplacementPlugin(/angular(\\|\/)core(\\|\/)/, path.resolve(__dirname, '../src/demo'))

];

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',
  mode: 'development',

  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [{
          loader: 'awesome-typescript-loader',
          options: { configFileName: helpers.root('tsconfig.json') }
        },
          'angular-router-loader',
          'angular2-template-loader'
        ]
      },
    ]
  },

  plugins: devPlugins,

  devServer: {
    historyApiFallback: true,
    stats: 'minimal'
  }
});