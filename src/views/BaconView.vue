<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { baconDecoder, baconEncoder, toHtmlSnippet, toMarkdown, type StyledChar } from '@/utils/steganography'

const activeTab = ref<'theory' | 'hide' | 'extract'>('theory')
const revealMode = ref(false)

const secretMessage = ref('')
const coverText = ref('')
const encodedInput = ref('')

const preview = computed<StyledChar[]>(() => {
  try {
    return baconEncoder(secretMessage.value, coverText.value)
  } catch (error) {
    console.error("Bacon encoder preview failed", {
      error,
      secretMessage: secretMessage.value,
      coverText: coverText.value,
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
      encodedInput: encodedInput.value,
    })
    return ''
  }
})

const htmlExport = computed(() => toHtmlSnippet(preview.value))
const markdownExport = computed(() => toMarkdown(preview.value))

const handleHotkey = (event: KeyboardEvent) => {
  if (event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLInputElement) return
  if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return

  if (event.key === 'r') revealMode.value = !revealMode.value
  if (event.key === 'e') activeTab.value = 'hide'
  if (event.key === 'd') activeTab.value = 'extract'
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleHotkey)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleHotkey)
  }
})
</script>

<template>
  <section class="bacon-view">
    <h1>Bacon's Cipher</h1>

    <div class="tabs">
      <button :class="{ active: activeTab === 'theory' }" @click="activeTab = 'theory'">Theory</button>
      <button :class="{ active: activeTab === 'hide' }" @click="activeTab = 'hide'">Hide</button>
      <button :class="{ active: activeTab === 'extract' }" @click="activeTab = 'extract'">Extract</button>
    </div>

    <div v-if="activeTab === 'theory'" class="panel theory-content">
      <p>
        <strong>Bacon's Cipher</strong> is a steganographic technique from the early 1600s, credited to Francis Bacon.
        Instead of scrambling letters like Caesar or Vigenère, it hides a message in plain sight by changing style.
      </p>
      <p>
        The modern variant used here maps each secret letter A-Z to a five-character pattern made of <code>a</code> and
        <code>b</code>. You can think of <code>a</code> as binary 0 and <code>b</code> as binary 1. Since five bits can represent
        32 values, we have enough room to encode all 26 letters.
      </p>
      <p>
        In Cryptotron, each alphabetic character in the cover text carries one bit:
      </p>
      <ul>
        <li><strong>Type A</strong> (normal weight) = <code>a</code> = 0</li>
        <li><strong>Type B</strong> (bright emphasized text) = <code>b</code> = 1</li>
      </ul>
      <p>
        After five styled letters, the decoder reads one hidden character. Spaces and punctuation are preserved in the
        cover text but do not consume bits.
      </p>
      <p>
        <strong>Example:</strong> The letter <code>H</code> is index 7 in A=0 indexing, binary <code>00111</code>, which becomes
        <code>aabbb</code>. If your cover starts with "There...", the first five alphabetic letters would be styled as:
        normal, normal, bold, bold, bold.
      </p>
      <p>
        To hide a full message, the app concatenates these five-bit groups and applies them left-to-right over the
        cover text. To extract, it reads styling back into bits, chunks them by five, and maps each chunk to a letter.
      </p>
      <p>
        Use this when you want subtle message hiding rather than cryptographic strength. Anyone who notices the
        style pattern can decode it, so the real security comes from plausible cover text and not drawing attention to
        the Type A/Type B distinction.
      </p>
    </div>

    <div v-if="activeTab === 'hide'" class="panel">
      <label>Secret Message</label>
      <textarea v-model="secretMessage" rows="4" />

      <label>Cover Text</label>
      <textarea v-model="coverText" rows="6" />

      <p v-if="lengthError" class="error">{{ lengthError }}</p>

      <div class="preview" :class="{ reveal: revealMode }">
        <span v-for="(item, idx) in preview" :key="idx" :class="`b-${item.type}`">{{ item.char }}</span>
      </div>

      <label>HTML Export</label>
      <textarea :value="htmlExport" rows="6" readonly />

      <label>Markdown Export</label>
      <textarea :value="markdownExport" rows="4" readonly />
    </div>

    <div v-if="activeTab === 'extract'" class="panel">
      <label>Encoded Text (HTML/Markdown)</label>
      <textarea v-model="encodedInput" rows="8" />

      <label>Extracted Secret</label>
      <textarea :value="extracted" rows="3" readonly />
    </div>
  </section>
</template>

<style scoped>
.bacon-view { display: grid; gap: 1rem; }
.tabs { display: flex; gap: 0.5rem; }
button.active { border-color: var(--neon-green); color: var(--neon-green); }
.panel {
  display: grid;
  gap: 0.75rem;
  border: 1px solid var(--cryptotron-grid-color);
  border-radius: 10px;
  background: var(--panel-bg);
  padding: 1rem;
}

.panel label {
  font-weight: 600;
  color: var(--text-secondary);
}

.theory-content ul {
  margin: 0;
  padding-left: 1.25rem;
  display: grid;
  gap: 0.35rem;
}

.theory-content code {
  font-family: var(--font-mono);
  color: var(--neon-green);
}

.preview {
  border: 1px solid var(--cryptotron-grid-color);
  background: color-mix(in srgb, var(--panel-bg) 85%, black 15%);
  padding: 1rem;
  border-radius: 8px;
  min-height: 5rem;
  white-space: pre-wrap;
  word-break: break-word;
}
.b-a { font-weight: 400; color: var(--text-primary); }
.b-b { font-weight: 700; color: var(--neon-green); text-shadow: 0 0 5px var(--neon-green); }
.preview.reveal .b-b { color: var(--neon-magenta); text-shadow: 0 0 8px var(--neon-magenta); }
.error { color: #ff6b6b; }
textarea {
  width: 100%;
  border: 1px solid var(--cryptotron-grid-color);
  border-radius: 8px;
  background: var(--panel-bg);
  color: var(--text-primary);
  padding: 0.75rem;
  resize: vertical;
}

textarea[readonly] {
  opacity: 0.95;
}
</style>
