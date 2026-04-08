<template>
  <div 
    class="cipher-content" 
    :data-vim-mode="isKeyMode ? 'key' : isInsertMode ? 'insert' : 'normal'"
  >
    <h1 class="page-title">{{ title }}</h1>
    <div class="cipher-container">
      <div class="vim-status-bar" :class="{ 'mode-insert': isInsertMode, 'mode-key': isKeyMode }">
        <div class="status-left">
          <span class="mode-tag">{{ isKeyMode ? '-- KEY --' : isInsertMode ? '-- INSERT --' : '-- NORMAL --' }}</span>
          <span v-if="showYankedTooltip" class="yank-alert">SYSTEM: DATA YANKED</span>
        </div>
        <span class="mode-hint">
          {{ isInsertMode ? 'Press ESC to exit' : 'i: text | k: key | 1-3: tabs | e: enc | d: dec | c: crack | x: clr | y: yank' }}
        </span>
      </div>
      <div class="tab-navigation">
        <button @click="switchTab('theory')" :class="['tab-button', { active: cipherActiveTab === 'theory' }]">
          <CyberIcon type="theory" size="16" class="tab-icon" />
          <span class="tab-label">Theory</span>
        </button>
        <button @click="switchTab('encrypt')" :class="['tab-button', { active: cipherActiveTab === 'encrypt' }]">
          <CyberIcon type="encrypt" size="16" class="tab-icon" />
          <span class="tab-label">Encrypt</span>
        </button>
        <button @click="switchTab('decrypt')" :class="['tab-button', { active: cipherActiveTab === 'decrypt' }]">
          <CyberIcon type="decrypt" size="16" class="tab-icon" />
          <span class="tab-label">Decrypt</span>
        </button>
      </div>

      <div class="tab-content">
        <div id="theory" :class="['tab-panel']">
          <ScanLine />
          <div class="cipher-theory">
            <h2 class="section-title">Theory & History</h2>
            <div class="theory-content">
              <slot name="theory"></slot>
            </div>
          </div>
        </div>

        <div id="encrypt" :class="['tab-panel']">
          <div class="cipher-practice">
            <h2 class="section-title">Encrypt Messages</h2>
            <div class="control-group">
              <slot name="cipherKey"></slot>
            </div>

            <div class="control-group">
              <label class="control-label">Input Text:</label>
              <textarea v-model="encryptInput" placeholder="Enter text to encrypt..."
                class="cipher-textarea"></textarea>
            </div>

            <div class="button-group">
              <button @click="encrypt" class="cipher-button">Encrypt</button>
              <button @click="clearEncrypt" class="cipher-button">Clear</button>
            </div>

            <div v-if="encryptError" class="status-error">
              <CyberIcon type="error" size="16" />
              <span>{{ encryptError }}</span>
            </div>

            <CipherOutput label="Output" :text="encryptOutput" />
          </div>
        </div>

        <div id="decrypt" :class="['tab-panel']">
          <div class="cipher-practice">
            <h2 class="section-title">Decrypt Messages</h2>
            <div class="control-group">
              <slot name="cipherKey"></slot>
            </div>

            <div class="control-group">
              <label class="control-label">Input Text:</label>
              <textarea v-model="decryptInput" placeholder="Enter text to decrypt..."
                class="cipher-textarea"></textarea>
            </div>

            <div class="button-group">
              <button @click="decrypt" class="cipher-button">Decrypt</button>
              <button @click="clearDecrypt" class="cipher-button">Clear</button>
              <button
                v-if="crackAlgorithm"
                @click="crack"
                class="cipher-button crack"
                :disabled="isCracking || !decryptInput"
              >
                <span v-if="isCracking" class="glitch-text" data-text="Cracking...">
                  <CyberIcon type="crack" size="18" class="button-icon pulse" />
                  Cracking...
                </span>
                <span v-else class="button-content">
                  <CyberIcon type="crack" size="18" class="button-icon" />
                  Crack
                </span>
              </button>
            </div>

            <div v-if="decryptError" class="status-error">
              <CyberIcon type="error" size="16" />
              <span>{{ decryptError }}</span>
            </div>

            <CipherOutput label="Output" :text="decryptOutput" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import CipherOutput from './CipherOutput.vue'
import ScanLine from './ScanLine.vue'
import CyberIcon from './icons/CyberIcon.vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  encryptAlgorithm: {
    type: Function,
    required: true,
  },
  decryptAlgorithm: {
    type: Function,
    required: true,
  },
  cipherKey: {
    type: Object,
    required: true,
  },
  crackAlgorithm: {
    type: Function,
    required: false,
  },
})

