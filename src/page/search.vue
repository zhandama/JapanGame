<template>
  <div>
    <!-- 头部 -->
    <div class="header-seach fixed-top bg-fff">
      <div class="seach-left fl"><a class="back" href="javascript:history.go(-1)"></a></div>
        <div class="seach-info fl py-15">
          <input class="seach-input f28 color-000 fl" placeholder="ゲーム名で検索" v-model="params.keyWord" name="" type="text" @focus="showSearch=true" @input="getSearch()" maxlength="11">
        </div>
    </div>
    <!--搜索列表弹窗-->
    <div class="seach-rake fixed-top mt-97" style="z-index:1" v-if="params.keyWord&&showSearch">
      <div class="japangame-list bg-fff">
                <ul class="pl-25"  v-if="searchlist.length>0">
                    <li class="py-20 border-top" v-for="(item,index) in searchlist" :key="index" @click="goList(item)">
                        <span class="selgame fl"><img :src="item.gameImageUrl"></span><em class="seltext f28 color-000 ml-25 fl ">{{item.name}}</em>
                    </li>
                </ul>
          </div>
    </div>
    <div class="mt-97">
        <div class="search-game" v-if="searchHistory.length>0">
            <div class="huntfor-titl px-25 bg-fff"><span class="titl pl-25 f30 color-000 fontbold fl">歴史検索</span><a class="seachdel fr f24 color-000" @click="delHistory" v-if="localSearchHistory.length>0">除去する</a></div>
            <div class="japangame-list bg-fff">
                    <ul class="pl-25">
                        <li class="py-20 border-top" v-for="(item,index) in searchHistory" :key="index" v-show="item" @click="goList(item)">
                            <span class="selgame fl "><img :src="item.gameImageUrl" v-if="item.gameImageUrl"></span><em class="seltext f28 color-000 ml-25 fl text-jd">{{item.name}}</em>
                        </li>
                    </ul>
              </div>
        </div>
        <div class="search-game mt-20" v-if="hotlist.length>0">
            <div class="huntfor-titl px-25 bg-fff"><span class="titl pl-25 f30 color-000 fontbold fl">人気検索</span></div>
            <div class="japangame-list bg-fff">
                    <ul class="pl-25">
                        <li class="py-20 border-top" v-for="(item,index) in hotlist" :key="index" @click="goList(item)">
                            <span class="selgame fl"><img :src="item.gameImageUrl" v-if="item.gameImageUrl"></span><em class="seltext f28 color-000 ml-25 fl text-jd">{{item.name}}</em>
                        </li>
                    </ul>
              </div>
        </div>
    </div>
    <div class="dialog_cover opacity-75" @click="showSearch=false" v-if="params.keyWord&&showSearch"></div>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
export default {
  data () {
    return {
      params:{
        keyWord:'',
        pageNum:1,
        pageSize:10
      },
      type:this.$route.query.type,
      searchlist:[],
      searchHistory:[],
      localSearchHistory: [],
      hotlist:[],
      showSearch:false
    }
  },
  computed: {
    ...mapState({
      isLogin:state => {
        return state.isLogin
      }
    })
  },
  created () {
    this.init()
  },
  methods: {
    async init (){
      this.getSearchHot()
      await this.getUserInfo()
      this.getSearchHistory()
    },
    goList (item) {
      this.setHistory(item)
      let query = {gameName:item.name,gameId:item.id,gameType:item.gameType}
      if (this.type === 'sell') {
        this.$router.push({name:'Create',query})
      } else {
        this.$router.push({name:'Goodslist',query})
      }
    },
    setHistory (item) {
      if (localStorage) {
        var searchHistory = []
        if (localStorage.searchHistory) {
          searchHistory = JSON.parse(localStorage.searchHistory)
        }
        searchHistory = searchHistory.filter(x=>x&&x.name&&x.name!=item.name)
        searchHistory.unshift(item)
        if (searchHistory.length > 5) {
          searchHistory = searchHistory.slice(0,5)
        }
        localStorage.setItem("searchHistory",JSON.stringify(searchHistory))
      }
    },
    getSearchHistory(){
      if (localStorage&&localStorage.searchHistory) {
        this.searchHistory = JSON.parse(localStorage.searchHistory)||[]
        this.localSearchHistory = JSON.parse(localStorage.searchHistory)||[]
      } else {
        if (this.isLogin) {
          this.$api.historySearch().then((res) => {
            if (res&&res.data&&res.data.length>0) {
              this.searchHistory = res.data
            }
          })
        }
      }
    },
    getSearchHot() {
      let params = {
        pageNum:1,
        pageSize:5
      }
      this.$api.hotList(params).then((res) => {
        if (res&&res.data&&res.data.list) {
          this.hotlist = res.data.list
        }
      })
    },
    getSearch() {
      this.$api.search(this.params).then((res) => {
        if (res&&res.data&&res.data.list) {
          this.searchlist = res.data.list
        }
      })
    },
    delHistory() {
      if (localStorage) {
        localStorage.removeItem('searchHistory')
      }
      this.searchHistory = []
      this.localSearchHistory = []
    },
    ...mapActions({
      getUserInfo: 'GET_USER'
    })
  }
}
</script>
<style>
@import '~css/common/seachgame.css';
</style>
