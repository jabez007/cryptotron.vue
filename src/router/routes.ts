import type { RouteRecord } from 'vue-router';

export default (parentRoute?: RouteRecord) => [
  {
    name: "cryptotron-home",
    path: parentRoute ? "" : "/",
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

