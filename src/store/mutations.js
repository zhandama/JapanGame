/*
* @Author: tangxm
* @Date:   2018-11-23 14:01:23
* @Last Modified by:   tangxm
* @Last Modified time: 2018-11-23 14:01:23
*/
export default {
  setUserInfo (state, info) {
    state.userInfo = info
  },
  updateUserInfoRead (state, info) {
    state.userInfo.unread = info
  },
  setLoginstatus (state, val) {
    state.isLogin = val
  },
  setPurchase (state, info) {
    state.purchase = info.data
  },
  setOrder (state, info) {
    state.order = info
  },
  updateOrderLike (state, info) {
    state.order.userGoodsCollectionVO = info
  },
  setBank (state, info) {
    state.bankInfo = info
  }
}
