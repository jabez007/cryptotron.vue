<script setup lang="ts">
import CipherCard from '@/components/CipherCard.vue'
import { computed, ref } from 'vue'
import { splitTagsMessage, tagsDecoder, tagsEncoder } from '@/utils/steganography'

const tagsKey = ref({ coverText: '👍' })
const revealMode = ref(false)

const coverText = computed({
  get: () => tagsKey.value.coverText ?? '',
  set: (value: string) => {
    tagsKey.value = {
      ...tagsKey.value,
      coverText: value,
    }
  },
})

const secretMessage = ref('')
const encodedInput = ref('')

const encodedOutput = computed(() => tagsEncoder(secretMessage.value, coverText.value))
const meter = computed(() => `${encodedOutput.value.length} / 2000`)

const extracted = computed(() => tagsDecoder(encodedInput.value))
const extractedCover = computed(() => splitTagsMessage(encodedInput.value).cover)

const revealText = computed(() =>
  revealMode.value ? `${coverText.value}\n\n[REVEALED]\n${secretMessage.value}` : coverText.value,
)

const handleNormalModeKey = (key: string, activeTab: string) => {
  if (key === 'r' && activeTab === 'encrypt') {
    revealMode.value = !revealMode.value
    return true
  }
  if (key === 'e') return false
  if (key === 'd') return false
  return false
}

const tagsEncrypt = (input: string) => {
  secretMessage.value = input
  return encodedOutput.value
}

const tagsDecrypt = (input: string) => {
  encodedInput.value = input
  return extracted.value
}
</script>

<template>
  <CipherCard
    title="Invisible Tags (Ghost Messages)"
    :encrypt-algorithm="() => tagsEncrypt"
    :decrypt-algorithm="() => tagsDecrypt"
    :encrypt-output-override="() => encodedOutput"
    :normal-mode-key-handler="handleNormalModeKey"
    v-model:cipher-key="tagsKey"
  >
    <template #theory>
      <h3>Shadow Strings</h3>
      <p>
        This module hides printable ASCII characters in the Unicode <code>Tags</code> block. The
        hidden payload is fully invisible in normal rendering while still preserved in raw text.
      </p>
      <p>
        Every supported ASCII character (<code>0x20</code> to <code>0x7E</code>) is shifted by
        <code>0xE0000</code> and appended to the cover text. Extraction reverses the shift.
      </p>
      <p>
        Some platforms sanitize tag code points. If extraction fails after sharing, the destination
        may be stripping the payload.
      </p>
    </template>

    <template #cipherKey>
      <div class="control-group">
        <label class="control-label">Cover Text</label>
        <textarea
          v-model="coverText"
          rows="4"
          class="cipher-textarea cipher-input"
          placeholder="Visible text or emoji carrier..."
        />
      </div>
    </template>

    <template #encryptOutput>
      <div class="tags-stack">
        <div class="control-group">
          <label class="control-label">Live Preview</label>
          <div class="tags-preview" :class="{ reveal: revealMode }">{{ revealText }}</div>
          <p class="tags-hint">Press <code>r</code> in normal mode to toggle reveal.</p>
        </div>

        <div class="control-group">
          <label class="control-label">Payload Meter</label>
          <p class="tags-meter">Total Characters: {{ meter }}</p>
        </div>

        <div class="control-group">
          <label class="control-label">Raw Encoded Output</label>
          <textarea :value="encodedOutput" rows="6" class="cipher-textarea" readonly />
        </div>
      </div>
    </template>

    <template #decryptOutput>
      <div class="tags-stack">
        <div class="control-group">
          <label class="control-label">Recovered Cover Text</label>
          <textarea :value="extractedCover" rows="3" class="cipher-textarea" readonly />
        </div>
        <div class="control-group">
          <label class="control-label">Recovered Secret</label>
          <textarea :value="extracted" rows="4" class="cipher-textarea" readonly />
        </div>
      </div>
    </template>
  </CipherCard>
</template>

<style scoped>
@import '@/assets/cipher-card.css';

.tags-stack {
  display: grid;
  gap: 1rem;
}

.tags-preview {
  border: 1px solid var(--cryptotron-border-glow);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.65);
  color: var(--cryptotron-text-primary);
  min-height: 5rem;
  padding: 1rem;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: 'Space Mono', monospace;
}

.tags-preview.reveal {
  color: var(--neon-magenta);
  text-shadow: 0 0 5px var(--neon-magenta);
  background: rgba(255, 0, 255, 0.08);
}

.tags-hint,
.tags-meter {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-family: 'Space Mono', monospace;
}

.tags-hint code {
  color: var(--neon-green);
}
</style>
