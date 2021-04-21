'use strict'
const path = require('path')
const config = require('./config.cjs')
const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf.cjs')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',

  devtool: config.dev.devtool,

  plugins: [
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, './../src/index.html'),
      inject: true,
      path: config.dev.assetsPublicPath + config.dev.assetsSubDirectory
    }),
  ]
})
module.exports = devWebpackConfig
