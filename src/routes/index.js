export default [
  {
    path: '/',
    name: 'home.index',
    component: () => import('./home/index.vue'),
  },

  {
    path: '*',
    name: 'account.index',
    component: () => import('./notFound/index.vue'),
  },
]