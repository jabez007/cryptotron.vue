<template>
  <header>
    <div class="logo">
      <img alt="Vue logo" src="@/assets/logo.png" width="50" height="50" />
      CryptoTron
    </div>

    <button @click="toggleMenu" :class="['hamburger-button', { active: menuOpen }]" aria-label="Toggle navigation menu">
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </button>
  </header>

  <!-- Navigation Overlay -->
  <div :class="['nav-overlay-bg', { active: menuOpen }]" @click="closeMenu"></div>
  <nav :class="['nav-overlay', { active: menuOpen }]">
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>

  <div id="app-content">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";
import { ref, watch } from "vue";

const menuOpen = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const closeMenu = () => {
  menuOpen.value = false;
};

const route = useRoute();

watch(route, () => {
  closeMenu();
});
</script>

<style>
@import "@/assets/main.css";
</style>

<style scoped>
header {
  min-width: 100vw;
  background: linear-gradient(135deg, var(--darker-bg) 0%, rgba(15, 15, 25, 0.95) 100%);
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
  background: linear-gradient(135deg, var(--darker-bg) 0%, rgba(15, 15, 25, 0.98) 100%);
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
  color: var(--text-primary);
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
  color: var(--color-text);
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
  max-width: 810px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
