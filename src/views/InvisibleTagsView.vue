<script setup lang="ts">
import CipherCard from '@/components/CipherCard.vue'
import { computed, ref } from 'vue'
import { tagsDecoder, tagsEncoder } from '@/utils/steganography'

const emojiOptions = ['👍', '🤓', '😎', '🫥', '🕵️', '🧠', '🔐', '🛰️']
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

const encodeResult = computed(() => {
  try {
    return {
      encoded: tagsEncoder(secretMessage.value, coverText.value),
      warning: '',
    }
  } catch (error) {
    return {
      encoded: coverText.value,
      warning: error instanceof Error ? error.message : 'Unsupported characters detected.',
    }
  }
})

const encodedOutput = computed(() => encodeResult.value.encoded)
const encodingWarning = computed(() => encodeResult.value.warning)
const meter = computed(() => `${encodedOutput.value.length} / 2000`)

const extracted = computed(() => tagsDecoder(encodedInput.value))

const revealText = computed(() =>
  revealMode.value ? `${coverText.value}\n\n[REVEALED]\n${secretMessage.value}` : coverText.value,
)

const handleNormalModeKey = (key: string, activeTab: string) => {
  if (key === 'r' && activeTab === 'encrypt') {
    revealMode.value = !revealMode.value
    return true
  }
  return false
}

const tagsEncrypt = (input: string) => {
  secretMessage.value = input
  return encodedOutput.value
}

const setSecretMessage = (value: string) => {
  secretMessage.value = value
}

const useEmojiCarrier = (emoji: string) => {
  coverText.value = emoji
}

const appendEmojiCarrier = (emoji: string) => {
  coverText.value = `${coverText.value}${emoji}`
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
    :show-cipher-key-on-decrypt="false"
    :on-encrypt-input-change="setSecretMessage"
    v-model:cipher-key="tagsKey"
  >
    <template #theory>
      <h3>Invisible Text Tradecraft: How This Works</h3>
      <p>
        Invisible Tags hides text by converting printable ASCII into Unicode tag code points and
        appending them after visible carrier text (often emojis). Most apps render those tag
        code points invisibly, so the message appears normal at a glance.
      </p>
      <p>
        This module now supports extraction from two families seen in the wild:
      </p>
      <ul>
        <li><strong>Unicode Tags payloads</strong> (the standard Invisible Tags approach)</li>
        <li><strong>Zero-width binary payloads</strong> that use invisible joiners/separators</li>
      </ul>
      <p>
        Why this matters: different platforms, keyboards, and tooling often produce different
        invisible encodings. Broad extraction support improves recovery when users paste messages
        from mixed sources.
      </p>
      <p>
        Practical constraints:
      </p>
      <ul>
        <li>Encoding is ASCII-only for predictable cross-platform results</li>
        <li>Some platforms strip or normalize invisible code points</li>
        <li>Copy/paste and moderation pipelines may silently alter payloads</li>
      </ul>
      <p>
        Analyst workflow: capture raw text, decode invisibles, verify recovered plaintext, and
        compare against carrier-visible text for tampering clues.
      </p>
    </template>

    <template #cipherKey>
      <div class="control-group">
        <label class="control-label">Carrier Emoji / Cover Text</label>
        <div class="emoji-picker">
          <button
            v-for="emoji in emojiOptions"
            :key="emoji"
            type="button"
            class="emoji-chip"
            @click="useEmojiCarrier(emoji)"
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
            @click="appendEmojiCarrier(emoji)"
          >
            +{{ emoji }}
          </button>
        </div>
        <textarea
          v-model="coverText"
          rows="3"
          class="cipher-textarea cipher-input"
          placeholder="Optional: customize carrier text"
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
          <p v-if="encodingWarning" class="status-error tags-warning">
            <span>{{ encodingWarning }}</span>
          </p>
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
.tags-meter,
.tags-warning {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-family: 'Space Mono', monospace;
}

.tags-warning {
  margin-bottom: 0;
}

.tags-hint code {
  color: var(--neon-green);
}

.emoji-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.emoji-chip {
  border: 1px solid var(--cryptotron-border-glow);
  background: rgba(0, 0, 0, 0.55);
  color: var(--cryptotron-text-primary);
  border-radius: 8px;
  cursor: pointer;
  padding: 0.35rem 0.55rem;
}

.emoji-chip.secondary {
  opacity: 0.85;
}
</style>
