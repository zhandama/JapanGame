<template>
  <div class="mt-97">
    <div class="jpdetail-banner">
      <ul class="slides" v-if="info.goodsImageUrls">
        <van-swipe :autoplay="3000" v-if="info.goodsImageUrls">
          <van-swipe-item v-for="(item, index) in info.goodsImageUrls" :key="index" class="banner-img">
            <li @click="openImg(info.goodsImageUrls)"><img :src="item"></li>
          </van-swipe-item>
        </van-swipe>
      </ul>
    </div>
    <div class="jpdetail-assct bg-fff px-20 pt-25 pb-30">
      <div class="assct-titl f30 color-000">{{info.title}}</div>
      <div class="assct-price mt-20 f32 color-m1">￥{{info.price|toThousands}}</div>
      <div class="assct-enter mt-25 f30" ref="assctBtn"><a class="bg-m1 color-fff assct-btn" @click="goOrder()" v-if="info.stockNum!=0&&(userInfo.id!=info.sellerId)">購入手続きへ</a></div>
      <div class="assct-state mt-25 f30" v-if="info.userGoodsCollection"><a class="border fl" :class="{active:info.userGoodsCollection.userCollection}" @click="likeAdd(info)"><span class="good">いいね<em v-if="info.userGoodsCollection.collectionNum>0">x{{info.userGoodsCollection.collectionNum|collectionNum}}</em></span></a><a class="border fr" @click="goIm()"><span class="contact">売り手に連絡する</span></a></div>
    </div>
    <div class="jpdetail-ware bg-fff mt-20">
      <div class="ware-titl f30"><a class="wrnav fl" :class="{'active':showInfo}" @click="showInfo = true">商品詳細</a><a class="wrnav fl" :class="{'active':!showInfo}" @click="showInfo = false">取引の流れ</a></div>
      <div class="ware-info" v-if="showInfo">
        <div class="ware-content px-25 py-15">
          <h2 class="f28 fontbold">商品の説明</h2>
          <p class="cn-text f28 color-000">{{info.description}}</p>
        </div>
        <div class="ware-trend pl-25" v-if="info.goodsAttrs">
          <ul v-if="info.goodsAttrs.length>0">
            <li class="border-top f28 color-000" v-for="(item, index) in info.goodsAttrs" :key="index">
              <div class="trend-name fontbold fl">{{item.attrName}}</div>
              <div class="trend-boxs fl">{{item.userFillAttrValue}}</div>
            </li>
          </ul>
        </div>
        <!-- <div class="ware-violate ml-25 pr-25 border-top"><a class="violate-ico f28 color-m1" >違反報告をする</a></div> -->
      </div>
      <div class="jpflow-info"  v-if="!showInfo">
        <div class="flowpic"><img src="~img/jpflow01.jpg"></div>
          <div class="flowpic"><img src="~img/jpflow02.jpg"></div>
          <div class="flowpic01"><img src="~img/jpflow03.jpg"></div>
          <div class="flowpic01"><img src="~img/jpflow04.jpg"></div>
      </div>
    </div>

    <div class="jpdetail-product bg-fff mt-20 ">
      <div class="japan-titl f30 fontbold px-25"><span class="current pl-25">出品者</span></div>
      <div class="product-info pl-25">
        <div class="product-head border-bottom py-25">
          <div class="product-pic fl"><img src="~img/product-pic.png"></div>
          <div class="product-name fl ml-25"><span class="use-name f28 color-000">{{info.sellerNickName}}</span></div>
        </div>
        <div class="product-authen py-20">
          <div class="authen-tion fl f24 color-666">本人確認</div>
          <div class="authen-rial fl f28">
            <span class="firm color-000">メールアドレス認証済み</span>
            <span class="firm color-000">電話番号認証済み</span>
          </div>
        </div>
      </div>
    </div>
    <div class="jpdetail-payment bg-fff mt-20 pb-20 " :class="{'pb-200':similarList.length<=0}">
      <div class="japan-titl f30 fontbold px-25"><span class="current pl-25">お支払い方法</span></div>
      <div class="payment-info">
        <div class="paymode-pic"><img src="~img/paymode-pic.png"></div>
        <div class="paymode-txt pb-15">
          <p class="f28 color-000 text-center">商品の引き渡しが確認できるまで、運営が代金を<br>
            <em class="color-m1">一旦お預かり</em>します。
          </p>
        </div>
      </div>
    </div>

    <div class="index-record mt-20 bg-fff pb-200"  v-if="similarList.length>0">
      <div class="japan-titl f30 fontbold px-25"><span class="current pl-25">モンストのその他のアカウントデータ</span></div>
      <div class="record-conn" v-if="similarList.length>0">
        <div  v-for="(item,index) in similarList" :key='index'>
          <List :item="item" pl="pl-25" />
        </div>
        <div class="tab-more py-20">
          <router-link class="more f28 color-666" :to="{name:'Goodslist',query:{gameId:info.gameId,gameName:info.gameName}}">モンストのその他のアカウントデータ</router-link>
        </div>
      </div>

    </div>
    <div class="jpdetail-bottom fixed-bottom" v-if="showBottom">
      <a class="fl house bg-fff pt-10 f24 color-000" v-if="info.userGoodsCollection" :class="{active:info.userGoodsCollection&&info.userGoodsCollection.userCollection}" @click="likeAdd(info)"><i class="house-ico"></i>いいね<em v-if="info.userGoodsCollection.collectionNum>0">x{{info.userGoodsCollection.collectionNum}}</em></a>
      <a class="fl touch bg-m2 f32 color-fff" @click="goIm()" :class="{'width82':info.stockNum==0||userInfo.id==info.sellerId}">売り手に連絡する</a>
      <a class="fl purch bg-m1 f32 color-fff" @click="goOrder()" v-if="info.stockNum!=0&&userInfo.id!=info.sellerId">購入手続きへ</a>
    </div>
    <div class="dialog-box bg-fff" style="z-index:11;" v-if="RZshow">
      <div class="dialog-main">
          <div class="dialog-titl f28 color-000"><a class="close" @click="RZshow = false"></a>本登録・電話番号認証のお願い</div>
            <div class="dialog-body px-30">
              <div class="dialog-tips py-15">
                  <div class="tips-shield fl"></div>
                    <div class="tips-conter fl pr-30"><p class="f24 color-000">皆様が安心して売買ができるように、すべてのユーザー様に本登録・電話番号認証をお願いしております。</p></div>
                </div>
                <div class="dialog-info pt-10">
                    <div class="dialog-step py-20 border-bottom active">
                        <div class="step-titl f30"><span class="fontbold fontarial">STEP1</span><em class="f22 pl-20">最短20秒！</em></div>
                        <div class="step-conn f28 color-999"><i class="select fl"></i>本登録完了</div>
                    </div>
                    <div class="dialog-step py-20 border-bottom">
                        <div class="step-titl f30"><span class="fontbold fontarial">STEP2</span><em class="f22 pl-20">最短10秒！</em></div>
                        <div class="step-conn f28 color-999"><i class="select fl"></i>{{RZtext}}</div>
                        <div class="step-phle f24 pl-30" @click="goInfo()"><i class="phle-ico fl"></i>{{RZtext}}</div>
                    </div>
                </div>
                <div class="dialog-after p-30"><p class="pb-20 f28 color-000">本登録・メールアドレスそして電話番号認証を完了させると売買が可能になります！</p></div>
            </div>
        </div>
    </div>
    <div class="slides-big" style="z-index:3030;height:1rem" v-if="showClose">
      <div class="slidesbig-titl">
          <div class="sdtitl-info">
            <span class="slide-conn f32 color-fff"><a class="sdbig-close fr" @click="closeBigImg()"></a></span>
          </div>
      </div>
    </div>
    <div class="dialog_cover opacity-75" style="z-index:9" v-if="RZshow" @click="RZshow = false"></div>
  </div>
