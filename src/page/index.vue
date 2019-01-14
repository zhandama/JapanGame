<template>
  <div id="wrapper" >
    <Header />
    <router-view/>
  </div>
</template>

<script>
import Header from '@/components/header.vue'
export default {
  name: 'App',
  components:{
    Header
  }
}
</script>
<style>
@import '~css/fost-base.css';
</style>
