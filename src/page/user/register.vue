<template>
  <div class="login mt-97">
      <p class="login-email f30 bg-fff">メールアドレスで登録</p>
      <div class="form-control bg-fff">
          <div class="control-input mb-25">
              <i class="icon-yx fl"></i>
              <input type="text" class="fl f30" placeholder="メールアドレス" v-model="params.account" maxlength="28">
          </div>
          <div class="control-input mb-25">
              <i class="icon-mm fl"></i>
              <input type="password" class="fl f30" placeholder="パスワード" v-model="params.password" maxlength="18">
          </div>
          <div class="control-input mb-20">
              <i class="icon-tx fl"></i>
              <input type="text" class="fl f30" placeholder="ニックネーム" v-model="params.nickName" maxlength="18">
          </div>
          <p class="nickname">※ニックネームは後から変更できます</p>
          <div class="signin">
              <a @click="register()" class="sign-box f30 color-fff">会員登録はこちら（無料）</a>
          </div>
          <p class="f24 newmember">新規会員登録をいただく際、「利用規約」を必ずお読みください。登録することにより<a href="http://5173.jp/siteinfo/?id=1"><em>利用規約</em></a>と<a href="http://5173.jp/siteinfo/?id=2"><em>個人情報保護方針</em></a>に同意したことになります。</p>
      </div>
      <div class="bg-fff insider mt-20">
          <router-link :to="{name:'Login'}" class="member f30" replace>ログイン</router-link>
      </div>
      <!-- <div class="other-ways bg-fff mt-20">
          <p class="f30">外部サイト</p>
          <div class="yahooway px-30 text-center">
              <a href="https://login.yahoo.co.jp/config/login" class="waysitem">
                  <span class="f30">Yahoo! IDでログイン</span>
              </a>
          </div>
      </div> -->
  </div>
</template>

<script>
import Footer from '@/components/footer.vue'
export default {
  components:{
    Footer
  },
  data () {
    return {
      params:{
        account:'',
        password:'',
        nickName:''
      }
    }
  },
  created () {
    this.$bus.emit("title", '会員登録')
  },
  methods: {
    register() {
      var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      if (this.params.account.length==0||!myreg.test(this.params.account)) {
        this.$toast('正しいメールアドレスを入力してください')
        return
      }
      if (this.params.password.length < 6) {
        this.$toast('パスワードを6~18桁の数字やアルファベットで入力してください')
        return
      }
      if (this.params.nickName.length==0) {
        this.$toast('ニックネームを記入してください')
        return
      }
      this.$api.user.register(this.params).then(res=> {
        if (res.code==='00') {
          this.$api.user.login(this.params).then(res=> {
            if (res.code==='00') {
              this.$router.push({name:'EmailVerif',query:{account:this.params.account}})
            }
          })
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
