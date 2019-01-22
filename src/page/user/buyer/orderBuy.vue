<template>
  <div>
    <div class="jplist-nav bg-fff f30 mt-97 new-buyer-nav fixed-top border-bottom" style="z-index:1">
        <a class="jpnav fl" :class="{active:params.orderQueryStatus==1}" @click="changeActive('1')">未払い</a>
        <a class="jpnav fl" :class="{active:params.orderQueryStatus==2}" @click="changeActive('2')">取引中</a>
        <a class="jpnav fl" :class="{active:params.orderQueryStatus==3}" @click="changeActive('3')">取引終了</a>
    </div>
      <van-pull-refresh
        v-model="refreshing"
        @refresh="onRefresh" style="margin-top:1.9rem;"
      >
        <van-list
          v-model="loading"
          :finished="finished"
          @load="onLoad"  v-if="list.length>0" 
        >
          <div class="index-record mt-20" v-for="(item,index) in list" :key='index'>
              <div class="record-conn">
                <div class="demolist py-25 pl-25 bg-fff">
                    <router-link :to="{name:'OrderInfo',query:{orderId:item.orderId}}">
                    <div class="mbgmes-img fl">
                        <img :src="item.goodsImageUrl" v-if="item.goodsImageUrl">
                    </div>
                    </router-link>
                    <div class="mbgmes-con mbgmes-ico pl-25 pr-20">
                        <div class="mbl-title f28 color-000">
                            <router-link :to="{name:'OrderInfo',query:{orderId:item.orderId}}"><span>{{item.goodsTitle}}</span></router-link>
                            <div class="like" v-if="item.userGoodsCollectionVO" :class="{'active':item.userGoodsCollectionVO.userCollection}" @click.stop="likeAdd(item)">
                              <i></i>
                              <em class="f24 color-666" v-if="item.userGoodsCollectionVO.collectionNum>0">×{{item.userGoodsCollectionVO.collectionNum}}</em>
                            </div>
                        </div>
                        <div class="mbl-cper f28">￥{{parseInt(item.realPay)|toThousands}}</div>
                        <div class="mbl-parea  f22">{{item.gameName}}</div>
                    </div>
                </div>
                
                <div class="bg-fff">
                    <div class="click-btn ml-25 border-top">
                        <span class="text f28 fl color-666" v-if="params.orderQueryStatus==3">{{item.orderStatus|orderFilter}}</span>
                        <span class="text f28 fl color-666" v-if="params.orderQueryStatus==2">{{item.refundStatus!=0?'返金中です':''}}</span>
                        <router-link class="fr buy color-fff f28 bg-m1" :to="{name:'Pay',query:{orderId:item.orderId}}" v-if="item.orderStatus===1">購入する</router-link>
                        <a class="fr buy color-fff f28 bg-m1" @click="confirm(item)" v-if="item.orderStatus===2&&item.refundStatus==0">納品確認</a>
                        <router-link :to="{name:'Chat',query:{goodsId:item.goodsId}}" class="f28 color-666 fr" v-if="params.orderQueryStatus==2">売り手に連絡する</router-link>
                        <router-link class="f28 color-666 fr" :to="{name:'OrderRefund',query:{orderId:item.orderId}}" v-if="item.orderStatus===2&&item.refundStatus==0">払い戻し</router-link>
                        <a class="f28 color-666 fr" @click="cancel(item)" v-if="item.orderStatus===1">取り消す</a>
                    </div>
                </div>
            </div>
        </div>
        </van-list>
      </van-pull-refresh>
  </div>
</template>

<script>
import {orderFilter, toThousands} from '@/components/filter'
export default {
  data () {
    return {
      params:{
        orderQueryStatus:this.$route.query.status||1,
        pageNum:0,
        pageSize:10
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
    this.$bus.emit("title", '購入した商品')
    this.$bus.emit("showTopRight", true)
  },
  methods: {
    init (){
      this.getList('init')
    },
    changeActive (item) {
      this.params.orderQueryStatus = item
      this.init()
      this.$router.replace({name:'OrderBuy',query:{status:item}})
    },
    onRefresh(){
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
      this.$api.order.buyerList(this.params).then((res) => {
        this.loading = false
        this.refreshing = false
        if (res&&res.data&&res.data.date) {
          this.total = res.data.total
          this.list = this.list.concat(res.data.date)
        }
      })
    },
    cancel(item) {
      let params = {
        cancelType: 1,
        orderId: item.orderId
      }
      this.$dialog.confirm({
        message: '注文をキャンセルしてよろしいでしょうか', // 取消订单
        confirmButtonText:'はい',
        cancelButtonText:'いいえ'
      }).then(() => {
        this.$api.order.cancel(params).then(res => {
          if (res&&res.code === '00') {
            this.$toast('成功をキャンセルする')
            setTimeout(() => {
              this.changeActive('3')
            }, 2000)
          }
        })
      }).catch(() => {
        // on cancel
      });
    },
    confirm (item) {
      let params = {
        confirmType: 1,
        orderId: item.orderId
      }
      this.$dialog.confirm({
        message: '納品確認してよろしいでしょうか', // 确认收货
        confirmButtonText:'はい',
        cancelButtonText:'いいえ'
      }).then(() => {
        this.$api.order.confirm(params).then(res => {
          if (res&&res.code === '00') {
            this.$toast('納品の完了を確認する')
            setTimeout(() => {
              this.changeActive('3')
            }, 2000)
          }
        })
      }).catch(() => {
        // on cancel
      });
    },
    async likeAdd(item) {
      let params = {
        collectOrCancelType: item.userGoodsCollectionVO.userCollection?-1:1,
        goodsId: item.goodsId
      }
      await this.$api.goods.collect(params).then((res) => {
        if (res&&res.code=='00') {
          if (this.reflesh) {
            this.reflesh()
          }
          item.userGoodsCollectionVO.collectionNum = item.userGoodsCollectionVO.collectionNum + params.collectOrCancelType
          item.userGoodsCollectionVO.userCollection = !item.userGoodsCollectionVO.userCollection
        }
      })
    }
  },
  filters:{
    orderFilter,
    toThousands
  }
}
</script>
<style>
@import '~css/common/buyer.css';
</style>
