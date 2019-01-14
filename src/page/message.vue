<template>
  <div>
    <!-- 头部 -->
    <div class="japan-header fixed-top border-bottom bg-f6" style="z-index:1">
      <div class="detail-top bg-m2">
        <h2 class="f32 color-fff">お知らせ</h2>
      </div>
    </div>

    <div class="japan-message bg-fff mt-97">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" @load="onLoad">
          <ul class="pl-25" v-if="list.length > 0">
            <router-link :to="{name:'Chat'}">
              <li class="border-top py-25 pr-25">
                <div class="jpmess-head fl"><img src="~img/message/messages-kfu.png"></div>
                <div class="jpmess-text fl pl-25">
                  <h2 class="f32 color-000 fontbold">オンラインサービス</h2>
                  <p class="f24 color-999">こんにちは、何かお手伝いしましょうか。</p>
                  <span class="f24 color-999" v-if="list[0].lastTalkTime">{{list[0].lastTalkTime|formatTimeFilter}}</span>
                </div>
              </li>
            </router-link>
            <router-link :to="{name:'Chat',query:{goodsId:item.goodsId,otherId:item.otherId}}" v-for="(item, index) in filterList" :key="index">
              <li class="border-top py-25 pr-25">
                <div class="jpmess-head fl"><img src="~img/product-pic.png"></div>
                <div class="jpmess-text fl pl-25">
                  <h2 class="f32 color-000 fontbold">{{item.otherNickName}}</h2>
                  <p class="f24 color-999">{{item.lastTalkRecord}}</p>
                  <span class="f24 color-999">{{item.lastTalkTime|formatTimeFilter}}</span>
                </div>
                <div class="jpmess-pic fr"><img :src="item.goodsPictureUrl" v-if="item.goodsPictureUrl"></div>
              </li>
            </router-link>
          </ul>
        </van-list>
      </van-pull-refresh>
    </div>
    <Footer :active="3" />
  </div>
</template>

<script>
import Footer from '@/components/footer.vue'
import { formatTimeFilter } from '@/components/filter'
export default {
  components: {
    Footer
  },
  data() {
    return {
      params: {
        page: 0,
        size: 20
      },
      list: [],
      filterList: [],
      loading: true,
      finished: false,
      refreshing: false,
      total: 0
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList('init')
    },
    onRefresh() {
      this.init()
    },
    onLoad() {
      if (this.list.length < this.total) {
        this.params.page++
        this.getList()
      } else {
        this.finished = true
        this.loading = false
      }
    },
    getList(type) {
      if (type === 'init') {
        this.list = [],
          this.params.page = 0
      }
      this.$api.user.chatList(this.params).then((res) => {
        this.loading = false
        this.refreshing = false
        if (res && res.code === "00") {
          this.total = res.data.total
          this.list = this.list.concat(res.data.list)
          this.filterList = this.list.filter((x,index)=>index!=0)
        } else {
          this.finished = true
        }
      })
    }
  },
  filters: {
    formatTimeFilter
  }
}
</script>
<style>
@import "~css/common/message.css";
</style>
