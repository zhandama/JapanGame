<template>
<div class="index-record mt-97">
    <div class="help-main pb-100" >
      <div class="feedback-titl bg-fff px-25 py-20">
          <p class="fdtxt f28 color-000 px-30 text-center"><em>よくある質問</em>に回答がないかご確認の上、お問い合わせください。</p>
        </div>
        <div class="feedback-info bg-fff mt-20">
          <ul>
              <li class="pt-25">
                  <div class="feedinfo-titl px-25 f28 color-467"><span class="current pl-25">問題の種類</span></div>
                    <div class="feedinfo-conn ml-25 px-25 border-bottom mt-20 pb-25"  @click="changeShow()">
                      <div class="f28 color-000 fdlist"><i class="fdrico fr"></i>{{params.viewTheme}}</div>
                    </div>
                </li>
                <li class="pt-25">
                  <div class="feedinfo-titl px-25 f28 color-467"><span class="current pl-25">メールアドレス</span></div>
                    <div class="feedinfo-conn ml-25 px-25 border-bottom mt-20 pb-25">
                      <div class="f28 color-000 fdlist">{{userInfo.account}}</div>
                    </div>
                </li>
                <li class="pt-25">
                  <div class="feedinfo-titl px-25 f28 color-467"><span class="current pl-25">内容</span></div>
                    <div class="feedinfo-conn ml-25 px-25 border-bottom mt-20 pb-25">
                      <textarea class="fdarea f28 color-000" name="" cols="" rows="" v-model="params.viewContent" placeholder="該当するページのURLや詳細な状況などをご記載ください" maxlength="250"></textarea>
                    </div>
                </li>
            </ul>
        </div>
        <div class="feedback-enter mt-20 px-30 py-20 bg-fff">
          <a class="feedback-btn bg-09f f32 color-fff" @click="submit()">出品する</a>
        </div>
    </div>
    <div class="feedback-item bg-fff fixed-bottom" style="z-index:3;" v-if="showList">
      <div class="feeditem-titl f28 color-000 border-bottom"><a class="close" @click="changeShow()"></a>項目</div>
      <div class="feeditem-conn pl-25 pb-20">
        <ul>
          <li class="f28 color-000 border-bottom" v-for="(item, index) in questionList" :key="index" @click="choseQuestion(item)">{{item.consultTitle}}</li>
        </ul>
      </div>
    </div>
    <div class="dialog_cover opacity-75" v-if="showList" @click="changeShow()" style="z-index:2;"></div> 
</div>
</template>

<script>
import {mapActions,mapState} from 'vuex'
export default {
  data () {
    return {
      questionList:'',
      showList: false,
      params: {
        mailAddress: '',
        viewContent: '',
        viewTheme: ''
      }
    }
  },
  created () {
    this.$bus.emit("title", 'お問い合わせ')
    this.$bus.emit("showTopRight", true)
    this.init()
  },
  methods: {
    init () {
      this.$api.user.questionList().then(res => {
        if (res && res.data) {
          this.questionList = res.data.list
        }
      })
    },
    submit () {
      if (this.params.viewTheme.length <= 0) {
        this.$toast('問題のタイプを選択してください')
        return
      }
      if (this.params.viewContent.length <= 0) {
        this.$toast('内容を記入してください')
        return
      }
      this.params.mailAddress = this.userInfo.account
      this.$api.user.feedback(this.params).then(res => {
        this.$toast('送信しました')
        setTimeout(()=>{
          this.$router.push({name:'User'})
        },2000)
      })
    },
    choseQuestion (item) {
      this.params.viewTheme = item.consultTitle
      this.showList = false
    },
    changeShow () {
      this.showList = !this.showList
    }
  },
  computed: {
    ...mapState({
      userInfo: state => {
        return state.userInfo
      }
    })
  },
}
</script>
<style>
@import '~css/common/help.css';
</style>
