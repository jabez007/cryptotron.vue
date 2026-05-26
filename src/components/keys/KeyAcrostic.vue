<template>
  <div class="form-control">
    <label class="control-label">
      Position Mode:
      <span class="label-hint">(m)</span>
    </label>
    <div class="mode-selector" role="radiogroup" aria-label="Acrostic position mode">
      <button
        v-for="option in modeOptions"
        :key="option"
        type="button"
        role="radio"
        :aria-checked="localMode === option"
        class="mode-button"
        :class="{ active: localMode === option }"
        @click="localMode = option"
      >
        {{ labels[option] }}
      </button>
    </div>
  </div>

  <div class="form-control">
    <label class="control-label">Cover Text:</label>
    <textarea
      v-model="localCoverText"
      class="cipher-input"
      rows="8"
      placeholder="Generated or pasted carrier text will appear here..."
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type AcrosticMode = 'acrostic' | 'telestic' | 'compound'

export interface AcrosticCipherKey {
  coverText: string
  mode: AcrosticMode
}

const modeOptions: AcrosticMode[] = ['acrostic', 'telestic', 'compound']
const labels: Record<AcrosticMode, string> = {
  acrostic: 'Acrostic',
  telestic: 'Telestic',
  compound: 'Compound',
}

interface Props {
  cipherKey: AcrosticCipherKey
}

const props = withDefaults(defineProps<Props>(), {
  cipherKey: () => ({
    coverText: '',
    mode: 'acrostic',
  }),
})

const emit = defineEmits<{
  'update:cipherKey': [cipherKey: AcrosticCipherKey]
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

const localMode = computed({
  get: () => props.cipherKey.mode,
  set: (mode: AcrosticMode) => {
    emit('update:cipherKey', {
      ...props.cipherKey,
      mode,
    })
  },
})
</script>

<style scoped>
@import '@/assets/cipher-key.css';

.mode-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.mode-button {
  background: rgba(0, 255, 65, 0.08);
  border: 1px solid rgba(0, 255, 65, 0.25);
  border-radius: 999px;
  color: inherit;
  cursor: pointer;
  padding: 0.5rem 0.9rem;
}

.mode-button.active {
  background: var(--cryptotron-neon-cyan);
  box-shadow: 0 0 10px var(--cryptotron-neon-cyan);
  color: #000;
}

textarea.cipher-input {
  resize: vertical;
}
</style>
