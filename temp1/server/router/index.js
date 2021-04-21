import Router from 'koa-router'

import dataRouter from './data.js'

const router = new Router()

// 本地的数据查询服务路由
router.use('/data', dataRouter)

export default router.routes()
