<template>
<div class="mt-97">
    <div class="trading-state mt-97">
        <div class="state-left fl">
            <!-- 交易取消icon-state02 交易中icon-state04 交易完成icon-state03 待付款icon-state01 -->
            <i class="fl icon-state01"></i>
            <span class="state-text fl f32 color-fff">{{order.orderStatus|orderFilter}}</span>
        </div>
        <div class="state-right fr" v-if="order.orderStatus===1">
            <span class="state-title f22">カウントダウンを支払う</span>
            <em class="state-time f28 fontarial">{{countDown}}</em>
        </div>
    </div>
    <div class="index-record">
        <div class="record-conn">
            <div class="demolist py-25 pl-25 bg-fff">
                <div class="mbgmes-img fl">
                  <img :src="order.goodsImageUrl" v-if="order.goodsImageUrl">
                </div>
                <div class="mbgmes-con mbgmes-ico pl-25 pr-20">
                    <div class="mbl-title f28 color-000">
                        <span>{{order.goodsTitle}}</span>
                        <div class="like" v-if="order.userGoodsCollectionVO" :class="{'active':order.userGoodsCollectionVO.userCollection}" @click.stop="likeAdd(order)">
                            <i></i>
                            <em class="f24 color-666" v-if="order.userGoodsCollectionVO.collectionNum>0">×{{order.userGoodsCollectionVO.collectionNum}}</em>
                        </div>
                    </div>
                    <div class="mbl-cper f28">￥{{order.goodsPrice}}</div>
                    <div class="mbl-parea  f22">{{order.goodsDescription}}</div>
                </div>
            </div>
        </div>
    </div>
    <div class="bg-fff content mt-20">
        <div class="content-list ml-30 border-bottom">
            <div class="content-item">
                <span class="title f28 color-666 fl">注文番号 : </span>
                <em class="order color-000 fl ml-20 f28">{{order.orderId}}</em>
                <a class="copy fr f24 color-666 mr-25">コピーする</a>
            </div>
            <div class="content-item">
                <span class="title f28 color-666 fl">次の時間 : </span>
                <em class="order color-000 fl ml-20 f28">{{order.orderTime|formatTimeFilter}}</em>
            </div>
        </div>
        <div class="content-list ml-30 border-bottom">
            <div class="content-item">
                <span class="title f28 color-666 fl">商品代金 : </span>
                <em class="order color-000 fl ml-20 f28">￥{{order.goodsPrice}}</em>
            </div>
            <div class="content-item">
                <span class="title f28 color-666 fl">決済手数料 :</span>
                <em class="order color-000 fl ml-20 f28">￥{{parseInt(order.financeChannelServiceFee)}}</em>
            </div>
        </div>
        <div class="content-list ml-30">
            <div class="content-item">
                <span class="title f28 color-666 fl">支払額 :</span>
                <em class="order color-d82 fl ml-20 f28">￥{{parseInt(order.realPay)}}</em>
            </div>
        </div>
    </div>
    <div class="mt-20 bg-fff px-25 all-href">
        <div class="buy-href">
            <a @click="pay()" class="f30 color-fff" v-if="order.orderStatus===1">購入する</a>
            <a @click="confirm()" class="f30 color-fff" v-if="order.orderStatus===2">納品を確認する</a>
        </div>
        <div class="edit-href mt-25">
            <a @click="cancel()" class="f30 color-fff delete fl" v-if="order.orderStatus===1"><span>取り消す</span></a>
            <router-link :to="{name:'OrderRefund',query:{orderId:order.orderId}}" class="f30 color-fff money fl" v-if="order.orderStatus===2&&order.refundStatus==0"><span>返金を申請する</span></router-link>
            <router-link :to="{name:'Chat',query:{goodsId:order.goodsId}}"  class="f30 color-fff message fl ml-25" v-if="order.orderStatus===2"><span>売り手に連絡する</span></router-link>
        </div>
    </div>
    <div class="dialog_cover opacity-75" style="z-index:9" v-if="dialog_cover">
      <div style="padding-top:5rem;text-align:center"><van-loading style="margin:auto" /></div>
    </div>
</div>
</template>

