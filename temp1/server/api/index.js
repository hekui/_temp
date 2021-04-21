import axios from 'axios'
import logger from './../log/index.js'
const log = logger('api')

axios.defaults.timeout = 1000 * 3 // 3s

axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, function (error = {}) {
  const config = error.config || {}
  log.fatal(`[${config.method}]${config.url} - code: - ${error.code}`)
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  error.message = `${error.message} - [${config.method}]${config.url}`
  return Promise.reject(error)
})

export default axios
