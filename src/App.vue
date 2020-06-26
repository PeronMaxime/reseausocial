<template>
  <div id="app">
    <HeaderTop></HeaderTop>
    <router-view/>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'

export default {
  name: 'App',
  components: {
    HeaderTop
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
