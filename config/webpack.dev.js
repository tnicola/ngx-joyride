var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
const path = require('path');

const devPlugins = [
  // Workaround for angular/angular#11580
  new webpack.ContextReplacementPlugin(/angular(\\|\/)core(\\|\/)/, path.resolve(__dirname, '../src/demo')),

  new webpack.optimize.CommonsChunkPlugin({
    name: ['app', 'vendor', 'polyfills']
  })

];

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',

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
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: { configFileName: helpers.root('tsconfig.json') }
          },
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