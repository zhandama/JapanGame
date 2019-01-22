<template>
  <div class="index-record mt-97">
    <div class="record-conn">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" @load="onLoad" v-if="list.length>0">
        <div v-for="(item,index) in list" :key='index'>
          <van-swipe-cell :right-width="65" v-if="!item.isDel" :on-close="onClose">
            <List :item="item" pl="pl-25"/>
            <span slot="right" @click="onDelete(item)">削除する</span>
          </van-swipe-cell>
        </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import List from '@/components/list.vue'
import { SwipeCell } from 'vant';
export default {
  components:{
    List,
    [SwipeCell.name]: SwipeCell,
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
    // this.$bus.emit("topRightText", 'すべてクリア')
    // this.$bus.emit("rightFunc", ()=>{
    //   this.deleteAll()
    // })
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
    onClose(item) {
      console.log(item)
    },
    onDelete (item) {
      this.$dialog.confirm({
        message: '削除してよろしいでしょうか', // 确定要删除？
        confirmButtonText:'はい',
        cancelButtonText:'いいえ'
      }).then(() => {
        this.deleteItem(item)
        // instance.close();
      });
    },
    deleteItem (item) {
      this.$api.goods.browseDelete({goodsId:item.goodsId}).then(res => {
        this.$set(item, 'isDel', true)
        if (!res.data) {
          var goodsHistory = this.list.filter(x=>!x.isDel)
          localStorage.setItem("goodsHistory",JSON.stringify(goodsHistory))
        }
      })
    },
    deleteAll () {

    },
    getLocal () {
      if (localStorage&&localStorage.goodsHistory) {
        this.list = JSON.parse(localStorage.goodsHistory)||[]
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
        if (res && res.data) {
          this.total = res.data.total
          this.list = this.list.concat(res.data.date)
        } else {
          this.getLocal()
          this.finished = true
        }
      })
    }
  }
}
</script>
<style>
@import '~css/common/browse.css';
.van-swipe-cell__right {
  color: #fff;
  font-size: 15px;
  width: 65px;
  display: inline-block;
  text-align: center;
  line-height: 2rem;
  background-color: #f44;
}
</style>
