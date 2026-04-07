<script setup lang="ts">
import { autokey } from '@jabez007/cryptotron.js'
import CipherCard from '@/components/CipherCard.vue'
import KeyAutokey from '@/components/keys/KeyAutokey.vue'
import { ref } from 'vue'

const autokeyCipherKey = ref({
  primer: 'bytewalker',
})
</script>

<template>
  <CipherCard
    title="Autokey Cipher"
    :encrypt-algorithm="autokey.encrypt(autokeyCipherKey)"
    :decrypt-algorithm="autokey.decrypt(autokeyCipherKey)"
    :crack-algorithm="autokey.crack"
    :cipher-key="autokeyCipherKey"
  >
    <template v-slot:theory>
      <p>
        Developed by Giovan Battista Bellaso in 1564, the Autokey cipher improves on Vigenère by
        using the plaintext itself as part of the key, making it harder to break with traditional
        methods.
      </p>

      <h3>How It Works</h3>
      <p>
        The key starts with a primer (the initial secret), then extends by appending the plaintext
        message itself. This ensures the key never repeats. For example, with primer "K" and
        plaintext "MEET AT MIDNIGHT":
      </p>
      <div class="cipher-example aligned">
        <div class="example-row">
          <span class="row-label">Plaintext:</span>
          <span class="char-cell">M</span><span class="char-cell">E</span><span class="char-cell">E</span><span class="char-cell">T</span><span class="char-cell">A</span><span class="char-cell">T</span><span class="char-cell">M</span><span class="char-cell">I</span><span class="char-cell">D</span><span class="char-cell">N</span><span class="char-cell">I</span><span class="char-cell">G</span><span class="char-cell">H</span><span class="char-cell">T</span>
        </div>
        <div class="example-row">
          <span class="row-label">Key:</span>
          <span class="char-cell highlighted">K</span><span class="char-cell">M</span><span class="char-cell">E</span><span class="char-cell">E</span><span class="char-cell">T</span><span class="char-cell">A</span><span class="char-cell">T</span><span class="char-cell">M</span><span class="char-cell">I</span><span class="char-cell">D</span><span class="char-cell">N</span><span class="char-cell">I</span><span class="char-cell">G</span><span class="char-cell">H</span>
        </div>
        <div class="example-row">
          <span class="row-label">Ciphertext:</span>
          <span class="char-cell result">W</span><span class="char-cell result">Q</span><span class="char-cell result">I</span><span class="char-cell result">X</span><span class="char-cell result">T</span><span class="char-cell result">T</span><span class="char-cell result">F</span><span class="char-cell result">U</span><span class="char-cell result">L</span><span class="char-cell result">Q</span><span class="char-cell result">V</span><span class="char-cell result">O</span><span class="char-cell result">N</span><span class="char-cell result">A</span>
        </div>
      </div>

      <h3>Mathematical Formula</h3>
      <p>Encryption: <strong>E(x_i) = (x_i + k_i) mod 26</strong></p>
      <p>
        Where
        <strong
          >k_i = primer_i (for i ≤ primer length) or x_{i-primer length} (for i > primer
          length)</strong
        >
      </p>

      <h3>Security</h3>
      <p>
        More secure than Vigenère against Kasiski examination (no repeating key patterns), but
        vulnerable to known-plaintext attacks.
      </p>
    </template>
    <template v-slot:cipherKey>
      <KeyAutokey v-model:cipher-key="autokeyCipherKey" />
    </template>
  </CipherCard>
</template>

<style scoped>
.cipher-example.aligned {
  background: rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--cryptotron-grid-color);
  margin: 1.5rem 0;
  font-family: 'Space Mono', monospace;
  overflow-x: auto;
}

.example-row {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  white-space: nowrap;
}

.example-row:last-child {
  margin-bottom: 0;
}

.row-label {
  display: inline-block;
  width: 120px;
  color: var(--cryptotron-text-secondary);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.char-cell {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 30px;
  border: 1px solid rgba(0, 255, 255, 0.1);
  margin-right: 2px;
  color: var(--cryptotron-text-primary);
  font-weight: 700;
}

.char-cell.highlighted {
  color: var(--neon-magenta);
  border-color: rgba(255, 0, 255, 0.2);
  background: rgba(255, 0, 255, 0.05);
}

.char-cell.result {
  color: var(--neon-green);
  border-color: rgba(0, 255, 65, 0.2);
  background: rgba(0, 255, 65, 0.05);
  text-shadow: 0 0 5px var(--neon-green);
}
</style>
