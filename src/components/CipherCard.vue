<template>
  <div class="cipher-content">
    <h1 class="page-title">Caesar Cipher</h1>
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
              <button @click="encryptOutput = props.encryptAlgorithm(encryptInput)"
                class="cipher-button">Encrypt</button>
              <button @click="clearEncrypt" class="cipher-button">Clear</button>
            </div>

            <div class="control-group">
              <label class="control-label">Output:</label>
              <div class="output-container">
                <div class="output-area">{{ encryptOutput }}</div>
                <button :disabled="!encryptOutput" :class="['copy-button', {
                  'disabled': !encryptOutput,
                  'copied': copyStates.encrypt
                }]" @click="copyToClipboard(encryptOutput, 'encrypt')">
                  📋
                </button>
                <div v-if="copyStates.encrypt" class="copy-tooltip">
                  Copied!
                </div>
              </div>
            </div>
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
              <button @click="decryptOutput = props.decryptAlgorithm(decryptInput)"
                class="cipher-button">Decrypt</button>
              <button @click="clearDecrypt" class="cipher-button">Clear</button>
              <button class="cipher-button">Crack</button>
            </div>

            <div class="control-group">
              <label class="control-label">Output:</label>
              <div class="output-container">
                <div class="output-area">{{ decryptOutput }}</div>
                <button :disabled="!decryptOutput" :class="['copy-button', {
                  'disabled': !decryptOutput,
                  'copied': copyStates.decrypt
                }]" @click="copyToClipboard(decryptOutput, 'decrypt')">
                  📋
                </button>
                <div v-if="copyStates.decrypt" class="copy-tooltip">
                  Copied!
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

const props = defineProps({
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
});

const cipherActiveTab = ref('theory')

const encryptInput = ref('')
const encryptOutput = ref('')

const clearEncrypt = () => {
  encryptInput.value = '';
  encryptOutput.value = '';
}

const decryptInput = ref('')
const decryptOutput = ref('')

const clearDecrypt = () => {
  decryptInput.value = '';
  decryptOutput.value = '';
}

// Copy functionality
const copyStates = reactive({
  encrypt: false,
  decrypt: false
});

const copyToClipboard = async (text: string, type: 'encrypt' | 'decrypt') => {
  try {
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for non-secure contexts
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    }

    copyStates[type] = true;

    // Hide tooltip after 2 seconds
    setTimeout(() => {
      copyStates[type] = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};
</script>

<style scoped>
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

/* Cipher */
.cipher-theory,
.cipher-practice {
  max-width: calc(100vw - 7rem);
  min-width: 100%;
  /* margin-bottom: 2rem; */
  background: var(--cryptotron-card-bg);
  border: 1px solid var(--cryptotron-border-glow);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(5px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.cipher-theory::before,
.cipher-practice::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--neon-cyan), var(--neon-magenta), var(--neon-green));
  animation: borderFlow 3s linear infinite;
}

@keyframes borderFlow {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

.section-title {
  font-family: 'Orbitron', monospace;
  font-size: 1.5rem;
  color: var(--neon-cyan);
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.theory-content {
  line-height: 1.8;
  color: var(--cryptotron-text-secondary);
}

.theory-content :deep(h3) {
  color: var(--neon-green);
  font-family: 'Orbitron', monospace;
  margin: 1.5rem 0 1rem 0;
  font-size: 1.2rem;
}

.theory-content :deep(p) {
  margin-bottom: 1rem;
}

:deep(.cipher-example) {
  background: rgba(0, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  font-family: 'Space Mono', monospace;
  font-size: 0.9rem;
}

/* Interactive Controls */
.control-group {
  margin-bottom: 1.5rem;
}

:deep(.control-label) {
  display: block;
  color: var(--neon-green);
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
}

:deep(.cipher-input),
.cipher-textarea {
  width: 100%;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid var(--cryptotron-border-glow);
  border-radius: 6px;
  padding: 0.75rem;
  color: var(--cryptotron-text-primary);
  font-family: 'Space Mono', monospace;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.cipher-input:focus,
.cipher-textarea:focus {
  outline: none;
  border-color: var(--neon-cyan);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
  background: rgba(0, 0, 0, 0.9);
}

.cipher-textarea {
  min-height: 100px;
  resize: vertical;
}

.cipher-button {
  background: linear-gradient(45deg, rgba(0, 255, 255, 0.2), rgba(255, 0, 255, 0.2));
  border: 1px solid var(--neon-cyan);
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  color: var(--cryptotron-text-primary);
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.cipher-button:hover {
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  transform: translateY(-2px);
}

.cipher-button:active {
  transform: translateY(0);
}

.cipher-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.cipher-button:hover::before {
  left: 100%;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

/* Output area with copy button */
.output-container {
  position: relative;
}

.output-area {
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid var(--neon-green);
  border-radius: 6px;
  padding: 1rem;
  min-height: 100px;
  font-family: 'Space Mono', monospace;
  color: var(--neon-green);
  word-break: break-all;
  white-space: pre-wrap;
}

.copy-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid var(--neon-cyan);
  border-radius: 4px;
  padding: 0.5rem;
  color: var(--neon-cyan);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
}

.copy-button.disabled {
  background: rgba(128, 128, 128, 0.1);
  border-color: rgba(128, 128, 128, 0.5);
  color: rgba(128, 128, 128, 0.5);
  cursor: not-allowed;
  opacity: 0.5;
}

.copy-button:hover:not(.disabled) {
  background: rgba(0, 255, 255, 0.2);
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  transform: scale(1.05);
}

.copy-button.copied {
  background: rgba(0, 255, 0, 0.2);
  border-color: var(--neon-green);
  color: var(--neon-green);
}

.copy-tooltip {
  position: absolute;
  top: -2.5rem;
  right: 0.5rem;
  background: rgba(0, 255, 0, 0.9);
  color: black;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 700;
  font-family: 'Orbitron', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  animation: tooltipFade 2s ease-in-out;
  z-index: 10;
}

@keyframes tooltipFade {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }

  20% {
    opacity: 1;
    transform: translateY(0);
  }

  80% {
    opacity: 1;
    transform: translateY(0);
  }

  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}
</style>
