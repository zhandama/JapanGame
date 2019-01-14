<template>
  <div id="wrapper" class="pb-200">
    <HeadSearch />
    <!-- 轮播图片 -->
    <div class="index-banner bg-000 border-bottom text-center" style="margin-top:1.85rem;">
        <van-swipe :autoplay="3000" v-if="bannerList.length>0">
          <van-swipe-item v-for="(list, index) in bannerList" :key="index" class="banner-img">
            <a class="demo" :href="list.linkUrl">
              <img :src="list.imageUrl" />
            </a>
          </van-swipe-item>
        </van-swipe>
    </div>
    <!-- <div class="fdback-conn bg-fff">
        <ul>
            <li class="fl">
                <router-link :to="{name:'Sell'}"><span class="zhix f28 color-000">アカウント販売</span></router-link>
            </li>
            <li class="fl">
                <span class="tous f28 color-000">アカウントレンタル</span>
            </li>
        </ul>
    </div> -->
    <!-- 游戏列表 -->
    <div class="search-game">
        <div class="tab">
            <div class="tab-head bg-fff  mb-20">
                <ul class="tab-nav">
                    <li :class="{active:params.gameType==1}" @click="changeType('1')">
                        <a>
                            <span class="sj fontbold">モバイルゲーム</span>
                        </a>
                        <em class="line"></em>
                    </li>
                    <li :class="{active:params.gameType==2}" @click="changeType('2')">
                        <a>
                            <span class="dn fontbold">PCゲーム</span>
                        </a>
                        <em class="line"></em>
                    </li>
                </ul>
            </div>
            <div class="tab-list bg-fff">
              <!--手游-->
                <div class="japangame-list " v-if="params.gameType==1">
                    <ul class="pl-25" v-if="gameList">
                        <li class="py-20 border-top" v-for="(item,index) in gameList" :key="index">
                          <router-link :to="{name:'Goodslist',query:{gameName:item.name,gameId:item.id}}">
                            <span class="selgame fl"><img :src="item.gameImageUrl"></span><em class="seltext f28 color-000 ml-25 fl ">{{item.name}}</em>
                          </router-link>
                        </li>
                    </ul>
                    <div class="tab-more py-20 border-top ml-25">
                        <router-link class="more f28 color-666" :to="{name:'Buy',query:{gameType:1}}">モバイルゲーム一覧へ</router-link>
                    </div>
                </div>
                <!--端游-->
                <div class="tab-panel" v-if="params.gameType==2">
                    <div class="tab-class01">
                        <ul class="pl-25" v-if="gameList">
                            <li class="py-10 border-top" v-for="(item,index) in gameList" :key="index">
                              <router-link :to="{name:'Goodslist',query:{gameName:item.name,gameId:item.id}}" >
                                <span class="fl">
                                    <img :src="item.gameImageUrl">
                                </span>
                                <em class="fl f28 color-000 ml-25">{{item.name}}</em>
                              </router-link>
                            </li>
                        </ul>
                    </div>
                    <div class="tab-more py-20 border-top ml-25">
                        <router-link class="more f28 color-666" :to="{name:'Buy',query:{gameType:2}}">PCゲーム一覧へ</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 历史记录和商品列表 -->
    <div class="index-record bg-fff mt-20" v-if="gameHistory.length>0" >
        <div class="record-titl f30 color-333 px-25 ">閲覧履歴</div>
        <div class="record-conn pl-25" v-if="gameHistory.length>0">
            <div v-for="(item,index) in gameHistory" :key='index'>
              <List :item="item" />
            </div>
            <div class="tab-more py-20 border-top">
                <router-link class="more f28 color-666" :to="{name:'History'}">閲覧履歴リストに移動する</router-link>
            </div>
        </div>
    </div>
    <Footer :active="0"/>
  </div>
</template>

<script>
import List from '@/components/list.vue'
import Footer from '@/components/footer.vue'
import HeadSearch from '@/components/headSearch.vue'
import { Swipe, SwipeItem } from 'vant';
export default {
  name: 'home',
  data () {
    return {
      params:{
        pageNum: 1,
        pageSize: 10,
        gameType:localStorage&&localStorage.gameType||1
      },
      bannerList:[],
      gameList:[],
      gameHistory:[],
    }
  },
  components:{
    Footer,
    HeadSearch,
    List,
    [Swipe.name]:Swipe,
    [SwipeItem.name]:SwipeItem,
  },
  created () {
    this.init()
  },
  methods: {
    init (){
      this.getBanner()
      this.getHomeGame()
      this.getHistory()
    },
    getBanner() {
      let params = {
        pageNum: 1,
        pageSize: 10
      }
      this.$api.bannerpage(params).then((res) => {
        if (res && res.data && res.data.list) {
          this.bannerList = res.data.list
        }
      })
    },
    getHomeGame() {
      this.gameList = []
      this.$api.hotList(this.params).then((res) => {
        if (res && res.data && res.data.list) {
          this.gameList = res.data.list
        }
      })
    },
    getHistory() {
      this.$api.goods.browseIndex().then((res) => {
        if (res&&res.data&&res.data.date) {
          this.gameHistory = res.data.date
        } else {
          if (localStorage&&localStorage.goodsHistory) {
            this.gameHistory = JSON.parse(localStorage.goodsHistory).slice(0,3)||[]
          }
        }
      })
    },
    changeType(type){
      this.params.gameType = type
      this.getHomeGame()
      try {
        localStorage.setItem("gameType",type)
      } catch (err){
        return
      }
    }
  }
}
</script>
<style>
@import '~css/common/index.css';
</style>
