<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
// 引入全局主题样式
@import '@/assets/styles/theme.less';

#app {
  min-height: 100vh;
  background-color: @bg-primary;
}
</style>
