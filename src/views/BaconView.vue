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

    <div v-if="activeTab === 'theory'" class="panel">
      <p>
        Bacon's Cipher maps each plaintext letter (A-Z) into a 5-symbol sequence of a/b, then hides those
        symbols in visible typography changes across a cover text.
      </p>
      <p>
        In this implementation, normal letters are Type A and emphasized letters are Type B. Five styled letters
        decode to one secret character.
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
.panel { display: grid; gap: 0.6rem; }
.preview {
  border: 1px solid var(--cryptotron-grid-color);
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
textarea { width: 100%; }
</style>
