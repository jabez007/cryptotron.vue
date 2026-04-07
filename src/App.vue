<template>
  <div class="cryptotron-app">
    <div v-if="isCrtEnabled" class="crt-overlay"></div>
    <div v-if="isCrtEnabled" class="scanlines"></div>
    <header>
      <div class="logo" @click="router.push({ name: 'cryptotron-home' })">
        <img alt="Vue logo" src="@/assets/logo.png" width="50" height="50" />
        CryptoTron
      </div>

      <div class="header-actions">
        <button
          class="crt-toggle-btn"
          @click="toggleCrt"
          :title="isCrtEnabled ? 'Disable CRT Effects (Clean Mode)' : 'Enable CRT Effects (Cyber Mode)'"
          :aria-label="isCrtEnabled ? 'Disable CRT Effects' : 'Enable CRT Effects'"
          :aria-pressed="isCrtEnabled"
        >
          <CyberIcon :type="isCrtEnabled ? 'display' : 'display-off'" size="24" />
        </button>

        <button
          @click="toggleMenu"
          :class="['hamburger-button', { active: menuOpen }]"
          aria-label="Toggle navigation menu"
          :aria-expanded="menuOpen"
        >
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>
    </header>

    <!-- Navigation Overlay -->
    <div :class="['nav-overlay-bg', { active: menuOpen }]" @click="closeMenu"></div>
    <nav :class="['nav-overlay', { active: menuOpen }]">
      <template v-for="(item, index) in menuItems" :key="item.name">
        <div 
          v-if="item.category && (index === 0 || menuItems[index-1].category !== item.category)" 
          class="nav-category"
        >
          {{ item.category }}
        </div>
        <RouterLink 
          :to="{ name: item.name }" 
          :class="{ 'keyboard-selected': menuOpen && menuSelectedIndex === index }"
        >
          <span v-if="menuOpen && menuSelectedIndex === index" class="menu-selection-indicator">&gt;</span>
          {{ item.label }}
        </RouterLink>
      </template>
    </nav>

    <div id="app-content">
      <RouterView v-slot="{ Component, route }">
        <transition name="cyber-glitch" mode="out-in">
          <component :is="Component" :key="route.name" />
        </transition>
      </RouterView>
    </div>

    <footer class="app-footer">
      <button
        class="bug-report-btn"
        aria-label="Report a bug or issue"
        title="Report a bug or issue"
        @click="openIssues"
      >
        <IconBug />
      </button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import IconBug from '@/components/icons/IconBug.vue'
import IconDocumentation from '@/components/icons/IconDocumentation.vue'
import CyberIcon from '@/components/icons/CyberIcon.vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const router = useRouter()
const route = useRoute()

// CRT Persistence and Logic
const isCrtEnabled = ref(localStorage.getItem('crt-enabled') !== 'false')

const toggleCrt = () => {
  isCrtEnabled.value = !isCrtEnabled.value
  localStorage.setItem('crt-enabled', isCrtEnabled.value.toString())
}

/* nav menu */
const menuOpen = ref(false)
const menuSelectedIndex = ref(0)

const menuItems = [
  { name: 'cryptotron-home', label: 'Home' },
  { name: 'cryptotron-about', label: 'About' },
  { name: 'cryptotron-builder', label: 'BYOA' },
  { name: 'cryptotron-affine', label: 'Affine', category: 'Substitution Ciphers' },
  { name: 'cryptotron-caesar', label: 'Caesar' },
  { name: 'cryptotron-polybius', label: 'Polybius', category: 'Grid & Fractionation' },
  { name: 'cryptotron-substitution', label: 'Simple', category: 'Substitution Ciphers' }, // Reordered slightly for logic
  { name: 'cryptotron-autokey', label: 'Autokey', category: 'Polyalphabetic Ciphers' },
  { name: 'cryptotron-beaufort', label: 'Beaufort' },
  { name: 'cryptotron-vigenere', label: 'Vigenère' },
  { name: 'cryptotron-rail-fence', label: 'Rail-Fence', category: 'Transposition Ciphers' },
]

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
  if (menuOpen.value) {
    // Find index of current route or default to 0
    const currentIndex = menuItems.findIndex(item => item.name === route.name)
    menuSelectedIndex.value = currentIndex !== -1 ? currentIndex : 0
  }
}

const closeMenu = () => {
  menuOpen.value = false
}

