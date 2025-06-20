<script setup lang="ts">
import { caesar } from '@jabez007/cryptotron.js'
import CipherCard from '@/components/CipherCard.vue'
import KeyCaesar from '@/components/keys/KeyCaesar.vue'
import { ref } from 'vue'

const caesarCipherKey = ref({
  shift: 13,
})
</script>

<template>
  <CipherCard
    title="Caesar Cipher"
    :encrypt-algorithm="caesar.encrypt(caesarCipherKey)"
    :decrypt-algorithm="caesar.decrypt(caesarCipherKey)"
    :cipher-key="caesarCipherKey"
  >
    <template v-slot:theory>
      <p>
        The Caesar cipher is one of the earliest known encryption techniques, named after Julius
        Caesar who reportedly used it to protect his military communications around 50 BCE.
      </p>

      <h3>How It Works</h3>
      <p>
        The Caesar cipher is a type of substitution cipher where each letter in the plaintext is
        shifted a certain number of places down or up the alphabet. For example, with a shift of 3:
      </p>

      <div class="cipher-example">A → D, B → E, C → F, ..., X → A, Y → B, Z → C</div>

      <h3>Mathematical Formula</h3>
      <p>For encryption: <strong>E(x) = (x + k) mod 26</strong></p>
      <p>For decryption: <strong>D(x) = (x - k) mod 26</strong></p>
      <p>Where x is the letter position (A=0, B=1, ..., Z=25) and k is the shift value.</p>

      <h3>Security</h3>
      <p>
        The Caesar cipher is extremely vulnerable to frequency analysis and brute force attacks, as
        there are only 25 possible keys to try.
      </p>
    </template>
    <template v-slot:cipherKey>
      <KeyCaesar v-model:cipherKey="caesarCipherKey" />
    </template>
  </CipherCard>
</template>
