var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
var helpers = require('./helpers');
const path = require('path')
const AotPlugin = require('@ngtools/webpack').AotPlugin;


// The value 'production' depends on what NODE_ENV is set when running Webpack
// to compile the production bundle
const IS_DEV = process.env.NODE_ENV !== 'production';

const extractSass = new ExtractTextPlugin({
  filename: "[name].[contenthash].css",
  disable: process.env.NODE_ENV === "development"
});

const prodPlugins = [
  new AotPlugin({
    tsConfigPath: 'tsconfig-aot.json',
    entryModule: path.resolve(__dirname, '../src/demo/app/app.module#AppModule'),
    sourceMap: true,
    skipCodeGeneration: IS_DEV
  }),
  extractSass
];

const devPlugins = [
  // Workaround for angular/angular#11580
  new webpack.ContextReplacementPlugin(/angular(\\|\/)core(\\|\/)/, path.resolve(__dirname, '../src/demo')),

  new webpack.optimize.CommonsChunkPlugin({
    name: ['app', 'vendor', 'polyfills']
  }),

  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, '../src/demo/index.html')
  })
];

module.exports = {

  entry: {
    'polyfills': './src/demo/polyfills.ts',
    'vendor': './src/demo/vendor.ts',
    'app': path.resolve(__dirname, '../src/demo/main.ts')
  },

  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'angular2-joyride': path.resolve(__dirname, '../src/lib')
    }
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: IS_DEV ? [
          {
            loader: 'awesome-typescript-loader',
            options: { configFileName: helpers.root('tsconfig.json') }
          },
          'angular2-template-loader'] : '@ngtools/webpack'
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        include: helpers.root('src', 'demo'),
        loader: 'raw-loader'
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          {
            loader: 'to-string-loader'
          }, {
            loader: "css-loader", options: {
              sourceMap: true
            }
          }, {
            loader: "sass-loader", options: {
              sourceMap: true
            }
          }]
      }
    ]
  },
  plugins: IS_DEV ? devPlugins : prodPlugins,
  devServer: {
    contentBase: path.join(__dirname, "../dist")
  }
};