const handleGlobalKeydown = (e: KeyboardEvent) => {
  // Ignore if typing in an input
  if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return

  const key = e.key.toLowerCase()

  // Menu Navigation
  if (menuOpen.value) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      e.stopImmediatePropagation()
      menuSelectedIndex.value = (menuSelectedIndex.value + 1) % menuItems.length
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      e.stopImmediatePropagation()
      menuSelectedIndex.value = (menuSelectedIndex.value - 1 + menuItems.length) % menuItems.length
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopImmediatePropagation()
      const item = menuItems[menuSelectedIndex.value]
      router.push({ name: item.name })
      closeMenu()
      return
    }
  }

  // Terminal Shortcuts (Alt + Key)
  if (e.altKey) {
    switch (key) {
      case 'h': e.preventDefault(); e.stopImmediatePropagation(); router.push({ name: 'cryptotron-home' }); break
      case 'b': e.preventDefault(); e.stopImmediatePropagation(); router.push({ name: 'cryptotron-builder' }); break
      case 'm': e.preventDefault(); e.stopImmediatePropagation(); toggleMenu(); break
      case 't': e.preventDefault(); e.stopImmediatePropagation(); toggleCrt(); break
    }
  }

  // Escape to Home
  if (e.key === 'Escape') {
    e.preventDefault()
    e.stopImmediatePropagation()
    if (menuOpen.value) closeMenu()
    else router.push({ name: 'cryptotron-home' })
  }
}

watch(
  () => route.fullPath,
  () => {
    closeMenu()
  },
)

/* Check if runing as sub-app to avoid displaying duplicate home links */
const isSubApp = ref(false)
onMounted(() => {
  const root = router.resolve({ path: '/' })
  console.debug(`Root route resolved to ${root.name as string}`)
  isSubApp.value = root.name !== 'cryptotron-home'
  
  // Use capture: true so the global listener (menu shortcuts) runs BEFORE component listeners
  window.addEventListener('keydown', handleGlobalKeydown, { capture: true })
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown, { capture: true })
})

/* Bug report functionality */
const openIssues = () => {
  // Replace with your actual GitHub repo URL
  const githubIssuesUrl = 'https://github.com/jabez007/cryptotron.vue/issues'
  window.open(githubIssuesUrl, '_blank', 'noopener,noreferrer')
}
</script>

<style>
@import '@/assets/base.css';

/* Accessibility: Respect OS-level reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  /* CRT effects */
  .crt-overlay,
  .scanlines,
  .crt-overlay::after {
    display: none !important;
  }

  /* Glitch text */
  .glitch-text::before,
  .glitch-text::after {
    display: none !important;
  }

  /* Global animations and transitions */
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Specific theme elements */
  .logo,
  .nav-overlay,
  .cipher-button::before,
  .tab-panel.active {
    animation: none !important;
    transition: none !important;
  }

  /* Route transitions */
  .cyber-glitch-enter-active,
  .cyber-glitch-leave-active {
    animation: none !important;
    transition: none !important;
  }
}
</style>

<style scoped>
@import '@/assets/main.css';

/* CRT Screen Effects (Scoped) */
.crt-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle, rgba(18, 16, 16, 0) 40%, rgba(0, 0, 0, 0.4) 100%),
    linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%),
    linear-gradient(90deg, rgba(255, 0, 0, 0.05), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.05));
  background-size:
    100% 100%,
    100% 4px,
    3px 100%;
  pointer-events: none;
  z-index: 9999;
  animation: crt-flicker 0.12s infinite;
}

.scanlines {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
    rgba(18, 16, 16, 0) 50%,
    rgba(0, 0, 0, 0.15) 50%
  );
  background-size: 100% 8px;
  pointer-events: none;
  z-index: 9998;
}

/* Subtle Vignette */
.crt-overlay::after {
  content: ' ';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(18, 16, 16, 0.1);
  opacity: 0;
  z-index: 10000;
  pointer-events: none;
  animation: crt-pulse 5s infinite;
}

@keyframes crt-flicker {
  0% {
    opacity: 0.97;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.98;
  }
}

@keyframes crt-pulse {
  0% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.15;
  }
  100% {
    opacity: 0.1;
  }
}

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

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.crt-toggle-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  transition: all 0.3s ease;
}

.crt-toggle-btn:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 0 5px var(--neon-cyan));
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
nav a.router-link-exact-active,
nav a.keyboard-selected {
  border-color: var(--neon-cyan);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  background: rgba(0, 255, 255, 0.1);
  transform: translateX(10px);
}

.menu-selection-indicator {
  position: absolute;
  left: 10px;
  color: var(--neon-magenta);
  font-weight: 900;
  animation: menu-pulse 1s infinite alternate;
}

@keyframes menu-pulse {
  from { opacity: 0.5; }
  to { opacity: 1; }
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
  justify-content: flex-start;
  align-items: flex-start;
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
