import Vue from 'vue'

import App from './App.vue'
import router from './router.js'

export default new Vue({
  el: '#app',
  router,
  render: h => h(App)
})