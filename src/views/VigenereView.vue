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

      <div class="cipher-example">
        Plaintext: A T T A C K A T D A W N<br />
        Key: K E Y K E Y K E Y K E Y<br />
        Ciphertext: K X R C E M K B D K B Y
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
