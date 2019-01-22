<template>
<div class="mt-97 history">
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh" >
    <van-list v-model="loading" :finished="finished" @load="onLoad">
      <div class="list bg-fff mb-20" v-for="(item, index) in list" :key="index">
          <div class="ml-25 border-bottom list-time f24">
              <span class="mr-25">申請日</span>
              <em>{{item.createTime|formatTimeFilter}}，</em>
              <span class="mr-25">入金日</span>
              <em>2018年11月07日</em>
          </div>
          <div class="ml-25 border-bottom list-money py-15 f28">
              <p class="fontbold">金額 ￥{{item.withdrawAmount}} ，入金
                  <em class="red">￥{{item.withdrawAmount-item.serviceFee}}</em>
              </p>
              <p class="">銀行振込：{{item.openBankName||item.bankName}}</p>
          </div>
          <div class="assct-state py-20 f28">
              <a class="border fr px-25 mr-25" @click="refund(item)">
                  <span class="delete" >キャンセル</span>
              </a>
              <a class="border fr px-25 mr-25" @click="update(item)">
                  <span class="good" >編集する</span>
              </a>
          </div>
      </div>
    </van-list>
  </van-pull-refresh>
</div>
</template>

<script>
import {formatTimeFilter} from '@/components/filter'
export default {
  data () {
    return {
      params: {
        pageNum: 1,
        pageSize: 10
      },
      list: [],
      loading: true,
      finished: false,
      refreshing: false,
      total:0
    }
  },
  created () {
    this.$bus.emit("title", '申請履歴')
    this.$bus.emit("topRightText", '')
    this.getList('init')
  },
  methods: {
    onRefresh(){
      this.getList('init')
    },
    onLoad() {
      if (this.list.length < this.total){
        this.params.pageNum ++
        this.getList()
      } else {
        this.finished = true
        this.loading = false
      }
    },
    getList (type) {
      if (type==='init') {
        this.list = [],
        this.params.pageNum = 0
      }
      this.$api.user.record(this.params).then(res=> {
        this.loading = false
        this.refreshing = false
        if (res&&res.data&&res.data.list) {
          this.total = res.data.total
          this.list = this.list.concat(res.data.list)
        }
      })
    },
    refund (item) {
      let params = {
        withdrawId: item.withdrawId
      }
      this.$dialog.confirm({
        message: '入金申請をキャンセルしてよろしいでしょうか',
        confirmButtonText:'はい',
        cancelButtonText:'いいえ'
      }).then(() => {
        this.$api.user.refund(params).then(res=> {
          if (res&&res.code === '00') {
            this.$toast('操作が成功しました')
            this.getList('init')
          }
        })
      }).catch(() => {
        // on cancel
      });
    },
    update (item) {
      this.$store.commit('setBank', item)
      this.$router.push({name:'PutForward',query:{update:true}})
    }
  },
  filters: {
    formatTimeFilter
  }
}
</script>
<style>
@import '~css/common/put-forward.css';
</style>
