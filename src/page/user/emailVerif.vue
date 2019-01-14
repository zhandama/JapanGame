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
      <p class="f24 color-333">メールアドレスの変更は<em>こちら</em></p>
      <p class="f24 color-333">メールが届かない方は<em>再送信</em>をお試しください。</p>
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
      fromName: ''
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
        }
      })
    },
    bindMail(){
      this.$api.user.bindmail({sky:this.sky}).then(res=>{
        if (res&&res.code==='00') {
          this.$toast('メールボックスバインドが成功しました')
          setTimeout(()=>{
            this.$router.push({name:'PhoneVerif'})
          },2000)
        } else {
          this.$toast('メールボックスが確認されました')
          setTimeout(()=>{
            this.$router.push({name:'Info'})
          },2000)
        }
      })
    }
  }
}
</script>
<style>
@import '~css/common/login-all.css';
</style>
