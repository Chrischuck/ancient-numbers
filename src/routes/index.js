export default [
  // Home
  {
    path: '/',
    name: 'home.index',
    component: () => import('./home/index.vue'),
  },

  // Account
  {
    path: '*',
    name: 'account.index',
    component: () => import('./notFound/index.vue'),
  },
]