export default (parentRouteName?: string) => {
  const rootPath = parentRouteName ? '' : '/'
  return [
    {
      name: 'cryptotron-home',
      path: rootPath,
      component: () => import('@/views/HomeView.vue'),
    },
    {
      name: 'cryptotron-about',
      path: `${rootPath}about`,
      component: () => import('@/views/AboutView.vue'),
    },
    {
      name: 'cryptotron-builder',
      path: `${rootPath}builder`,
      component: () => import('@/views/BuilderView.vue'),
    },
    /***************************************************/
    {
      name: 'cryptotron-affine',
      path: `${rootPath}affine`,
      component: () => import('@/views/AffineView.vue'),
    },
    {
      name: 'cryptotron-autokey',
      path: `${rootPath}autokey`,
      component: () => import('@/views/AutokeyView.vue'),
    },
    {
      name: 'cryptotron-caesar',
      path: `${rootPath}caesar`,
      component: () => import('@/views/CaesarView.vue'),
    },
    {
      name: 'cryptotron-vigenere',
      path: `${rootPath}vigenere`,
      component: () => import('@/views/VigenereView.vue'),
    },
  ]
}
