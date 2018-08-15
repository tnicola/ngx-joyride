var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
var path = require('path');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

const extractSass = new MiniCssExtractPlugin({
  filename: "[name].css",
  chunkFilename: "[id].css"
});

const prodPlugins = [
  new AngularCompilerPlugin({
    tsConfigPath: 'tsconfig-aot.json',
    entryModule: path.resolve(__dirname, '../src/demo/app/app.module#AppModule'),
    sourceMap: true,
    skipCodeGeneration: false
  }),
  extractSass
];

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',
  mode: 'production',

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