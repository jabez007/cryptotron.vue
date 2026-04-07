<script setup lang="ts">
import { polybius } from '@jabez007/cryptotron.js'
import CipherCard from '@/components/CipherCard.vue'
import KeyPolybius from '@/components/keys/KeyPolybius.vue'
import { ref } from 'vue'

const polybiusCipherKey = ref({
  keyword: '',
  cipherChars: 'ABCDE',
})
</script>

<template>
  <CipherCard
    title="Polybius Square"
    :encrypt-algorithm="polybius.encrypt(polybiusCipherKey)"
    :decrypt-algorithm="polybius.decrypt(polybiusCipherKey)"
    :crack-algorithm="polybius.crack"
    :cipher-key="polybiusCipherKey"
  >
    <template v-slot:theory>
      <p>
        The Polybius Square is a technique for telegraphy that represents each letter of the
        alphabet with its coordinates in a 5x5 grid. It was originally invented by the Greek
        historian Polybius around 150 BCE.
      </p>

      <h3>How It Works</h3>
      <p>
        A 5x5 grid is filled with the letters of the alphabet (usually combining I and J into one
        cell). The coordinates of each letter (Row, Column) then represent that letter.
      </p>

      <div class="cipher-example">
        &nbsp;&nbsp;<span class="header-char">A</span> <span class="header-char">B</span> <span class="header-char">C</span> <span class="header-char">D</span> <span class="header-char">E</span><br />
        <span class="header-char">A</span> A B C D E<br />
        <span class="header-char">B</span> F G H I K<br />
        <span class="header-char">C</span> L M N O P<br />
        <span class="header-char">D</span> Q R S T U<br />
        <span class="header-char">E</span> V W X Y Z
      </div>

      <p>Example: "HELLO" → "BD AE CB CB CD"</p>

      <h3>Keyed Square</h3>
      <p>
        To increase security, the grid can be filled starting with a secret keyword (removing
        duplicate letters), followed by the remaining letters of the alphabet in order.
      </p>

      <p>Example with keyword "CYBERPUNK":</p>
      <div class="cipher-example">
        &nbsp;&nbsp;<span class="header-char">A</span> <span class="header-char">B</span> <span class="header-char">C</span> <span class="header-char">D</span> <span class="header-char">E</span><br />
        <span class="header-char">A</span> C Y B E R<br />
        <span class="header-char">B</span> P U N K A<br />
        <span class="header-char">C</span> D F G H I<br />
        <span class="header-char">D</span> L M O Q S<br />
        <span class="header-char">E</span> T V W X Z
      </div>

      <p>Note how duplicate letters are removed and "I/J" are treated as a single unit.</p>

      <h3>Security</h3>
      <p>
        The Polybius square is primarily a fractionation method rather than a strong encryption by
        itself. It is often used as a component in more complex ciphers like the ADFGVX cipher.
      </p>
    </template>
    <template v-slot:cipherKey>
      <KeyPolybius v-model:cipherKey="polybiusCipherKey" />
    </template>
  </CipherCard>
</template>

<style scoped>
.header-char {
  color: var(--neon-magenta);
  font-weight: 900;
  text-shadow: 0 0 5px var(--neon-magenta);
}

.cipher-example {
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--cryptotron-grid-color);
  margin: 1rem 0;
  line-height: 1.8;
  font-family: 'Space Mono', monospace;
  letter-spacing: 2px;
}
</style>
