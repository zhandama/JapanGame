/*
 * @Author: tangxm
 * @Date: 2018-11-23 15:07:06
 * @LastEditors: tangxm
 * @LastEditTime: 2019-01-16 12:37:28
 */
import Vue from 'vue'

const vm = new Vue()

const accountGoods = '/api/account/goods/'

function browseIndex(params) {
  return vm.$http.get(accountGoods + 'browse/index', {params:params})
}
function browseMore(params) {
  return vm.$http.get(accountGoods + 'browse/more', {params:params})
}
function collect(params) {
  return vm.$http.post(accountGoods + 'collect', params)
}
function release(params) {
  return vm.$http.post(accountGoods + 'release', params)
}
function list(params) {
  return vm.$http.post(accountGoods + 'select/list', params)
}
function info(params) {
  return vm.$http.get(accountGoods + 'info', {params:params})
}
function collections(params) {
  return vm.$http.get(accountGoods + 'collections', {params:params})
}
function selfReleases(params) {
  return vm.$http.get(accountGoods + 'self/releases', {params:params})
}
function update(params) {
  return vm.$http.post(accountGoods + 'seller/update', params)
}
function shelf(params) {
  return vm.$http.post(accountGoods + 'seller/shelf', params)
}
function upper(params) {
  return vm.$http.post(accountGoods + 'seller/upper', params)
}
function similarList(params) {
  return vm.$http.get(accountGoods + 'similar/list', {params:params})
}
function browseDelete(params) {
  return vm.$http.post(accountGoods + 'browse/delete', params)
}

export default {
  browseIndex,
  browseMore,
  collect,
  release,
  list,
  info,
  collections,
  selfReleases,
  update,
  shelf,
  upper,
  similarList,
  browseDelete
}
