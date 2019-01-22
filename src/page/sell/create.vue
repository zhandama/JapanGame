<template>
  <div>
    <div class="all-detail mt-97 ">
        <div class="bg-fff pt-15 mb-20">
            <div class="record-titl f28 color-333 px-25 ">画像をアップロードする</div>
            <div class="upload">
                <div class="upload-img-list bg-fff mt-79 px-25 pt-30 clearfix">
                    <div class="fl mb-30 img-list-item" v-for="(item,index) in params.goodsImageUrls" :key="index">
                        <img :src="item" alt="">
                        <i class="del-img" @click="delImg(index)"></i>
                    </div>
                    <div class="fl mb-30 add-img" v-show="params.goodsImageUrls.length<10">
                        <label>
                          <Upload @addImg="addImg" ref="upload"/>
                        </label>
                    </div>
                </div>
            </div>
            <p class="img-ts color-666 f24 text-right pr-25">※画像は10枚まで追加できます</p>
        </div>
        <!-- <div class="bg-fff pt-15 mb-20">
            <div class="record-titl f28 color-333 px-25">カテゴリー</div>
            <div class="order-container bg-fff f28 pb-20" @click="gameTypeShow()">
                <span class="span-icon-xinhao color-000 pl-25">アカウントデータ</span>
                <i class="toRight fr mr-25"></i>
            </div>
        </div> -->
        <div class="bg-fff pt-15 mb-20">
            <div class="record-titl f28 color-333 px-25">商品名 / 詳細説明</div>
            <div class="order-container bg-fff f28  pb-20">
                <div class="commodity-name f28 border-bottom">
                    <input type="text" v-model="params.title" placeholder="アカウント名（50文字以内）" maxlength="50">
                </div>
                <textarea class="text-area f28" v-model="params.description" placeholder="アカウントの説明（2000文字以内）キャラクター、武器、ランク、課金額、プレイ日数など" maxlength="2000"></textarea>
            </div>
        </div>
        <div class="bg-fff pt-15 mb-20" v-if="property.length>0">
            <div v-for="(item,index) in property" :key="index" >
              <div class="record-titl f28 color-333 px-25">{{item.gamePropertyName.propertyName}}</div>
              <div class="order-container bg-fff f28  pb-15">
                  <div class="commodity-name f28 border-bottom">
                    <v-input v-if="item.gameProperty.userFillType==2" inputType="tel" :maxlength="14" :inputPlaceholder="item.gamePropertyName.propertyName+'を入力してください'" v-model.trim="item.propertyValue" />
                    <input v-if="item.gameProperty.userFillType==1" type="text" :placeholder="item.gamePropertyName.propertyName+'を入力してください'" v-model.trim="item.propertyValue" maxlength="200"/>
                    {{item.gamePropertyName.unitName}}
                  </div>
              </div>
            </div>
            <div class="record-titl f28 color-333 px-25">価格</div>
            <div class="order-container bg-fff f28  pb-15">
                <div class="commodity-name f28">
                  <v-input inputType="tel" :maxlength="9" inputPlaceholder="価格（半角数字）" v-model.trim="params.price" />
                  円
                </div>
            </div>
        </div>
        <div class="sale-order bg-fff mt-20">
            <div class="sale-order-choose text-center" :class="{active:agreement}" @click="agreement=!agreement">
                <i class="icon"></i>
                <em class="title f24 color-000 ml-20">チート行為を一切行なっていないことを誓います</em>
            </div>
            <p class="sure-btn pt-20">
                <a @click="publish" class="sellbtn">出品する</a>
            </p>
        </div>
    </div>
    <!-- 提示弹窗 -->
    <div class="mint-toast is-placemiddle">
        <i class="poprmts"></i>
        <span class="mint-toast-text ml-15">商品名を記入してください</span>
    </div>
    <!-- 下拉选择 -->
    <div class="bottom-bomb bomb-danxuan bg-f1" v-if="show">
        <div class="bomb-title border-bottom border-top bg-fff">
            <h1 class="f32 color-666 text-center">カテゴリー</h1>
            <i class="bomb-close" @click="hide"></i>
        </div>
        <div class="bomb-content bg-fff">
            <ul class="bomb-li-item ">
                <li class="border-bottom active">
                    アカウントデータ
                    <i class="gou"></i>
                </li>
                <li class="border-bottom">
                    アカウントデータ
                    <i class="gou"></i>
                </li>
            </ul>
        </div>
    </div>
    <div class="dialog_cover opacity-75" @click="hide" v-if="dialog_cover"></div>
  </div>
</template>

