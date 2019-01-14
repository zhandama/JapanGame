/*
 * @Author: tangxm
 * @Date: 2018-12-04 15:47:15
 * @LastEditors: tangxm
 * @LastEditTime: 2018-12-29 15:09:24
 */
const fixedDou = function (num) {
  num = Math.floor(num*100)/100
  return num
}
//转化年月日
const formatTimeFilter = function formatTime(date) {
  date = new Date(date)
  function _turnNum(num) {
    if (num < 10) return '0' + num
    return num
  }
  return date.getFullYear() + '-' +
    _turnNum(date.getMonth() + 1) + '-' +
    _turnNum(date.getDate()) + ' ' +
    _turnNum(date.getHours()) + ':' +
    _turnNum(date.getMinutes()) + ':' +
    _turnNum(date.getSeconds())
}
const orderFilter = function (val) {
  var tip = ''
  if (val===1) {
    tip = '保留中の支払い'
  } else if (val===2) {
    tip = '取引中'
  } else if (val===3) {
    tip = '取引が成功する'
  } else if (val===4) {
    tip = '取引の取り消し'
  } else if (val===5) {
    tip = '払い戻しのキャンセル'
  }
  return tip
}

// 字符串转化逗号，三位一逗号
const toThousands = function(num) {
  var num = (num || 0).toString(), result = '';
  while (num.length > 3) {
      result = ',' + num.slice(-3) + result;
      num = num.slice(0, num.length - 3);
  }
  if (num) { result = num + result; }
  return result;
}


export {
  fixedDou,
  formatTimeFilter,
  orderFilter,
  toThousands
}