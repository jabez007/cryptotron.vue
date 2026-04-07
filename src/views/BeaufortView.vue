<script setup lang="ts">
import { beaufort } from '@jabez007/cryptotron.js'
import CipherCard from '@/components/CipherCard.vue'
import KeyBeaufort from '@/components/keys/KeyBeaufort.vue'
import { ref } from 'vue'

const beaufortCipherKey = ref({
  keyword: 'lumberjack',
})
</script>

<template>
  <CipherCard
    title="Beaufort Cipher"
    :encrypt-algorithm="beaufort.encrypt(beaufortCipherKey)"
    :decrypt-algorithm="beaufort.decrypt(beaufortCipherKey)"
    :crack-algorithm="beaufort.crack"
    :cipher-key="beaufortCipherKey"
  >
    <template v-slot:theory>
      <p>
        Created by Sir Francis Beaufort in the 19th century, this cipher is similar to Vigenère but
        uses a reversed encryption process. It was used in the Royal Navy for weather logs.
      </p>

      <h3>How It Works</h3>
      <p>
        Encryption involves subtracting the plaintext value from the key value (mod 26). This creates
        a "reciprocal" property where encryption and decryption use the exact same steps. Example
        with key "FORTIFY":
      </p>
      <div class="cipher-example aligned">
        <div class="example-row">
          <span class="row-label">Plaintext:</span>
          <span class="char-cell">D</span><span class="char-cell">E</span><span class="char-cell">F</span><span class="char-cell">E</span><span class="char-cell">N</span><span class="char-cell">D</span><span class="char-cell">T</span><span class="char-cell">H</span><span class="char-cell">E</span><span class="char-cell">E</span><span class="char-cell">A</span><span class="char-cell">S</span><span class="char-cell">T</span>
        </div>
        <div class="example-row">
          <span class="row-label">Key:</span>
          <span class="char-cell highlighted">F</span><span class="char-cell highlighted">O</span><span class="char-cell highlighted">R</span><span class="char-cell highlighted">T</span><span class="char-cell highlighted">I</span><span class="char-cell highlighted">F</span><span class="char-cell highlighted">Y</span><span class="char-cell highlighted">F</span><span class="char-cell highlighted">O</span><span class="char-cell highlighted">R</span><span class="char-cell highlighted">T</span><span class="char-cell highlighted">I</span><span class="char-cell highlighted">F</span>
        </div>
        <div class="example-row">
          <span class="row-label">Ciphertext:</span>
          <span class="char-cell result">C</span><span class="char-cell result">K</span><span class="char-cell result">M</span><span class="char-cell result">P</span><span class="char-cell result">V</span><span class="char-cell result">C</span><span class="char-cell result">F</span><span class="char-cell result">Y</span><span class="char-cell result">K</span><span class="char-cell result">N</span><span class="char-cell result">T</span><span class="char-cell result">Q</span><span class="char-cell result">M</span>
        </div>
      </div>

      <h3>Mathematical Formula</h3>
      <p>Encryption: <strong>E(x_i) = (k_i - x_i) mod 26</strong></p>
      <p>Decryption: <strong>D(y_i) = (k_i - y_i) mod 26</strong></p>

      <h3>Security</h3>
      <p>
        Comparable to Vigenère, but its reciprocal property (encryption = decryption) can simplify
        attacks in some cases.
      </p>
    </template>
    <template v-slot:cipherKey>
      <KeyBeaufort v-model:cipher-key="beaufortCipherKey" />
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
