<template>
  <div>
    <!-- <div class="jplist-nav bg-fff f28 mt-97" style="z-index:2"><a class="jpnav active fl" href="#">アカウント販売</a><a class="jpnav fl" href="#">アカウントのレンタル</a></div> -->
    <div class="jplist-info fixed-top mt-97" style="z-index:1">
      <div class="jplist-menu bg-e8 py-15 pl-25 f30" ><a class="fl bg-fff mr-25 active" @click="sortShow()"><span class="menu-sortin">{{sort.name}}</span></a><a class="fl bg-fff" :class="{'active':params.fuzzyValue||params.dynamicAttributes.length>0||params.prices.length>0}" @click="clickFilter()"><span class="menu-seach">絞り込み</span></a></div>
        <div class="jplist-seach" v-if="sort.show">
          <!--默认排序-->
            <div class="sortin-mold bg-fff pl-25">
              <ul>
                <li class="f30 border-top" @click="sortChecked(item)" :class="{'active':item.id===params.orderByCode}" v-for="(item,index) in sort.list" :key="index"><span>{{item.name}}</span></li>
              </ul>
            </div>
        </div>
    </div>
    <div class="index-record " style="margin-top:1.9rem">
      <div class="record-conn" v-show="!filter.show">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh"  >
          <van-list v-model="loading" :finished="finished" @load="onLoad" >
            <div v-for="(item,index) in list" :key="index">
              <List :item="item" pl="pl-25"/>
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>
    <listFilter v-show="filter.show" :filterSearch="filterSearch" :clickFilter="clickFilter" :maxPrice="maxPrice" :filterlist="filter.list" v-if="filter.list.length > 0"/>
    <div class="dialog_cover opacity-75" @click="sortShow()" v-if="dialog_cover"></div>
    <div style="padding-top:3.5rem;text-align:center" v-if="list.length==0&&loading"><van-loading style="margin:auto" /></div>
  </div>
</template>

<script>
import List from '@/components/list'
import listFilter from './listFilter.vue'
export default {
  components:{
    List,
    listFilter
  },
  data () {
    return {
      params:{
        // dynamicAttributes: [ // 动态属性搜索入参模型
        //   {
        //     gameTradePropertyId: 4, 
        //     propertySectionId:1,
        //     userSelectValues: [
        //       10,1000
        //     ]
        //   }
        // ],
        dynamicAttributes: [],
        fuzzyValue: '', // 关键字模糊匹配
        gameId: this.$route.query.gameId,
        goodsType: 1, // 商品类型 1:账号 2:金币 3:租赁
        orderByCode: 5, // 0:默认 出售中在前 1:价格升序 2:价格降序 3:被收藏数量升序排序 4:被收藏数量降序排序 5:最近发布排序 6:最早发布排序
        page: 0,
        prices: [],
        size: 10
      },
      maxPrice:1000000,
      list:[],
      loading: true,
      finished: false,
      refreshing: false,
      total:0,
      gameType:this.$route.query.gameType||1,
      sort: {
        show: false,
        id:5,
        name: '新着順',
        list: [
          {name: '新着順', id:5},
          {name: '高い順', id:2},
          {name: '安い順', id:1},
          {name: 'ハイコレクション', id:4},
          // {name: 'ローコレクション', id:3},
          // {name: 'デフォルト', id:0},
        ]
      },
      filter:{
        show: false,
        list:[]
      },
      dialog_cover: false,
      fromName:''
    }
  },
  activated () { // 缓存初始化页面
    this.$bus.emit("title", this.$route.query.gameName)
    this.$bus.emit("showTopRight", true)
    if (this.params.gameId!=this.$route.query.gameId) {
      this.params.gameId = this.$route.query.gameId
      this.gameType = this.$route.query.gameType
      this.init()
    }
  },
  beforeRouteLeave(to, from, next) {
    from.meta.keepAlive = false;
    next();
  },
  mounted () { // 初始化页面
    this.$bus.emit("title", this.$route.query.gameName)
    this.$bus.emit("showTopRight", true)
    this.params.gameId = this.$route.query.gameId
    this.gameType = this.$route.query.gameType
    this.init()
  },
  methods: {
    init (){
      this.getList('init')
      this.getSectionList()
    },
    onRefresh(){
      this.init()
    },
    onLoad() {
      if (this.list.length < this.total){
        this.params.page ++
        this.getList()
      } else {
        this.finished = true
        this.loading = false
      }
    },
    getList(type) {
      if (type==='init') {
        this.list = [],
        this.params.page = 0
        this.total = 0
      }
      this.$api.goods.list(this.params).then((res) => {
        this.loading = false
        this.refreshing = false
        if (res&&res.data) {
          this.total = res.data.total
          this.list = this.list.concat(res.data.date)
        }
      })
    },
    filterSearch (params) {
      this.params.dynamicAttributes = []
      this.params.fuzzyValue = params.keywords
      params.filterlist.map(x => {
        if (x.checked) {
          var obj
          x.sectionServices.map (n => {
            if (n.checked) {
              obj = {
                gameTradePropertyId:x.gamePropertyId,
                propertySectionId: n.id,
              }
            }
          })
          this.params.dynamicAttributes.push(obj)
        }
      })
      if (params.price && params.price.checked) {
        this.params.prices = [params.price.min,params.price.max]
      }
      this.getList('init')
    },
    getSectionList () {
      this.$api.sectionList({gameId:this.params.gameId,tradeType:1}).then(res => {
        if (res && res.data) {
          this.filter.list = res.data
        }
      })
    },
    sortShow () {
      this.sort.show = !this.sort.show
      this.dialog_cover = !this.dialog_cover
    },
    sortChecked (item) {
      this.sort.name = item.name
      this.params.orderByCode = item.id
      this.init()
      this.sortShow()
    },
    clickFilter () {
      this.filter.show = !this.filter.show
    }
  } 
}
</script>
<style>
@import '~css/common/list.css';
</style>
