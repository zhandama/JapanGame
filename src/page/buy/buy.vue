<template>
  <div>
    <HeadSearch />
    <ChoseGame :top="'1.85rem'" :gameType="gameType"/>
    <Footer :active="1"/>
  </div>
</template>

<script>
import HeadSearch from '@/components/headSearch.vue'
import ChoseGame from '@/components/choseGame.vue'
import Footer from '@/components/footer.vue'
export default {
  components:{
    HeadSearch,
    ChoseGame,
    Footer
  },
  data () {
    return {
      list:[],
      gameType:this.$route.query.gameType
    }
  },
  created () {
    // this.init()
  },
  methods: {
    // init (){
    //   this.getGame('init')
    // },
    // getGame() {
    //   this.$http.get('/api/gameList').then((res) => {
    //     if (res) {
    //       this.list = this.list.concat(res)
    //     }
    //   })
    // }
  }
}
</script>
<style>
@import '~css/common/choicegame.css';
</style>
