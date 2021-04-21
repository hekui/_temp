import Vue from 'vue'
import Router from 'vue-router'

import HelloWorld from '@/components/HelloWorld'
// import async from '@/components/async'
const async = () => import(/* webpackChunkName: "async" */ '@/components/async')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
    },
    {
      path: '/async',
      name: 'async',
      component: async,
      // component: () => import(/* webpackChunkName: "async" */ '@/components/async')
    }
  ]
})
