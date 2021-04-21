import mysql from 'mysql'
import { dbConfig, enableDb } from './../config/index.js'

import logger from './../log/index.js'
const log = logger('conn')

const dbObject = Object.assign({
  multipleStatements: true,
}, dbConfig)

class Conn {
  constructor() {
    // const conn = mysql.createConnection(dbObject)
    // this.conn = conn

    // test
    // conn.connect()
    // conn.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    //   if (error) throw error
    //   console.log('mysql connection success! ')
    // })
    // conn.end()

    // pool
    if (enableDb) {
      const pool = mysql.createPool(dbObject)
      pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
        if (error) {
          log.error(`数据库连接失败：${error.message}`)
          return
          // throw error
        }
        log.info('mysql connection success! ')
      })
      this.pool = pool
    }
  }

  // q(sql, values) {
  //   return new Promise((resolve, reject) => {
  //     const conn = mysql.createConnection(dbObject)
  //     conn.connect()
  //     conn.query(sql, values, (err, rows) => {
  //       if (err) {
  //         log.error(`操作数据库发生错误，数据：${sql} - ${JSON.stringify(values)}`)
  //         log.error(err)
  //         reject(err)
  //       } else {
  //         resolve(rows)
  //       }
  //     })
  //     conn.end()
  //   })
  // }

  // pool
  /**
   * 封装的 Promise 化的方法，参数同query
   * @param {*} sql
   * @param {*} values
   */
  q(sql, values) {
    return new Promise((resolve, reject) => {
      if (enableDb) {
        this.pool.getConnection(function(err, conn) {
          if (err) {
            // conn.release()
            reject(err)
          } else {
            conn.query(sql, values, (err, rows) => {
              conn.release()
              if (err) {
                log.error(`操作数据库发生错误，数据：${sql} - ${JSON.stringify(values)}`)
                log.error(err)
                reject(err)
              } else {
                resolve(rows)
              }
            })
          }
        })
      } else {
        log.info('未启用数据库')
        reject()
      }
    })
  }
}

export default new Conn()
