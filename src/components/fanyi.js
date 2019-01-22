/*
 * @Author: tangxm
 * @Date: 2019-01-16 16:32:33
 * @LastEditors: tangxm
 * @LastEditTime: 2019-01-22 10:24:23
 */
import axios from 'axios'
import md5 from 'js-md5'

axios.jsonp = (url) => { // 封装一个axios_jsonp
	if(!url){
			console.error('Axios.JSONP 至少需要一个url参数!')
			return;
	}
	return new Promise((resolve,reject) => {
			window.jsonCallBack =(result) => {
					resolve(result)
			}
			var JSONP=document.createElement("script");
			JSONP.type="text/javascript";
			JSONP.src=`${url}&callback=jsonCallBack`;
			document.getElementsByTagName("head")[0].appendChild(JSONP);
			setTimeout(() => {
					document.getElementsByTagName("head")[0].removeChild(JSONP)
			},500)
	})
}
const fanyi = {
	salt:new Date()-1,
	Bdfanyi:function(text) {  // 百度翻译API
		// appid+q+salt+密钥的MD5值
		var sign = md5(`20190116000257273${text}${this.salt}dGslWZC7mnB8mF_MlHRC`)
		let params = `?q=${text}&from=zh&to=jp&appid=20190116000257273&salt=${this.salt}&sign=${sign}`
		return new Promise((resolve, reject) => {
			axios.jsonp('//fanyi-api.baidu.com/api/trans/vip/translate'+ params).then(res => {
				if (res && res.trans_result) {
					resolve(res.trans_result[0].dst)
				}
			})
		})
	},
	Youdao:function(text) {  // 有道翻译API
		var sign = md5(`0bcf6d4b5a2e25de${text}${this.salt}getp4O6nNBkyP9nGvLmTygeMyIySeLtY`)
		let params = `?q=${text}&from=zh-CHS&to=ja&appKey=0bcf6d4b5a2e25de&salt=${this.salt}&sign=${sign}`
		return new Promise((resolve, reject) => {
			axios.jsonp('//openapi.youdao.com/api'+ params).then(res => {
				if (res&&res.translation&&res.translation[0]) {
					resolve(res.translation[0])
				}
			})
		})
	}
}
export default fanyi