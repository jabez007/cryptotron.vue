<script setup lang="ts">
import { beaufort } from '@jabez007/cryptotron.js'
import CipherCard from '@/components/CipherCard.vue'
import KeyBeaufort from '@/components/keys/KeyBeaufort.vue'
import ExampleGrid from '@/components/ExampleGrid.vue'
import { ref } from 'vue'

const beaufortCipherKey = ref({
  keyword: 'nightcity',
})
</script>

<template>
  <CipherCard
    title="Beaufort Cipher"
    :encrypt-algorithm="() => beaufort.encrypt(beaufortCipherKey)"
    :decrypt-algorithm="() => beaufort.decrypt(beaufortCipherKey)"
    :crack-algorithm="beaufort.crack"
    v-model:cipher-key="beaufortCipherKey"
  >
    <template v-slot:theory>
      <h3>The Origin Story</h3>
      <p>
        The Beaufort cipher is a variant of the Vigenère cipher, created by Sir Francis Beaufort (1774–1857), an officer in the British Royal Navy and the creator of the famous Beaufort scale for measuring wind speeds. This cipher was used by the Royal Navy for weather logs and was also a favorite of the Confederate States of America during the American Civil War due to its practical simplicity.
      </p>

      <h3>The Mechanics</h3>
      <p>
        The Beaufort cipher is a polyalphabetic substitution cipher that uses a repeating keyword, just like the Vigenère. However, it uses a different mathematical operation. Instead of adding the key to the plaintext, it <strong>subtracts the plaintext from the key</strong>. For example, with key "FORTIFY":
      </p>

      <div class="cipher-example aligned">
        <ExampleGrid label="Plaintext:" text="DEFENDTHEEASTWALL" />
        <ExampleGrid label="Key:" text="FORTIFYFORTIFYFOR" type="highlighted" />
        <ExampleGrid label="Ciphertext:" text="CKMPVCFYKNQMCFDG" type="result" />
      </div>

      <p>
        This small change results in a unique property: the Beaufort cipher is <strong>reciprocal</strong>, meaning that encryption and decryption are the exact same process.
      </p>

      <h3>The Mathematics</h3>
      <p>
        Mapping letters to numbers (A=0, B=1, ..., Z=25), the Beaufort transformation is:
      </p>
      <div class="cipher-example">
        Encryption/Decryption: <strong>E(x) = (k_i - p_i) mod 26</strong>
      </div>
      <p>
        Because the operation is its own inverse, you don't need a separate decryption formula. If you "encrypt" the ciphertext using the same key, you get the plaintext back.
      </p>

      <h3>The Breach</h3>
      <p>
        Since it relies on a repeating keyword, the Beaufort cipher is vulnerable to the same cryptanalysis as the Vigenère. Friedrich Kasiski’s method of finding the keyword length through repeated ciphertext patterns (<strong>Kasiski examination</strong>) works perfectly here. Once the key length is identified, the cipher can be broken using standard frequency analysis on each individual shift set.
      </p>

      <h3>Modern Perspective</h3>
      <p>
        The Beaufort cipher is celebrated for its mathematical symmetry. It demonstrates how a simple change in algebra can simplify the operational logistics of a cipher (requiring only one set of instructions for both sending and receiving) without fundamentally altering its cryptographic strength.
      </p>
    </template>
    <template v-slot:cipherKey>
      <KeyBeaufort v-model:cipher-key="beaufortCipherKey" />
    </template>
  </CipherCard>
</template>

<style scoped>
@import '@/assets/example-grid.css';
</style>
