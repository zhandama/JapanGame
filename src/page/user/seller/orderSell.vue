<template>
  <div>
    <div class="jplist-nav bg-fff f30 mt-97 new-buyer-nav fixed-top border-bottom" style="z-index:1">
          <a class="jpnav fl" :class="{active:params.goodsQueryStatus==1}" @click="changeActive('1')">出品中</a>
          <a class="jpnav fl" :class="{active:params.goodsQueryStatus==2}" @click="changeActive('2')">取引中</a>
          <a class="jpnav fl" :class="{active:params.goodsQueryStatus==3}" @click="changeActive('3')">売却済み</a>
      </div>
      <van-pull-refresh
        v-model="refreshing"
        @refresh="onRefresh" style="margin-top:1.9rem;"
      >
        <van-list
          v-model="loading"
          :finished="finished"
          @load="onLoad" v-if="list.length>0" 
        >
          <div class="index-record mt-20" v-for="(item,index) in list" :key='index'>
             <div class="record-conn" >
                <List :item="item" pl="pl-25" mb=""/>
                <div class="bg-fff">
                  <div class="click-btn ml-25 border-top">
                      <span class="text f28 fl color-666" v-if="params.goodsQueryStatus==2">{{item.goodsPayStatus==1?'未払い':'払いました'}}</span>
                      <span class="text f28 fl color-666" v-if="params.goodsQueryStatus==3">{{item.goodsStatus|sellFilter}}</span>
                      <router-link :to="{name:'Create',query:{goodsId:item.goodsId}}" class="fr buy color-fff f28 bg-m2" v-if="item.goodsStatus==1||item.goodsStatus==4">編集する</router-link>
                      <router-link :to="{name:'Chat',query:{goodsId:item.goodsId, otherId:item.buyerId}}" class="fr buy color-fff f28 bg-m2" v-if="item.goodsStatus==2">売り手に連絡する</router-link>
                      <a class="f28 color-666 fr" v-if="item.goodsStatus==1" @click="cancel(item)">取り消す</a>
                      <a class="fr buy color-fff f28 bg-m2" v-if="item.goodsStatus==4" @click="upshelf(item)">上棚に売る</a>
                  </div>
              </div>
            </div>
        </div>
        </van-list>
      </van-pull-refresh>
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
        goodsQueryStatus:this.$route.query.status||1,
        pageNum:0,
        pageSize:20
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
    this.$bus.emit("title", '出品した商品')
    this.$bus.emit("showTopRight", true)
  },
  methods: {
    init (){
      this.getList('init')
    },
    changeActive (item) {
      this.params.goodsQueryStatus = item
      this.init()
      this.$router.replace({name:'OrderSell',query:{status:item}})
    },
    onRefresh () {
      this.init()
    },
    onLoad() {
      if (this.list.length < this.total){
        this.params.pageNum ++
        this.getList()
      } else {
        this.finished = true
        this.loading = false
      }
    },
    getList(type) {
      if (type==='init') {
        this.list = [],
        this.params.pageNum = 0
      }
      this.$api.goods.selfReleases(this.params).then((res) => {
        this.loading = false
        this.refreshing = false
        if (res&&res.data&&res.data.date) {
          this.total = res.data.total
          this.list = this.list.concat(res.data.date)
        }
      })
    },
    upshelf (item) {
      let params = {
        goodsId: item.goodsId
      }
      this.$dialog.confirm({
        message: '上棚に売る？',
        confirmButtonText:'はい',
        cancelButtonText:'いいえ'
      }).then(() => {
        this.$api.goods.upper(params).then(res => {
          if (res&&res.code === '00') {
            this.$toast('操作が成功する')
            setTimeout(() => {
              this.changeActive('1')
            }, 2000)
          }
        })
      }).catch(() => {
        // on cancel
      });
    },
    cancel (item) {
      let params = {
        goodsId: item.goodsId
      }
      this.$dialog.confirm({
        message: '下棚をはい？',
        confirmButtonText:'はい',
        cancelButtonText:'いいえ'
      }).then(() => {
        this.$api.goods.shelf(params).then(res => {
          if (res&&res.code === '00') {
            this.$toast('操作が成功する')
            setTimeout(() => {
              this.changeActive('3')
            }, 2000)
          }
        })
      }).catch(() => {
        // on cancel
      });
    }
  },
  filters: {
    sellFilter (val) {
      var tip = ''
      if (val===1) {
        tip = '販売中'
      } else if (val===2) {
        tip = '取引中'
      } else if (val===3) {
        tip = '販売されている'
      } else if (val===4) {
        tip = '段取り'
      }
      return tip
    }
  }
}
</script>
<style>
@import '~css/common/buyer.css';
</style>