<script>
import Footer from '@/components/footer.vue'
import {mapActions, mapState} from 'vuex'
import {formatTimeFilter, orderFilter} from '@/components/filter'
export default {
  components:{
    Footer
  },
  data () {
    return {
      orderId:this.$route.query.orderId,
      dialog_cover:false,
      leftTime:'',
      countDown:''
    }
  },
  created () {
    this.$bus.emit("title", '注文の詳細')
    this.$bus.emit("showTopRight", true)
    this.init()
  },
  methods: {
    async init () {
      if (!this.order||this.order.orderId!=this.orderId||this.order.orderStatus===1) {
        await this.$api.order.orderInfo({orderId:this.orderId}).then(res => {
          if (res && res.data) {
            this.$store.commit('setOrder', res.data)
          }
        })
      }
      this.leftTime = this.order.expireTime - this.order.nowTime
      this.leftTimer()
      if (this.leftTime>1000) {
        setInterval(this.leftTimer,1000); 
      }
    },
    leftTimer () {
      function checkTime(i) { //将0-9的数字前面加上0，例1变为01 
        if (i < 10) { 
          i = "0" + i
        } 
        return i
      } 
      var hours = parseInt(this.leftTime / 1000 / 60 / 60 % 24 , 10) //计算剩余的小时 
      var minutes = parseInt(this.leftTime / 1000 / 60 % 60, 10)  //计算剩余的分钟 
      var seconds = parseInt(this.leftTime / 1000 % 60, 10)  //计算剩余的秒数 
      hours = checkTime(hours); 
      minutes = checkTime(minutes); 
      seconds = checkTime(seconds);
      this.leftTime = this.leftTime - 1000
      this.countDown = (hours!='00' ? hours + ":" : '') + minutes + ":" + seconds
    },
    pay() {
      let params = {
        orderId: this.order.orderId,
      }
      this.dialog_cover = true
      this.$api.order.pay(params).then(res => {
        if (res && res.data) {
          location.href = res.data
        } else {
          this.dialog_cover = false
        }
      },error=>{
        this.dialog_cover = false
      })
    },
    confirm () {
      let params = {
        confirmType: 1,
        orderId: this.order.orderId
      }
      this.$dialog.confirm({
        message: '納品を確認する？',
        confirmButtonText:'はい',
        cancelButtonText:'いいえ'
      }).then(() => {
        this.$api.order.confirm(params).then(res => {
          if (res&&res.code === '00') {
            this.$toast('納品の完了を確認する')
            setTimeout(() => {
              this.$router.push({name:'orderbuy',query:{status:3}})
            }, 2000)
          }
        })
      }).catch(() => {
        // on cancel
      });
    },
    cancel() {
      let params = {
        cancelType: 1,
        orderId: this.orderId
      }
      this.$dialog.confirm({
        message: '注文をキャンセルする？',
        confirmButtonText:'はい',
        cancelButtonText:'いいえ'
      }).then(() => {
        this.$api.order.cancel(params).then(res => {
          if (res&&res.code === '00') {
            this.$toast('成功をキャンセルする')
            setTimeout(() => {
              this.$router.push({name:'orderbuy',query:{status:3}})
            }, 2000)
          }
        })
      }).catch(() => {
        // on cancel
      });
    },
    changePay () {
      this.$router.push({name:'Order',query:{orderId: this.order.orderId, goodsId: this.order.goodsId}})
    },
    async likeAdd(item) {
      let params = {
        collectOrCancelType: item.userGoodsCollectionVO.userCollection?-1:1,
        goodsId: item.goodsId
      }
      
      await this.$api.goods.collect(params).then((res) => {
        if (res&&res.code=='00') {
          let userGoodsCollectionVO = {
            collectionNum: item.userGoodsCollectionVO.collectionNum + params.collectOrCancelType,
            userCollection: !item.userGoodsCollectionVO.userCollection
          }
          this.$store.commit('updateOrderLike', userGoodsCollectionVO)
        }
      })
    },
    ...mapActions({
      getOrder: 'GET_ORDER',
    })
  },
  computed: {
    ...mapState({
      order: state => {
        return state.order
      }
    })
  },
  filters:{
    formatTimeFilter,
    orderFilter
  }
}
</script>
<style>
@import '~css/common/buyer-detail.css';
</style>
