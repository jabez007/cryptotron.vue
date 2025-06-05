<template>
  <div class="cryptotron-app">
    <header>
      <div class="logo">
        <img alt="Vue logo" src="@/assets/logo.png" width="50" height="50" />
        CryptoTron
      </div>

      <button @click="toggleMenu" :class="['hamburger-button', { active: menuOpen }]"
        aria-label="Toggle navigation menu">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </header>

    <!-- Navigation Overlay -->
    <div :class="['nav-overlay-bg', { active: menuOpen }]" @click="closeMenu"></div>
    <nav :class="['nav-overlay', { active: menuOpen }]">
      <RouterLink v-if="isSubApp" to="/">
        <IconDocumentation />
      </RouterLink>
      <RouterLink :to="{ name: 'cryptotron-home' }">Home</RouterLink>
      <RouterLink :to="{ name: 'cryptotron-about' }">About</RouterLink>
    </nav>

    <div id="app-content">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import IconDocumentation from "@/components/icons/IconDocumentation.vue";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import { ref, watch } from "vue";

const router = useRouter();
const route = useRoute();

const cryptotronRoutes = [
  {
    name: "cryptotron-home",
    path: "/",
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

console.debug(`Current URL: ${window.location.pathname}${window.location.hash}`);

// Get the current route name to add children to
const parentRouteName = route.name as string;
console.debug(`Parent route name: ${parentRouteName}`);

cryptotronRoutes.forEach((r) => {
  if (!router.hasRoute(r.name)) {
    console.debug(`Adding ${r.name} to router`)
    if (!parentRouteName) {
      router.addRoute(r)
    } else {
      router.addRoute(parentRouteName, r)
    }
  } else {
    console.warn(`Route ${r.name} already exists on router`)
  }
})

console.debug(`Route query: ${JSON.stringify(route.query)}`);
console.debug(`Window location search: ${window.location.search}`);
console.debug(`Router history base: ${router.options.history.base}`);
setTimeout(() => {
  let initialRoute;
  if (window.location.search) {
    console.debug("Using location query parameter");
    initialRoute = router.resolve(
      new URLSearchParams(window.location.search).get("initialRoute") || {
        name: "cryptotron-home",
      },
    );
  } else if (Object.keys(route.query).length > 0) {
    console.debug("Using route query parameter");
    initialRoute = router.resolve(
      (route.query.initialRoute as string) || { name: "cryptotron-home" },
    );
  } else if (router.options.history.base.endsWith("#")) {
    console.debug("Using hash");
    initialRoute = router.resolve(`${window.location.hash.slice(1)}`);
  } else {
    console.debug("Using path");
    initialRoute = router.resolve(
      `${window.location.pathname.slice(router.options.history.base.length)}`,
    );
  }

  console.debug(`Initial route matched: ${JSON.stringify(initialRoute.matched)}`);
  if (initialRoute.matched.length > 0 &&
    initialRoute.matched.some((p) => p.path === route.path)) {
    console.debug('Already on correct route, skipping navigation')
    router.replace(initialRoute)
    return
  }

  if (
    initialRoute.matched.length > 0 &&
    initialRoute.matched.some((p) => p.path === initialRoute.path)
  ) {
    console.debug(`Navigating to initial route: ${initialRoute.fullPath}`);
    router.push(initialRoute);
  } else {
    console.warn(`No route for ${initialRoute.fullPath}`);
    router.push({ name: "cryptotron-home" });
  }
}, 100);

/* nav menu */
const menuOpen = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const closeMenu = () => {
  menuOpen.value = false;
};

watch(route, () => {
  closeMenu();
});

/* Check if runing as sub-app to avoid displaying duplicate home links */
const rootName = router.resolve("/").name
console.debug(`Root route resolved to ${rootName as string}`)
const isSubApp = ref(rootName !== 'cryptotron-home')
</script>

<style>
@import "@/assets/base.css";
</style>

<style scoped>
@import "@/assets/main.css";

header {
  min-width: 100%;
  background: linear-gradient(135deg, var(--cryptotron-darker-bg) 0%, rgba(15, 15, 25, 0.95) 100%);
  border-bottom: 2px solid var(--neon-cyan);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  line-height: 1.5;
  /* header-content */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  font-family: "Orbitron", monospace;
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(45deg, var(--neon-cyan), var(--neon-magenta));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    filter: drop-shadow(0 0 5px rgba(0, 255, 255, 0.5));
  }

  to {
    filter: drop-shadow(0 0 15px rgba(0, 255, 255, 0.8));
  }
}

.hamburger-button {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 1001;
  position: relative;
}

.hamburger-line {
  width: 100%;
  height: 2px;
  background: var(--neon-cyan);
  transition: all 0.3s ease;
  transform-origin: center;
  box-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
}

.hamburger-button.active .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.hamburger-button.active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.hamburger-button.active .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

.nav-overlay {
  position: fixed;
  top: 50px;
  right: -100%;
  width: 350px;
  height: 100vh;
  background: linear-gradient(135deg, var(--cryptotron-darker-bg) 0%, rgba(15, 15, 25, 0.98) 100%);
  backdrop-filter: blur(20px);
  border-left: 2px solid var(--neon-cyan);
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
  transition: right 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 1000;
  padding: 2rem;
  overflow-y: auto;
}

.nav-overlay.active {
  right: 0;
}

.nav-overlay-bg {
  position: fixed;
  top: calc(50px + 2rem + 2px);
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s ease;
  z-index: 999;
}

.nav-overlay-bg.active {
  opacity: 1;
  visibility: visible;
}

nav {
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a {
  color: var(--cryptotron-text-primary);
  text-decoration: none;
  padding: 1rem 1.5rem;
  border: 1px solid transparent;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: block;
  margin-bottom: 0.5rem;
  font-family: "Space Mono", monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
}

nav a:hover,
nav a.router-link-exact-active {
  border-color: var(--neon-cyan);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  background: rgba(0, 255, 255, 0.1);
  transform: translateX(10px);
}

nav a::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

nav a:hover::before {
  left: 100%;
}

nav a.router-link-exact-active {
  background: linear-gradient(45deg, rgba(0, 255, 255, 0.2), rgba(255, 0, 255, 0.1));
  color: var(--cryptotron-color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

.nav-category {
  font-family: "Orbitron", monospace;
  font-size: 0.8rem;
  color: var(--neon-magenta);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 2rem 0 1rem 0;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 0, 255, 0.3);
}

.nav-category:first-of-type {
  margin-top: 0;
}

#app-content {
  min-height: calc(100vh - 50px - 2rem - 2px);
  max-height: calc(100vh - 50px - 2rem - 2px);
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  overflow: auto;
  display: flex;
  flex-direction: column;
  place-items: center;
}
</style>
