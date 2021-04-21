import Koa from 'koa'
import serve from 'koa-static'
import session from 'koa-session'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import xmlParser from 'koa-xml-body'
import compress from 'koa-compress'
import zlib from 'zlib'
import serverRouter from './router/index.js'

// const webpack = require('webpack')
// const koaWebpack = require('koa-webpack-middleware')
import path from 'path'
import webpack from 'webpack'
import koaWebpack from 'koa-webpack'
import webpackConfig from './../build/webpack.dev.conf.cjs'
import buildConfig from './../build/config.cjs'
import history from 'koa2-history-api-fallback'

import logger from './log/index.js'
const log = logger('http')

const port = process.env.runEnv ? 3000 : 4002
const maxAge = 1000 * 60 * 60 * 24 * 30 // ms,30天
const isProd = process.env.NODE_ENV === 'production'

const app = new Koa()
const router = new Router()

// 异常捕捉中间件
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    ctx.app.emit('error', e)
    ctx.status = e.status || 500
    ctx.body = {
      code: -1,
      msg: 'server error'
    }
  }
})

// 记录请求日志
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  if (ctx.status === 200) {
    log.trace(`"${ctx.request.method} ${ctx.request.url}" ${ctx.status} ${ms}ms "${ctx.request.header['user-agent']}"`)
  } else {
    log.error(`"${ctx.request.method} ${ctx.request.url}" ${ctx.status} ${ms}ms "${ctx.request.header['user-agent']}"`)
  }
})

// compress
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

// session
app.keys = ['sskey']
const sessionOptions = {
  key: 'WECHATSSID',
  maxAge: maxAge,
  overwrite: true,
  rolling: false,
  renew: false,
}
app.use(session(sessionOptions, app))

// 支持xml
app.use(xmlParser({
  key: 'xmlBody', // ctx.request.xmlBody
  xmlOptions: {
    explicitArray: false, // Always put child nodes in an array if true; otherwise an array is created only if there is more than one. (default: true)
  },
  onerror: (err, ctx) => {
    log.error('xmlParser error', err.status, err.message)
    ctx.throw(err.status, err.message)
  }
}))
// body parser
app.use(bodyParser())

// 后台接口
router.use('/api', serverRouter)
app.use(router.routes())
app.use(router.allowedMethods())

// 公共资源
app.use(serve('./public/', {
  maxAge: maxAge
}))

// 兜底，将其他所有请求指向 index.html
app.use(history())

async function devMiddleware() {
  const compiler = webpack(webpackConfig)
  const middleware = await koaWebpack({
    compiler,
    devMiddleware: {
      publicPath: buildConfig.dev.assetsPublicPath,
      quiet: true,
      noInfo: true,
      stats: 'errors-only',
      // stats: {
      //   colors: true,
      //   entrypoints: false,
      //   chunks: false
      // }
    }
  })
  app.use(middleware)
}

if (isProd) {
  app.use(serve(path.join('./dist'), {
    maxage: maxAge
  }))
} else {
  devMiddleware()
}

app.on('error', err => {
  log.error('server error', err)
})

process.on('unhandledRejection', (message, stack) => {
  log.error('未捕捉的Promise错误：', stack)
})

app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`)
})
