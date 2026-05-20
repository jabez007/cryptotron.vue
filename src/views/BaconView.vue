<script setup lang="ts">
import CipherCard from '@/components/CipherCard.vue'
import CipherOutput from '@/components/CipherOutput.vue'
import { computed, ref } from 'vue'
import {
  baconDecoder,
  baconEncoder,
  toHtmlSnippet,
  toMarkdown,
  type StyledChar,
} from '@/utils/steganography'
import { generateBaconCover } from '@/utils/text-gen'

const baconCoverKey = ref({ coverText: '' })
const secretMessage = ref('')
const encodedInput = ref('')
const exportMode = ref<'html' | 'markdown'>('html')

const coverText = computed({
  get: () => baconCoverKey.value.coverText ?? '',
  set: (value: string) => {
    baconCoverKey.value = {
      ...baconCoverKey.value,
      coverText: value,
    }
  },
})

const bitLength = computed(
  () => secretMessage.value.toUpperCase().replace(/[^A-Z]/g, '').length * 5,
)

const handleGenerateCover = () => {
  if (bitLength.value === 0) return
  coverText.value = generateBaconCover(bitLength.value)
  if (secretMessage.value) {
    updatePreview()
    updateActiveExport()
  }
}

const preview = ref<StyledChar[]>([])

const updatePreview = () => {
  try {
    preview.value = baconEncoder(secretMessage.value, coverText.value)
  } catch (error) {
    console.error('Bacon encoder preview failed', {
      error,
      secretLength: secretMessage.value.length,
      coverLength: coverText.value.length,
    })
    preview.value = [...coverText.value].map((char) => ({
      char,
      type: 'a' as const,
      carriesBit: false,
    }))
  }
}

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

const activeExport = ref('')

const updateActiveExport = () => {
  activeExport.value =
    exportMode.value === 'html' ? toHtmlSnippet(preview.value) : toMarkdown(preview.value)
}

const toggleExportMode = () => {
  exportMode.value = exportMode.value === 'html' ? 'markdown' : 'html'
  updateActiveExport()
}

const handleBaconNormalModeKey = (key: string, activeTab: string) => {
  if (activeTab !== 'encrypt') return false

  if (key === 'm') {
    toggleExportMode()
    return true
  }

  if (key === 'g') {
    handleGenerateCover()
    updatePreview()
    return true
  }

  return false
}

/**
 * Adapter used by CipherCard: mutates reactive state, then returns a computed value.
 * This relies on Vue's synchronous ref updates; use pure encoder/decoder helpers for non-mutating transforms.
 */
