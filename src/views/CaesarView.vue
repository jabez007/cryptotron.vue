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
    :crack-algorithm="caesar.crack"
    v-model:cipher-key="caesarCipherKey"
  >
    <template v-slot:theory>
      <h3>The Origin Story</h3>
      <p>
        The Caesar cipher is named after Julius Caesar (100 BC – 44 BC), who reportedly used it with a shift of three to protect military communications during the Gallic Wars. While Suetonius’s accounts provide the most famous evidence of its use, Caesar wasn't the first to use substitution—he simply popularized this specific variant. In an era where few could read, a simple shift was often enough to ensure total secrecy.
      </p>

      <h3>The Mechanics</h3>
      <p>
        Each letter in your message is replaced by another letter found a fixed number of positions down the alphabet. For instance, with a shift of 3, 'A' becomes 'D', 'B' becomes 'E', and so on. When the end of the alphabet is reached, it wraps around back to the beginning. This is a <strong>monoalphabetic</strong> cipher, meaning the substitution remains constant for the entire message.
      </p>

      <h3>The Mathematics</h3>
      <p>
        We can express the Caesar cipher using modular arithmetic by assigning numbers to letters (A=0, B=1, ..., Z=25).
      </p>
      <div class="cipher-example">
        Encryption: <strong>E(x) = (x + k) mod 26</strong><br />
        Decryption: <strong>D(x) = (x - k) mod 26</strong>
      </div>
      <p>Where <em>x</em> is the letter numerical value and <em>k</em> is the shift (the key).</p>

      <h3>The Breach</h3>
      <p>
        The Caesar cipher is trivial to break today for two main reasons:
      </p>
      <ul>
        <li><strong>Brute Force:</strong> There are only 25 possible shifts (excluding zero). A computer can try every possibility in microseconds.</li>
        <li><strong>Frequency Analysis:</strong> In any language, some letters appear more often than others. English 'E' is the most common. By analyzing which letters appear most frequently in the ciphertext, an attacker can quickly guess the shift.</li>
      </ul>

      <h3>Modern Perspective</h3>
      <p>
        While obsolete for security, the Caesar cipher remains a fundamental teaching tool. It is the basis for <strong>ROT13</strong>, a shift of 13 positions used today in digital forums to hide spoilers. It also serves as the building block for more complex polyalphabetic ciphers like the Vigenère.
      </p>
    </template>
    <template v-slot:cipherKey>
      <KeyCaesar v-model:cipherKey="caesarCipherKey" />
    </template>
  </CipherCard>
</template>
