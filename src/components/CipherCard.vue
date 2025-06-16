<template>
  <div class="cipher-content">
    <h1 class="page-title">{{ title }}</h1>
    <div class="cipher-container">
      <div class="tab-navigation">
        <button @click="switchTab('theory')" :class="['tab-button', { active: cipherActiveTab === 'theory' }]">
          📚 Theory
        </button>
        <button @click="switchTab('encrypt')" :class="['tab-button', { active: cipherActiveTab === 'encrypt' }]">
          🔒 Encrypt
        </button>
        <button @click="switchTab('decrypt')" :class="['tab-button', { active: cipherActiveTab === 'decrypt' }]">
          🔓 Decrypt
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
              <button v-if="keysGenerator" class="cipher-button">Crack</button>
            </div>

            <CipherOutput label="Output" :text="decryptOutput" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import CipherOutput from './CipherOutput.vue'
import ScanLine from './ScanLine.vue'

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
  keysGenerator: {
    type: Function,
    required: false,
  },
})

const cipherActiveTab = ref('theory')

const switchTab = (newTabId: string) => {
  cipherActiveTab.value = newTabId

  // Add leaving class to current tab
  document.querySelector('.tab-panel.active')?.classList.add('leaving')

  // After exit animation, switch to new tab
  setTimeout(async () => {
    await nextTick()
    document.querySelectorAll('.tab-panel').forEach((panel) => {
      panel.classList.remove('active', 'leaving')
    })
    document.getElementById(newTabId)?.classList.add('active')
  }, 600) // Match exit animation duration
}

onMounted(() => {
  document.getElementById(cipherActiveTab.value)?.classList.add('active')
})

const encryptInput = ref('')
const encryptOutput = ref('')

const encrypt = () => {
  try {
    encryptOutput.value = props.encryptAlgorithm(encryptInput.value)
  } catch (err) {
    console.error(err)
    encryptOutput.value = '⚠️  encryption failed'
  }
}

const clearEncrypt = () => {
  encryptInput.value = ''
  encryptOutput.value = ''
}

const decryptInput = ref('')
const decryptOutput = ref('')

const decrypt = () => {
  try {
    decryptOutput.value = props.decryptAlgorithm(decryptInput.value)
  } catch (err) {
    console.error(err)
    decryptOutput.value = '⚠️  decryption failed'
  }
}

const clearDecrypt = () => {
  decryptInput.value = ''
  decryptOutput.value = ''
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
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;
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
