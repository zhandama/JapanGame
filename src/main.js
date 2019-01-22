// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from './http.js'
import VueBus from 'vue-bus'
import Vuex from 'vuex'
import VueClipboard from 'vue-clipboard2'
import store from './store'
// import Vant from 'vant'
// import 'vant/lib/index.css'
import {Toast, List, PullRefresh, Loading, Dialog} from 'vant';
import api from './api'
import fanyi from './components/fanyi'

// 引入mockjs
// require('./mock/index.js')

// Vue.use(Vant)
Vue.use(Toast).use(List).use(PullRefresh).use(Loading).use(Dialog)
Vue.config.productionTip = false
Vue.prototype.$fanyi = fanyi
Vue.prototype.$http = Axios
Vue.prototype.$api = api
Vue.use(VueClipboard)
Vue.use(VueBus)
Vue.use(Vuex)

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) {
    let query = to.query
    query.returnName = to.name
    if (router.app.$store&&router.app.$store.state.isLogin) {
      next()
    } else {
      api.user.current().then(res=>{
        if (res&&res.code==='00') {
          router.app.$store.commit('setUserInfo', res.data)
          router.app.$store.commit('setLoginstatus', true)
          next()
        } else {
          router.push({name:'Login',query})
        }
      },err=>{
        router.push({name:'Login'})
        return Promise.reject(err)
      })
    }
  } else {
    next()
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
