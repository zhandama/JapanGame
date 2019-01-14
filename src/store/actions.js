/*
* @Author: tangxm
* @Date:   2018-11-23 14:01:23
* @Last Modified by:   tangxm
* @Last Modified time: 2018-11-23 14:01:23
*/
import api from 'api'
import * as type from './type.js'

export default {
  [type.GET_USER] ({commit}) {
    return new Promise((resolve, reject) => {
      api.user.current(new Date().getTime()).then((res) => {
        if (res && res.code === '00') {
          commit('setUserInfo', res.data)
          commit('setLoginstatus', true)
        }
        resolve(res.data)
      }, (error) => {
        commit('setUserInfo', {})
        commit('setLoginstatus', false)
        reject(error)
      })
    })
  },
  [type.GET_PURCHASE] ({commit}, params) {
    return new Promise((resolve, reject) => {
      api.order.purchase(params).then((res) => {
        if (res && res.code === '00') {
          commit('setPurchase', res)
        }
        resolve(res)
      }, (error) => {
        reject(error)
      })
    })
  },
  [type.GET_ORDER] ({commit}, params) {
    return new Promise((resolve, reject) => {
      if (params.goodsId) {
        api.order.create(params).then((res) => {
          if (res && res.code === '00') {
            commit('setOrder', res.data)
          }
          resolve(res)
        }, (error) => {
          reject(error)
        })
      } else {
        api.order.changePay(params).then((res) => {
          if (res && res.code === '00') {
            commit('setOrder', res.data)
          }
          resolve(res)
        }, (error) => {
          reject(error)
        })
      }
    })
  }
}
