<template>
  <div class="index-header fixed-top pt-20 px-25">
    <div class="index-top">
      <router-link :to="{name:'Help'}">
        <div class="index-header-logo">
          <span></span>
        </div>
      </router-link>
      <div class="index-header-middle">
        <span class="treegame">
        </span>
      </div>
      <div class="index-header-right">
        <router-link :to="{name:'Login'}" v-if="!$store.state.isLogin"><span class="f28 color-fff">ログイン</span></router-link>
      </div>
    </div>
    <div class="index-search py-25">
      <router-link :to="{name:'Search'}">
        <div class="index-input bg-fff">
          <span class="f28">ゲーム名で検索</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'headSearch',
  data() {
    return {
    }
  }
}
</script>
<style>
.index-header {
  z-index: 1;
}
</style>
