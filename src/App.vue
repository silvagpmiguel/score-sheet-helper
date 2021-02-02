<template>
  <div id="app">
    <TopNav />
    <router-view></router-view>
  </div>
</template>

<script>
import TopNav from './components/TopNav.vue'
export default {
  name: 'App',
  components: {
    TopNav,
  },
}
</script>

<style>
html,
body {
  background-color: whitesmoke !important;
  overflow-x: hidden;
  width: 100vw;
  height: 100vh;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: whitesmoke !important;
}
</style>
