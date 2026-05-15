<script setup lang="ts">
import CipherCard from '@/components/CipherCard.vue'
import { computed, ref } from 'vue'
import { tagsDecoder, tagsEncoder, type InvisibleEncodingMode } from '@/utils/steganography'

const emojiOptions = ['👍', '🤓', '😎', '🫥', '🕵️', '🧠', '🔐', '🛰️']
const tagsKey = ref({ coverText: '👍' })
const revealMode = ref(false)
const encodingMode = ref<InvisibleEncodingMode>('tags')

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
      encoded: tagsEncoder(secretMessage.value, coverText.value, encodingMode.value),
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

const nextMode = (mode: InvisibleEncodingMode): InvisibleEncodingMode => {
  if (mode === 'tags') return 'zero-width-binary'
  if (mode === 'zero-width-binary') return 'variation-selectors'
  return 'tags'
}

const handleNormalModeKey = (key: string, activeTab: string) => {
  if (activeTab !== 'encrypt') return false

  if (key === 'r') {
    revealMode.value = !revealMode.value
    return true
  }

  if (key === 'm') {
    encodingMode.value = nextMode(encodingMode.value)
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
        Invisible text steganography works by carrying a second message inside characters that are
        either non-rendering (zero-width code points) or rendered in ways humans usually ignore.
        In this view, the visible carrier is typically an emoji string, but the hidden payload is
        appended behind it.
      </p>
      <p>
        In operational terms, this is useful for analysts because it allows hidden instructions,
        command fragments, or social-engineering bait to move through everyday chat channels while
        appearing harmless. The payload can survive screenshots and casual moderation, then only
        appears when someone inspects code points directly.
      </p>
      <h4>Encoding Families You’ll See</h4>
      <ul>
        <li><strong>Unicode Tags payloads:</strong> printable ASCII shifted into tag ranges.</li>
        <li><strong>Zero-width binary payloads:</strong> bits encoded with ZWNJ/ZWJ and separators.</li>
      </ul>
      <p>
        This view now lets you <strong>encode</strong> using either family and attempts to
        <strong>decode</strong> both automatically, so mixed-source samples from different
        platforms can be recovered in one place.
      </p>
      <h4>Why Cross-Platform Handling Matters</h4>
      <p>
        Different apps normalize text differently. Some preserve Unicode tag ranges but collapse
        zero-width separators. Others strip tag ranges while keeping joiners. Even keyboard
        behavior, copy/paste paths, and cloud sanitizers can mutate payload structure. A decoder
        that assumes one strict format will miss real-world samples.
      </p>
      <p>
        In practice, you should expect partial corruption. If output looks wrong, compare character
        counts, inspect for dropped separators, and test both decoding assumptions before discarding
        a lead.
      </p>
      <h4>Threat-Model Notes</h4>
      <ul>
        <li>Hidden payloads are great for low-noise signaling in public channels.</li>
        <li>Detection often fails when teams inspect rendered text only.</li>
        <li>Automated scanners may miss payloads if they tokenize on visible graphemes.</li>
        <li>Defenders should normalize and diff raw code points, not just visible strings.</li>
      </ul>
      <h4>What the Reference Material Adds</h4>
      <p>
        The emoji-smuggling research highlights a practical defender lesson: payloads are often
        converted to bytes first, then mapped into invisible selector-like ranges, which means
        two payloads can look nearly identical but decode differently depending on byte framing.
        That is why this view now supports three families: direct Unicode Tags, zero-width binary,
        and UTF-8-byte mapping via variation selectors.
      </p>
      <p>
        It also reinforces that detection should not trust rendered output. Reliable analysis needs
        code-point inspection, normalization checks after copy/paste, and cross-tool comparison
        because different platforms sanitize different invisible ranges.
      </p>
    </template>

    <template #cipherKey>
      <div class="control-group">
        <label class="control-label">Encoding Mode</label>
        <div class="mode-picker">
          <label class="mode-option">
            <input v-model="encodingMode" type="radio" value="tags" />
            Unicode Tags
          </label>
          <label class="mode-option">
            <input v-model="encodingMode" type="radio" value="zero-width-binary" />
            Zero-width Binary
          </label>
          <label class="mode-option">
            <input v-model="encodingMode" type="radio" value="variation-selectors" />
            Variation Selectors (UTF-8 bytes)
          </label>
        </div>
      </div>

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
          <p class="tags-hint">Press <code>r</code> to toggle reveal, <code>m</code> to switch encoding mode.</p>
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

.mode-picker {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.mode-option {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: 'Space Mono', monospace;
  color: var(--cryptotron-text-primary);
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
