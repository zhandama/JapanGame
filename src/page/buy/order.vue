<template>
<div class="mt-97">
    <div class="index-record mt-20 bg-fff" v-if="accountGoods">
        <div class="japan-titl f30 fontbold px-25"><span class="current pl-25">出品者：<em class="fontnobold">{{accountGoods.sellerNickName}}</em></span></div>
          <div class="record-conn">
                  <div class="demolist pb-25 pl-25 bg-fff border-bottom">
                      <div class="mbgmes-img fl">
                          <img :src="accountGoods.goodsImageUrl" v-if="accountGoods.goodsImageUrl">
                          <div class="img_bj bg-000"></div>
                          <div class="img-text f24 color-fff text-center" :class="{'ke':accountGoods.goodsType==1,'dai':accountGoods.goodsType==3}">{{accountGoods.goodsType==1?'売':'貸'}}</div>
                      </div>
                      <div class="mbgmes-con mbgmes-ico pl-25 mr-25">
                          <div class="mbl-title f28 color-000">
                              <span>{{accountGoods.title}}</span>
                          </div>
                          <div class="mbl-cper f28">￥{{accountGoods.price}}</div>
                          <div class="mbl-parea  f22">{{accountGoods.gameName}}</div>
                      </div>
                  </div>
              </div>
      </div>
    <div class="order-payment mt-20 bg-fff" v-if="financeChannels">
        <div class="japan-titl f30 fontbold px-25"><span class="current pl-25">支払い方法を選択してください。</span></div>
        <div class="orderpay-info px-25 pb-30">
            <ul class="ordmode">
                <li class="fl mb-25 mr-15" :class="{'active':payInfo.id===item.id}" v-for="(item, index) in financeChannels" :key="index" @click="payChose(item)"><a :class="{'paypal':item.name == 'PayPal'}" :title="item.name"></a></li>
              </ul>
              <div class="ordtips bg-f8 py-20 px-25"><p class=" f24 color-000">PayPalでのお支払いとなります。クレジットカードがご利用いただけます。お支払いは取引ページにて行えます。</p></div>
          </div>
      </div>
      <div class="order-gold mt-20 bg-fff">
        <div class="single ml-25 border-bottom py-20">
            <ul>
                <li><div class="odsglist fr f28"><span class="name fl color-666">商品代金</span><span class="price fr color-000">￥{{accountGoods.price}}</span></div></li>
                  <li><div class="odsglist fr f28"><span class="name fl color-666">決済手数料</span><span class="price fr color-000">￥{{parseInt(payInfo.serviceRate*accountGoods.price)}}</span></div></li>
              </ul>
          </div>
          <div class="orknot pl-25 ">
            <ul>
                <li><div class="odsglist fr f28"><span class="name fl color-666">支払額</span><span class="price fr color-m1">￥{{parseInt(accountGoods.price+payInfo.serviceRate*accountGoods.price)+payInfo.offset||0}}</span></div></li>
              </ul>
          </div>
      </div>
      <div class="order-enter mt-20 p-25 bg-fff">
        <a class="enbuy-btn bg-m1 f30 color-fff" @click="orderCreate()">購入する</a>
      </div>
      <div class="dialog_cover opacity-75" style="z-index:9" v-if="dialog_cover">
        <div style="padding-top:5rem;text-align:center"><van-loading style="margin:auto" /></div>
      </div>
</div>
</template>

<script>
import Footer from '@/components/footer.vue'
import {mapActions,mapState} from 'vuex'
export default {
  components:{
    Footer
  },
  data () {
    return {
      goodsId:this.$route.query.goodsId,
      orderId:this.$route.query.orderId,
      accountGoods: {},
      financeChannels: [],
      payInfo: {},
      dialog_cover:false
    }
  },
  created () {
    this.$bus.emit("title", 'お支払い')
    this.$bus.emit("showTopRight", false)
    this.init()
  },
  methods: {
    async init () {
      if (!this.purchase) {
        await this.getPurchase({goodsId:this.goodsId})
      }
      this.accountGoods = this.purchase.accountGoods
      this.financeChannels = this.purchase.financeChannels
      this.payInfo = this.financeChannels[0]
    },
    payChose (item, index) {
      if (this.payInfo.id === item.id) {
        return
      }
      this.payInfo = item
    },
    orderCreate () {
      let params = {
        financeChannelId: this.payInfo.id,
        goodsId:this.goodsId
      }
      if (this.orderId) {
        params = {
          financeChannelId: this.payInfo.id,
          orderId: this.orderId
        }
      }
      this.dialog_cover = true
      this.getOrder(params).then(res => {
          if (res && res.data) {
          this.$router.push({name:'Pay',query: {orderId:res.data.orderId}})
        } else {
          this.$toast('注文の作成に失敗しました')
          this.dialog_cover = false
        }
      })
    },
    ...mapActions({
      getPurchase: 'GET_PURCHASE',
      getOrder: 'GET_ORDER',
    })
  },
  computed: {
    ...mapState({
      purchase:state => {
        return state.purchase
      }
    })
  },
}
</script>
<style>
@import '~css/common/order.css';
</style>
