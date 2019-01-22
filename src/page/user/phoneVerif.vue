<template>
<div class="login mt-97">
  <p class="phone pt-10 f40 bg-fff">{{phoneNum}}</p>
  <div class="phone-tips f24 color-333 bg-fff">上記の番号にSMSで認証コードを送りました。<br>届いた番号を下記のフォームにご入力ください。</div>
  <div class="phone-input bg-fff">
      <div class="verfi-code">
          <i class="fl code"></i>
          <input type="text" placeholder="認証コードを入力" class="fl f30" v-model="smsCode" maxlength="10">
      </div>
  </div>
  <div class="attestation bg-fff">
      <a @click="bindPhone" class="f30 color-fff">認証する</a>
  </div>
  <div class="shortmess bg-fff mt-20">
      <h2 class="f30">SMSが届かない場合</h2>
      <p class="f24 color-333 outside">SMSが2分以内に届かない場合は以下の方法をお試しください</p>
      <div class="situation">
          <a @click="sendMsg()" class="f28 mr-30" :class="{'color6':time!=0}">認証コードを再送 <em v-if="time!=0">({{time}})</em></a>
          <a @click="$router.go(-1)" class="f28 ml-30">電話番号を変更</a>
      </div>
  </div>
</div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  data () {
    return {
      phoneNum:this.$route.query.phoneNum,
      smsCode:'',
      time: 60,
      countdown: ''
    }
  },
  created () {
    this.$bus.emit("title", '認証コードを入力してください')
    this.countdownFun()
  },
  methods: {
    ...mapActions({
        getUserInfo: 'GET_USER'
    }),
    countdownFun() {
      this.time = 60
      this.countdown = setInterval(()=>{
        if (this.time>0) {
          this.time = this.time-1
        } else {
          clearInterval(this.countdown)
        }
      },1000)
    },
    bindPhone() {
      if (this.smsCode.length==0) {
        this.$toast('認証コードを入力してください')  // 请输入验证码
        return
      }
      let params = {
        phoneNum:this.phoneNum,
        smsCode:this.smsCode
      }
      this.$api.user.bindphone(params).then(res=> {
        if (res.code==='00') {
          this.$toast('認証成功') // 认证成功
          this.getUserInfo()
          setTimeout(()=>{
            this.$router.push({name:'User'})
          },2000)
        } else {
          this.$toast('正しい認証コードを入力してください') // 验证码错误
        }
      })
    },
    sendMsg () {
      if (this.time>0) {
        return
      }
      this.$api.user.sendsms({phoneNum:this.phoneNum}).then(res=> {
        if (res.code==='00') {
          this.$toast('正常に送信されました')
          this.countdownFun()
        }
      })
    }
  }
}
</script>

<style>
@import '~css/common/login-all.css';
</style>
<style scoped>
.color6 {color:#666 !important}
</style>
