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
    v-model:cipher-key="vigenereCipherKey"
  >
    <template v-slot:theory>
      <h3>The Origin Story</h3>
      <p>
        The Vigenère cipher is a method of encrypting alphabetic text by using a series of interwoven Caesar ciphers. Though named after Blaise de Vigenère, who published a description of it in 1586, the cipher was actually invented by Giovan Battista Bellaso in 1553. For over 300 years, it was famously known as <strong>"Le Chiffre Indéchiffrable"</strong> (The Unbreakable Cipher) because it resisted all standard methods of cryptanalysis until the mid-19th century.
      </p>

      <h3>The Mechanics</h3>
      <p>
        Unlike the Caesar cipher, which uses a single shift value for the whole message, the Vigenère cipher uses a <strong>keyword</strong>. Each letter of the keyword determines the shift for the corresponding letter in the plaintext. If the message is longer than the keyword, the keyword is repeated. For example, with the keyword "KEY":
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
          <span class="char-cell result">K</span><span class="char-cell result">X</span><span class="char-cell result">R</span><span class="char-cell result">K</span><span class="char-cell result">G</span><span class="char-cell result">I</span><span class="char-cell result">K</span><span class="char-cell result">X</span><span class="char-cell result">B</span><span class="char-cell result">K</span><span class="char-cell result">A</span><span class="char-cell result">L</span>
        </div>
      </div>

      <p>
        This makes it a <strong>polyalphabetic</strong> cipher—the same plaintext letter can be encrypted into different ciphertext letters depending on its position.
      </p>

      <h3>The Mathematics</h3>
      <p>
        If we map letters to numbers (A=0, B=1, ..., Z=25), the encryption for a letter <em>p</em> with a key letter <em>k</em> is:
      </p>
      <div class="cipher-example">
        Encryption: <strong>E(p_i) = (p_i + k_{i mod m}) mod 26</strong><br />
        Decryption: <strong>D(c_i) = (c_i - k_{i mod m}) mod 26</strong>
      </div>
      <p>Where <em>m</em> is the length of the keyword.</p>

      <h3>The Breach</h3>
      <p>
        The "unbreakable" status of the Vigenère cipher ended in 1863 when Friedrich Kasiski published a method to find the key length by looking for repeated sequences in the ciphertext (the <strong>Kasiski examination</strong>). Once the key length is known, the ciphertext can be treated as a collection of several Caesar ciphers, each of which can be broken easily using frequency analysis. Even earlier, Charles Babbage had privately developed a similar method to break the cipher during the Crimean War.
      </p>

      <h3>Modern Perspective</h3>
      <p>
        The Vigenère cipher is a pivotal chapter in cryptography history. It marked the transition from simple substitution to complex, position-dependent encryption. It remains a fascinating study in pattern recognition and is the spiritual ancestor to the <strong>One-Time Pad</strong>, which remains mathematically unbreakable if used correctly.
      </p>
    </template>
    <template v-slot:cipherKey>
      <KeyVigenere v-model:cipher-key="vigenereCipherKey" />
    </template>
  </CipherCard>
</template>

<style scoped>
@import '@/assets/example-grid.css';
</style>