<script>
import HeadSearch from '@/components/headSearch.vue'
import Upload from '@/components/upload.vue'
import ChoseGame from '@/components/choseGame.vue'
import Footer from '@/components/footer.vue'
import {mapState} from 'vuex'
import inputCom from './input.vue'
export default {
  components:{
    HeadSearch,
    ChoseGame,
    Footer,
    Upload,
    'v-input': inputCom
  },
  data () {
    return {
      params:{
        title: '',
        price: '',
        description: '',
        goodsType: 1,
        goodsSource: 1,
        gameId: this.$route.query.gameId,
        gameName: this.$route.query.gameName,
        gameType: this.$route.query.gameType,
        goodsImageUrls: [],
      },
      goodsId: this.$route.query.goodsId,
      agreement: true,
      show: false,
      dialog_cover: false,
      property: [],
      goodsAttrs: []
    }
  },
  created () {
    if (!this.userInfo.beBindEmail||!this.userInfo.beBindPhone) { // 验证电话和邮箱绑定
      this.$dialog.alert({
        message: '未確認の電話またはメールボックス'
      }).then(() => {
        this.$router.push({name:'Info'})
      });
      return
    }
    if (this.goodsId) { // 根据goodsId判断是否是编辑
      this.editInit()
    } else if (this.params.gameId) {
      this.init()
    } else {
      this.$toast('this params wrong,init error')
      setTimeout(()=>{
        this.$router.back(-1)
      },2000)
    }
    this.$bus.emit("showTopRight", true)
  },
  computed: {
    ...mapState({
      userInfo:state => {
        return state.userInfo
      }
    })
  },
  methods: {
    init (){
      this.getProperty('init')
      this.$bus.emit("title", this.params.gameName)
    },
    editInit() { // 编辑模式
      this.$api.goods.info({goodsId:this.goodsId}).then((res) => {
        if (res&&res.code==='00'&&res.data) {
          let info = res.data
          this.params = {
            title: info.title,
            price: info.price,
            description: info.description,
            goodsType: 1,
            goodsSource: 1,
            gameId: info.gameId,
            gameName: info.gameName,
            gameType: info.gameType,
            goodsImageUrls: info.goodsImageUrls,
            goodsId: info.goodsId,
            id: info.id
          }
          this.goodsAttrs = info.goodsAttrs
          this.getProperty('init')
          this.$bus.emit("title", info.gameName)
        }
      })
    },
    getProperty () {
      let params = {
        gameId: this.params.gameId,
        tradeType: this.params.goodsType
      }
      this.$api.property(params).then(res=>{
        if (res&&res.code==='00'&&res.data) {
          this.property = res.data
          if (this.goodsId) { // 编辑模式动态属性赋值
            this.goodsAttrs.map(n=>{
              this.property.map(x=>{
                if (x.gameProperty.id===n.gameTradePropertyId) {
                  x.propertyValue = n.userFillAttrValue
                  x.id = n.id
                }
              })
            })
          }
        }
      })
    },
    publish() {
      if (this.propertyFilter()) {
        return
      }
      if (this.required()) {
        return
      }
      if (this.goodsId) {
        this.updatePublish()
      } else {
        this.createPublish()
      }
    },
    createPublish () {
      this.$api.goods.release(this.params).then((res) => {
        if (res&&res.code==='00') {
          this.$toast('正常にリリースされました')
          setTimeout(()=>{
            this.$router.push({name:'Goodslist',query:{gameName:this.params.gameName,gameId:this.params.gameId}})
          },2000)
        } else {
          this.$toast(res)
        }
      })
    },
    updatePublish () {
      this.$api.goods.update(this.params).then((res) => {
        if (res&&res.code==='00') {
          this.$toast('編集の成功')
          setTimeout(()=>{
            this.$router.push({name:'OrderSell'})
          },2000)
        } else {
          this.$toast(res)
        }
      })
    },
    propertyFilter () {
      let list = []
      for (let i in this.property) {
        let property = {
          attrName: this.property[i].gamePropertyName.propertyName,
          attrUnitName: this.property[i].gamePropertyName.attrUnitName||'',
          gameTradePropertyId: this.property[i].gameProperty.id,
          userFillAttrValue: this.property[i].propertyValue||'',
          id: this.property[i].id||''
        }
        if ((!this.property[i].propertyValue||this.property[i].propertyValue.length<1)&&this.property[i].gameProperty.required) {
          this.$toast(this.property[i].gamePropertyName.propertyName+'を記入してください')
          return true
        }
        list.push(property)
      }
      this.params.goodsAttrs = list
      return false
    },
    required () {
      for (let key in this.params) {
        if (this.params[key].length <1) {
          if (key==='goodsImageUrls') {
            this.$toast('画像をアップロードしてください')
            return true
          } else if (key==='title') {
            this.$toast('商品名を記入してください')
            return true
          } else if (key==='description') {
            this.$toast('説明を記入してください')
            return true
          } else if (key==='price') {
            this.$toast('価格を記入してください')
            return true
          }
        }
        if (key==='price' && this.params[key]<='0') {
          this.$toast('価格を記入0より大きくなければならない')
          return true
        }
      }
      if (!this.agreement) {
        this.$toast('リリースの条件に同意することを選択してください')
        return true
      }
      return false
    },
    addImg (list) {
      this.params.goodsImageUrls.push(list)
    },
    delImg(index) {
      this.params.goodsImageUrls = this.params.goodsImageUrls.filter((x,idx)=>idx!=index)
      this.$refs.upload.delImg(index)
    },
    gameTypeShow () {
      this.show = !this.show
      this.dialog_cover = true
    },
    hide () {
      this.show = false
      this.dialog_cover = false
    },
  }
}
</script>
<style>
@import '~css/common/sell.css';
</style>
