<script setup lang="ts">
import { affine } from '@jabez007/cryptotron.js'
import CipherCard from '@/components/CipherCard.vue'
import KeyAffine from '@/components/keys/KeyAffine.vue'
import { ref } from 'vue'

const affineCipherKey = ref({
  alpha: 1,
  beta: 1,
})
</script>

<template>
  <CipherCard
    title="Affine Cipher"
    :encrypt-algorithm="affine.encrypt(affineCipherKey)"
    :decrypt-algorithm="affine.decrypt(affineCipherKey)"
    :cipher-key="affineCipherKey"
  >
    <template v-slot:theory>
      <p>
        The Affine cipher is an advanced substitution cipher that combines multiplicative and
        additive encryption, dating back to ancient times. It generalizes the Caesar cipher by
        applying two mathematical operations.
      </p>

      <h3>How It Works</h3>
      <p>
        Each letter is encrypted using a formula <strong>E(x) = (ax + b) mod 26</strong>, where:
      </p>
      <ul>
        <li>
          <strong>a</strong> must be coprime with 26 (e.g., 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23,
          25)
        </li>
        <li><strong>b</strong> is the shift value (like in Caesar cipher)</li>
      </ul>
      <p>Example with <strong>a=5, b=8</strong>:</p>
      <div class="cipher-example">A → I (0→8), B → N (1→13), C → S (2→18), ..., Z → H (25→7)</div>

      <h3>Mathematical Formula</h3>
      <p>Encryption: <strong>E(x) = (a·x + b) mod 26</strong></p>
      <p>
        Decryption: <strong>D(y) = a⁻¹·(y - b) mod 26</strong> (where a⁻¹ is the modular inverse of
        a)
      </p>

      <h3>Security</h3>
      <p>
        Slightly stronger than Caesar (312 possible keys vs. 25), but still vulnerable to frequency
        analysis and brute force (since it's monoalphabetic).
      </p>
    </template>
    <template v-slot:cipherKey>
      <KeyAffine v-model:cipherKey="affineCipherKey" />
    </template>
  </CipherCard>
</template>
