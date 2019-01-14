<template>
  <div class="newfooter fixed-bottom  indexfooter" data-style="fixed-bottom">
    <!--在li中添加active类名可以改变图标和字体颜色-->
    <ul>
      <router-link :to="{name:'Home'}" class="foot-home" >
          <li :class="{'active':active==0}">
              <span class="i_home">ホーム</span>
          </li>
      </router-link>
      <router-link :to="{name:'Buy'}" class="foot-buy">
          <li :class="{'active':active==1}">
              <span class="i_mybuy">ゲームリスト</span>
          </li>
      </router-link>
      <router-link :to="{name:'Sell'}" class="foot-home">
          <li class="data-buy" >
              <span class="i_newsell">出品</span>
          </li>
      </router-link>
      <router-link  :to="{name:'Message'}" class="foot-message">
          <li :class="{'active':active==3}" style="margin-left:20%;">
              <span class="i_message">お知らせ</span>
              <!-- <span class="tsme">5</span> -->
              <span class="i_redmessage" v-if="userInfo&&userInfo.unread"></span>
          </li>
      </router-link>
      <router-link :to="{name:'User'}" class="foot-home">
          <li :class="{'active':active==4}">
              <span class="i_tx">マイページ</span>
          </li>
      </router-link>
    </ul>
  </div>
</template>

<script>
// import * as im from '@/components/NIM_Web_SDK_v5.8.0.js'
import {mapActions,mapState} from 'vuex'
export default {
  name: 'Footer',
  props:['active'],
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      isLogin:state => {
        return state.isLogin
      },
      userInfo: state => {
        return state.userInfo
      }
    })
  },
  mounted () {
    this.init()
  },
  methods:{
    async init () {
      if (!this.isLogin) {
        await this.getUserInfo()
      }
      // this.imInit()
    },
    // imInit () {  // 初始化聊天
    //   var that = this
    //   that.nim = SDK.NIM.getInstance({
    //     appKey: 'f83a4d869a4638548b7c15a174cbc38e ',
    //     account: this.userInfo.imAccount,
    //     token: this.userInfo.imPassword,
    //     autoMarkRead: false,
    //     onwillreconnect: function() {
    //       that.imInit()
    //     },
    //     onsysmsgunread: function(opt){
    //       console.log('未读数',opt)
    //     },
    //     onsessions: function(opt){
    //       console.log('onsessions', opt);
    //       opt.map(x => {
    //         if (x.unread > 0) {
    //           that.$store.commit('updateUserInfoRead', true)
    //         }
    //       })
    //     },
    //     onupdatesession: function(opt){
    //       console.log('onupdatesession', opt);
    //     },
    //     onupdatesysmsgunread: function(opt){
    //       console.log('系统通知未读数更新了', opt);
    //     }
    //   })
    // },
    ...mapActions({
        getUserInfo: 'GET_USER'
    }),
  }
}
</script>