const emit = defineEmits<{
  'update:cipherKey': [key: any]
}>()

const cipherActiveTab = ref('theory')
let switchTabTimer: ReturnType<typeof setTimeout> | null = null

const switchTab = (newTabId: string) => {
  if (cipherActiveTab.value === newTabId) return
  
  const oldTabId = cipherActiveTab.value
  cipherActiveTab.value = newTabId

  // Clear any existing timer
  if (switchTabTimer) clearTimeout(switchTabTimer)

  // Add leaving class to current tab
  document.getElementById(oldTabId)?.classList.add('leaving')

  // After exit animation, switch to new tab
  switchTabTimer = setTimeout(async () => {
    await nextTick()
    document.querySelectorAll('.tab-panel').forEach((panel) => {
      panel.classList.remove('active', 'leaving')
    })
    document.getElementById(newTabId)?.classList.add('active')
    switchTabTimer = null
  }, 600) // Match exit animation duration
}

const isInsertMode = ref(false)
const isKeyMode = ref(false)

const handleKeydown = (e: KeyboardEvent) => {
  if (e.defaultPrevented) return
  const isInput = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)
  const isKeyInput = (e.target as HTMLElement).classList.contains('cipher-input')

  // Prevent collision with global navigation menu
  const isMenuOpen = document.querySelector('.nav-overlay.active') !== null
  if (isMenuOpen) return

  // Handle Escape to leave insert mode
  if (e.key === 'Escape') {
    if (isInput) {
      ;(e.target as HTMLElement).blur()
    }
    isInsertMode.value = false
    isKeyMode.value = false
    return
  }

  // If typing in an input, update modes
  if (isInput) {
    isInsertMode.value = true
    isKeyMode.value = isKeyInput
    return
  }

  const key = e.key.toLowerCase()

  // Normal Mode Shortcuts
  if (!isInsertMode.value) {
    switch (key) {
      case 'i': {
        const panel = document.getElementById(cipherActiveTab.value)
        const textarea = panel?.querySelector('textarea') as HTMLTextAreaElement
        if (textarea) {
          e.preventDefault()
          isInsertMode.value = true
          isKeyMode.value = false
          setTimeout(() => textarea.focus(), 0)
        }
        break
      }
      case 'k': {
        const panel = document.getElementById(cipherActiveTab.value)
        const keyInput = panel?.querySelector('.cipher-input') as HTMLInputElement
        if (keyInput) {
          e.preventDefault()
          isInsertMode.value = true
          isKeyMode.value = true
          setTimeout(() => keyInput.focus(), 0)
        }
        break
      }
      case '1': switchTab('theory'); break
      case '2': switchTab('encrypt'); break
      case '3': switchTab('decrypt'); break
      case 'e': 
        if (cipherActiveTab.value === 'encrypt') encrypt(); 
        break
      case 'd': 
        if (cipherActiveTab.value === 'decrypt') decrypt(); 
        break
      case 'c': 
        if (cipherActiveTab.value === 'decrypt' && props.crackAlgorithm && !isCracking.value) crack(); 
        break
      case 'x': 
        if (cipherActiveTab.value === 'encrypt') clearEncrypt();
        else if (cipherActiveTab.value === 'decrypt') clearDecrypt();
        break
      case 'y':
        yankOutput()
        break
    }
  }
}

onMounted(() => {
  document.getElementById(cipherActiveTab.value)?.classList.add('active')
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (switchTabTimer) clearTimeout(switchTabTimer)
  if (crackTimer) clearTimeout(crackTimer)
})

const encryptInput = ref('')
const encryptOutput = ref('')
const encryptError = ref('')

const encrypt = () => {
  encryptError.value = ''
  try {
    encryptOutput.value = props.encryptAlgorithm(encryptInput.value)
  } catch (err) {
    console.error(err)
    encryptError.value = 'encryption failed'
  }
}

const clearEncrypt = () => {
  encryptInput.value = ''
  encryptOutput.value = ''
  encryptError.value = ''
}

const decryptInput = ref('')
const decryptOutput = ref('')
const decryptError = ref('')

const decrypt = () => {
  decryptError.value = ''
  try {
    decryptOutput.value = props.decryptAlgorithm(decryptInput.value)
  } catch (err) {
    console.error(err)
    decryptError.value = 'decryption failed'
  }
}

const clearDecrypt = () => {
  decryptInput.value = ''
  decryptOutput.value = ''
  decryptError.value = ''
}

const isCracking = ref(false)
const showYankedTooltip = ref(false)
let crackTimer: ReturnType<typeof setTimeout> | null = null

