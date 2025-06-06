export default (parentRouteName?: string) => [
  {
    name: "cryptotron-home",
    path: parentRouteName ? "" : "/",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    name: "cryptotron-about",
    path: "/about",
    component: () => import("@/views/AboutView.vue"),
  },
  {
    name: "cryptotron-caesar",
    path: "/caesar",
    component: () => import("@/views/CaesarView.vue"),
  }
]

