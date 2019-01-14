/*
* @Author: tangxm
* @Date:   2018-11-23 14:01:23
* @Last Modified by:   tangxm
* @Last Modified time: 2018-11-23 14:01:23
*/
import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import state from './state'
import mutations from './mutations.js'

Vue.use(Vuex)
/* eslint-disable no-new */
export default new Vuex.Store({
  state,
  actions,
  mutations,
  strict: process.env.NODE_ENV !== 'production'
})
