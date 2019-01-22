<template>
<div class="mt-97">
  <div class="tx-list bg-fff">
      <img src="~img/icon/my-tx.png" class="icon-tx">
      <span class="title-tx f28 color-000 ml-25">{{userInfo.nickName}}</span>
  </div>
  <div class="mt-20 bg-fff">
      <div class="verification ml-25  border-bottom" @click="bindEmail">
          <span class="list01 fl f28 fontbold color-000">メールアドレス</span>
          <em class="list02 fl f28 color-000">{{userInfo.email}}</em>
          <span class="list03 fr f28" :class="{'color-06':userInfo.beBindEmail,'color-m1':!userInfo.beBindEmail}">{{userInfo.beBindEmail?'認証済み':'未認証'}}</span>
      </div>
      <div class="verification ml-25  border-bottom" @click="bindPhone">
          <span class="list01 fl f28 fontbold color-000">携帯番号</span>
          <em class="list02 fl f28 color-000">{{userInfo.mobilePhone}}</em>
          <span class="list03 fr f28" :class="{'color-06':userInfo.beBindPhone,'color-m1':!userInfo.beBindPhone}">{{userInfo.beBindPhone?'認証済み':'未認証'}}</span>
      </div>
  </div>
  <div class="outlogin">
      <a class="switchdown bg-fff f28 color-000" @click="isDialog">ログアウト</a>
  </div>
</div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  data () {
    return {
    }
  },
  mounted(){
    this.$bus.emit("title", '個人情報')
    this.$bus.emit("showTopRight", true)
  },
  computed: {
    ...mapState({
      userInfo:state => {
        return state.userInfo
      }
    })
  },
  methods: {
    isDialog () {
      this.$dialog.confirm({
        message: 'サインアウトしてよろしでしょうか', // 退出登录
        confirmButtonText:'はい',
        cancelButtonText:'いいえ'
      }).then(() => {
        this.logout()
      }).catch(() => {
        // on cancel
      });
    },
    logout() {
      this.$api.user.logout().then(res=>{
        if (res) {
          this.$store.commit('setUserInfo', {})
          this.$store.commit('setLoginstatus', false)
          this.$router.push({name:'User'})
        }
      })
    },
    bindEmail (){
      if (!this.userInfo.beBindEmail) {
        this.$router.push({name:'EmailVerif',query:{account:this.userInfo.account}})
      }
    },
    bindPhone (){
      if (!this.userInfo.beBindPhone) {
        this.$router.push({name:'PhoneCode'})
      }
    }
  }
}
</script>
<style>
@import '~css/common/personal.css';
.color-06{color: #00a006;}
</style>
