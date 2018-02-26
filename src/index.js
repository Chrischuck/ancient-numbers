import Vue from 'vue'
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

import App from './App.vue'
import router from './router.js'
import store from './store'

export default new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})

OfflinePluginRuntime.install();

