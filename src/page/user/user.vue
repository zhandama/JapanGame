<template>
  <div>
    <!-- 头部 -->
    <div class="index-header fixed-top">
      <div class="index-top pb-30">
        <router-link :to="{name:'Help'}">
        <div class="index-header-logo">
          <span class="kefu" ></span>
        </div>
        </router-link>
        <div class="index-header-middle">
          <span class="f32 color-fff">
            <em class="fl fontbold">マイページ</em>
          </span>
        </div>
        <!-- <router-link :to="{name:'Chat'}">
          <div class="index-header-right">
            <span class="kefu" ></span>
          </div>
        </router-link> -->
      </div>
    </div>
    <div class="mt-97">
      <!-- 已登录的 -->
      <div class="bg-fff member-list-user" v-if="isLogin">
        <router-link :to="{name:'Info'}">
          <div class="comment">
            <div class="fl text-left po-re list-left-user">
              <img src="~img/icon/my-tx.png" class="loginImg">
              <span class="notlogin">
                <em class="color-fff f32 fontbold">{{userInfo.nickName}}</em>
              </span>
            </div>
            <div class="list-right-user fr po-re text-left">
              <span class="right"></span>
            </div>
          </div>
        </router-link>
        <div class="coins">
          <div class="coins-left fl">
            <span></span>
          </div>
          <div class="coins-middle fl">
            <span class="f24 color-666">売上金</span>
            <em class="f30">{{amount|fixedDou}} 円</em>
          </div>
          <router-link :to="{name: 'PutForward'}">
            <div class="coins-right fr">
              <span class="f24 color-666">入金申請</span>
              <i class="right"></i>
            </div>
          </router-link>
        </div>
      </div>
      <!-- 未登录的 -->
      <div class="notlogin" v-else>
        <router-link :to="{name:'Login'}" class="f30 color-fff">ログイン</router-link>
        <router-link :to="{name:'Register'}" class="ml-25 f30 color-fff">会員登録(無料)</router-link>
      </div>
      <router-link :to="{name:'OrderSell'}">
        <div class="member-list bg-fff">
          <div class="list-left fl text-left">
            <span class="new-icon new-icon01"></span>
          </div>
          <div class="list-right fr text-right color-333 border-bottom">
            <span class="fl f30">出品した商品</span>
            <i></i>
          </div>
        </div>
      </router-link>
      <router-link :to="{name:'OrderBuy'}">
        <div class="member-list  bg-fff">
          <div class="list-left fl text-left">
            <span class="new-icon new-icon02"></span>
          </div>
          <div class="list-right fr text-right color-333 border-bottom">
            <span class="fl f30">購入した商品</span>
            <i></i>
          </div>
        </div>
      </router-link>
      <router-link :to="{name:'Collection'}">
        <div class="member-list mt-20 bg-fff">
          <div class="list-left fl text-left">
            <span class="new-icon new-icon03"></span>
          </div>
          <div class="list-right fr text-right color-333 border-bottom">
            <span class="fl f30">コレクションの商品</span>
            <i></i>
          </div>
        </div>
      </router-link>
      <router-link :to="{name:'History'}">
        <div class="member-list  bg-fff">
          <div class="list-left fl text-left">
            <span class="new-icon new-icon04"></span>
          </div>
          <div class="list-right fr text-right color-333 border-bottom">
            <span class="fl f30">閲覧履歴</span>
            <i></i>
          </div>
        </div>
      </router-link>
      <router-link :to="{name:'Help'}">
        <div class="member-list mt-20 bg-fff">
          <div class="list-left fl text-left">
            <span class="new-icon new-icon05"></span>
          </div>
          <div class="list-right fr text-right color-333 border-bottom">
            <span class="fl f30">よくある質問</span>
            <i></i>
          </div>
        </div>
      </router-link>
      <router-link :to="{name:'Feedback'}">
        <div class="member-list  bg-fff">
          <div class="list-left fl text-left">
            <span class="new-icon new-icon06"></span>
          </div>
          <div class="list-right fr text-right color-333 border-bottom">
            <span class="fl f30">お問い合わせ</span>
            <i></i>
          </div>
        </div>
      </router-link>
      <router-link :to="{name:'SiteInfo'}">
          <div class="member-list  bg-fff">
              <div class="list-left fl text-left">
                  <span class="new-icon new-icon07"></span>
              </div>
              <div class="list-right fr text-right color-333 border-bottom">
                  <span class="fl f30">サイト情報</span>
                  <i></i>
              </div>
          </div>
      </router-link>
    </div>
    <Footer :active="4" />
  </div>
</template>

<script>
import Footer from '@/components/footer.vue'
import { mapState } from 'vuex'
import { fixedDou } from '@/components/filter'
export default {
  components: {
    Footer
  },
  data() {
    return {
      amount: 0
    }
  },
  mounted() {
    this.sellAmount()
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
    sellAmount() {
      this.$api.user.sellAmount().then(res => {
        if (res && res.data) {
          this.amount = res.data
        }
      })
    }
  },
  filters: {
    fixedDou
  }
}
</script>
<style>
@import "~css/common/member.css";
</style>
