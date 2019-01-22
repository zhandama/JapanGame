<template>
  <div>
       <!--商品展示区-->
        <div class="messages-chatting mt-97 ">
        	<div class="product-boxs fixed-top mt-97" style=" z-index:1" v-if="goodsId&&goodsInfo">
            	<div class="pdct-info bg-fff p-25" v-show="goodShow">
                <router-link :to="{name:'Detail',query:{goodsId:goodsInfo.goodsId,gameName:goodsInfo.gameName}}">
                  <div class="mbgmes-img fl">
                    <img :src="goodsInfo.goodsImageUrl">
                  </div>
                  <div class="mbgmes-con pl-25">
                      <div class="mbl-title f28 color-000">
                          {{goodsInfo.title}}{{goodsId&&goodsInfo&&goodShow}}
                      </div>
                      <div class="mbl-cper f28 color-m1 fontbold">￥{{goodsInfo.price}}</div>
                  </div>
                   </router-link>
              </div>
        		<div class="pdct-reveal"><a class="reveal-icon" @click="goodShow=!goodShow"></a></div>
        	</div>
            <!--聊天区-->
            <div class="chatting-hwrap pt-30 pb-150" :class="{'hwrp-hg':goodsId&&goodsInfo&&goodShow}" ref='chattingCont' v-if="msgList.length > 0">
              <van-pull-refresh v-model="refreshing" @refresh="onRefresh" :disabled="disabled" pullingText="プルダウンで更新…"  loosingText="リフレッシュできます..." loadingText="リロード中...">
                <div  v-for="(item, index) in msgList" :key="index" >
            	    <div class="font_span f22 color-888 clear" v-if="index>0&&(item.time-msgList[index-1].time>300000) || index==0">{{item.time|formatTimeFilter}}</div>
                  <div class="wrap-ip px-25 py-20" :class="{'wrap_l':item.to.toLowerCase()!=selfChat.toAccid.toLowerCase(),'wrap_r':item.to.toLowerCase()==selfChat.toAccid.toLowerCase()}" :ref="'wrap'+index">
                      <div class="wrap_img fl" v-if="item.to.toLowerCase()!=selfChat.toAccid.toLowerCase()"><img src="~img/product-pic.png"></div>
                      <div class="wrap_fid fl">
                        <div class="wmessage fl f30 color-000 px-10 py-10">
                          <i class="arrow"></i>
                          <div class="hximg-tip">
                            <p class="py-10 px-15" v-if="item.type=='text'">{{item.text}}</p>
                            <p class="py-10 px-15" v-if="item.type=='file'"><img :src="item.file.url|urlFilter" @click="openImg(item.file.url)" @load="loadImg(item.onload)"></p>
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
                </van-pull-refresh>
            </div>
        </div>
        
        <div class="mess_footer ">
            <div class="ftmore-info">
              <div class="fot_left" @click="openUpload()"> 
                    <div class="wkit-igh"></div>
                    <input type="file" id="uploadShim" class="hide" @change="uploadImg()" accept="image/*" >
             </div>
    
            <div class="fot_right">
                <div class="wkit-le">
                  <input class="inty" id="msg_text" type="text" placeholder="" v-model.trim="inputText" @keyup.enter="send()">
                </div>
                <div class="wkit-ri">
                  <input class="btn_ot" :class="{'btn_dis':inputText.length <= 0}" type="button" value="送信" @click="send()" >
                </div>
            </div>
            </div>
        </div>
        <remote-js :src="this.jsUrl" @load-js-finish="this.jsLoadCallBack"></remote-js>
        <remote-js :src="this.Fingerprintjs" @load-js-finish="this.FingerprintjsBack"></remote-js>
  </div>
</template>

