// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // components: { App },
  // template: '<App/>', 这种方式也可以，但是需要在webpack.config.js中配置 alias vue: 'vue/dist/vue.js',
  // vue有两种形式的代码：一种是compiler（模版），另一种是runtime（运行时）模式。
  // 以下是 compiler 模式。
  render: h => h(App)
})
