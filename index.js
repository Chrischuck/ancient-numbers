import Vue from 'vue'

import App from './src/App.vue'
import router from './src/router.js'

export default new Vue({
  el: '#app',
  router,
  render: h => h(App)
})