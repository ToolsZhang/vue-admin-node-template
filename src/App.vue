<template>
  <div id="app">
    <router-view v-if="isShow"/>
  </div>
</template>
<script>
import Vue from 'vue'
export default {
  name: "App",
  provide(){
    return {
      reload: this.pageRelod
    }
  },
  data(){
    return {
      isShow: true
    }
  },
  methods:{
    pageRelod(){
      this.isShow = false;
      this.$nextTick(()=>{
        this.isShow = true;
      })
    }
  }
}
</script>

<style lang="scss">
#app{
  width: 100%;
  height: 100%;
}
</style>
