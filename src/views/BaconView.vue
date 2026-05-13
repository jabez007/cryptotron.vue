<script setup lang="ts">
import CipherCard from '@/components/CipherCard.vue'
import { computed, ref } from 'vue'
import { baconDecoder, baconEncoder, toHtmlSnippet, toMarkdown, type StyledChar } from '@/utils/steganography'

const baconCipherKey = ref({})
const baconCoverKey = ref({ coverText: '' })
const secretMessage = ref('')
const encodedInput = ref('')
const exportMode = ref<'html' | 'markdown'>('html')
const copiedNotice = ref('')

const coverText = computed({
  get: () => baconCoverKey.value.coverText ?? '',
  set: (value: string) => {
    baconCoverKey.value = {
      ...baconCoverKey.value,
      coverText: value,
    }
  },
})

const preview = computed<StyledChar[]>(() => {
  try {
    return baconEncoder(secretMessage.value, coverText.value)
  } catch (error) {
    console.error('Bacon encoder preview failed', {
      error,
      secretLength: secretMessage.value.length,
      coverLength: coverText.value.length,
    })
    return [...coverText.value].map((char) => ({ char, type: 'a' as const }))
  }
})

const bitLength = computed(() => secretMessage.value.toUpperCase().replace(/[^A-Z]/g, '').length * 5)
const alphaLength = computed(() => [...coverText.value].filter((c) => /[A-Za-z]/.test(c)).length)
const lengthError = computed(() =>
  bitLength.value > 0 && alphaLength.value < bitLength.value
    ? `Cover Text needs at least ${bitLength.value} alphabetic characters (has ${alphaLength.value}).`
    : '',
)

const extracted = computed(() => {
  try {
    return baconDecoder(encodedInput.value)
  } catch (error) {
    console.error('Bacon decoder extraction failed', {
      error,
      inputLength: encodedInput.value.length,
    })
    return ''
  }
})

const htmlExport = computed(() => toHtmlSnippet(preview.value))
const markdownExport = computed(() => toMarkdown(preview.value))
const activeExport = computed(() => (exportMode.value === 'html' ? htmlExport.value : markdownExport.value))

const copyActiveExport = async () => {
  if (!activeExport.value) return

  try {
    await navigator.clipboard.writeText(activeExport.value)
    copiedNotice.value = `${exportMode.value.toUpperCase()} copied`
    setTimeout(() => {
      copiedNotice.value = ''
    }, 2000)
  } catch (error) {
    console.error('Failed to copy Bacon export', { error, exportMode: exportMode.value })
    copiedNotice.value = 'Copy failed'
    setTimeout(() => {
      copiedNotice.value = ''
    }, 2000)
  }
}

const handleBaconNormalModeKey = (key: string, activeTab: string) => {
  if (activeTab !== 'encrypt') return false
  if (key !== 'm') return false

  exportMode.value = exportMode.value === 'html' ? 'markdown' : 'html'
  return true
}

/**
 * Adapter used by CipherCard: mutates reactive state, then returns a computed value.
 * This relies on Vue's synchronous ref updates; use pure encoder/decoder helpers for non-mutating transforms.
 */
const baconEncrypt = (input: string) => {
  secretMessage.value = input
  return activeExport.value
}

/**
 * Adapter used by CipherCard: mutates reactive state, then returns a computed value.
 * This relies on Vue's synchronous ref updates; use pure encoder/decoder helpers for non-mutating transforms.
 */
const baconDecrypt = (input: string) => {
  encodedInput.value = input
  return extracted.value
}
</script>

