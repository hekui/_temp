import Redis from 'ioredis'
import { redis } from '../config/index.js'
import { promisify } from 'util'
import logger from './../log/index.js'
const log = logger('redis')

// redis集群
const cluster = new Redis.Cluster(redis.cluster, {
  lazyConnect: true,
})

cluster.connect().then(res => {
  log.info('redis.cluster connected success!')
  log.info('config.redis.cluster:', JSON.stringify(redis.cluster))
}).catch(e => {
  log.fatal('Process will exit. Because an error was caught when redis.cluster connected.')
  log.fatal(e)
  process.exit()
})

cluster.on('error', function (e) {
  log.fatal('Process will exit. Because an error was caught when redis.cluster connected.')
  log.fatal(e)
  process.exit()
})

// 扩展一个promise化的get方法
cluster.getAsync = promisify(cluster.get).bind(cluster)

// test
cluster.set('foo', 'bar')
cluster.get('foo', function (err, res) {
  // res === 'bar'
  if (err) console.error('redis error', err)
  log.info(`Test redis, expect got:'bar', actual got:'${res}'`)
})

export default cluster
