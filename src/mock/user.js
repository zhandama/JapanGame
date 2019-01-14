/*
 * @Author: tangxm
 * @Date: 2018-11-23 13:46:22
 * @LastEditors: tangxm
 * @LastEditTime: 2018-11-29 17:22:08
 */
// 引入mockjs
const Mock = require('mockjs');
// 获取 mock.Random 对象
const Random = Mock.Random;
// mock一组数据
const userInfo = function() {
  let sList={
    isLogin:Random.boolean(),
  };
  return sList
}

export{
  userInfo,
}
