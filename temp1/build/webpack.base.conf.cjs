'use strict'
const path = require('path')
const config = require('./config.cjs')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
const devMode = process.env.NODE_ENV !== 'production'
function assetsPath(_path) {
  const assetsSubDirectory = devMode ? config.dev.assetsSubDirectory : config.build.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

// const createLintingRule = () => ({
//   test: /\.(js|vue)$/,
//   loader: 'eslint-loader',
//   enforce: 'pre',
//   include: [resolve('src'), resolve('server'), resolve('test')],
//   options: {
//     formatter: require('eslint-friendly-formatter'),
//     emitWarning: !config.dev.showEslintErrorsInOverlay
//   }
// })

module.exports = {
  context: resolve(''),
  entry: {
    app: [resolve('src/main.js')]
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath,
    filename: '[name].[hash].js',
    // chunkFilename: '[name].bundle.js',
  },
  target: 'web',
  stats: 'errors-only',
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('src'),
    }
  },
  externals: { // 常见库采用CDN引入
    vue: 'Vue',
    'element-ui': 'ELEMENT',
    'vue-router': 'VueRouter',
  },
  module: {
    rules: [
      // ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        }
      },
      // 普通的 `.scss` 文件和 `*.vue` 文件中的 `<style lang="scss">` 块都应用它
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          // 貌似是 vue-style-loader(版本较低) 与 css-loader(较新) 不兼容，故采用 style-loader
          // devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          // 'postcss-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('autoprefixer')(),
              ]
            }
          },
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              // Provide path to the file with resources
              resources: path.resolve(__dirname, '../src/views/app/variables.scss'), // 指定 scss 变量文件
            },
          },
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        exclude: [resolve('src/icons')],
        options: {
          limit: 10, // 10000
          esModule: false,
          name: assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [resolve('src/icons')],
        options: {
          symbolId: 'icon-[name]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
  ],
}
