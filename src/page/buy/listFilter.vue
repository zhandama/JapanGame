<template>
  <div class="jpscreen-info fixed-top jpscreen-bj bg-f1" style="z-index:9">
    <!-- 头部 -->
    <div class="japan-header fixed-top border-bottom bg-f6" style="z-index:9">
      <div class="detail-top">
        <div class="top-back" @click="clickFilter">
          <a></a>
        </div>
        <h2 class="f32">絞り込み</h2>
      </div>
    </div>
    <div class="japn-leth">
      <!--关键字-->
      <div class="screen-keyword bg-fff p-25 mt-97">
        <div class="screen-titl color-467 f30"><span class="current pl-25">キーワードで絞り込む</span></div>
        <div class="keyword-conn mt-20">
          <input type="text" class="keybord-input color-000 f30" placeholder="キーワードから探す" v-model="keywords">
        </div>
      </div>
      <!--价格-->
      <div class="screen-price bg-fff p-25 mt-20">
        <div class="screen-titl color-467 f30"><span class="current pl-25">価格で絞り込む</span></div>
          <div class="price-boxs px-25">
            <div class="price-titl color-000 f24">価格：￥<i class="fontarial">{{price.min|toThousands}}</i> - ￥<i class="fontarial">{{price.max|toThousands}}</i></div>
              <div class="price-conn my-15 pr-25">
                <div class="pcecnn-flow" ref="flowRun">
                  <em class="fl xian01"></em>
                    <div class="flow-run">
                      <span class="flow-conn" :style="{'width':width1+'px'}"><i class="dem01 fl" @mousedown="start()" @touchstart="start()"  @mousemove="move('1', $event)"  @touchmove="move('1', $event)" @touchend="end()" @mouseup="end()"></i><em class="xian02"></em></span>
                      <span class="flow-tenp" :style="{'width':String(width2).indexOf('%')==-1? width2 +'px': width2}"><i class="dem02 fl"  @mousedown="start()" @touchstart="start()" @mousemove="move('2', $event)"  @touchmove="move('2', $event)" @touchend="end()" @mouseup="end()"></i><em class="xian03"></em></span>
                    </div>
                </div>
              </div>
          </div>
      </div>
      <!--玩家等级-->
      <div v-if="filterlist.length > 0">
        <div class="screen-grade bg-fff py-25 mt-20" v-for="(list, index) in filterlist" :key="index">
          <div class="screen-titl color-467 f30 px-25"><span class="current pl-25">{{list.gamePropertyName}}</span></div>
          <div class="grade-conn pl-25 pb-10">
            <ul>
              <li class="fl mt-20" :class="{'active':list.sectionServices.filter(x=>x.checked).length<=0}" @click="filterChose('',list)"><span class="border f28">全て</span></li>
              <li class="fl mt-20" :class="{'active':item.checked}" @click="filterChose(item,list)" v-for="(item, listIndex) in list.sectionServices" :key="listIndex"><span class="border f28">{{item.propertySectionName}}</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="screen-enter mt-20"><a class="screen-btn bg-09f f32 color-fff" @click="goFilter()">絞り込む</a></div>
    </div>
  </div>
</template>

<script>
import { toThousands } from '@/components/filter'
export default {
  name: 'ListFilter',
  props: ['clickFilter', 'filterlist', 'filterSearch','maxPrice'],
  data() {
    return {
      keywords:'',
      width1: '0',
      width2: '100%',
      price: {
        checked: false,
        min:0,
        max:this.maxPrice
      },
      startmove: false
    }
  },
  created() {
    
  },
  methods: {
    filterChose(item, list) {
      list.sectionServices.map(x => {
        this.$set(x, 'checked', false)
      })
      list.checked = false
      if (!item) {
        return
      }
      this.$set(item, 'checked', !item.checked)
      list.sectionServices.map(x => {
        if (x.checked) {
          list.checked = true
        }
      })
    },
    goFilter () {
      let params = {
        keywords: this.keywords,
        filterlist: this.filterlist,
        price: this.price
      }
      this.filterSearch(params)
      this.clickFilter()
    },
    onChange(value) {
      this.$toast('当前值：' + value);
    },
    start () {
      this.startmove = true
    },
    move (type, event) {
      if (!this.startmove) {
        return
      }
      event.preventDefault()
      var clientX = event.clientX-18||event.changedTouches[0].clientX-18
      var clientWidth = this.$refs.flowRun.clientWidth
      var maxW = (String(this.width2).indexOf('%')==-1 ? this.width2 : clientWidth) - 10, minW = this.width1 + 30

      if (type == 1 && clientX >= 0 && clientX <= maxW) {
        this.width1 = clientX
      } else if ( type == 1 && clientX > maxW) {
        this.width1 =  maxW 
      } else if ( type == 1 && clientX < clientWidth) {
        this.width1 = 0 
      }

      if (type == 2 && clientX >= minW && clientX <= clientWidth) {
        this.width2 = clientX
      } else if ( type == 2 && clientX > clientWidth) {
        this.width2 = clientWidth
      } else if ( type == 2 && clientX < minW) {
        this.width2 = minW
      }

      this.price.min = parseInt((this.width1/clientWidth) * this.maxPrice)
      this.price.max = parseInt(((String(this.width2).indexOf('%')==-1 ? this.width2 : clientWidth)/clientWidth) * this.maxPrice)
      this.price.checked = true
    },
    end (){
      this.startmove = false
    }
  },
  filters: {
    toThousands
  }
}
</script>
<style scoped>
.japn-leth {
  height: 100vh;
  overflow-y: scroll;
  padding-bottom: 1.2rem;
}
</style>