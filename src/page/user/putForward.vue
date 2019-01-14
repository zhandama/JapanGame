<template>
<div>
  <div class="bg-m2 money-tips py-30 mt-97">
      <p class="tips color-fff f28">現在の売上金</p>
      <p class="money f36 color-fff">
          <em class="fontbold">{{amount}}</em> 円</p>
  </div>
  <div class="forward-list bg-fff">
      <div class="forward-left ml-25 f28 fl pt-20">
          出金金額
      </div>
      <div class="forward-right fl pt-20 pb-15 ml-20">
          <input type="tel" placeholder="0" class="price f32" @input="inputPrice()" v-model="params.withdrawAmount" maxlength="9">
          <p class="title f24 color-666">{{params.withdrawAmount}}-{{params.serviceFee}}円(振込手数料)={{params.withdrawAmount-params.serviceFee}}</p>
      </div>
  </div>
  <div class="forward-list bg-fff mt-20">
      <div class="method ml-25 border-bottom">
          <p class="method-left fl f28">入金方法</p>
          <p class="method-right fl f28 color-000 ml-20">￥銀行振込</p>
      </div>
      <div class="forward-choose ml-25 border-bottom">
          <div class="choose-left fl f28">金融機関名</div>
          <div class="choose-right fl">
              <ul>
                  <li class="fl mb-20 ml-25" :class="{'active':bankChose.id===item.id}" v-for="(item, index) in bankList" :key="index" @click="clickBank(item)">{{item.name}}</li>
              </ul>
              <!-- <span class="extend ml-25 pl-20 mb-20">上記以外の金融機関</span> -->
          </div>
      </div>
      <div class="border-bottom ml-25 clearfix newmethod">
          <p class="newmethod-left fl f28">支店名</p>
          <div class="newmethod-right fl ml-25">
              <input type="text" class="fl pl-10 f26"  placeholder="分行名を入力する" v-model="params.openBankName" @input="bankSarch" @focus="bankSarch" @blur="closebankSarch" maxlength="30">
              <i class="up fr"></i>
              <ul class="uplist" v-if="branchListSearch.length>0&&branchListShow">
                  <li v-for="(item, index) in branchListSearch" :key="index" @click="branchListChose(item)">{{item.branchName}}</li>
              </ul>
          </div>
      </div>
      <div class="forward-choose ml-25 border-bottom">
          <div class="choose-left fl f28">口座種別</div>
          <div class="choose-right fl">
              <ul>
                  <li class="fl mb-20 ml-25" :class="{'active':params.remitType==1}" @click="params.remitType=1">普通</li>
                  <li class="fl mb-20 ml-25" :class="{'active':params.remitType==2}" @click="params.remitType=2">当座</li>
              </ul>
          </div>
      </div>
      <div class="method ml-25 border-bottom">
          <div class="method-left fl f28">口座番号</div>
          <div class="method-right fl ml-20">
              <input type="text" class="entering f28 fl" placeholder="口座番号入力してください" v-model="params.cardCode" maxlength="30">
              <p class="ts f18 color-666 mb-25">半角数字で、7桁未満の場合は先頭に「0」をつけてください</p>
          </div>
      </div>
      <div class="method ml-25 border-bottom">
          <div class="method-left fl f28">口座名義</div>
          <div class="method-right fl ml-20">
              <input type="text" class="entering f28 fl" placeholder="口座名義(全角力ナ)入力してください" v-model="params.realName" maxlength="15">
          </div>
      </div>
      <div class="method ml-25 border-bottom">
          <div class="method-left fl f28">電話番号</div>
          <div class="method-right fl ml-20">
              <input type="text" class="entering f28 fl" placeholder="電話番号" v-model="params.mobile" maxlength="11">
          </div>
      </div>
  </div>
  <div class="sale-order bg-fff mt-20">
      <div class="sale-order-choose" :class="{active:agreement}" @click="agreement=!agreement">
          <i class="icon fl"></i>
          <em class="title f24 color-000 fl ml-20">振込先情報を登録して申請する</em>
      </div>
      <p class="sure-btn pt-20">
          <a @click="putWithdraw()" class="sellbtn">申請する</a>
      </p>
      <p class="schedule">
          <a href="" class="f24">入金スケジュールはこちら</a>
      </p>
  </div>
