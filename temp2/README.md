# Temp2
纯 `node` 服务。

## Features
1. node v14.6.0 (ES6 import)
2. koa v2.0 + redis + mysql + log + xml
3. eslint

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
      threshold: 2048,
      gzip: {
        flush: flush,
      },
      deflate: {
        flush: flush,
      },
      br: false // disable brotli
    }))
    ```
