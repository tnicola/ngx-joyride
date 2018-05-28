var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var helpers = require('./helpers');
var path = require('path');

module.exports = {

  entry: {
    'polyfills': './src/demo/polyfills.ts',
    'vendor': './src/demo/vendor.ts',
    'app': path.resolve(__dirname, '../src/demo/main.ts')
  },

  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'ngx-joyride': path.resolve(__dirname, '../src/lib')
    }
  },

  module: {
    rules: [
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
  plugins: [
    // Will generate an HTML5 file that includes all the webpack bundles
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/demo/index.html')
    })
  ]
};