<script>
import { formatTimeFilter } from '@/components/filter'
import { ImagePreview } from 'vant'
import {mapActions,mapState} from 'vuex'
export default {
  data () {
    return {
      goodShow: true,
      goodsId: this.$route.query.goodsId||'',
      otherId:this.$route.query.otherId||'',
      visitorIDCode: '',
      goodsInfo: '',
      selfChat: '',
      inputText: '',
      nim: '', // 聊天初始化对象
      firstMsg: true, // 第一条消息判断
      msgList: [], // 消息列表
      refreshing: false,
      disabled:false,
      jsUrl: '//m.5173.com/js/NIM_Web_SDK_v4.0.0.js',
      Fingerprintjs: '//cdnjs.cloudflare.com/ajax/libs/fingerprintjs2/2.0.6/fingerprint2.min.js',
    }
  },
  async created () {
    this.$bus.emit("showTopRight", true)
    this.$bus.emit("topRightText", '')
    // this.init()
    // document.querySelector('body').setAttribute('style', 'height:100%;overflow:hidden')
    if (!this.isLogin) {
      await this.getUserInfo()
    }
  },
  computed: {
    ...mapState({
      isLogin:state => {
        return state.isLogin
      }
    })
  },
  beforeRouteLeave(to, from, next) {
    if (this.nim) {
      this.nim.disconnect()
    }
    next()
  },
  methods: {
    init (){
      this.visitorIDCode = ''
      if (this.goodsId) {
        this.getGoodsInfo()
      } else {
        this.getServiceChat()
      }
    },
    onRefresh () {
      this.getHistoryMsgs(this.msgList[0].time)
    },
    jsLoadCallBack () {
      if (!this.isLogin) {
        if (this.visitorIDCode) {
          this.getAnonymousChat()
        }
        return
      }
      this.init()
    },
    async FingerprintjsBack () {
      var that = this
      // if (!this.isLogin) {
      //   await this.getUserInfo()
      // }
      if (!that.isLogin) {
        Fingerprint2.get(function(components) {
          that.visitorIDCode = Fingerprint2.x64hash128(components.map(function (pair) { return pair.value }).join(), 31)
          if (!that.selfChat) {
            that.getAnonymousChat()
          }
        })
      }
    },
    imInit () {  // 初始化聊天this.getHistoryMsgs()
      var that = this
      that.nim = SDK.NIM.getInstance({
        appKey: 'f83a4d869a4638548b7c15a174cbc38e ',
        account: this.selfChat.fromAccid||this.selfChat.imAccount||this.selfChat.visitorAccId,
        token: this.selfChat.fromToken||this.selfChat.imPassword||this.selfChat.visitorToken,
        autoMarkRead: false,
        onconnect: function(opt){
          console.log('连接成功',opt)
          that.onconnect(opt)
        },
        onerror: function(){
          console.log('onerror')
        },
        onwillreconnect: function() {
          that.imInit()
        },
        onmsg: function(opt){
          that.onmsg(opt)
        },
        onsessions: function(opt){
          console.log('onsessions', opt);
          // that.nim.resetSessionUnread(opt[0].id); // 调用已读方法
          // that.nim.resetCurrSession() // 重置用户列表Session
        },
        onupdatesession: function(opt){
          console.log('onupdatesession', opt);
        },
        onupdatesysmsgunread: function(opt){
          console.log('系统通知未读数更新了', opt);
        },
        onpushevents: function(param){ // 订阅事件，用户在线离线
          console.log('订阅事件', param);
        },
        ondisconnect: function(e){
          console.log('退出登录',e)
        }
      })
    },
    getServiceChat () {
      this.$api.user.serviceChat().then(res => {
        if (res && res.data) {
          this.$bus.emit("title", 'オンラインサービス')
          this.selfChat = res.data
          this.imInit()
        } 
      })
    },
    getOtherChat () { // 获取用户帐号
      this.$api.user.chattersInfo({toId:this.otherId||this.goodsInfo.sellerId}).then(res => {
        if (res && res.data && res.data.chatStatus==0) {
          this.selfChat = res.data
          this.$bus.emit("title", res.data.toNickName)
          this.imInit()
        } else {
          this.getServiceChat()
        }
      })
    },
    getAnonymousChat () {
      this.$api.user.chatAnonymousInfo({visitorIDCode:this.visitorIDCode}).then(res => {
        if (res && res.data) {
          this.selfChat = res.data
          this.selfChat.toAccid = res.data.serviceImAccount
          this.$bus.emit("title", 'オンラインサービス')
          this.imInit()
        }
      })
    },
    getGoodsInfo () {
      let params = {
        goodsId: this.goodsId
      }
      this.$api.goods.info(params).then((res) => {
        if (res&&res.data) {
          this.goodsInfo = res.data
          this.getOtherChat()
        }
      })
    },
    send () {
      var that = this
      if (this.inputText.length <=0) {
        return
      }
      if (this.firstMsg) {
        if (this.goodsId) {
          this.saveFirstMsg({
            goodsId: this.goodsId,
            onLineStatus: 0,
            toId: this.otherId||this.goodsInfo.sellerId
          })
        } else if (this.visitorIDCode) {
          this.saveFirstMsg({
            visitorIDCode: this.visitorIDCode
          })
        } else {
          this.saveFirstMsg()
        }
      }
      let params = {
        text: this.inputText,
        from: (this.selfChat.fromAccid||this.selfChat.imAccount||this.selfChat.visitorAccId).toLowerCase(),
        to: this.selfChat.toAccid,
        type: 'text',
        time:new Date()-1
      }
      this.msgList.push(params) 
      this.nim.sendText({
        scene: 'p2p',
        to: this.selfChat.toAccid,
        text: this.inputText,
        done: function() {
          that.sendMsgDone()
        }
      })
      this.scrollBottom()
    },
    openUpload () {
      document.getElementById('uploadShim').click()
    },
    openImg(url) {
      const instance = ImagePreview({
        images: [url],
        startPosition: 0,
        onClose() {
          // do something
        }
      })
    },
    uploadImg (a) {
      var fileInput = document.getElementById('uploadShim')
      var that = this
      that.nim.previewFile({
          type: 'image',
          fileInput: fileInput,
          uploadprogress: function(obj) {
              console.log('文件总大小: ' + obj.total + 'bytes');
              console.log('已经上传的大小: ' + obj.loaded + 'bytes');
              console.log('上传进度: ' + obj.percentage);
              console.log('上传进度文本: ' + obj.percentageText);
          },
          done: function(error, file) {
              console.log('上传image' + (!error?'成功':'失败'));
              if (!error) {
                  var msg = that.nim.sendFile({
                      scene: 'p2p',
                      to: that.selfChat.toAccid,
                      file: file,
                      done: function(res) {
                        msg.onload = true
                        that.msgList.push(msg)
                      }
                  });
              }
          }
      })
    },
    saveFirstMsg (params) {
      if (params && params.goodsId) {
        this.$api.user.chatFirst(params).then(res => {
          if (res && res.data) {
            this.firstMsg = false
          }
        })
      } else if (params && params.visitorIDCode) {
        this.$api.user.chatAnonymousFirst(params).then(res => {
          if (res && res.data) {
            this.firstMsg = false
          }
        })
      } else {
        this.$api.user.chatServiceFirst(params).then(res => {
          if (res && res.data) {
            this.firstMsg = false
          }
        })
      }
    },
    onconnect (opt) {
      this.getHistoryMsgs()
    },
    onmsg (opt) {
      if (opt.from === this.selfChat.toAccid.toLowerCase()) {
        opt.onload = true
        this.msgList.push(opt)
        this.scrollBottom()
      }
    },
    loadImg (onload) {
      if (onload) {
        this.scrollBottom()
      } else if (this.msgList.length<=20) {
        this.scrollBottom()
      }
    },
    sendMsgDone () {
      this.inputText = ''
    },
    getHistoryMsgs (endTime) {
      var that = this
      that.nim.getHistoryMsgs({
        scene: 'p2p',
        to: this.selfChat.toAccid,
        limit: 20,
        endTime: endTime,
        done: function(error,obj) {
          that.refreshing = false
          if (!error) {
            if (obj.msgs.length<=0) {
              that.disabled = true
            }
            obj.msgs.map(x => {
              that.msgList.unshift(x)
            })
            that.scrollBottom(endTime,obj.msgs.length)
          }
        }
      });
    },
    scrollBottom (endTime,index) {
      this.$nextTick(()=>{
        if (endTime) {
          if (this.$refs['wrap'+index]) {
            document.documentElement.scrollTop = this.$refs['wrap'+index][0].offsetTop
            document.body.scrollTop = this.$refs['wrap'+index][0].offsetTop
          }
        } else {
          if (this.$refs.chattingCont) {
            document.documentElement.scrollTop = this.$refs.chattingCont.scrollHeight
            document.body.scrollTop = this.$refs.chattingCont.scrollHeight
          }
        }
      })
    },
    ...mapActions({
        getUserInfo: 'GET_USER'
    }),
  },
  filters: {
    formatTimeFilter,
    urlFilter (url) {
      var fix = 'imageView&thumbnail=200x0&quality=85'
      if (url.indexOf('?')==-1) {
        return url + '?' + fix
      } else {
        return url + '&' + fix
      }
    }
  },
  components: {
    'remote-js': {
      render (createElement) {
        var self = this
        return createElement('script', {
          attrs: { type: 'text/javascript', src: this.src },
          on: {
            load: function () {
              self.$emit('load-js-finish')
            }
          }
        })
      },
      props: {
        src: { type: String, required: true }
      }
    }
  }
}
</script>
<style>
@import '~css/common/chatting.css';
.hximg-tip img {max-width: 100%}
</style>