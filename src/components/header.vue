<template>
  <div class="japan-header fixed-top border-bottom bg-f6" style="z-index:2">
    <div class="detail-top">
      <div class="top-back">
        <a href="javascript:void(0)" @click="goBack"></a>
      </div>
      <h2 class="f32 color-000 fontbold" v-if="!showSearch">{{title}}</h2>
      <div class="game-input" v-if="showSearch">
        <input readonly type="text" class="cave f28" placeholder="ゲーム名で検索" @click="goSearch">
      </div>
      <div class="top-right" v-if="showTopRight">
        <span class="color-000 f30 mr-15" @click.stop="rightFunc" v-if="topRightText">{{topRightText}}</span>
        <a href="javascript:void(0);" class="jpshare fl" @click.stop="showRight=!showRight" v-if="!showSearch&&!topRightText"></a>
        <a href="javascript:void(0);" class="switch fl switch-hov" @click.stop="$toast('ゲームを検索することができます')" v-if="showSearch"></a>
      </div>
      <div class="screem-boxs" style="display:none;" v-show="showRight">
        <i class="more-chart fr"></i>
        <div class="more-handle bg-000 f28 px-15">
          <router-link :to="{name:'Message'}"><span class="color-fff"><em class="notice fl">お知らせ</em></span></router-link>
          <router-link :to="{name:'Home'}"><span class="color-fff"><em class="station fl">ホーム</em></span></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      title: '',
      showRight: false,
      showTopRight: false,
      showSearch: false,
      topRightText: '',
      oldUrl: ''
    }
  },
  watch: {
    $route(route) {
      if (route.name != 'Sell') {
        this.showSearch = false
      }
    }
  },
  created() {
    this.$bus.$on('title', title => {
      this.title = title
    })
    this.$bus.on('showSearch', type => {
      this.showSearch = type
    })
    this.$bus.on('showTopRight', type => {
      this.showTopRight = type
    })
    this.$bus.on('topRightText', text => {
      this.showTopRight = true
      this.topRightText = text
    })
    this.$bus.on('rightFunc', fuc => {
      this.rightFunc = fuc
    })
    this.$bus.on('callback', fuc => {
      this.callback = fuc
    })
  },
  mounted() {
    document.addEventListener('click', this.handleBodyClick )
  },
  destroyed() {
    document.removeEventListener('click', this.handleBodyClick)
  },
  methods: {
    goSearch() {
      this.$router.push({ name: 'Search', query: { type: 'sell' } })
    },
    handleBodyClick() {
      if (this.showRight) {
        this.showRight = false
      }
    },
    goBack() {
      if (this.callback) {
        this.callback()
      } else {
        this.$router.go(-1)
        // if (document.referrer.indexOf(location.hostname)==-1) {
        //   this.$router.push({name:'Home'})
        // } else {
        //   this.$router.go(-1)
        // }
      }
    }
  }
}
</script>