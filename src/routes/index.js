export default [
  {
    path: '/',
    name: 'home.index',
    component: () => import('./home/index.vue'),
  },
  {
    path: '/convert',
    name: 'converter.index',
    component: () => import('./converter/index.vue')
  },
  {
    path: '*',
    name: 'account.index',
    component: () => import('./notFound/index.vue'),
  },
]