const yankOutput = () => {
  const output = cipherActiveTab.value === 'encrypt' ? encryptOutput.value : decryptOutput.value
  if (!output) return

  navigator.clipboard.writeText(output).then(() => {
    showYankedTooltip.value = true
    setTimeout(() => {
      showYankedTooltip.value = false
    }, 2000)
  })
}

const crack = async () => {
  if (!props.crackAlgorithm || !decryptInput.value || isCracking.value) return

  isCracking.value = true
  decryptError.value = ''
  
  // Crack algorithms in the library are synchronous but might be heavy.
  // We yield to the event loop to allow the "Cracking..." UI to paint.
  crackTimer = setTimeout(() => {
    try {
      const result = props.crackAlgorithm!(decryptInput.value)
      if (result && result.key) {
        // Emit updated key instead of mutating prop
        emit('update:cipherKey', result.key)
        // Update decrypt output with the recovered plaintext
        decryptOutput.value = result.plaintext
      } else {
        decryptOutput.value = '⚠️  no key found'
      }
    } catch (err) {
      console.error(err)
      decryptError.value = 'cracking failed'
    } finally {
      isCracking.value = false
      crackTimer = null
    }
  }, 0)
}
</script>

<style scoped>
@import '@/assets/cipher-card.css';

.cipher-content {
  min-width: 100%;
  max-width: calc(100vw - 5rem);
}

.page-title {
  font-family: 'Orbitron', monospace;
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(45deg, var(--neon-green), var(--neon-cyan));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(0, 255, 65, 0.3);
}

/* Tabbed Interface */
.cipher-container {
  background: var(--card-bg);
  border: 1px solid var(--border-glow);
  border-radius: 12px;
  backdrop-filter: blur(5px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  /* margin-bottom: 2rem; */
}

.vim-status-bar {
  background: rgba(0, 255, 255, 0.1);
  border-bottom: 1px solid var(--border-glow);
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Space Mono', monospace;
  font-size: 0.75rem;
  transition: all 0.3s ease;
}

.status-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.yank-alert {
  color: var(--neon-green);
  font-weight: 700;
  text-shadow: 0 0 5px var(--neon-green);
  animation: yank-flicker 0.2s infinite;
}

@keyframes yank-flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.vim-status-bar.mode-insert {
  background: rgba(255, 0, 255, 0.15);
  border-bottom-color: var(--neon-magenta);
}

.vim-status-bar.mode-key {
  background: rgba(0, 255, 65, 0.15);
  border-bottom-color: var(--neon-green);
}

.mode-tag {
  color: var(--neon-cyan);
  font-weight: 700;
  letter-spacing: 1px;
}

.mode-insert .mode-tag {
  color: var(--neon-magenta);
  text-shadow: 0 0 5px var(--neon-magenta);
}

.mode-key .mode-tag {
  color: var(--neon-green);
  text-shadow: 0 0 5px var(--neon-green);
}

.mode-hint {
  color: var(--text-secondary);
  opacity: 0.8;
}

.status-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  color: var(--neon-magenta);
  font-family: 'Space Mono', monospace;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  animation: error-flicker 0.3s ease-in-out;
}

@keyframes error-flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.cipher-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  /*
  background: linear-gradient(90deg, var(--neon-cyan), var(--neon-magenta), var(--neon-green));
  animation: borderFlow 3s linear infinite;
  */
}

