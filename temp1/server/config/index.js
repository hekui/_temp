// console.log('process.env:', JSON.stringify(process.env))

export const webUrl = process.env.webUrl || 'https://wechat-ddb-sa.test.chuangjialive.com' // 服务访问域名，末尾不含斜杠 https://wechat-ddb-sa.test.chuangjialive.com
export const runEnv = process.env.runEnv || 'dev' // 服务环境：本地,loc; 开发,dev; 测试,test; 生产,prod
export const accessTokenWebUrl = process.env.accessTokenWebUrl || 'https://accesstoken-ddb-sa.chuangjialive.com' // accessToken中控服务访问域名
export const timeout = process.env.timeout || 5000 // 与第三方请求的超时时间，单位：ms，默认：5000
export const enableDb = process.env.enableDb === 'true' || true // 启用数据库

// 数据库配置 mysql
export const dbConfig = {
  host: process.env.dbHost || 'localhost',
  user: process.env.dbUser || 'root',
  password: process.env.dbPassword || '123456',
  database: process.env.dbDatabase || 'wechat_service',
}

export const page = {
  curPage: 1,
  pageSize: 20,
}

// redis 集群
export const redis = {
  cluster: [],
}

switch (runEnv) {
  case 'prod': // 生产环境
    redis.cluster = [{
      host: '192.168.70.3',
      port: '7001'
    }, {
      host: '192.168.70.4',
      port: '7001'
    }, {
      host: '192.168.70.23',
      port: '7001'
    }]
    break
  case 'test': // 测试环境
    // 2019.8.5 更新为 192.168.10.245:7000,192.168.10.222:7000,192.168.10.247:7000
    // 192.168.10.232:7000,192.168.10.232:7003,192.168.10.232:7005
    redis.cluster = [{
      host: '192.168.10.245',
      port: '7000'
    }, {
      host: '192.168.10.222',
      port: '7000'
    }, {
      host: '192.168.10.247',
      port: '7000'
    }]
    break
  default: // dev
    redis.cluster = [{
      host: '192.168.10.243',
      port: '7000'
    }, {
      host: '192.168.10.243',
      port: '7001'
    }, {
      host: '192.168.10.243',
      port: '7002'
    }]
    break
}

export default {
  webUrl,
  runEnv,
  accessTokenWebUrl,
  timeout,
  page,
  redis,
}
