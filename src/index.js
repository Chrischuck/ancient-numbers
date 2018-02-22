import Vue from 'vue'
import Vuex from 'vuex'
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

import App from './App.vue'
import router from './router.js'

Vue.use(Vuex)

export default new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

OfflinePluginRuntime.install();

