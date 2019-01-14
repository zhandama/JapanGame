<template>
  <div class="index-record mt-97">
    <div class="record-conn">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" @load="onLoad" v-if="list.length>0">
        <div v-for="(item,index) in list" :key='index'>
          <List :item="item" pl="pl-25"/>
        </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import List from '@/components/list.vue'
export default {
  components:{
    List
  },
  data () {
    return {
      params:{
        page:0,
        size:20
      },
      list:[],
      loading: true,
      finished: false,
      refreshing: false,
      total:0
    }
  },
  created () {
    this.init()
    this.$bus.emit("title", '閲覧履歴')
    this.$bus.emit("showTopRight", true)
  },
  methods: {
    init (){
      this.getHistory('init')
    },
    onRefresh(){
      this.init()
    },
    onLoad() {
      if (this.list.length < this.total){
        this.params.page ++
        this.getHistory()
      } else {
        console.log('到底了')
        this.finished = true
        this.loading = false
      }
    },
    getHistory(type) {
      if (type==='init') {
        this.list = [],
        this.params.page = 0
      }
      this.$api.goods.browseMore(this.params).then((res) => {
        this.loading = false
        this.refreshing = false
        if (res && res.code === "00") {
          this.total = res.data.total
          this.list = this.list.concat(res.data.date)
        } else if (res.code === "02") {
          if (localStorage&&localStorage.goodsHistory) {
            this.list = JSON.parse(localStorage.goodsHistory)||[]
          }
        } else {
          this.finished = true
        }
      })
    }
  }
}
</script>
<style>
@import '~css/common/browse.css';
</style>
