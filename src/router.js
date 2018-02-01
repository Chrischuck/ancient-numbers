import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';


Vue.use(VueRouter)

export const router = new VueRouter({
  mode: 'history',
  routes
})

Vue.router = router

export default router