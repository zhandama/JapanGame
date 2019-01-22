<template>
<div class="mt-97">
    <div class="index-record mt-20 bg-fff">
        <div class="japan-titl f30 fontbold px-25"><span class="current pl-25">出品者：<em class="fontnobold">{{order.sellerNickName}}</em></span></div>
          <div class="record-conn">
                  <div class="demolist pb-25 pl-25 bg-fff border-bottom">
                      <div class="mbgmes-img fl">
                           <img :src="order.goodsImageUrl" v-if="order.goodsImageUrl">
                          <div class="img_bj bg-000"></div>
                          <div class="img-text f24 color-fff text-center" :class="{'ke':order.goodsType==1,'dai':order.goodsType==3}">{{order.goodsType==1?'売':'貸'}}</div>
                      </div>
                      <div class="mbgmes-con mbgmes-ico pl-25 mr-25">
                          <div class="mbl-title f28 color-000">
                              <span>{{order.goodsTitle}}</span>
                          </div>
                          <div class="mbl-cper f28">￥{{order.goodsPrice}}</div>
                          <div class="mbl-parea  f22">{{order.gameName}}</div>
                      </div>
                  </div>
              </div>
      </div>
    <div class="order-payment mt-20 bg-fff">
        <!-- <div class="japan-titl f30 fontbold px-25"><span class="current pl-25">支払い方法を選択してください。</span></div> -->
      </div>
      <div class="order-gold bg-fff">
        <div class="single ml-25 border-bottom py-20">
            <ul>
                <li><div class="odsglist fl f28"><span class="name fl color-666">商品代金</span><span class="price fr color-000">￥{{order.goodsPrice}}</span></div></li>
                  <li><div class="odsglist fl f28"><span class="name fl color-666">決済手数料</span><span class="price fr color-000">￥{{parseInt(order.financeChannelServiceFee)}}</span></div></li>
              </ul>
          </div>
          <div class="orknot pl-25 ">
            <ul>
                <li><div class="odsglist fl f28"><span class="name fl color-666">支払額</span><span class="price fr color-m1">￥{{parseInt(order.realPay)}}</span></div></li>
              </ul>
          </div>
      </div>
      <div class="order-enter mt-20 p-25 bg-fff">
        <a class="enbuy-btn bg-m1 f30 color-fff" @click="pay()">購入する</a>
          <!-- <a class="change-btn f30 color-666 border mt-25" @click="changePay()">お支払い方法を変更する</a> -->
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
      orderId:this.$route.query.orderId,
      dialog_cover:false
    }
  },
  created () {
    this.$bus.emit("title", 'お支払い')
    this.init()
  },
  methods: {
    async init () {
      if (!this.order||this.order.orderId!=this.orderId) {
        await this.$api.order.orderInfo({orderId:this.orderId}).then(res => {
          if (res && res.data) {
            this.$store.commit('setOrder', res.data)
          }
        })
      }
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
    changePay () {
      this.$router.push({name:'Order',query:{orderId: this.order.orderId, goodsId: this.order.goodsId}})
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
}
</script>
<style>
@import '~css/common/order.css';
</style>
