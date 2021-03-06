import Koa from 'koa'
import serve from 'koa-static'
import session from 'koa-session'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import xmlParser from 'koa-xml-body'
import compress from 'koa-compress'
import zlib from 'zlib'
import serverRouter from './router/index.js'

import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import koaWebpack from 'koa-webpack'
import webpackConfig from './../build/webpack.dev.conf.cjs'
import buildConfig from './../build/config.cjs'

// const { createBundleRenderer } = require('vue-server-renderer')
import vsr from 'vue-server-renderer'

import logger from './log/index.js'
const log = logger('http')

const __dirname = path.resolve()
const resolve = file => path.resolve(__dirname, file)
const { createBundleRenderer } = vsr

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

app.keys = ['sskey']
const sessionOptions = {
  key: 'WECHATSSID',
  maxAge: maxAge,
  overwrite: true,
  rolling: false,
  renew: false,
}
app.use(session(sessionOptions, app))

app.use(serve('./public/', {
  maxAge: maxAge
}))

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

app.use(bodyParser())

// 服务端接口范文都记录日志
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

router.use('/api', serverRouter)

app.use(router.routes())

// ssr
function createRenderer(bundle, options) {
  // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
  return createBundleRenderer(bundle, Object.assign(options, {
    // for component caching
    // cache: LRU({
    //   max: 1000,
    //   maxAge: 1000 * 60 * 15
    // }),
    inject: false,
    // this is only needed when vue-server-renderer is npm-linked
    basedir: resolve('./../dist'),
    // recommended for performance
    runInNewContext: false
  }))
}

let renderer
let readyPromise
const templatePath = resolve('./../src/index.template.html')
if (isProd) {
  // In production: create server renderer using template and built server bundle.
  // The server bundle is generated by vue-ssr-webpack-plugin.
  const template = fs.readFileSync(templatePath, 'utf-8')
  const bundle = require('./../dist/vue-ssr-server-bundle.json')
  // The client manifests are optional, but it allows the renderer
  // to automatically infer preload/prefetch links and directly add <script>
  // tags for any async chunks used during render, avoiding waterfall requests.
  const clientManifest = require('./../dist/vue-ssr-client-manifest.json')
  renderer = createRenderer(bundle, {
    template,
    clientManifest
  })
} else {
  // In development: setup the dev server with watch and hot-reload,
  // and create a new renderer on bundle / index template update.
  readyPromise = require('./../build/setup-dev-server')(
    app,
    templatePath,
    (bundle, options) => {
      renderer = createRenderer(bundle, options)
    }
  )
}
const page404 = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"><title>你访问的页面不在啦！</title><link rel="stylesheet" href="/404/style.css"></head><body><div class="container"><div class="error-content view"><div class="text-wrapper"><p class="text">哎呀！<br>你访问的页面不在啦！</p><p><a href="/" class="router-link-active"><img src="/images/arrow-home.png">返回首页</a></p></div></div></div></body></html>'

async function render(ctx) {
  console.log('in render')
  const s = Date.now()

  const errorHandle = err => {
    log.error(`error during render : ${ctx.req.url}\n${err.message}\n${err.stack}`)
    // log.error(err)
    if (err.url) {
      ctx.status = err.code || 302
      ctx.redirect(err.url)
    } else {
      ctx.status = 404
      ctx.body = page404
    }
  }

  const context = {
    title: '域名', // default title
    keywords: '域名',
    description: '域名',
    url: ctx.req.url,
    // city: req.city,
    cookies: ctx.req.cookies,
    headers: ctx.req.headers,
    session: ctx.req.session,
    // cdnHost: config.cdnHost,
  }

  // console.log('context', context)
  await renderer.renderToString(context).then(html => {
    ctx.type = 'text/html'
    // ctx.res.setHeader('Server', serverInfo)
    console.log('request complete!')
    ctx.body = html
    if (!isProd) {
      console.log(`whole request: ${Date.now() - s}ms`)
    }
  }).catch(e => {
    errorHandle(e)
  })
}

app.use(isProd ? render : async ctx => {
  await readyPromise.then(() => render(ctx)).catch(e => {
    console.log('readyPromise e', e)
  })
})

app.on('error', err => {
  log.error('server error', err)
})

process.on('unhandledRejection', (message, stack) => {
  log.error('未捕捉的Promise错误：', stack)
})

app.listen(port, () => {
  if (!isProd) {
    // require('webpack-dev-middleware-hard-disk')(compiler, {
    //   publicPath: webpackConfig.output.publicPath,
    //   quiet: true
    // })
  }
  console.log(`server listening at http://localhost:${port}`)
})
