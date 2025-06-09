export default (parentRouteName?: string) => {
  const rootPath = parentRouteName ? "" : "/"
  return [
    {
      name: "cryptotron-home",
      path: rootPath,
      component: () => import("@/views/HomeView.vue"),
    },
    {
      name: "cryptotron-about",
      path: `${rootPath}about`,
      component: () => import("@/views/AboutView.vue"),
    },
    {
      name: "cryptotron-caesar",
      path: `${rootPath}caesar`,
      component: () => import("@/views/CaesarView.vue"),
    }
  ]
}
