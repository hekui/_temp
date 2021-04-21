import Koa from 'koa'
import serve from 'koa-static'
import session from 'koa-session'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import xmlParser from 'koa-xml-body'
import serverRouter from './router/index.js'

import logger from './log/index.js'
const log = logger('http')

const port = process.env.runEnv ? 3000 : 4002
const maxAge = 1000 * 60 * 60 * 24 * 30 // ms,30天

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

app.on('error', err => {
  log.error('server error', err)
})

process.on('unhandledRejection', (message, stack) => {
  log.error('未捕捉的Promise错误：', stack)
})

app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`)
})
