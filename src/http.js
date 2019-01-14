/*
 * @Author: tangxm
 * @Date: 2018-12-03 14:27:23
 * @LastEditors: tangxm
 * @LastEditTime: 2018-12-07 17:38:09
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
    return data.data
  } else {
    return Promise.reject(data)
  }
}, error => {
  if (error.response && error.response) {
    // vm.$toast('リクエストが失敗しました')
    return Promise.reject(error.response.statusText)
  };
})

export default axios