<template>
  <div id="app" />
</template> 

<script>
  import Vue from 'vue'
  import NotFound from './routes/notFound/index.vue'
  const Home = { template: '<p>home page</p>' }

  const routes = {
    '/': Home
  }

  export default new Vue({
  el: '#app',
  data: {
    currentRoute: window.location.pathname
  },
  computed: {
    ViewComponent () {
      return routes[this.currentRoute] || NotFound
    }
  },
  render (h) { return h(this.ViewComponent) }
  })
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