</template>

<script>
import HeadSearch from '@/components/headSearch.vue'
import ChoseGame from '@/components/choseGame.vue'
import Footer from '@/components/footer.vue'
import List from '@/components/list.vue'
import { toThousands } from '@/components/filter'
import { Swipe, SwipeItem, ImagePreview } from 'vant'
import { mapActions, mapState } from 'vuex'
export default {
  components: {
    HeadSearch,
    ChoseGame,
    Footer,
    List,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
  },
  data() {
    return {
      params: {
        goodsId: this.$route.query.goodsId
      },
      info: [],
      similarList: [],
      RZshow: false,
      showBottom: false,
      showInfo: true,
      showClose: false,
      instance: ''
    }
  },
  created() {
    this.init()
  },
  computed: {
    ...mapState({
      isLogin: state => {
        return state.isLogin
      },
      userInfo: state => {
        return state.userInfo
      }
    })
  },
  watch: {
    $route(route) {
      this.init()
    }
  },
  beforeRouteLeave (to, from, next) {
    window.removeEventListener('scroll', this.handleScroll)
    if (to.name == "Goodslist") {
      to.meta.keepAlive = true;
    } else {
      to.meta.keepAlive = false;
    }
    next()
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    async init() {
      this.params.goodsId = this.$route.query.goodsId
      this.info = []
      this.getInfo()
      this.$bus.emit("title", this.$route.query.gameName)
      this.$bus.emit("showTopRight", true)
      if (!this.isLogin) {
        await this.getUserInfo().then()
      }
      if (!this.userInfo.beBindEmail) {
        this.RZtext = 'メールアドレス認証'
      } else if (!this.userInfo.beBindPhone) {
        this.RZtext = '電話番号認証'
      }
    },
    handleScroll () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > (this.$refs.assctBtn.offsetTop + 50)) {
        this.showBottom = true
      } else {
        this.showBottom = false
      }
    },
    getSimilarList(params) {
      this.$api.goods.similarList(params).then((res) => {
        if (res && res.data && res.data.list) {
          this.similarList = res.data.list
        }
      })
    },
    getInfo() {
      this.$api.goods.info(this.params).then((res) => {
        if (res && res.data) {
          this.info = res.data
          this.setGoodsHistory(this.info)
          this.getSimilarList({ goodsId: this.info.goodsId, page: 0, size: 5 })
        }
      })
    },
    openImg(imgList) {
      this.showClose = true
      this.instance = ImagePreview({
        images: imgList,
        startPosition: 0,
        asyncClose: true
      })
    },
    closeBigImg () {
      this.showClose = false
      this.instance.close();
    },
    async likeAdd(item) {
      if (!this.isLogin) {
        let query = this.$route.query
        query.returnName = this.$route.name
        this.$router.push({ name: 'Login', query })
        return
      }
      let params = {
        collectOrCancelType: item.userGoodsCollection.userCollection ? -1 : 1,
        goodsId: item.goodsId
      }
      await this.$api.goods.collect(params).then((res) => {
        if (res && res.code == '00') {
          item.userGoodsCollection.collectionNum = item.userGoodsCollection.collectionNum + params.collectOrCancelType
          item.userGoodsCollection.userCollection = !item.userGoodsCollection.userCollection
        }
      })
    },
    goIm() {
      if (this.userInfo && this.userInfo.id === this.info.sellerId) {
        this.$toast('自分に連絡できません') // 不能联系自己
        return
      }
      this.$router.push({ name: 'Chat', query: { goodsId: this.info.goodsId } })
    },
    goInfo () {
      let query = this.$route.query
      this.$router.push({ name: 'Info', query })
    },
    goOrder() {
      let query = this.$route.query
      if (!this.isLogin) {
        query.returnName = this.$route.name
        this.$router.push({ name: 'Login', query })
        return
      }
      if (!this.userInfo.beBindPhone||!this.userInfo.beBindEmail) {
        // this.$router.push({ name: 'Info', query })
        this.RZshow = true
        return
      }
      this.getPurchase({ goodsId: this.info.goodsId }).then(res => {
        if (res && res.data && !res.data.haveUnPayOrder) {
          this.$router.push({ name: 'Order', query: { goodsId: this.info.goodsId } })
        } else if (res && res.data && res.data.haveUnPayOrder) {
          this.$dialog.confirm({
            message: '未払い注文があります', // 已经存在未支付订单，去支付
            confirmButtonText: 'はい',
            cancelButtonText: 'いいえ'
          }).then(() => {
            this.$router.push({ name: 'OrderBuy' })
          }).catch(() => {
            // on cancel
          });
        }
      }, err => {
        this.$toast(err)
      })
    },
    setGoodsHistory(item) {
      if (localStorage) {
        var goodsHistory = []
        if (localStorage.goodsHistory) {
          goodsHistory = JSON.parse(localStorage.goodsHistory)
        }
        goodsHistory = goodsHistory.filter(x => x && x.goodsId && x.goodsId != item.goodsId)
        goodsHistory.unshift(item)
        if (goodsHistory.length > 50) {
          goodsHistory = goodsHistory.slice(0, 50)
        }
        localStorage.setItem("goodsHistory", JSON.stringify(goodsHistory))
      }
    },
    ...mapActions({
      getUserInfo: 'GET_USER',
      getPurchase: 'GET_PURCHASE',
    })
  },
  filters: {
    toThousands,
    collectionNum(num) {
      if (num > 9999) {
        num = Math.floor((num / 10000) * 100) / 100 + 'w'
      }
      return num
    }
  }
}
</script>
<style>
@import "~css/common/detail.css";
.width82{width:82% !important}
.van-image-preview__index{z-index:999}
</style>
