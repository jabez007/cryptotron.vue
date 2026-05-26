<template>
  <div class="bacon-key-row">
    <div class="form-control bacon-key-mode">
      <label class="control-label">
        Export Mode:
        <span class="label-hint">(m)</span>
      </label>
      <div class="mode-selector" role="radiogroup" aria-label="Bacon export mode">
        <button
          v-for="option in exportModeOptions"
          :key="option"
          type="button"
          role="radio"
          :aria-checked="localExportMode === option"
          class="mode-button"
          :class="{ active: localExportMode === option }"
          @click="localExportMode = option"
        >
          {{ optionLabels[option] }}
        </button>
      </div>
    </div>

    <div class="form-control bacon-key-action">
      <label class="control-label control-label-spacer" aria-hidden="true">Actions</label>
      <button
        class="cipher-button bacon-generate-button"
        type="button"
        @click="emit('generate-cover')"
        :disabled="generateDisabled"
      >
        Generate Cover (g)
      </button>
    </div>
  </div>

  <div class="form-control">
    <label class="control-label">Cover Text:</label>
    <textarea
      v-model="localCoverText"
      class="cipher-input"
      rows="6"
      placeholder="Enter the visible carrier text..."
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface BaconCipherKey {
  coverText: string
  exportMode: 'html' | 'markdown'
}

const exportModeOptions: BaconCipherKey['exportMode'][] = ['html', 'markdown']
const optionLabels: Record<BaconCipherKey['exportMode'], string> = {
  html: 'HTML',
  markdown: 'Markdown',
}

interface Props {
  cipherKey: BaconCipherKey
  generateDisabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  cipherKey: () => ({
    coverText: '',
    exportMode: 'html',
  }),
  generateDisabled: false,
})

const emit = defineEmits<{
  'update:cipherKey': [cipherKey: BaconCipherKey]
  'generate-cover': []
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

const localExportMode = computed({
  get: () => props.cipherKey.exportMode,
  set: (exportMode: 'html' | 'markdown') => {
    emit('update:cipherKey', {
      ...props.cipherKey,
      exportMode,
    })
  },
})
</script>

<style scoped>
@import '@/assets/cipher-key.css';

.bacon-key-row {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
}

.bacon-key-mode {
  min-width: 0;
}

.bacon-key-action {
  align-self: end;
}

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

.control-label-spacer {
  visibility: hidden;
}

.bacon-generate-button {
  white-space: nowrap;
}

@media (max-width: 640px) {
  .bacon-key-row {
    grid-template-columns: 1fr;
  }

  .control-label-spacer {
    display: none;
  }

  .bacon-generate-button {
    width: 100%;
  }
}

textarea.cipher-input {
  resize: vertical;
}
</style>
