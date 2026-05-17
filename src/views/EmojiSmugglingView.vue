<script setup lang="ts">
import CipherCard from '@/components/CipherCard.vue'
import { computed, ref } from 'vue'
import {
  detectTagsPayloadFormat,
  tagsDecoder,
  tagsEncoder,
  type InvisibleEncodingMode,
} from '@/utils/steganography'

const emojiOptions = ['👍', '🤓', '😎', '🫥', '🕵️', '🧠', '🔐', '🛰️']
const tagsKey = ref({ coverText: '👍' })
const revealMode = ref(false)
const encodingMode = ref<InvisibleEncodingMode>('variation-selectors')

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
const detectedFormat = computed(() => detectTagsPayloadFormat(encodedInput.value))

const revealText = computed(() =>
  revealMode.value ? `${coverText.value}\n\n[REVEALED]\n${secretMessage.value}` : coverText.value,
)

const nextMode = (mode: InvisibleEncodingMode): InvisibleEncodingMode => {
  if (mode === 'tags') return 'zero-width-binary'
  if (mode === 'zero-width-binary') return 'variation-selectors'
  if (mode === 'variation-selectors') return 'variation-selectors-legacy'
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

const clearEncryptState = () => {
  secretMessage.value = ''
  revealMode.value = false
  coverText.value = '👍'
  encodingMode.value = 'variation-selectors'
}

const clearDecryptState = () => {
  encodedInput.value = ''
}

const tagsDecrypt = (input: string) => {
  encodedInput.value = input
  return extracted.value
}
</script>

<template>
  <CipherCard
    title="Emoji Smuggling (Ghost Messages)"
    :encrypt-algorithm="() => tagsEncrypt"
    :decrypt-algorithm="() => tagsDecrypt"
    :encrypt-output-override="() => encodedOutput"
    :normal-mode-key-handler="handleNormalModeKey"
    :show-cipher-key-on-decrypt="false"
    :on-encrypt-input-change="setSecretMessage"
    :on-encrypt-clear="clearEncryptState"
    :on-decrypt-clear="clearDecryptState"
    v-model:cipher-key="tagsKey"
  >
    <template #theory>
      <h3>Invisible Text & Emoji Steganography</h3>
      <p>
        Emoji steganography generally falls into two operational branches:
        <strong>Invisible Cargo</strong> (appending hidden data behind a carrier) and
        <strong>Semantic/Visual Obfuscation</strong> (using the emojis themselves, or platform
        features, as the cipher). This tool focuses on the Invisible Cargo branch.
      </p>

      <h4>1. The "Invisible Cargo" Branch (Implemented Here)</h4>
      <p>
        This works by carrying a second message inside characters that are either non-rendering
        (zero-width code points) or rendered in ways humans usually ignore. The visible carrier is
        typically an emoji string, but the hidden payload is appended behind it.
      </p>
      <p>
        In operational terms, this allows hidden instructions, C2 command fragments, or
        social-engineering bait to move through everyday chat channels while appearing harmless. The
        payload can survive screenshots and casual moderation.
      </p>
      <ul>
        <li>
          <strong>Variation selectors (default):</strong> UTF-8 bytes mapped into VS ranges for
          broad web-app compatibility.
        </li>
        <li><strong>Unicode Tags payloads:</strong> printable ASCII shifted into tag ranges.</li>
        <li>
          <strong>Zero-width binary payloads:</strong> bits encoded with ZWNJ/ZWJ and separators.
        </li>
      </ul>

      <h4>2. The "Semantic/Visual Obfuscation" Branch</h4>
      <p>
        Instead of relying on invisible code points, attackers also use the visible emojis or image
        data:
      </p>
      <ul>
        <li>
          <strong>Substitution Ciphers (e.g., Disgomoji):</strong> A pre-shared "codebook" maps
          specific emojis to commands. A string like 🔥🌐💀 looks like chat but executes malware
          instructions.
        </li>
        <li>
          <strong>Image-Based Custom Emojis:</strong> On platforms like Discord or Slack, classic
          steganography (LSB manipulation, EXIF data) is applied directly to the uploaded
          <code>.png</code> or <code>.gif</code> of a custom emoji.
        </li>
        <li>
          <strong>Bidi Overrides:</strong> Combining emojis with Right-to-Left Override characters
          to spoof file extensions or URLs (e.g. <code>document[U+202E]exe.txt</code>).
        </li>
      </ul>

      <h4>Why Cross-Platform Handling Matters</h4>
      <p>
        Different apps normalize text differently. Some preserve Unicode tag ranges but collapse
        zero-width separators. Even keyboard behavior, copy/paste paths, and cloud sanitizers can
        mutate payload structure. In practice, you should expect partial corruption. If output looks
        wrong, test multiple decoding paths before discarding a lead.
      </p>

      <h4>Threat-Model Notes</h4>
      <ul>
        <li>
          Hidden payloads provide low-noise signaling in public channels, often bypassing WYSIWYG
          protections.
        </li>
        <li>
          Automated scanners often miss payloads if they tokenize only on visible graphemes or
          ignore custom emoji image data.
        </li>
        <li>
          Defenders must normalize and diff raw code points, not just visible strings, and treat
          custom emojis as potential binary carriers.
        </li>
      </ul>
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
          <label class="mode-option">
            <input v-model="encodingMode" type="radio" value="variation-selectors-legacy" />
            Variation Selectors (Legacy A=1)
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
          <p class="tags-hint">
            Press <code>r</code> to toggle reveal, <code>m</code> to switch encoding mode.
          </p>
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
          <p class="tags-hint">
            Auto-detected format: <strong>{{ detectedFormat }}</strong>
          </p>
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
