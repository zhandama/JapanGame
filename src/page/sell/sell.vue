<template>
  <div>
    <ChoseGame :top="'0.96rem'" :gameType="gameType"/>
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
  mounted () {
    this.$bus.emit("showTopRight", true)
    this.$bus.emit("showSearch", true)
  },
  methods: {
  }
}
</script>
<style>
@import '~css/common/choicegame.css';
</style>
