<template>
  <div class="form-control">
    <label class="control-label">
      Encoding Mode:
      <span class="label-hint">(m)</span>
    </label>
    <select v-model="localEncodingMode" class="cipher-input">
      <option v-for="option in modeOptions" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <div class="mode-help">
      <div class="mode-help-header">
        <span class="mode-help-title">{{ currentMode.title }}</span>
        <span v-if="currentMode.recommended" class="mode-badge">Recommended</span>
      </div>
      <p class="mode-help-copy">{{ currentMode.description }}</p>
    </div>
  </div>

  <div class="form-control">
    <label class="control-label">Carrier Emoji / Cover Text:</label>
    <div class="emoji-picker">
      <button
        v-for="emoji in emojiOptions"
        :key="emoji"
        type="button"
        class="emoji-chip"
        @click="localCoverText = emoji"
      >
        {{ emoji }}
      </button>
    </div>
    <div class="emoji-picker">
      <button
        v-for="emoji in emojiOptions"
        :key="`${emoji}-append`"
        type="button"
        class="emoji-chip secondary"
        @click="localCoverText = `${localCoverText}${emoji}`"
      >
        +{{ emoji }}
      </button>
    </div>
    <textarea
      v-model="localCoverText"
      class="cipher-input"
      rows="3"
      placeholder="Paste your own emoji or carrier text here..."
    ></textarea>
  </div>

  <div class="form-control checkbox-control">
    <label class="checkbox-label">
      <input v-model="localInterleave" type="checkbox" />
      Interleave Payload
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { InvisibleEncodingMode } from '@/utils/steganography'

const emojiOptions = ['👍', '🤓', '😎', '🫥', '🕵️', '🧠', '🔐', '🛰️']
const modeOptions = [
  { value: 'tags', label: 'Tags' },
  { value: 'zero-width-binary', label: 'Zero-width' },
  { value: 'variation-selectors', label: 'VS Bytes' },
  { value: 'variation-selectors-nibbles', label: 'VS Nibbles' },
  { value: 'variation-selectors-legacy', label: 'VS Legacy' },
] as const

const modeMeta: Record<
  InvisibleEncodingMode,
  { title: string; description: string; recommended?: boolean }
> = {
  tags: {
    title: 'Unicode Tags',
    description: 'Fully invisible payload characters. Compact, but some systems may sanitize them.',
  },
  'zero-width-binary': {
    title: 'Zero-width Binary',
    description: 'Best for broad compatibility, but uses the most hidden characters per message.',
  },
  'variation-selectors': {
    title: 'Variation Selectors (Bytes)',
    description: 'Strong default for capacity and stealth. Encodes UTF-8 bytes into selector code points.',
    recommended: true,
  },
  'variation-selectors-nibbles': {
    title: 'Variation Selectors (Nibbles)',
    description: 'More granular 4-bit encoding. Useful for experimentation, but longer than byte mode.',
  },
  'variation-selectors-legacy': {
    title: 'Variation Selectors (Legacy)',
    description: 'Compatibility mode for older selector mappings and prior generated payloads.',
  },
}

export interface EmojiSmugglingCipherKey {
  coverText: string
  encodingMode: InvisibleEncodingMode
  interleave: boolean
}

interface Props {
  cipherKey: EmojiSmugglingCipherKey
}

const props = withDefaults(defineProps<Props>(), {
  cipherKey: () => ({
    coverText: '👍',
    encodingMode: 'variation-selectors',
    interleave: false,
  }),
})

const emit = defineEmits<{
  'update:cipherKey': [cipherKey: EmojiSmugglingCipherKey]
}>()

const localCoverText = computed({
  get: () => props.cipherKey.coverText,
  set: (coverText: string) => {
    emit('update:cipherKey', {
      ...props.cipherKey,
      coverText,
    })
  },
})

const localEncodingMode = computed({
  get: () => props.cipherKey.encodingMode,
  set: (encodingMode: InvisibleEncodingMode) => {
    emit('update:cipherKey', {
      ...props.cipherKey,
      encodingMode,
    })
  },
})

const localInterleave = computed({
  get: () => props.cipherKey.interleave,
  set: (interleave: boolean) => {
    emit('update:cipherKey', {
      ...props.cipherKey,
      interleave,
    })
  },
})

const currentMode = computed(() => modeMeta[localEncodingMode.value])
</script>

<style scoped>
@import '@/assets/cipher-key.css';

.mode-help {
  background: rgba(0, 255, 65, 0.05);
  border: 1px solid rgba(0, 255, 65, 0.16);
  border-radius: 10px;
  margin-top: 0.4rem;
  padding: 0.7rem 0.85rem;
}

.mode-help-header {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: space-between;
}

.mode-help-title {
  color: var(--cryptotron-text-primary);
  font-size: 0.95rem;
  font-weight: 700;
}

.mode-badge {
  background: rgba(0, 255, 65, 0.14);
  border: 1px solid rgba(0, 255, 65, 0.25);
  border-radius: 999px;
  color: var(--cryptotron-neon-green);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  padding: 0.16rem 0.55rem;
  text-transform: uppercase;
}

.mode-help-copy {
  color: var(--cryptotron-text-primary);
  font-size: 0.88rem;
  line-height: 1.45;
  margin: 0.45rem 0 0;
  opacity: 0.88;
}

.emoji-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.emoji-chip {
  border: 1px solid rgba(0, 255, 65, 0.25);
  border-radius: 999px;
  background: rgba(0, 255, 65, 0.08);
  color: inherit;
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
  padding: 0.5rem 0.75rem;
}

.emoji-chip.secondary {
  font-size: 0.95rem;
}

.checkbox-control {
  margin-top: 0.25rem;
}

.checkbox-label {
  align-items: center;
  display: inline-flex;
  gap: 0.5rem;
}

textarea.cipher-input {
  resize: vertical;
}
</style>
