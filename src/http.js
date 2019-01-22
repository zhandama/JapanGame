/*
 * @Author: tangxm
 * @Date: 2018-12-03 14:27:23
 * @LastEditors: tangxm
 * @LastEditTime: 2019-01-22 14:02:50
 */
import axios from 'axios'
import Vue from 'vue'

const vm = new Vue()

// 请求前的拦截
axios.interceptors.request.use(config => {
  return config
}, error => {
  vm.$toast('this is error message')
  return Promise.reject(error)
})

// http响应拦截器
axios.interceptors.response.use(data => { // 响应成功关闭loading
  if (data.data) {
    if (data.data.code != '00') {
      vm.$toast(filterMsg(data.data.message))
    }
    return data.data
  } else {
    return Promise.reject(data)
  }
}, error => {
  if (error.response && error.response) {
    return Promise.reject(error.response.statusText)
  };
})

function filterMsg(msg) {
  let x
  switch (msg) {
    case '意见反馈主题不能为空':
      x = 'タイトルを入力してください'
      break
    case '用户邮箱地址不能为空':
      x = 'メールアドレスを入力してください'
      break
    case '意见反馈内容不能为空':
      x = 'コメント内容を入力してください'
      break
    case '用户手机号码未绑定':
      x = '携帯番号を認証してください'
      break
    case '用户邮箱未绑定':
      x = 'メールアドレスを認証してください'
      break
    case '用户被禁用':
      x = 'このアカウントはブロックされました'
      break
    case '商品已经没有库存':
      x = '商品が売り切れました'
      break
    case '帐号或密码错误':
      x = '正しいアカウントまたはパスワードを入力してください'
      break
    case '用户名已经被注册':
      x = 'アカウントが使用できません'
      break
    case '请输入6~18位字母或数字':
      x = 'パスワードを入力してください'
      break
    case '密码错误':
      x = '正しいパスワードを入力してください'
      break
    case '调用接口失败：此号码已绑定':
      x = 'すでに使用された携帯番号です'
      break
    case '调用接口失败：此账号已经绑定过手机号码':
      x = '携帯番号認証済み'
      break
    case '调用接口失败：请勿重复发送,稍后再试':
      x = '請求回数は上限になりました、しばらくお待ちください'
      break
    case '调用接口失败：该号码发送短信超上限':
      x = '本日の認証回数が上限になりました'
      break
    case '手机号码无效':
      x = '正しい携帯番号を入力してください'
      break
    case '用户邮箱未绑定':
      x = 'メールアドレスを認証してください'
      break
    case '图片大小无效':
      x = '画像のサイズがオーバーしました'
      break
    case '调用接口失败：用户可提现金额不足':
      x = '最低入金可能額未満'
      break
    default:
      x = 'エラーが発生しました'
  }
  console.log(msg)
  return x
}

export default axios
