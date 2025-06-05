<template>
  <div class="cipher-content">
    <h1 class="page-title">Caesar Cipher</h1>
    <div class="cipher-container">
      <div class="cipher-theory">
        <h2 class="section-title">Theory & History</h2>
        <div class="theory-content">
          <slot name="theory"></slot>
        </div>
      </div>

      <div class="cipher-practice">
        <h2 class="section-title">Interactive Practice</h2>

        <div class="control-group">
          <slot name="cipherKey"></slot>
        </div>

        <div class="control-group">
          <label class="control-label">Input Text:</label>
          <textarea v-model="cipherInput" placeholder="Enter text to encrypt/decrypt..."
            class="cipher-textarea"></textarea>
        </div>

        <div class="button-group">
          <button @click="cipherOutput = props.encryptAlgorithm(cipherInput)" class="cipher-button">Encrypt</button>
          <button @click="cipherOutput = props.decryptAlgorithm(cipherInput)" class="cipher-button">Decrypt</button>
          <button @click="clear" class="cipher-button">Clear</button>
        </div>

        <div class="control-group">
          <label class="control-label">Output:</label>
          <div class="output-area">{{ cipherOutput }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

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

const cipherInput = ref('')
const cipherOutput = ref('')

const clear = () => {
  cipherInput.value = '';
  cipherOutput.value = '';
}
</script>

<style scoped>
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

.cipher-theory,
.cipher-practice {
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
  gap: 1rem;
  margin-top: 1rem;
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
</style>
