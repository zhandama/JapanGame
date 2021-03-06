/*
 * @Author: tangxm
 * @Date: 2018-11-23 15:07:06
 * @LastEditors: tangxm
 * @LastEditTime: 2018-12-03 13:08:07
 */
//获取cookie、
const cookie = {
  getCookie:function (name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
     return (arr[2]);
    else
     return null;
   },
   //设置cookie,增加到vue实例方便全局调用
   setCookie:function (c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
   },
   //删除cookie
   delCookie:function (name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
     document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
   }
} 
export default cookie