</div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  data () {
    return {
      bankList: '',
      branchList: '',
      branchListShow: false,
      branchListSearch: [],
      bankChose: '',
      amount: 0,
      agreement: true,
      params: {
        withdrawAmount: 0,
        userId: '',
        withdrawType: 1,
        realName: '',
        cardCode: '',
        remitType: 1,
        mobile: '',
        serviceFee: 0,
        openBankName: ''
      }
    }
  },
  created () {
    this.$bus.emit("title", '入金申請')
    this.$bus.emit("topRightText", '申請履歴')
    this.$bus.emit("rightFunc", ()=>{
      this.$router.push({name:'PutForwardHistory'})
    })
    this.init()
  },
  beforeRouteLeave (to, from, next) {
    this.$bus.emit("showTopRight", false)
    next()
  },
  methods: {
    init() {
      this.$api.user.bankList().then(res=> {
        if (res.code==='00') {
          this.bankList = res.data
          if (this.bankInfo) {
            this.bankChose = res.data.filter(x=>x.name==this.bankInfo.bankName)[0]
          } else {
            this.bankChose = res.data[0]
          }
          this.getBranchList()
        }
      })
      this.sellAmount()
      this.params.mobile = this.userInfo.mobilePhone||0
      if (this.$route.query.update) {
        if (this.bankInfo) {
          this.params = this.bankInfo
        } else {
          this.$router.replace({name:'PutForwardHistory'})
        }
      }
    },
    clickBank (item) {
      this.bankChose = item
      this.params.openBankName = ''
      this.getBranchList()
    },
    branchListChose (item) {
      this.branchListShow = false
      this.params.openBankName = item.branchName
    },
    bankSarch () {
      this.branchListShow = true
      if (this.params.openBankName.length>0) {
        this.branchListSearch = this.branchList.filter(x =>x.branchName.indexOf(this.params.openBankName)!=-1)
      } else {
        this.branchListSearch = this.branchList
      }
    },
    closebankSarch () {
      this.branchListShow = false
    },
    getBranchList () {
      let params = {
        bankId: this.bankChose.id
      }
      this.$api.user.branchList(params).then(res => {
        if (res && res.data) {
          this.branchList = res.data
        }
      })
    },
    inputPrice () {
      if (this.params.withdrawAmount > this.amount) {
        this.params.withdrawAmount = this.amount + '' // 加引号把类型转化为字符串
      }
      this.params.withdrawAmount = this.params.withdrawAmount.replace(/^0*/g,'').replace(/[^\d]/g, "")
      this.getfee()
    },
    getfee () {
      this.$api.user.fee({withAmount:this.params.withdrawAmount}).then(res => {
        if (res && res.data) {
          this.params.serviceFee = res.data
        }
      })
    },
    sellAmount() {
      this.$api.user.sellAmount().then(res=>{
        if (res&&res.data) {
          this.amount = res.data
        }
      })
    },
    putWithdraw () {
      this.params.userId = this.userInfo.id
      this.params.bankName = this.bankChose.name
      if (this.params.withdrawAmount-this.params.serviceFee <= 0) {
        this.$toast('現金引き出し額が低！')
        return
      }
      if (this.$route.query.update) {
        this.$api.user.update(this.params).then(res=>{
          if (res&&res.data) {
            this.$toast('操作が成功する')
            setTimeout(() => {
              this.$router.push({name:'PutForwardHistory'})
            }, 2000)
          }
        })
      } else {
        this.$api.user.create(this.params).then(res=>{
          if (res&&res.data) {
            this.$toast('操作が成功する')
            setTimeout(() => {
              this.$router.push({name:'PutForwardHistory'})
            }, 2000)
          }
        })
      }
    }
  },
  computed: {
    ...mapState({
      userInfo:state => {
        return state.userInfo
      },
      bankInfo:state => {
        return state.bankInfo
      },
    })
  },
}
</script>
<style>
@import '~css/common/put-forward.css';
</style>
