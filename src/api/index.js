/*
 * @Author: tangxm
 * @Date: 2018-11-23 15:07:06
 * @LastEditors: tangxm
 * @LastEditTime: 2018-12-26 16:04:55
 */
import user from './user.js'
import goods from './goods.js'
import order from './order.js'
import Vue from 'vue'

const vm = new Vue()

function bannerpage(params) {
  return vm.$http.post('/api/banner/page', params)
}

//gameProperty
const gameProperty = '/api/game/property/'

function property(params) {
  return vm.$http.get(gameProperty + 'get/list', {params:params})
}
function sectionList(params) {
  return vm.$http.get(gameProperty + 'section/list', {params:params})
}
/**
 * categoryGame
 * 类目接口
 */
const categoryGame = '/api/category/game/'

function pyList(params) {
  return vm.$http.get(categoryGame + 'first/py/list', {params:params})
}
function pySearch(params) {
  return vm.$http.post(categoryGame + 'first/py/search', params)
}
function hotList(params) {
  return vm.$http.post(categoryGame + 'hot/search', params)
}
function search(params) {
  return vm.$http.post(categoryGame + 'keyword/search', params)
}
function historySearch(params) {
  return vm.$http.get(categoryGame + 'history/search', {params:params})
}
export default {
  bannerpage,
  property,
  sectionList,
  pyList,
  pySearch,
  hotList,
  search,
  historySearch,
  user,
  goods,
  order
}
