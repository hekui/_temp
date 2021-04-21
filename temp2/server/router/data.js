import Router from 'koa-router'
import db from './../db/index.js'
import config from './../config/index.js'
// import logger from './../../log/index.js'
// const log = logger('dataRouter')

const router = new Router()

// 查询消息列表
router.post('/messageList', async ctx => {
  try {
    const query = ctx.request.query
    const curPage = query.curPage || config.page.curPage
    const pageSize = query.pageSize || config.page.pageSize

    // let whereStr = ' where status = 0 and canReg != 2'
    let sql = `select * from message order by id desc limit ${(curPage - 1) * pageSize}, ${pageSize};`
    sql += 'select count(id) as count from message'
    const results = await db.q(sql, [])

    const total = results[1][0].count
    ctx.body = {
      code: 0,
      data: {
        total: total,
        curPage: curPage,
        pageSize: pageSize,
        list: results[0]
      },
    }
  } catch (e) {
    ctx.body = {
      code: 1,
      msg: e.message,
      data: e.data,
    }
  }
})

// 查询用户列表
router.post('/userList', async ctx => {
  try {
    const query = ctx.request.query
    const curPage = query.curPage || config.page.curPage
    const pageSize = query.pageSize || config.page.pageSize

    // let whereStr = ' where status = 0 and canReg != 2'
    let sql = `select * from user order by id desc limit ${(curPage - 1) * pageSize}, ${pageSize};`
    sql += 'select count(id) as count from user'
    const results = await db.q(sql, [])

    const total = results[1][0].count
    ctx.body = {
      code: 0,
      data: {
        total: total,
        curPage: curPage,
        pageSize: pageSize,
        list: results[0]
      },
    }
  } catch (e) {
    ctx.body = {
      code: 1,
      msg: e.message,
      data: e.data,
    }
  }
})

// 查询菜单事件列表
router.post('/menuEventList', async ctx => {
  try {
    const query = ctx.request.query
    const curPage = query.curPage || config.page.curPage
    const pageSize = query.pageSize || config.page.pageSize

    // let whereStr = ' where status = 0 and canReg != 2'
    let sql = `select * from menuEvent order by id desc limit ${(curPage - 1) * pageSize}, ${pageSize};`
    sql += 'select count(id) as count from menuEvent'
    const results = await db.q(sql, [])

    const total = results[1][0].count
    ctx.body = {
      code: 0,
      data: {
        total: total,
        curPage: curPage,
        pageSize: pageSize,
        list: results[0]
      },
    }
  } catch (e) {
    ctx.body = {
      code: 1,
      msg: e.message,
      data: e.data,
    }
  }
})

export default router.routes()
