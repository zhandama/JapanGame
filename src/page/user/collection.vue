<template>
  <div class="index-record mt-97">
    <div class="record-conn">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" @load="onLoad" v-if="list.length>0">
        <div v-for="(item,index) in list" :key='index'>
          <List :item="item" pl="pl-25" :reflesh="init"/>
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
    this.$bus.emit("title", 'コレクションの商品')
    this.$bus.emit("showTopRight", true)
  },
  methods: {
    init (){
      this.getList('init')
    },
    onRefresh(){
      this.init()
    },
    onLoad() {
      if (this.list.length < this.total){
        this.params.page ++
        this.getList()
      } else {
        this.finished = true
        this.loading = false
      }
    },
    getList(type) {
      if (type==='init') {
        this.list = [],
        this.params.page = 0
      }
      this.$api.goods.collections(this.params).then((res) => {
        this.loading = false
        this.refreshing = false
        if (res && res.data) {
          this.total = res.data.total
          this.list = this.list.concat(res.data.date)
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