<template>
  <CipherCard
    title="Bacon's Encoding"
    :encrypt-algorithm="() => baconEncrypt"
    :decrypt-algorithm="() => baconDecrypt"
    :encrypt-output-override="() => activeExport"
    :normal-mode-key-handler="handleBaconNormalModeKey"
    v-model:cipher-key="baconCoverKey"
  >
    <template #theory>
      <h3>The Origin Story</h3>
      <p>
        <strong>Bacon's Encoding</strong> is a steganographic system attributed to Francis Bacon in the
        early 1600s. Instead of disguising a message by shifting or scrambling letters, it hides the
        payload inside an innocent-looking cover text by giving letters one of two visual styles.
      </p>
      <p>
        That distinction matters: this is less about secret math and more about covert signaling.
        To a casual reader the text still looks readable, but to someone who knows the pattern, the
        typography itself becomes the channel.
      </p>

      <h3>The Mechanics</h3>
      <p>
        The modern version used here maps each plaintext letter A-Z to a five-symbol pattern of
        <code>a</code> and <code>b</code>. Think of <code>a</code> as binary <code>0</code> and
        <code>b</code> as binary <code>1</code>. Because five bits can represent 32 values, that is
        enough room to cover the 26-letter alphabet.
      </p>
      <p>
        Cryptotron applies those bits to the <em>alphabetic</em> characters in the cover text from
        left to right:
      </p>
      <ul>
        <li><strong>Type A</strong> = normal weight = <code>a</code> = 0</li>
        <li><strong>Type B</strong> = emphasized neon weight = <code>b</code> = 1</li>
      </ul>
      <p>
        Spaces, punctuation, and other non-letter characters stay visible in the cover text, but
        they do not consume bits. That means only letters count toward the available hiding
        capacity.
      </p>

      <h3>The Binary Mapping</h3>
      <p>
        Internally, the encoder converts each secret letter to its alphabet index using A=0,
        B=1, ..., Z=25. That number is then written as a five-bit binary value and translated into
        <code>a</code>/<code>b</code> symbols.
      </p>
      <div class="cipher-example">
        <strong>Worked example:</strong><br />
        H = 7<br />
        7 in binary = <code>00111</code><br />
        <code>00111</code> becomes <code>aabbb</code><br />
        So the next five alphabetic letters in the cover text are styled as:
        normal, normal, emphasized, emphasized, emphasized.
      </div>
      <p>
        If your secret message is <code>HELLO</code>, the encoder creates 25 total bits, so you need
        at least 25 alphabetic characters in the cover text. That acceptance rule is enforced here
        to prevent partial or ambiguous output.
      </p>

      <h3>Encoding and Extraction</h3>
      <p>
        In the <strong>Hide</strong> workflow, the app cleans the secret message down to A-Z,
        converts every letter into five Bacon bits, then overlays those bits onto the cover text.
        The live preview shows what the styled carrier text will look like.
      </p>
      <p>
        In the <strong>Extract</strong> workflow, the decoder reads the style markers back in. Bold
        or <code>b-b</code> spans are treated as binary 1, unstyled or Type A letters become binary
        0, and the stream is then chunked into five-bit groups to recover the hidden message.
      </p>
      <p>
        The HTML export preserves explicit <code>span</code> classes for reliable recovery, while the
        Markdown export uses bold formatting as a lightweight fallback.
      </p>

      <h3>Modern Perspective</h3>
      <p>
        Bacon's Encoding is a good lesson in the difference between <strong>encryption</strong> and
        <strong>steganography</strong>. The message is not mathematically protected against a curious
        observer who notices the pattern; instead, the goal is to avoid attracting attention in the
        first place.
      </p>
      <p>
        So the real risk is not brute force. It is detection. If the styling contrast is too loud,
        the carrier text looks suspicious. If the cover text is too short or unnatural, the pattern
        becomes easier to spot. What matters is not just whether the encoding works, but whether the
        hiding still looks plausible.
      </p>
    </template>

    <template #cipherKey>
      <div class="control-group">
        <label class="control-label">Cover Text</label>
        <textarea
          v-model="coverText"
          rows="6"
          class="cipher-textarea cipher-input"
          placeholder="Enter the visible carrier text..."
        />
      </div>
    </template>

    <template #encryptOutput>
      <div class="bacon-practice-stack">
        <p v-if="lengthError" class="status-error bacon-inline-error">
          <span>{{ lengthError }}</span>
        </p>

        <div class="control-group">
          <div class="bacon-preview-header">
            <label class="control-label">Live Preview</label>
          </div>
          <div class="bacon-preview">
            <span v-for="(item, idx) in preview" :key="idx" :class="`b-${item.type}`">{{ item.char }}</span>
          </div>
        </div>

        <div class="control-group">
          <div class="bacon-preview-header">
            <label class="control-label">Export Output</label>
            <div class="bacon-export-actions">
              <button
                class="cipher-button bacon-secondary-button"
                type="button"
                @click="exportMode = exportMode === 'html' ? 'markdown' : 'html'"
              >
                {{ exportMode === 'html' ? 'Switch to Markdown (m)' : 'Switch to HTML (m)' }}
              </button>
              <button class="cipher-button bacon-secondary-button" type="button" @click="copyActiveExport">
                Copy {{ exportMode.toUpperCase() }}
              </button>
            </div>
          </div>
          <p v-if="copiedNotice" class="bacon-copy-notice">{{ copiedNotice }}</p>
          <textarea :value="activeExport" rows="8" class="cipher-textarea" readonly />
        </div>

      </div>
    </template>

    <template #decryptOutput>
      <div class="control-group">
        <label class="control-label">Decoded Secret Preview</label>
        <textarea :value="extracted" rows="3" class="cipher-textarea" readonly />
      </div>
    </template>
  </CipherCard>
</template>

<style scoped>
@import '@/assets/cipher-card.css';

.bacon-practice-stack {
  display: grid;
  gap: 1.25rem;
}

.bacon-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.bacon-export-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}


.bacon-preview {
  border: 1px solid var(--cryptotron-border-glow);
  background: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  padding: 1rem;
  min-height: 5rem;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--cryptotron-text-primary);
  font-family: 'Space Mono', monospace;
}

.b-a {
  font-weight: 400;
  color: var(--cryptotron-text-primary);
}

.b-b {
  font-weight: 700;
  color: var(--neon-green);
  text-shadow: 0 0 5px var(--neon-green);
}

.bacon-inline-error {
  margin-top: -0.25rem;
}

.bacon-copy-notice {
  margin: 0 0 0.5rem;
  color: var(--neon-green);
  font-family: 'Space Mono', monospace;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.theory-content code {
  font-family: var(--font-mono);
  color: var(--neon-green);
}

.theory-content ul {
  margin: 0 0 1rem;
  padding-left: 1.25rem;
  display: grid;
  gap: 0.35rem;
}
</style>
