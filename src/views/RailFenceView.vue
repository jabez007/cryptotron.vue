<script setup lang="ts">
import { railFence } from '@jabez007/cryptotron.js'
import CipherCard from '@/components/CipherCard.vue'
import KeyRailFence from '@/components/keys/KeyRailFence.vue'
import { ref } from 'vue'

const railFenceCipherKey = ref({
  rails: 3,
})
</script>

<template>
  <CipherCard
    title="Rail-Fence Cipher"
    :encrypt-algorithm="railFence.encrypt(railFenceCipherKey)"
    :decrypt-algorithm="railFence.decrypt(railFenceCipherKey)"
    :crack-algorithm="railFence.crack"
    v-model:cipher-key="railFenceCipherKey"
  >
    <template v-slot:theory>
      <h3>The Origin Story</h3>
      <p>
        The Rail-Fence cipher (also called a zigzag cipher) is a classic example of a <strong>transposition</strong> cipher. Unlike substitution ciphers that replace letters, transposition ciphers keep the original letters but rearrange their positions. Historically, it has been used for centuries, most notably by the Union forces during the American Civil War to send simple but rapid battlefield communications.
      </p>

      <h3>The Mechanics</h3>
      <p>
        To encrypt a message, you write the plaintext in a diagonal, zigzag pattern across a set number of "rails" (the key). Once the pattern is complete, you read the characters off row by row. For example, with 3 rails and the message "WEAREDISCOVERED":
      </p>

      <div class="cipher-example">
        W . . . E . . . C . . . R<br />
        . E . R . D . S . O . E . E<br />
        . . A . . . I . . . V . . . D
      </div>

      <p>By reading the rows left-to-right, the ciphertext becomes: "WECR ERDSOEE AIVD"</p>

      <h3>The Mathematics</h3>
      <p>
        The Rail-Fence cipher is based on a periodic wave function. The pattern of rails repeats every <strong>2 * (n - 1)</strong> characters, where <em>n</em> is the number of rails. For 3 rails, the period is 4. This geometric predictability is what allows the cipher to be automated and decrypted systematically.
      </p>

      <h3>The Breach</h3>
      <p>
        The Rail-Fence cipher is mathematically very weak for two reasons:
      </p>
      <ul>
        <li><strong>Small Key Space:</strong> The number of rails is typically very small (usually between 2 and 10). An attacker can brute-force all possible rail counts in seconds.</li>
        <li><strong>Letter Integrity:</strong> Since the letters themselves aren't changed, the frequency of characters (like 'E', 'T', 'A') remains exactly the same as the original plaintext, confirming immediately that a transposition cipher is being used.</li>
      </ul>

      <h3>Modern Perspective</h3>
      <p>
        Today, the Rail-Fence cipher is an introductory lesson in the world of transposition. It teaches the fundamental concept that data security isn't just about hiding what a character is, but also about where it is located. In modern cryptography, AES (Advanced Encryption Standard) uses a <strong>substitution-permutation network</strong>, where the <strong>ShiftRows</strong> step serves as a sophisticated modern parallel to the simple rail-fence transposition.
      </p>
    </template>
    <template v-slot:cipherKey>
      <KeyRailFence v-model:cipherKey="railFenceCipherKey" />
    </template>
  </CipherCard>
</template>
