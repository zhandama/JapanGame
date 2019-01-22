<template>
  <div class="help-main pb-100 mt-97">
    <div class="helplist-info">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" @load="onLoad">
        <ul style="min-height:5rem" v-if="list.length>0">
          <li class="pl-25 bg-fff" v-for="(item,index) in list" :key='index'>
              <div class="helplist-boxs">	
                    <div class="helplist-titl border-bottom" @click="open(item)">
                      <span class="f28 color-000 fontbold mr-25 pr-25" :class="{'help-up':item.open,'help-down':!item.open}">
                        {{item.question}}
                      </span>
                      </div>
                    <div class="helplist-conn border-bottom py-25 pr-25" v-show="item.open">
                      <div class="helplist-deta py-10 px-30">
                          <p class="f28 color-000" v-html="item.answer"></p>
                            <!-- <span class="deta color-m2 f28 pl-25">無料会員登録をする</span> -->
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      params:{
        parentId: this.$route.query.parentId,
        page:0,
        size:20
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
    this.$bus.emit("title", this.$route.query.name)
    this.$bus.emit("showTopRight", true)
  },
  methods: {
    init () {
      this.getList('init')
    },
    onRefresh (){
      this.init()
    },
    onLoad () {
      if (this.list.length < this.total){
        this.params.page ++
        this.getList()
      } else {
        this.finished = true
        this.loading = false
      }
    },
    getList (type) {
      if (type==='init') {
        this.list = [],
        this.params.page = 0
      }
      this.$api.user.answerList(this.params).then((res) => {
        this.loading = false
        this.refreshing = false
        if (res && res.data && res.data.list && res.data.list.length>0) {
          this.total = res.data.total
          this.list = this.list.concat(res.data.list)
          // this.list[0].open = true
        } else {
          this.finished = true
        }
      })
    },
    open (item) {
      this.$set(item, 'open', !item.open)
    }
  }
}
</script>
<style>
@import '~css/common/help.css';
</style>
