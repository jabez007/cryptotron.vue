<script setup lang="ts">
import { vigenere } from '@jabez007/cryptotron.js'
import CipherCard from '@/components/CipherCard.vue'
import KeyVigenere from '@/components/keys/KeyVigenere.vue'
import { ref } from 'vue'

const vigenereCipherKey = ref({
  keyword: 'mockraven',
})
</script>

<template>
  <CipherCard
    title="Vigenère Cipher"
    :encrypt-algorithm="vigenere.encrypt(vigenereCipherKey)"
    :decrypt-algorithm="vigenere.decrypt(vigenereCipherKey)"
    :crack-algorithm="vigenere.crack"
    :cipher-key="vigenereCipherKey"
  >
    <template v-slot:theory>
      <p>
        The Vigenère cipher is a more advanced encryption method that emerged in the 16th century,
        often attributed to Blaise de Vigenère, though it was actually first described by Giovan
        Battista Bellaso in 1553.
      </p>

      <h3>How It Works</h3>
      <p>
        The Vigenère cipher is a polyalphabetic substitution cipher that uses a keyword to shift
        letters in the plaintext. Unlike the Caesar cipher which uses a single shift value, the
        Vigenère cipher uses multiple shift values based on the letters of the keyword. For example,
        with the keyword "KEY":
      </p>

      <div class="cipher-example aligned">
        <div class="example-row">
          <span class="row-label">Plaintext:</span>
          <span class="char-cell">A</span><span class="char-cell">T</span><span class="char-cell">T</span><span class="char-cell">A</span><span class="char-cell">C</span><span class="char-cell">K</span><span class="char-cell">A</span><span class="char-cell">T</span><span class="char-cell">D</span><span class="char-cell">A</span><span class="char-cell">W</span><span class="char-cell">N</span>
        </div>
        <div class="example-row">
          <span class="row-label">Key:</span>
          <span class="char-cell highlighted">K</span><span class="char-cell highlighted">E</span><span class="char-cell highlighted">Y</span><span class="char-cell highlighted">K</span><span class="char-cell highlighted">E</span><span class="char-cell highlighted">Y</span><span class="char-cell highlighted">K</span><span class="char-cell highlighted">E</span><span class="char-cell highlighted">Y</span><span class="char-cell highlighted">K</span><span class="char-cell highlighted">E</span><span class="char-cell highlighted">Y</span>
        </div>
        <div class="example-row">
          <span class="row-label">Ciphertext:</span>
          <span class="char-cell result">K</span><span class="char-cell result">X</span><span class="char-cell result">R</span><span class="char-cell result">C</span><span class="char-cell result">E</span><span class="char-cell result">M</span><span class="char-cell result">K</span><span class="char-cell result">B</span><span class="char-cell result">D</span><span class="char-cell result">K</span><span class="char-cell result">B</span><span class="char-cell result">Y</span>
        </div>
      </div>

      <h3>Mathematical Formula</h3>
      <p>For encryption: <strong>E(x_i) = (x_i + k_(i mod m)) mod 26</strong></p>
      <p>For decryption: <strong>D(x_i) = (x_i - k_(i mod m)) mod 26</strong></p>
      <p>
        Where x_i is the i-th letter position (A=0, B=1, ..., Z=25), k_j is the j-th letter of the
        key, and m is the length of the key.
      </p>

      <h3>Security</h3>
      <p>
        The Vigenère cipher was considered secure for centuries (the "unbreakable cipher") until
        Charles Babbage and Friedrich Kasiski independently developed methods to break it in the
        19th century. Its security depends on:
      </p>
      <ul>
        <li>Key length (longer keys are more secure)</li>
        <li>Key randomness (avoiding predictable words)</li>
        <li>Message length (shorter messages are harder to crack)</li>
      </ul>
      <p>
        Modern attacks using frequency analysis and pattern recognition can break the cipher,
        especially with short or repeated keys.
      </p>
    </template>
    <template v-slot:cipherKey>
      <KeyVigenere v-model:cipher-key="vigenereCipherKey" />
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
