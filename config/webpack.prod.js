var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const AotPlugin = require('@ngtools/webpack').AotPlugin;
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
var path = require('path');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

const extractSass = new ExtractTextPlugin({
  filename: "[name].[contenthash].css",
  disable: process.env.NODE_ENV === "development"
});

const prodPlugins = [
  new AotPlugin({
    tsConfigPath: 'tsconfig-aot.json',
    entryModule: path.resolve(__dirname, '../src/demo/app/app.module#AppModule'),
    sourceMap: true,
    skipCodeGeneration: false
  }),
  extractSass
];

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',

  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },

  module: {
    rules: [{
      test: /\.ts$/,
      use: '@ngtools/webpack'
    }]
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
      mangle: {
        keep_fnames: true
      }
    }),
    new ExtractTextPlugin('[name].[hash].css'),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    }),
    new webpack.LoaderOptionsPlugin({
      htmlLoader: {
        minimize: false // workaround for ng2
      }
    })
  ].concat(prodPlugins)
});