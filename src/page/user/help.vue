<template>
  <!-- <div class="index-record mt-97">
    <div class="record-conn">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" @load="onLoad">
        <div v-if="list.length>0" v-for="(item,index) in list" :key='index'>
          <List :item="item" pl="pl-25" :reflesh="init"/>
        </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div> -->
<div class="help-main pb-100" style="margin-top:.97rem;">
  <div class="help-info">
        <ul>
          <router-link :to="{name:'HelpList',query:{parentId:item.id,name:item.consultTitle}}" v-for="(item, index) in questionList" :key="index">
            <li class="pl-25 bg-fff">
                <div class="help-list border-bottom py-25 pr-25">
                    <div class="help-upic fl help-upic1">
                      <!-- <i :class="['hpico0'+(index-1+2)]"></i> -->
                      <i class="hpico"><img :src="item.imageUrl" /></i>
                    </div>
                    <div class="help-conn">
                        <div class="help-titl f32 color-000 fontbold">{{item.consultTitle}}</div>
                        <div class="help-ptxt f24">{{item.description}}</div>
                    </div>
                </div>
            </li>
          </router-link>
        </ul>
    </div>
    <div class="help-info mt-20">
        <ul>
          <router-link :to="{name:'Chat'}">
            <li class="pl-25 bg-fff">
                <div class="help-list py-25 pr-25">
                    <div class="help-upic fl"><i class="hpico"><img src="~img/icon/help-u07.png"></i></div>
                    <div class="help-conn">
                        <div class="help-titl f32 color-000 fontbold">オンラインサービス</div>
                        <div class="help-ptxt f24">こんにちは、何かお手伝いしますか。</div>
                    </div>
                </div>
            </li>
          </router-link>
        </ul>
    </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      questionList:[],
      total:0
    }
  },
  created () {
    this.init()
    this.$bus.emit("title", 'よくある質問')
    this.$bus.emit("showTopRight", true)
  },
  methods: {
    init () {
      this.$api.user.questionList().then(res => {
        if (res && res.data) {
          this.questionList = res.data.list
        }
      })
    },
  }
}
</script>
<style>
@import '~css/common/help.css';
</style>
