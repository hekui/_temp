# Temp1
`node` + 前台打包服务。

## Features
1. node v14.6.0 (ES6 import)
2. koa v2.0 + redis + mysql + log + xml
3. eslint
4. webpack 4
5. vue 2.6 + vue-router + sass + postcss-loader(autoprefixer) + 组件动态引入（代码分割，异步加载）
6. gzip：koa-compress

## 性能提升
可使用 `webpack-bundle-analyzer` 进行打包分析，对症下药。  

1. 采用 `CDN` 引入较大/独立的资源：`vue`、`vue-router`、`vuex`、`element-ui` 等。  
2. 采用组件动态引入：  
    ```javascript
    export default new Router({
      routes: [
        {
          path: '/async',
          name: 'async',
          component: () => import(/* webpackChunkName: "async" */ '@/components/async')
        }
      ]
    })
    ```
3. 开启压缩 `gzip` 等。  

## Compress
1. `webpack` 打包开启 `gzip` ，会打包出满足设置的 `.gz`  文件。
2. `koa-static` 默认开启 `gzip` ，当客户端支持 `gzip` 且所请求的文件存在扩展名为 `.gz` 的文件时。
3. 使用 `koa-compress` 设置 `gzip` ，当客户端支持 `gzip` 即可，不需要提供 `.gz`  文件。
    详见：[koa-compress](https://github.com/koajs/compress)
    ```javascript
    import Koa from 'koa'
    import compress from 'koa-compress'
    import zlib from 'zlib'

    const app = new Koa()

    const flush = zlib.constants.Z_SYNC_FLUSH
    app.use(compress({
      filter (contentType) {
        return /(text|javascript)/i.test(contentType)
      },
      threshold: 2048, // unit:bytes,要压缩的最小大小；equal 2kb
      gzip: {
        flush: flush,
      },
      deflate: {
        flush: flush,
      },
      br: false // disable brotli
    }))
    ```

## Dependencies
可直接拷贝 `package.json` 文件中的依赖项。  
```javascript
// build
cnpm install -S cross-env shelljs ora rimraf chalk

// webpack
cnpm install -D webpack koa-webpack webpack-merge html-webpack-plugin html-webpack-plugin optimize-css-assets-webpack-plugin mini-css-extract-plugin

// vue
cnpm install -D vue vue-router vue-loader vue-template-compiler

// css
cnpm install -D css-loader style-loader url-loader file-loader sass sass-loader postcss-loader autoprefixer sass-resources-loader

// babel
cnpm install -D babel-loader @babel/core @babel/plugin-transform-runtime @babel/preset-env

// html history
cnpm install -D koa2-history-api-fallback

// analyzer
cnpm install -D webpack-bundle-analyzer

// compression support gzip
cnpm install -D compression-webpack-plugin
```