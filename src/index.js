import Vue from 'vue'
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

import App from './App.vue'
import router from './router.js'

OfflinePluginRuntime.install();

export default new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
