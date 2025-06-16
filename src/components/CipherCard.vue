<template>
  <div class="cipher-content">
    <h1 class="page-title">{{ title }}</h1>
    <div class="cipher-container">
      <div class="tab-navigation">
        <button @click="cipherActiveTab = 'theory'" :class="['tab-button', { active: cipherActiveTab === 'theory' }]">
          📚 Theory
        </button>
        <button @click="cipherActiveTab = 'encrypt'" :class="['tab-button', { active: cipherActiveTab === 'encrypt' }]">
          🔒 Encrypt
        </button>
        <button @click="cipherActiveTab = 'decrypt'" :class="['tab-button', { active: cipherActiveTab === 'decrypt' }]">
          🔓 Decrypt
        </button>
      </div>

      <div class="tab-content">
        <div :class="['tab-panel', { active: cipherActiveTab === 'theory' }]">
          <div class="cipher-theory">
            <h2 class="section-title">Theory & History</h2>
            <div class="theory-content">
              <slot name="theory"></slot>
            </div>
          </div>
        </div>

        <div :class="['tab-panel', { active: cipherActiveTab === 'encrypt' }]">
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

        <div :class="['tab-panel', { active: cipherActiveTab === 'decrypt' }]">
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
import CipherOutput from './CipherOutput.vue'
import { ref } from 'vue'

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

.tab-panel {
  display: none;
  animation: cyberFade 0.3s ease-in-out;
}

.tab-panel.active {
  display: block;
}

@keyframes cyberFade {
  0% {
    opacity: 0;
    filter: brightness(0) hue-rotate(180deg);
    transform: translateY(10px);
  }

  50% {
    opacity: 0.5;
    filter: brightness(0.5) hue-rotate(-180deg);
    transform: translateY(-10px);
  }

  100% {
    opacity: 1;
    filter: brightness(1) hue-rotate(0deg);
    transform: translateY(0);
  }
}
</style>
