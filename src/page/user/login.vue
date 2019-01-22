<template>
<div class="login mt-97">
    <p class="login-email f30 bg-fff">メールアドレスまたは電話番号</p>
    <div class="form-control bg-fff">
        <input type="input" class="control-box f30" placeholder="メールアドレスまたは電話番号" v-model="params.account" @keyup.enter="login" maxlength="30">
        <input type="password" class="control-box f30" onpaste="return false"  placeholder="パスワード" v-model="params.password" @keyup.enter="login" maxlength="18">
        <div class="signin">
            <a class="sign-box f30 color-fff" @click="login">ログイン</a>
        </div>
        <!-- <p class="remember f24">パスワードを忘れてしまった方はこちら</p> -->
    </div>
    <div class="bg-fff insider mt-20">
        <router-link :to="{name:'Register'}" class="member f30" replace>会員登録はこちら（無料）</router-link>
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
import {mapActions,mapState} from 'vuex'
export default {
  components:{
    Footer
  },
  data () {
    return {
      returnName:this.$route.query.returnName,
      returnUrl:this.$route.query.returnUrl,
      params:{
        account:'',
        password:''
      }
    }
  },
  created () {
    this.$bus.emit("title", 'ログイン')
    this.init()
  },
  computed: {
    ...mapState({
      isLogin: state => {
        return state.isLogin
      },
      userInfo: state => {
        return state.userInfo
      }
    })
  },
  methods: {
    init () {
      if (!this.isLogin) {
        this.getUserInfo().then(res => {
          if (res) {
            this.pageTo()
          }
        })
      }
    },
    pageTo () {
      let query = this.$route.query
      if (this.returnUrl) {
        location.replace(this.returnUrl)
      } else if(this.returnName) {
        this.$router.replace({name:this.returnName,query})
      } else {
        this.$router.replace({name:'User'})
      }
    },
    login() {
      if (this.params.account.length==0) {
        this.$toast('アカウントを入力してください') // 请输入帐号
        return
      }
      if (this.params.password.length==0) {
        this.$toast('パスワードを入力してください') // 请输入密码
        return
      }
      this.$api.user.login(this.params).then(res=> {
        if (res.code==='00' && res.data) {
          this.pageTo()
        }
      })
    },
    ...mapActions({
      getUserInfo: 'GET_USER'
    })
  }
}
</script>
<style>
@import '~css/common/login-all.css';
</style>
