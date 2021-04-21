# Templates

## KOA静态服务
根目录的 `server.js` 可以启动一个静态服务（KOA）。  
可用于在本地校验打包后的代码，方法：将本文件复制到 `dist` 目录，然后 `node` 运行（确保全局安装了`KOA`）。

## Temp1
`node` + 前台打包服务。
#### Features
1. node v14.6.0 (ES6 import)
2. koa v2.0 + redis + mysql + log + xml
3. eslint
4. webpack 4
5. vue 2.6 + vue-router + sass + postcss-loader(autoprefixer) + 组件动态引入（代码分割，异步加载）
6. gzip：koa-compress

## Temp2
纯 `node` 服务。
### Features
1. node v14.6.0 (ES6 import)
2. koa v2.0 + redis + mysql + log + xml
3. eslint

## Temp3
`node` + 前台打包 + `SSR` 服务。  
TODO:待实现。