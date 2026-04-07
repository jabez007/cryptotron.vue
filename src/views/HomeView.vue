<script setup lang="ts">
import { useRouter } from 'vue-router'
import ScanLine from '@/components/ScanLine.vue'
import { onMounted, onUnmounted, ref } from 'vue'

const router = useRouter()

const ciphers = [
  { name: 'cryptotron-caesar', label: 'Caesar Cipher', delay: '-1s', text: 'One of the oldest known ciphers and simplest substitution cipher, used by Julius Caesar himself! Shift each letter by a fixed number of positions in the alphabet (e.g., ROT13).' },
  { name: 'cryptotron-rail-fence', label: 'Rail-Fence Cipher', delay: '-2s', text: 'A transposition cipher from the 19th-century that writes the message in a zigzag pattern across multiple "rails", then reads off the ciphertext row by row. Simple yet effective!' },
  { name: 'cryptotron-vigenere', label: 'Vigenère Cipher', delay: '-3s', text: 'A 16th-century polyalphabetic substitution cipher that resisted cracking for centuries! Uses a keyword to create multiple shifting alphabets, making it much harder to crack.' },
  { name: 'cryptotron-polybius', label: 'Polybius Square', delay: '-4s', text: 'Invented by the ancient Greeks! A digraph substitution cipher that turn letters into coordinates using a 5×5 grid of letters (I and J share a cell) based on a keyword.' },
  { name: 'cryptotron-builder', label: 'Interactive Cipher Chain Builder', delay: '-5s', text: 'Create visual encryption pipelines by connecting cipher blocks. Build complex multi-step sequences with Caesar, Vigenère, and other classical ciphers. Discover how combining different encryption methods strengthens security through hands-on experimentation.' },
]

const selectedIndex = ref(0)
const gridElement = ref<HTMLElement | null>(null)

const getColumns = () => {
  if (!gridElement.value) return 3
  return window.getComputedStyle(gridElement.value).display === 'flex' 
    ? Math.floor(gridElement.value.offsetWidth / 450) || 1 // 450 is approx card width + margin
    : 1
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return

  // Prevent collision with global navigation menu
  const isMenuOpen = document.querySelector('.nav-overlay.active') !== null
  if (isMenuOpen) return

  const cols = getColumns()

  switch (e.key) {
    case 'ArrowRight':
      e.preventDefault()
      selectedIndex.value = (selectedIndex.value + 1) % ciphers.length
      break
    case 'ArrowLeft':
      e.preventDefault()
      selectedIndex.value = (selectedIndex.value - 1 + ciphers.length) % ciphers.length
      break
    case 'ArrowDown':
      e.preventDefault()
      if (selectedIndex.value + cols < ciphers.length) {
        selectedIndex.value += cols
      } else {
        // Wrap to top of next column or just stay at bottom
        selectedIndex.value = (selectedIndex.value + 1) % ciphers.length
      }
      break
    case 'ArrowUp':
      e.preventDefault()
      if (selectedIndex.value - cols >= 0) {
        selectedIndex.value -= cols
      } else {
        // Wrap to bottom
        selectedIndex.value = (selectedIndex.value - 1 + ciphers.length) % ciphers.length
      }
      break
    case 'Enter':
    case ' ':
      router.push({ name: ciphers[selectedIndex.value].name })
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="cipher-grid" ref="gridElement">
    <div
      v-for="(cipher, index) in ciphers"
      :key="cipher.name"
      class="cipher-card"
      :class="{ 'keyboard-selected': selectedIndex === index }"
      role="link"
      @click="router.push({ name: cipher.name })"
    >
      <ScanLine :delay="cipher.delay" />
      <div class="selection-indicator" v-if="selectedIndex === index">
        <span>&gt;</span>
      </div>
      <h3>{{ cipher.label }}</h3>
      <p>{{ cipher.text }}</p>
    </div>
  </div>
</template>

<style scoped>
.cipher-grid {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  place-content: center;
}

.cipher-card {
  flex: 1 0 29%;
  max-width: 600px;
  margin: 2rem;
  background: var(--cryptotron-card-bg);
  border: 1px solid var(--cryptotron-border-glow);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.cipher-card:hover,
.cipher-card:focus-visible,
.cipher-card.keyboard-selected {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 255, 255, 0.2);
  outline: none;
  border-color: var(--neon-cyan);
}

.selection-indicator {
  position: absolute;
  top: 1rem;
  left: 1rem;
  color: var(--neon-magenta);
  font-family: 'Space Mono', monospace;
  font-weight: 700;
  font-size: 1.5rem;
  animation: pulse 1s infinite alternate;
  z-index: 10;
}

@keyframes pulse {
  from { opacity: 0.5; transform: translateX(0); }
  to { opacity: 1; transform: translateX(5px); }
}

.cipher-card h3 {
  font-family: 'Orbitron', monospace;
  color: var(--neon-cyan);
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.cipher-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}
</style>
