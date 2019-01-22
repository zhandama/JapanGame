<template>
<div class="siteinfo-main pb-100" style="margin-top:.97rem;">
  <div v-if="!id">
    <div class="site-boxs pt-15 bg-fff">
      <span class="boxs-lg"></span>
    </div>
    <div class="site-info bg-fff" v-if="list">
      <router-link v-for="(item, index) in list" :key="index" :to="{name:'SiteInfo',query:{id:item.id}}">
        <div class="site-list border-bottom ml-30"><span class="name f30 color-000 fl">{{item.subject}}</span><i class="rgt-ico fr"></i></div>
      </router-link>
    </div>
  </div>
  <div v-if="id && detail">
    <div class="privacy-boxs bg-fff m-25">
      <div class="pv-text f28 color-000 " v-html="detail.content">
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      list: '',
      id: '',
      detail: ''
    }
  },
  watch: {
    $route(route) {
      this.init()
    }
  },
  created () {
    this.$bus.emit("showTopRight", true)
    this.init()
  },
  methods: {
    init () {
      this.id = this.$route.query.id
      if (this.id) {
        this.getDetail()
      } else {
        this.$bus.emit("title", 'サイト情報')
        this.getList()
      }
    },
    getList () {
      this.$api.user.info().then(res => {
        if (res && res.data) {
          this.list = res.data
        }
      })
    },
    getDetail () {
      this.$api.user.infoDetail({id:this.id}).then(res => {
        if (res && res.data) {
          this.detail = res.data
          this.$bus.emit("title", this.detail.subject)
        }
      })
    }
  }
}
</script>
<style>
@import '~css/common/siteinfo.css';
</style>
