import Koa from 'koa'
import serve from 'koa-static'

const app = new Koa()
const port = 3001
app.use(serve('./'))

app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})