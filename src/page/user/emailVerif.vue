<template>
<div class="regist mt-97">
  <div class="bg-fff regist-yet">
      <h1 class="f30">まだ本登録は完了しておりません</h1>
      <div class="regist-step">
          <span class="step01"></span>
      </div>
      <p class="mail-url color-333 f24">下記メールアドレスに本登録用のURLを記載したメールを送信しました。</p>
      <h2 class="noumenon f40" v-if="account">{{account}}</h2>
      <p class="end-buy color-333 f24">本登録を終えるとアカウントの出品・購入が可能になります。</p>
  </div>
  <div class="again-send bg-fff mt-20">
      <p class="f24 color-333">メールアドレスの変更は<em @click="logout()" >こちら</em></p>
      <p class="f24 color-333">メールが届かない方は<em :class="{'color9':time!=0}" @click="sengAgain()">再送信<span v-if="time<60 && time>0">({{time}})</span></em>をお試しください。</p>
      <p class="f24 color-333">メールアドレスが正しいのにメールが届かない場合は、</p>
      <p class="f24 color-333">迷惑メールフォルダーをご確認ください。</p>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      account:this.$route.query.account,
      sky:this.$route.query.sky,
      fromName: '',
      time: 60,
      countdown: ''
    }
  },
  created () {
    this.$bus.emit("title", 'メールの確認')
    if (this.sky) {
      this.bindMail()
    }
  },
  watch:{
    fromName (n) {
      if (n === 'Info' && this.account) {
        this.sendMail()
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.fromName = from.name
    })
  },
  methods: {
    sendMail () {
      let params = {
        userAccount:this.account
      }
      this.$api.user.sendMail(params).then(res=>{
        if (res&&res.code==='00') {
          this.$toast('メールボックス認証が正常に送信されたので、電子メール認証に行ってください。')
          this.countdownFun()
        }
      })
    },
    sengAgain () {
      if (time==0) {
        this.sendMail()
      }
    },
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
    bindMail(){
      this.$api.user.bindmail({sky:this.sky}).then(res=>{
        if (res&&res.code==='00') {
          this.$toast('メールアドレス認証成功しました') // 邮箱绑定成功
          setTimeout(()=>{
            this.$router.push({name:'PhoneCode'})
          },2000)
        } else {
          this.$toast('メールアドレス認証できません')  // 邮箱已绑定或者绑定失败
        }
      })
    },
    logout() {
      this.$api.user.logout().then(res=>{
        if (res) {
          this.$store.commit('setUserInfo', {})
          this.$store.commit('setLoginstatus', false)
          this.$router.push({name:'Register'})
        }
      })
    },
  }
}
</script>
<style>
@import '~css/common/login-all.css';
</style>
<style scoped>
.color9{color:#999 !important}
</style>
