<script setup lang="ts">
import CipherCard from '@/components/CipherCard.vue'
import { computed, ref } from 'vue'
import { generateAcrostic } from '@/utils/text-gen'

const acrosticMode = ref<'acrostic' | 'telestic' | 'compound'>('acrostic')
const secretMessage = ref('')
const acrosticKey = ref({ coverText: '' })

const coverText = computed({
  get: () => acrosticKey.value.coverText ?? '',
  set: (value: string) => {
    acrosticKey.value = {
      ...acrosticKey.value,
      coverText: value,
    }
  },
})

const coverLines = computed(() => coverText.value.split('\n').filter(l => l.length > 0))

const handleGenerateAcrostic = () => {
  if (!secretMessage.value) return
  coverText.value = generateAcrostic(secretMessage.value, acrosticMode.value)
}

const acrosticEncrypt = (input: string) => {
  secretMessage.value = input
  // Always regenerate logs to keep it fresh and automated
  handleGenerateAcrostic()
  return coverText.value
}

const stripMetadata = (line: string) => line.trim().replace(/^(\[[^\]]+\]\s*)+/, '')

const getLineData = (line: string) => {
  const content = stripMetadata(line)
  return {
    first: content[0] || '',
    last: content[content.length - 1] || '',
    content: line,
  }
}

const acrosticDecrypt = (input: string) => {
  const lines = input.split('\n').filter(l => l.trim().length > 0)
  
  if (acrosticMode.value === 'acrostic') {
    return lines.map(l => stripMetadata(l)[0] || '').join('')
  } else if (acrosticMode.value === 'telestic') {
    return lines.map(l => {
      const content = stripMetadata(l)
      return content[content.length - 1] || ''
    }).join('')
  } else {
    // Compound
    return lines.map(l => {
      const content = stripMetadata(l)
      if (content.length < 2) return content
      return content[0] + content[content.length - 1]
    }).join('')
  }
}

const handleAcrosticNormalModeKey = (key: string, activeTab: string) => {
  if (activeTab !== 'encrypt') return false

  if (key === 'g') {
    handleGenerateAcrostic()
    return true
  }

  if (key === 'm') {
    const modes: ('acrostic' | 'telestic' | 'compound')[] = ['acrostic', 'telestic', 'compound']
    const nextIdx = (modes.indexOf(acrosticMode.value) + 1) % modes.length
    acrosticMode.value = modes[nextIdx]
    return true
  }

  return false
}
</script>

