<template>
  <div class="control-group">
    <label class="control-label">{{ label }}:</label>
    <div class="output-container">
      <div class="output-area">
        <span class="terminal-text">{{ displayText }}</span>
        <span v-if="text" class="cursor" :class="{ typing: isTyping }"></span>
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
import { ref, watch } from 'vue'

interface Props {
  text: string
  label: string
  typingSpeed?: number
}

const props = withDefaults(defineProps<Props>(), {
  typingSpeed: 50,
})

// Typewriter composable
function useTypewriter(speed: number = 50) {
  const displayText = ref('')
  const isTyping = ref(false)
  let currentTimer: ReturnType<typeof setTimeout> | null = null

  const typeText = (newText: string) => {
    if (currentTimer) {
      clearInterval(currentTimer)
    }

    if (!newText) {
      displayText.value = ''
      isTyping.value = false
      return
    }

    isTyping.value = true
    displayText.value = ''

    let i = 0
    currentTimer = setInterval(() => {
      displayText.value += newText[i]
      i++

      if (i >= newText.length) {
        clearInterval(currentTimer!)
        currentTimer = null
        isTyping.value = false
      }
    }, speed)
  }

  const clearText = () => {
    if (currentTimer) {
      clearInterval(currentTimer)
      currentTimer = null
    }
    displayText.value = ''
    isTyping.value = false
  }

  return {
    displayText,
    isTyping,
    typeText,
    clearText,
  }
}

const { displayText, isTyping, typeText } = useTypewriter(props.typingSpeed)

// Watch for text changes and trigger typewriter effect
watch(
  () => props.text,
  (newText) => {
    typeText(newText)
  },
  { immediate: true },
)

// Copy text to clipboard
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

/* Terminal effects */
.terminal-text {
  color: var(--neon-green);
  text-shadow: 0 0 5px rgba(0, 255, 65, 0.5);
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background: var(--neon-green);
  margin-left: 2px;
  box-shadow: 0 0 8px var(--neon-green);
  animation: blink 1.2s infinite;
  vertical-align: text-bottom;
}

.cursor.typing {
  animation: none;
  opacity: 1;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }

  51%,
  100% {
    opacity: 0;
  }
}

/* Optional: Add scan line effect */
.output-area::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    transparent 50%,
    rgba(0, 255, 65, 0.02) 50%,
    rgba(0, 255, 65, 0.02) 51%,
    transparent 51%
  );
  background-size: 100% 4px;
  animation: scan 0.08s linear infinite;
  pointer-events: none;
  z-index: 1;
}

@keyframes scan {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(4px);
  }
}

/* Ensure text content is above scan lines */
.terminal-text,
.cursor {
  position: relative;
  z-index: 2;
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
