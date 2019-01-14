<template>
  <div class="search-game" :style="{'margin-top':top}">
    <div class="tab ">
      <div class="tab-head bg-fff">
        <ul class="tab-nav">
          <li :class="{active:params.gameType==1}" @click="gameTypeClick('1');">
            <a>
              <span class="sj fontbold">モバイルゲーム</span>
            </a>
            <em class="line"></em>
          </li>
          <li :class="{active:params.gameType==2}" @click="gameTypeClick('2')">
            <a>
              <span class="dn fontbold">PCゲーム</span>
            </a>
            <em class="line"></em>
          </li>
        </ul>
      </div>
      <div class="japangame-area p-15 bg-fff" v-if="pyList.length>0">
        <ul>
          <li class="fl" :class="{active:params.firstPy==item}" v-for="(item,index) in pyList" :key="index" @click="pyClick(item)">
            <a>
              <span class="fl f28">{{item}}</span>
              <em class="mx-10 mt-20 fl"></em>
            </a>
          </li>
        </ul>
      </div>

      <div class="japangame-list mt-20 bg-fff">
        <van-list v-model="loading" :finished="finished" @load="onLoad">
          <ul class="pl-25">
            <li class="py-20 border-top" v-for="(item,index) in list" :key="index">
              <router-link :to="{name:type,query:{gameName:item.name,gameId:item.id,gameType:item.gameType}}">
                <span class="selgame fl"><img :src="item.gameImageUrl"></span><em class="seltext f28 color-000 ml-25 fl ">{{item.name}}</em>
              </router-link>
            </li>
          </ul>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChoseGame',
  props: {
    top: {
      default: '0.96rem'
    },
    gameType: {
      default: 1,
    }
  },
  data() {
    return {
      params: {
        pageNum: 1,
        pageSize: 20,
        firstPy: '',
        gameType: 1
      },
      list: [],
      pyList: [],
      loading: true,
      finished: false,
      total: 0,
      type: 'Create'
    }
  },
  created() {
    this.params.gameType = this.gameType
    this.init()
    if (this.$route.name === 'Buy') {
      this.type = 'Goodslist'
    }
  },
  methods: {
    init() {
      this.getPy()
      this.getGame()
    },
    clear() {
      this.total = 0
      this.list = []
      this.params.pageNum = 1
      this.finished = false
    },
    getGame() {
      if (this.params.firstPy) {
        this.pySearch()
      } else {
        this.hotList()
      }
    },
    hotList() {
      this.$api.hotList(this.params).then((res) => {
        if (res && res.data && res.data.list.length > 0) {
          this.loading = false
          this.list = this.list.concat(res.data.list)
          this.total = res.data.total
        } else {
          this.loading = false
          this.finished = true
        }
      })
    },
    pySearch() {
      this.$api.pySearch(this.params).then((res) => {
        if (res && res.data && res.data.list.length > 0) {
          this.loading = false
          this.list = this.list.concat(res.data.list)
          this.total = res.data.total
        } else {
          this.loading = false
          this.finished = true
        }
      })
    },
    getPy() {
      this.$api.pyList({ gameType: this.params.gameType }).then((res) => {
        if (res && res.data) {
          this.pyList = res.data
        }
      })
    },
    gameTypeClick(gameType) {
      this.params.gameType = gameType
      this.params.firstPy = ''
      this.clear()
      this.getGame()
      this.getPy()
    },
    pyClick(item) {
      this.clear()
      if (this.params.firstPy === item) {
        this.params.firstPy = ''
        this.getGame('init')
      } else {
        this.params.firstPy = item
        this.pySearch('init')
      }
    },
    onLoad() {
      if (this.list.length < this.total) {
        this.params.pageNum++
        this.getGame()
      } else {
        this.finished = true
        this.loading = false
      }
    },
  }
}
</script>
<style>
@import "~css/common/choicegame.css";
</style>