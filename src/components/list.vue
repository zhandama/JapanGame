<template>
  <div class="demolist py-25 bg-fff border-top" :class="[pl,mb]" v-if="item" @click="goDetail(item)">
    <div class="mbgmes-img fl">
      <img :src="item.goodsImageUrl" v-if="item.goodsImageUrl">
      <div class="img_bj bg-000"></div>
      <div class="img-text f24 color-fff text-center" :class="{'ke':item.goodsType==1&&showTag,'dai':item.goodsType==3&&showTag,'soid':item.goodsStatus!=1&&showTag}">{{goodsTypeFilter(item)}}</div>
    </div>
    <div class="mbgmes-con mbgmes-ico pl-25 mr-25">
      <div class="mbl-title f28 color-000">
        <span><em v-if="item.stockNum==0">【終了】</em>{{item.title}}</span>
        <div class="like" v-if="item.userGoodsCollection" :class="{'active':item.userGoodsCollection.userCollection}" @click.stop="likeAdd(item)">
          <i></i>
          <em class="f24 color-666" v-if="item.userGoodsCollection.collectionNum!=0">×{{item.userGoodsCollection.collectionNum}}</em>
        </div>
      </div>
      <div class="mbl-hotpot" v-if="item.goodsAttrs">
        <span class="pthot f22 fl" v-for="(attr, index) in item.goodsAttrs" :key="index" v-show="attr">{{attr.attrName}}：{{attr.userFillAttrValue}}</span>
      </div>
      <div class="mbl-cper f28">￥{{item.price|toThousands}}</div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { toThousands } from './filter'
export default {
  name: 'List',
  props: {
    item: {
      default: ''
    },
    pl: {
      default: ''
    },
    reflesh: {
      default: ''
    },
    mb: {
      default: 'mb-20'
    }
  },
  data() {
    return {
      showTag: true
    }
  },
  computed: {
    ...mapState({
      isLogin: state => {
        return state.isLogin
      },
    })
  },
  created() {
    if (this.$route.name=='OrderSell') {
      this.showTag = false
    }
  },
  methods: {
    async likeAdd(item) {
      let params = {
        collectOrCancelType: item.userGoodsCollection.userCollection ? -1 : 1,
        goodsId: item.goodsId
      }
      if (!this.isLogin) {
        let query = this.$route.query
        query.returnName = this.$route.name
        this.$router.push({ name: 'Login', query })
        return
      }
      await this.$api.goods.collect(params).then((res) => {
        if (res && res.code == '00') {
          if (this.reflesh) {
            this.reflesh()
          }
          item.userGoodsCollection.collectionNum = item.userGoodsCollection.collectionNum + params.collectOrCancelType
          item.userGoodsCollection.userCollection = !item.userGoodsCollection.userCollection
        }
      })
    },
    goodsTypeFilter (item) {
      if (!this.showTag) {
        return ''
      }
      if (item.goodsType==1&&item.goodsStatus==1) {
        return '売'
      } else if (item.goodsType==1&&item.goodsStatus!=1) {
        return 'SOLD'
      } else if (item.goodsType==3&&item.goodsStatus==1) {
        return '貸'
      }
    },
    goDetail(item) {
      if (this.$route.name === 'Detail') {
        this.$router.replace({ name: 'Detail', query: { gameName: item.gameName, goodsId: item.goodsId } })
      } else {
        this.$router.push({ name: 'Detail', query: { gameName: item.gameName, goodsId: item.goodsId } })
      }
    }
  },
  filters: {
    toThousands,
  }
}
</script>
<style>
/* @import '~css/common/list.css'; */
</style>
