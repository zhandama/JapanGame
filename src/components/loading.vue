<template>
  <div class="dialog_cover opacity-75" style="z-index:9" v-if="dialog_cover">
    <div style="padding-top:5rem;text-align:center"><van-loading style="margin:auto" /></div>
  </div>
</template>

<script>
export default {
  name: 'loading',
  data() {
    return {
      dialog_cover
    }
  }
}
</script>