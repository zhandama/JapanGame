/*
 * @Author: tangxm
 * @Date: 2018-11-23 15:07:06
 * @LastEditors: tangxm
 * @LastEditTime: 2019-01-14 15:37:58
 */
import Vue from 'vue'

const vm = new Vue()

const frontUser = '/api/front/user/'
const withdraw = '/api/withdraw/'
const message = '/api/message/'

/**
 * frontUser
 * 用户中心接口
 */
function current(params) {
  return vm.$http.post(frontUser + 'current', params)
}
function login (params) {
  return vm.$http.post(frontUser + 'login', params)
}
function logout (params) {
  return vm.$http.post(frontUser + 'logout', params)
}
function register (params) {
  return vm.$http.post(frontUser + 'register', params)
}
function sendsms (params) {
  return vm.$http.get(frontUser + 'send/sms', {params:params})
}
function bindphone (params) {
  return vm.$http.get(frontUser + 'bind/phone', {params:params})
}
function bindmail (params) {
  return vm.$http.get(frontUser + 'bind/mail', {params:params})
}
function sellAmount (params) {
  return vm.$http.get(frontUser + 'sell/amount', {params:params})
}
function sendMail (params) {
  return vm.$http.get(frontUser + 'send/mail', {params:params})
}
function selfChat (params) {
  return vm.$http.get(frontUser + 'self/chat', {params:params})
}
function chattersInfo (params) {
  return vm.$http.get(frontUser + 'chatters/info', {params:params})
}
function chatFirst (params) {
  return vm.$http.post(frontUser + 'chat/first', params)
}
function chatList (params) {
  return vm.$http.get(frontUser + 'chat/list', {params:params})
}
function serviceChat (params) {
  return vm.$http.get(frontUser + 'service/info', {params:params})
}
function chatServiceFirst (params) {
  return vm.$http.post(frontUser + 'service/first', params)
}

/**
 * withdraw
 * 资金、提现接口 
*/

function bankList (params) {
  return vm.$http.get(withdraw + 'bank/list', {params:params})
}
function create (params) {
  return vm.$http.post(withdraw + 'create', params)
}
function fee (params) {
  return vm.$http.get(withdraw + 'service/fee', {params:params})
}
function record (params) {
  return vm.$http.post(withdraw + 'user/record', params)
}
function refund (params) {
  return vm.$http.post(withdraw + 'refund', params)
}
function update (params) {
  return vm.$http.post(withdraw + 'update', params)
}
function branchList (params) {
  return vm.$http.get(withdraw + 'branch/list', {params:params})
}

/**
 * message
 * 意见反馈与问题帮助
 */
function questionList (params) {
  return vm.$http.get(message + 'question/consult/list', {params:params})
}
function answerList (params) {
  return vm.$http.get(message + 'question/answer/list', {params:params})
}
function feedback (params) {
  return vm.$http.post(message + 'view/record/submit', params)
}
function info (params) {
  return vm.$http.get(message + 'web/information/list', {params:params})
}
function infoDetail (params) {
  return vm.$http.get(message + 'web/information/info', {params:params})
}
function chatAnonymousFirst (params) {
  return vm.$http.get(message + 'visitor/service/first', {params:params})
}
function chatAnonymousInfo (params) {
  return vm.$http.get(message + 'visitor/service/info', {params:params})
}

export default {
  current,
  login,
  logout,
  register,
  sendsms,
  bindphone,
  bindmail,
  sellAmount,
  sendMail,
  bankList,
  create,
  fee,
  record,
  refund,
  update,
  branchList,
  selfChat,
  chattersInfo,
  chatFirst,
  chatServiceFirst,
  chatAnonymousFirst,
  chatAnonymousInfo,
  chatList,
  serviceChat,
  questionList,
  answerList,
  feedback,
  info,
  infoDetail
}
