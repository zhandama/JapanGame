<template>
<div class="login mt-97">
  <div class="phone-code f24 color-333 bg-fff">本人確認のため、携帯電話のSMS（ショートメッセー ジサービス）を利用して認証を行います。</div>
  <div class="phone-input bg-fff">
      <div class="verfi-code">
          <i class="fl key"></i>
          <input type="text" placeholder="携帯電話の番号（11桁）を入力" class="fl f30" v-model="phoneNum" maxlength="11">
      </div>
  </div>
  <div class="attestation bg-fff">
      <a class="f30 color-fff" @click="sendSms">次へ</a>
  </div>
  <div class="shortmess bg-fff mt-20">
      <p class="f24 color-333 dataitem">※電話番号は本人確認や不正利用防止のために利用され ます。他のユーザーに公開されることはありません。</p>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      phoneNum:'',
    }
  },
  created () {
    this.$bus.emit("title", '電話番号認証')
  },
  methods: {
    sendSms() {
      var mobileReg1 = /(^0{0,1}1[3|4|5|7|8|9][0-9]{9}$)/;  // 中国手机号
      var mobileReg = /^(\+?81|0)\d{1,4}[ \-]?\d{1,4}[ \-]?\d{4}$/  // 日本手机号
      if (this.phoneNum.length==0) {
        this.$toast('電話番号を記入してください')
        return
      } else if (!mobileReg.test(this.phoneNum)&&!mobileReg1.test(this.phoneNum)) {
        this.$toast('電話番号の形式が正しくありません')
        return
      }
      this.$api.user.sendsms({phoneNum:this.phoneNum}).then(res=> {
        if (res.code==='00') {
          this.$toast('正常に送信されました')
          this.$router.push({name:'PhoneVerif',query:{phoneNum:this.phoneNum}})
        } else {
          this.$toast(res.message)
        }
      })
    }
  }
}
</script>
<style>
@import '~css/common/login-all.css';
</style>