const baconEncrypt = (input: string) => {
  secretMessage.value = input
  updatePreview()
  updateActiveExport()
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
    :on-encrypt-input-change="(val: string) => { secretMessage = val; preview = []; activeExport = ''; }"
    :on-encrypt-clear="() => { secretMessage = ''; coverText = ''; preview = []; activeExport = ''; }"
    :encrypt-feedback="lengthError"
    v-model:cipher-key="baconCoverKey"
  >
    <template #theory>
      <h3>I. Omnia per Omnia</h3>
      <p>
        In his seminal 1605 work <em>The Advancement of Learning</em>, Sir Francis Bacon described
        the "highest degree of a cipher" as one that could signify
        <strong>Omnia per Omnia</strong>—Latin for "all things by all things."
      </p>
      <p>
        Bacon’s philosophy was radical: he realized that any medium capable of a "twofold
        difference"—any binary state—could be used to carry a hidden message. Whether it be two
        different typefaces in a book, two types of stones in a wall, or the alternating tones of a
        bell, the message could be woven into the very fabric of the mundane.
      </p>

      <h3>II. Origins: The Biliteral Cipher</h3>
      <p>
        Conceived in the late 16th century, the <strong>Biliteral Cipher</strong> represents the
        exact point where cryptography (the art of secret writing) meets steganography (the art of
        hidden writing).
      </p>
      <p>
        Unlike shifting ciphers (like Caesar) or scrambling ciphers (like Rail-Fence), Bacon’s
        method does not alter the underlying plaintext. Instead, it uses a <strong>carrier</strong>.
        To a casual observer, the carrier text is perfectly readable prose. But to the initiated,
        the <em>typography itself</em> becomes the channel.
      </p>

      <h3>III. Mechanisms: The Binary Ancestor</h3>
      <p>
        Technically, Bacon’s cipher is a <strong>5-bit binary encoding system</strong>, predating
        modern computing by nearly three centuries. It works in two distinct layers:
      </p>
      <div class="anatomy-grid">
        <div class="anatomy-card">
          <h4>The Alphabet</h4>
          <p>
            Each secret letter is mapped to a unique five-symbol sequence of <code>a</code> and
            <code>b</code>.
          </p>
        </div>
        <div class="anatomy-card">
          <h4>The Infolding</h4>
          <p>
            The symbols are applied to the <em>visual style</em> of letters in an innocent cover
            text.
          </p>
        </div>
      </div>
      <div class="cipher-example">
        <strong>The Modern Mapping:</strong><br />
        A = <code>aaaaa</code> (00000)<br />
        B = <code>aaaab</code> (00001)<br />
        C = <code>aaaba</code> (00010)<br />
        ... and so on. Five bits provide 32 combinations, more than enough for the 26-letter
        alphabet.
      </div>

      <h3>IV. The Shakespeare Controversy</h3>
      <p>
        In the late 19th century, proponents of the "Baconian theory" claimed that Sir Francis Bacon
        was the true author of Shakespeare’s plays. They believed he used the Biliteral Cipher
        within the <strong>First Folio</strong> to embed his own name and secret history within the
        typography of the verses.
      </p>
      <p>
        While modern scholars have largely debunked these claims as "over-reading" minor printing
        variations, the investigation itself helped birth modern military cryptology. The techniques
        used to hunt for Bacon’s ghost in Shakespeare laid the foundation for the cracking of the
        great codes of the 20th century.
      </p>

      <h3>V. Modern Legacy: Knowledge is Power</h3>
      <p>
        William and Elizabeth Friedman, pioneers of American cryptanalysis, were deeply influenced
        by Bacon. In a famous 1918 photograph of their staff at Riverbank Laboratories, they
        arranged the officers to face either toward or away from the camera.
      </p>
      <p>
        When decoded using Bacon’s biliteral system (treating "facing camera" as <code>b</code> and
        "facing away" as <code>a</code>), the officers' positions spelled out Bacon's most famous
        maxim: <strong>KNOWLEDGE IS POWER.</strong>
      </p>

      <h3>VI. Perception is Reality</h3>
      <p>
        Bacon’s Encoding remains a powerful lesson in the Spire: the most effective hiding places
        are the ones no one thinks to look at. By turning the "noise" of typography into a "signal"
        of data, we remind ourselves that <strong>stability</strong> often requires a second script
        written between the lines of the first.
      </p>
      <p>
        In Cryptotron, we apply this principle to <strong>System Logs</strong>. By varying the
        weight of characters in a realistic log stream, we submerge our data in the very heartbeat
        of the machine.
      </p>
    </template>

    <template #cipherKey="{ panel }">
      <div v-if="panel !== 'decrypt'" class="control-group">
        <div class="bacon-preview-header">
          <label class="control-label">Cover Text</label>
          <button
            class="cipher-button bacon-secondary-button"
            type="button"
            @click="handleGenerateCover"
            :disabled="bitLength === 0"
          >
            Generate Cover (g)
          </button>
        </div>
        <textarea
          v-model="coverText"
          rows="6"
          class="cipher-textarea cipher-input"
          placeholder="Enter the visible carrier text or generate one..."
        />
      </div>
    </template>

    <template #encryptOutput>
      <div class="bacon-practice-stack">
        <div>
          <div class="bacon-preview-header">
            <label class="control-label">Live Preview</label>
          </div>
          <div class="bacon-preview cyber-panel">
            <span v-for="(item, idx) in preview" :key="idx" :class="`b-${item.type}`">{{
              item.char
            }}</span>
          </div>
        </div>

        <div>
          <div class="bacon-preview-header">
            <label class="control-label">Export Output</label>
            <div class="bacon-export-actions">
              <button
                class="cipher-button bacon-secondary-button"
                type="button"
                @click="toggleExportMode"
              >
                {{ exportMode === 'html' ? 'Switch to Markdown (m)' : 'Switch to HTML (m)' }}
              </button>
            </div>
          </div>
          <CipherOutput :label="exportMode.toUpperCase()" :text="activeExport" />
        </div>
      </div>
    </template>
  </CipherCard>
</template>

<style scoped>
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
  height: 150px;
  overflow-y: auto;
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
  color: var(--cryptotron-neon-green);
  text-shadow: 0 0 5px var(--cryptotron-neon-green);
}
</style>