<template>
  <CipherCard
    title="Acrostics & Telestics"
    :encrypt-algorithm="() => acrosticEncrypt"
    :decrypt-algorithm="() => acrosticDecrypt"
    :normal-mode-key-handler="handleAcrosticNormalModeKey"
    v-model:cipher-key="acrosticKey"
  >
    <template #theory>
      <h3>I. The Architecture of Silence</h3>
      <p>
        Standard reading is an act of <strong>horizontal momentum</strong>. Your eyes scan from left
        to right, processing words as linear sequences of meaning. In the Spire, we call this "The
        Surface." But for a steganographer, the most valuable real estate is not the line itself—it
        is the <strong>gutter</strong>.
      </p>
      <p>
        <strong>Acrostics</strong> and <strong>Telestics</strong> are the art of the vertical
        signal. By anchoring secret characters to the margins of a text, a message can be submerged
        "under" the prose, perfectly visible but entirely overlooked by the linear mind.
      </p>

      <h3>II. Origins: The Sibylline Proof</h3>
      <p>
        The term "acrostic" (from the Greek <em>akros</em>, meaning "at the end" or "outermost," and
        <em>stichos</em>, meaning "line of verse") was first popularized by the
        <strong>Sibylline Oracles</strong>—the prophetesses of the ancient world.
      </p>
      <p>
        The Roman orator Cicero noted that the "true" Sibylline verses were distinguished from
        forgeries by their acrostic structure. He argued that the presence of a vertical message
        proved the text was composed with <strong>deliberate care</strong> and logic, rather than in
        a state of uncontrolled frenzy.
      </p>
      <div class="cipher-example">
        <strong>The Great Christological Acrostic:</strong><br />
        In the 2nd century, a 34-line Greek poem was found where the initial letters spelled out:
        <em>"Jesus Christ, Son of God, Savior, Cross."</em> The first five words formed the acronym
        <strong>ICHTHYS</strong> (Fish), creating a secret sign for early Christians that remained
        "submerged" within seemingly pagan oracular tradition.
      </div>

      <h3>III. Medieval Watermarks & Secret Lovers</h3>
      <p>
        During the Middle Ages and the Renaissance, these techniques evolved into structural
        "watermarks" for authors who wished to claim their work—or their secrets—without alerting the
        uninitiated.
      </p>
      <ul>
        <li>
          <strong>Aldhelm of Malmesbury (7th Century):</strong> A master of the "Double Acrostic." He
          composed poems where the first letters spelled a sentence, and the last letters spelled
          the <em>same sentence in reverse</em>, effectively locking the text in a vertical frame.
        </li>
        <li>
          <strong>The Lover Monk (1499):</strong> The enigmatic book
          <em>Hypnerotomachia Poliphili</em> hid its author's identity in the first letter of its 38
          chapters. Read in sequence, they spelled:
          <em>"Poliam frater Franciscus Columna peramavit"</em>—revealing that Brother Francesco
          Colonna passionately loved a woman named Polia.
        </li>
      </ul>

      <h3>IV. Anatomy of the Vertical Signal</h3>
      <p>There are three primary modes of vertical synchronization:</p>
      <div class="anatomy-grid">
        <div class="anatomy-card">
          <h4>Acrostic</h4>
          <p>The signal is anchored to the <strong>first letter</strong> of every line.</p>
        </div>
        <div class="anatomy-card">
          <h4>Telestic</h4>
          <p>The signal is anchored to the <strong>last letter</strong> of every line.</p>
        </div>
        <div class="anatomy-card">
          <h4>Compound</h4>
          <p>Signals are anchored to <strong>both</strong> margins, doubling the data density.</p>
        </div>
      </div>

      <h3>V. The Psychology of the Gutter</h3>
      <p>
        Why does this work? It relies on <strong>Saccadic Masking</strong>. When we read, our eyes
        don't move smoothly; they jump in quick hops called <em>saccades</em>. Our brain suppresses
        visual input during these jumps to maintain a steady image.
      </p>
      <p>
        Because we are trained to jump from the end of one line to the start of the next, the
        "gutters" of a text block are effectively dead zones in our conscious attention. Unless a
        reader is specifically looking for vertical patterns, the brain filters out the marginal
        characters to focus on the semantic content of the sentence.
      </p>

      <h3>VI. Submerged in the Stream</h3>
      <p>
        In the modern digital landscape, prose is often too "loud" to be an effective cover. A poem
        stands out; a story invites scrutiny.
      </p>
      <p>
        <strong>The Cryptotron Solution:</strong> Instead of literature, we use
        <strong>System Logs</strong>. A stream of high-fidelity logs, complete with timestamps and
        PIDs, is the ultimate "white noise." It is boring, technical, and voluminous—the perfect
        ocean in which to submerge a vertical signal.
      </p>
      <p>
        When you use the <strong>Vertical Synchronization</strong> tool, you aren't just hiding a
        word; you are weaving it into the heartbeat of the Spire.
      </p>
    </template>

    <template #cipherKey>
      <div class="control-group">
        <label class="control-label">Position Mode (m)</label>
        <div class="mode-selector">
          <button 
            v-for="m in ['acrostic', 'telestic', 'compound']" 
            :key="m"
            class="cipher-button"
            :class="{ active: acrosticMode === m }"
            @click="acrosticMode = m as any"
          >
            {{ m.charAt(0).toUpperCase() + m.slice(1) }}
          </button>
        </div>
      </div>
    </template>

    <template #encryptOutput>
      <div class="acrostic-preview">
        <div v-for="(line, idx) in coverLines" :key="idx" class="acrostic-line">
          <span class="gutter-marker" v-if="acrosticMode !== 'telestic'">
            {{ getLineData(line).first }}
          </span>
          <span class="line-content">{{ line }}</span>
          <span class="gutter-marker" v-if="acrosticMode !== 'acrostic'">
            {{ getLineData(line).last }}
          </span>
        </div>
      </div>
    </template>
  </CipherCard>
</template>

<style scoped>
@import '@/assets/cipher-card.css';

.mode-selector {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.mode-selector .cipher-button.active {
  background: var(--neon-cyan);
  color: #000;
  box-shadow: 0 0 10px var(--neon-cyan);
}

.acrostic-preview {
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid var(--cryptotron-border-glow);
  padding: 1.5rem;
  border-radius: 8px;
  font-family: 'Space Mono', monospace;
  min-height: 10rem;
}

.acrostic-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  border-bottom: 1px solid rgba(0, 255, 65, 0.1);
  padding-bottom: 0.25rem;
}

.gutter-marker {
  color: var(--neon-magenta);
  font-weight: 700;
  width: 1.5rem;
  text-align: center;
}

.line-content {
  flex: 1;
  color: var(--cryptotron-text-primary);
  padding: 0 1rem;
}

.bacon-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.bacon-secondary-button {
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
}
</style>
