<template>
  <div class="cryptotron-app">
    <header>
      <div class="logo" @click="router.push({ name: 'cryptotron-home' })">
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
      <RouterLink :to="{ name: 'cryptotron-builder' }">BYOA</RouterLink>
      <RouterLink :to="{ name: 'cryptotron-caesar' }">Caesar</RouterLink>
      <RouterLink :to="{ name: 'cryptotron-vigenere' }">Vigenère</RouterLink>
    </nav>

    <div id="app-content">
      <RouterView v-slot="{ Component, route }">
        <transition name="cyber-glitch" mode="out-in">
          <component :is="Component" :key="route.name" />
        </transition>
      </RouterView>
    </div>

    <footer class="app-footer">
      <button class="bug-report-btn" aria-label="Report a bug or issue" title="Report a bug or issue"
        @click="openIssues">
        <IconBug />
      </button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import IconBug from '@/components/icons/IconBug.vue'
import IconDocumentation from '@/components/icons/IconDocumentation.vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'

const router = useRouter()
const route = useRoute()

console.debug(`Current router is`, router)
console.debug(`Current route is`, route)

/* nav menu */
const menuOpen = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const closeMenu = () => {
  menuOpen.value = false
}

watch(route, () => {
  closeMenu()
})

/* Check if runing as sub-app to avoid displaying duplicate home links */
const rootName = router.resolve('/').name
console.debug(`Root route resolved to ${rootName as string}`)
const isSubApp = ref(rootName !== 'cryptotron-home')

/* Bug report functionality */
const openIssues = () => {
  // Replace with your actual GitHub repo URL
  const githubIssuesUrl = 'https://github.com/jabez007/cryptotron.vue/issues'
  window.open(githubIssuesUrl, '_blank', 'noopener,noreferrer')
}
</script>

<style>
@import '@/assets/base.css';
</style>

<style scoped>
@import '@/assets/main.css';

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
  cursor: pointer;
  display: flex;
  align-items: center;
  font-family: 'Orbitron', monospace;
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
  font-family: 'Space Mono', monospace;
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
  content: '';
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
  font-family: 'Orbitron', monospace;
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
  padding-bottom: 3rem;
  overflow: auto;
  display: flex;
  flex-direction: column;
  place-items: center;
}

/* Footer Styles */
.app-footer {
  min-width: 100%;
  background: linear-gradient(135deg, var(--cryptotron-darker-bg) 0%, rgba(15, 15, 25, 0.95) 100%);
  /*border-top: 2px solid var(--neon-cyan);*/
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  padding: 0.5rem 2rem;
  display: flex;
  justify-content: start;
  align-items: start;
  backdrop-filter: blur(10px);
  position: sticky;
  bottom: 0;
  z-index: 50;
}

.bug-report-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid var(--neon-cyan);
  border-radius: 12px;
  padding: 0.5rem;
  color: var(--neon-cyan);
  font-family: 'Space Mono', monospace;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.bug-report-btn:hover {
  background: rgba(0, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  transform: translateY(-2px);
}

.bug-report-btn:active {
  transform: translateY(0);
}

.bug-report-btn svg {
  transition: all 0.3s ease;
}

.bug-report-btn:hover svg {
  animation: bug-wiggle 0.6s ease-in-out;
}

.bug-text {
  font-weight: 600;
}

@keyframes bug-wiggle {

  0%,
  100% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(-5deg) scale(1.1);
  }

  75% {
    transform: rotate(5deg) scale(1.1);
  }
}

/* Transition Animations */

/* Cyber Glitch */
.cyber-glitch-enter-active {
  animation: glitch-enter 0.8s ease-out;
}

.cyber-glitch-leave-active {
  animation: glitch-leave 0.8s ease-in;
}

/* Keyframe Animations */
@keyframes glitch-effect {

  0%,
  100% {
    transform: translateX(0);
  }

  10% {
    transform: translateX(-2px) scaleX(1.01);
  }

  20% {
    transform: translateX(2px) scaleX(0.99);
  }

  30% {
    transform: translateX(-1px) scaleX(1.005);
  }

  40% {
    transform: translateX(1px) scaleX(0.995);
  }

  50% {
    transform: translateX(-0.5px) scaleX(1.002);
  }
}

@keyframes scan-lines-move {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(10px);
  }
}

@keyframes glitch-enter {
  0% {
    opacity: 0;
    transform: translateX(-100px) rotateY(90deg);
    filter: hue-rotate(180deg) contrast(2) brightness(0.5);
  }

  20% {
    transform: translateX(10px) rotateY(0deg);
    filter: hue-rotate(90deg) contrast(1.5) brightness(1.2);
  }

  40% {
    transform: translateX(-5px) rotateY(0deg);
    filter: hue-rotate(-45deg) contrast(1.2) brightness(1.1);
  }

  60% {
    transform: translateX(2px) rotateY(0deg);
    filter: hue-rotate(20deg) contrast(1.1) brightness(1.05);
  }

  80% {
    transform: translateX(-1px) rotateY(0deg);
    filter: hue-rotate(-10deg) contrast(1.05) brightness(1.02);
  }

  100% {
    opacity: 1;
    transform: translateX(0) rotateY(0deg);
    filter: hue-rotate(0deg) contrast(1) brightness(1);
  }
}

@keyframes glitch-leave {
  0% {
    opacity: 1;
    transform: translateX(0) rotateY(0deg);
    filter: hue-rotate(0deg) contrast(1) brightness(1);
  }

  20% {
    transform: translateX(-2px) rotateY(0deg);
    filter: hue-rotate(-20deg) contrast(1.1) brightness(0.9);
  }

  40% {
    transform: translateX(5px) rotateY(0deg);
    filter: hue-rotate(45deg) contrast(1.3) brightness(0.7);
  }

  60% {
    transform: translateX(-10px) rotateY(0deg);
    filter: hue-rotate(-90deg) contrast(1.6) brightness(0.5);
  }

  80% {
    transform: translateX(50px) rotateY(45deg);
    filter: hue-rotate(-180deg) contrast(2) brightness(0.3);
  }

  100% {
    opacity: 0;
    transform: translateX(100px) rotateY(90deg);
    filter: hue-rotate(-270deg) contrast(3) brightness(0);
  }
}
</style>
