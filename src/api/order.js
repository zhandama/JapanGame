/*
 * @Author: tangxm
 * @Date: 2018-11-23 15:07:06
 * @LastEditors: tangxm
 * @LastEditTime: 2018-12-28 13:26:32
 */
import Vue from 'vue'

const vm = new Vue()

const accountGoods = '/api/account/order/'

function purchase(params) {
  return vm.$http.post(accountGoods + 'purchase', params)
}
function create(params) {
  return vm.$http.post(accountGoods + 'create', params)
}
function buyerList(params) {
  return vm.$http.get(accountGoods + 'buyer/query/list', {params:params})
}
function cancel(params) {
  return vm.$http.post(accountGoods + 'cancel', params)
}
function orderInfo(params) {
  return vm.$http.get(accountGoods + 'buyer/query/info', {params:params})
}
function changePay(params) {
  return vm.$http.post(accountGoods + 'change/pay', params)
}
function pay(params) {
  return vm.$http.post(accountGoods + 'pay', params)
}
function confirm(params) {
  return vm.$http.post(accountGoods + 'confirm', params)
}
function refund(params) {
  return vm.$http.post(accountGoods + 'refund', params)
}

export default {
  purchase,
  create,
  buyerList,
  cancel,
  orderInfo,
  changePay,
  pay,
  confirm,
  refund
}
