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
          <a href="#" class="f28 mr-30">認証コードを再送</a>
          <a href="#" class="f28 ml-30">電話番号を変更</a>
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
      smsCode:''
    }
  },
  created () {
    this.$bus.emit("title", '認証コードを入力する')
  },
  methods: {
    ...mapActions({
        getUserInfo: 'GET_USER'
    }),
    bindPhone() {
      if (this.smsCode.length==0) {
        this.$toast('認証コードを入力する')
        return
      }
      let params = {
        phoneNum:this.phoneNum,
        smsCode:this.smsCode
      }
      this.$api.user.bindphone(params).then(res=> {
        if (res.code==='00') {
          this.$toast('バインディングの成功')
          this.getUserInfo()
          setTimeout(()=>{
            this.$router.push({name:'Info'})
          },2000)
        } else {
          this.$toast('確認コードエラー')
        }
      })
    }
  }
}
</script>
<style>
@import '~css/common/login-all.css';
</style>