.tab-navigation {
  display: flex;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid var(--border-glow);
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.tab-navigation::-webkit-scrollbar {
  display: none;
}

.tab-button {
  flex: 1;
  min-width: 120px;
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-family: 'Orbitron', monospace;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.tab-label::before {
  content: '[';
  margin-right: 4px;
  opacity: 0.5;
}

.tab-label::after {
  content: ']';
  margin-left: 4px;
  opacity: 0.5;
}

.tab-button.active .tab-label {
  color: var(--neon-cyan);
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.tab-button.active .tab-label::before {
  content: '> [';
  opacity: 1;
  color: var(--neon-magenta);
}

.tab-button.active .tab-label::after {
  content: '] <';
  opacity: 1;
  color: var(--neon-magenta);
}

.tab-icon {
  filter: drop-shadow(0 0 2px rgba(0, 255, 255, 0.3));
}

.tab-button.active .tab-icon {
  filter: drop-shadow(0 0 5px rgba(0, 255, 255, 0.8));
}

.button-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.button-icon {
  vertical-align: middle;
}

.pulse {
  animation: icon-pulse 1.5s infinite ease-in-out;
}

@keyframes icon-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}

/* Accessibility: Respect OS-level reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .tab-button.active::after,
  .tab-panel.active,
  .pulse,
  .cipher-button::before {
    animation: none !important;
    transition: none !important;
  }

  .tab-panel.active {
    transform: none !important;
    opacity: 1 !important;
  }
}

.tab-button:hover {
  color: var(--neon-cyan);
  background: rgba(0, 255, 255, 0.05);
}

.tab-button.active {
  color: var(--neon-cyan);
  background: rgba(0, 255, 255, 0.1);
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--neon-cyan), var(--neon-magenta));
  animation: tabGlow 2s ease-in-out infinite alternate;
  will-change: box-shadow;
}

@keyframes tabGlow {
  0% {
    box-shadow:
      0 0 8px rgba(0, 255, 255, 0.6),
      0 0 16px rgba(0, 255, 255, 0.4),
      0 0 32px rgba(0, 255, 255, 0.2);
  }

  100% {
    box-shadow:
      0 0 16px rgba(0, 255, 255, 0.9),
      0 0 32px rgba(0, 255, 255, 0.6),
      0 0 64px rgba(0, 255, 255, 0.3);
  }
}

.tab-content {
  padding: 2rem;
  min-height: 400px;
}

@media only screen and (max-width: 768px) {
  .tab-content {
    padding: 0;
  }
}

/* Enhanced Cyberpunk Tab System */
.tab-panel {
  opacity: 0;
  position: absolute;
  width: 100%;
  pointer-events: none;
  transform: translateX(100%);
  transition: none;
}

.tab-panel.active {
  opacity: 1;
  position: relative;
  pointer-events: all;
  transform: translateX(0);
  animation: cyberDataStream 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.tab-panel.leaving {
  animation: cyberDataExit 0.6s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
}

@keyframes cyberDataStream {
  0% {
    opacity: 0;
    transform: translateX(100%) rotateY(45deg) scale(0.8);
    filter: hue-rotate(120deg) brightness(2) contrast(3) blur(5px);
    clip-path: polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%);
  }

  20% {
    opacity: 0.3;
    transform: translateX(60%) rotateY(25deg) scale(0.85);
    filter: hue-rotate(80deg) brightness(1.8) contrast(2.5) blur(3px);
    clip-path: polygon(80% 0%, 100% 0%, 100% 100%, 80% 100%);
  }

  40% {
    opacity: 0.6;
    transform: translateX(30%) rotateY(15deg) scale(0.9);
    filter: hue-rotate(40deg) brightness(1.5) contrast(2) blur(2px);
    clip-path: polygon(40% 0%, 100% 0%, 100% 100%, 40% 100%);
  }

  60% {
    opacity: 0.8;
    transform: translateX(10%) rotateY(5deg) scale(0.95);
    filter: hue-rotate(20deg) brightness(1.2) contrast(1.5) blur(1px);
    clip-path: polygon(20% 0%, 100% 0%, 100% 100%, 20% 100%);
  }

  80% {
    opacity: 0.95;
    transform: translateX(2%) rotateY(1deg) scale(0.98);
    filter: hue-rotate(5deg) brightness(1.05) contrast(1.2) blur(0.5px);
    clip-path: polygon(5% 0%, 100% 0%, 100% 100%, 5% 100%);
  }

  100% {
    opacity: 1;
    transform: translateX(0%) rotateY(0deg) scale(1);
    filter: hue-rotate(0deg) brightness(1) contrast(1) blur(0px);
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  }
}

@keyframes cyberDataExit {
  0% {
    opacity: 1;
    transform: translateX(0%) rotateY(0deg) scale(1);
    filter: hue-rotate(0deg) brightness(1) contrast(1) blur(0px);
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  }

  30% {
    opacity: 0.7;
    transform: translateX(-20%) rotateY(-10deg) scale(1.02);
    filter: hue-rotate(-30deg) brightness(1.3) contrast(1.5) blur(1px);
    clip-path: polygon(0% 0%, 80% 0%, 80% 100%, 0% 100%);
  }

  60% {
    opacity: 0.3;
    transform: translateX(-60%) rotateY(-30deg) scale(1.05);
    filter: hue-rotate(-80deg) brightness(1.8) contrast(2.5) blur(3px);
    clip-path: polygon(0% 0%, 40% 0%, 40% 100%, 0% 100%);
  }

  100% {
    opacity: 0;
    transform: translateX(-100%) rotateY(-45deg) scale(1.1);
    filter: hue-rotate(-120deg) brightness(2.5) contrast(3) blur(5px);
    clip-path: polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%);
  }
}
</style>
