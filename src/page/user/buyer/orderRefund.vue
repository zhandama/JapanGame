<template>
<div class="index-record mt-97">
    <div class="record-conn" v-if="info">
        <div class="demolist py-25 pl-25 bg-fff">
          <div class="mbgmes-img fl"><img :src="info.goodsImageUrl"></div> 
          <div class="mbgmes-con mbgmes-ico pl-25 pr-20">
            <div class="mbl-title f28 color-000"><span>{{info.goodsTitle}}</span>
              <div class="like" v-if="info.userGoodsCollectionVO" :class="{'active':info.userGoodsCollectionVO.userCollection}" @click.stop="likeAdd(info)">
                  <i></i>
                  <em class="f24 color-666" v-if="info.userGoodsCollectionVO.collectionNum>0">×{{info.userGoodsCollectionVO.collectionNum}}</em>
              </div>
            </div>
            <div class="mbl-cper f28">￥{{info.goodsPrice}}</div> 
            <div class="mbl-parea  f22">{{info.goodsDescription}}</div>
          </div>
        </div>
    </div>
    <div class="japan-titl f28 px-25 mt-20 bg-fff">
        <span class="current pl-25">返金の原因</span>
    </div>
    <div class="cause-refund bg-fff">
        <textarea name="" id="" class="cause-textarea f28" placeholder="返金の原因を入力してください" v-model="params.orderRefundReason" maxlength="255"></textarea>
        <div class="upload">
            <div class="upload-img-list bg-fff mt-79 px-25 pt-30 clearfix">                          
                <div class="fl mb-30 img-list-item" v-for="(item,index) in params.orderRefundImages" :key="index">
                    <img :src="item" alt="">
                    <i class="del-img" @click="delImg(index)"></i>
                </div>
                <div class="fl mb-30 add-img" v-show="params.orderRefundImages.length<3">
                    <label>
                        <Upload @addImg="addImg" maxLength='3' ref="upload"/>
                    </label>
                </div>
            </div>
        </div>
    </div>
    <div class="submit mt-20 bg-fff">
        <a @click="subRefund()" class="submit-info f32 color-fff">提出する</a>
    </div>
</div>
</template>

<script>
import Upload from '@/components/upload.vue'
import Footer from '@/components/footer.vue'
export default {
  components:{
    Upload,
    Footer
  },
  data () {
    return {
      info:'',
      params: {
        orderId: this.$route.query.orderId,
        orderRefundReason: '',
        orderRefundImages: []
      }
    }
  },
  created () {
    this.$bus.emit("title", '返金を申請する')
    this.$bus.emit("showTopRight", true)
    this.init()
  },
  methods: {
    init () {
      this.$api.order.orderInfo({orderId:this.params.orderId}).then(res => {
        if (res && res.data) {
          this.info = res.data
        }
      })
    },
    addImg (list) {
      this.params.orderRefundImages.push(list)
    },
    delImg(index) {
      this.params.orderRefundImages = this.params.orderRefundImages.filter((x,idx)=>idx!=index)
      this.$refs.upload.delImg(index)
    },
    async likeAdd(item) {
      let params = {
        collectOrCancelType: item.userGoodsCollectionVO.userCollection?-1:1,
        goodsId: item.goodsId
      }
      
      await this.$api.goods.collect(params).then((res) => {
        if (res&&res.code=='00') {
          item.userGoodsCollectionVO.collectionNum = item.userGoodsCollectionVO.collectionNum + params.collectOrCancelType
          item.userGoodsCollectionVO.userCollection = !item.userGoodsCollectionVO.userCollection
        }
      })
    },
    subRefund () {
      this.$api.order.refund(this.params).then(res => {
        if (res && res.data) {
          this.$router.push({name:'OrderBuy',query:{status:2}})
        }
      })
    } 
  }
}
</script>
<style>
@import '~css/common/apply.css';
</style>
