<template>
  <div class="control-group">
    <label class="control-label">{{ label }}:</label>
    <div class="output-container">
      <div class="output-area">
        {{ text }}
      </div>
      <button
        :disabled="!text"
        :class="[
          'copy-button',
          {
            copied: showCopied,
            disabled: !text,
          },
        ]"
        @click="handleCopy"
      >
        📋
      </button>
      <div v-if="showCopied" class="copy-tooltip">Copied!</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  text: string
  label: string
}

const props = defineProps<Props>()

const chars = computed(() => props.text.length)

const showCopied = ref(false)

const handleCopy = async () => {
  console.debug('Copying text')

  if (!props.text) return

  try {
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(props.text)
    } else {
      // Fallback for non-secure contexts
      const textArea = document.createElement('textarea')
      textArea.value = props.text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      document.execCommand('copy')
      textArea.remove()
    }

    showCopied.value = true

    // Hide tooltip after 2 seconds
    setTimeout(() => {
      showCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}
</script>

<style scoped>
/* Control Group */
.control-group {
  margin-bottom: 1.5rem;
}

.control-label {
  display: block;
  color: var(--neon-green);
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
}

/* Output area with copy button */
.output-container {
  position: relative;
}

.output-area {
  height: 120px;
  overflow: auto;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid var(--neon-green);
  border-radius: 6px;
  padding: 1rem;
  padding-right: 3rem;
  font-family: 'Space Mono', monospace;
  color: var(--neon-green);
  word-break: break-all;
  white-space: pre-wrap;
}

.terminal-text {
  font-family: 'Space Mono', monospace;
  color: var(--neon-green);
  background: #000;
  padding: 10px;
  border-right: 2px solid var(--neon-green);
  white-space: nowrap;
  overflow: hidden;
  animation:
    typing 2s steps(v-bind('chars'), end),
    blink 0.5s step-end infinite alternate;
}

@keyframes typing {
  from {
    width: 0;
  }

  to {
    width: 100%;
  }
}

@keyframes blink {
  50% {
    border-color: transparent;
  }
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

.copy-button.disabled {
  background: rgba(128, 128, 128, 0.1);
  border-color: rgba(128, 128, 128, 0.5);
  color: rgba(128, 128, 128, 0.5);
  cursor: not-allowed;
  opacity: 0.5;
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
