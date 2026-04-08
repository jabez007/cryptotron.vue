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
      <h3>The Origin Story</h3>
      <p>
        The Polybius Square is one of the earliest examples of <strong>fractionation</strong> in cryptography. It was invented by the Greek historian Polybius around 150 BCE. While modern users see it as an encryption tool, Polybius originally designed it as a system for <strong>telegraphy</strong>—allowing soldiers to signal letters across long distances using pairs of torches held in each hand.
      </p>

      <h3>The Mechanics</h3>
      <p>
        The system uses a 5x5 grid filled with the letters of the alphabet. Since the English alphabet has 26 letters, 'I' and 'J' are typically combined into a single cell. Each letter is then represented by its coordinates (Row, Column). For example, in a standard square, 'A' is 11, 'B' is 12, and so on.
      </p>

      <p>Standard Polybius Square Example:</p>
      <div class="cipher-example">
        &nbsp;&nbsp;<span class="header-char">A</span> <span class="header-char">B</span> <span class="header-char">C</span> <span class="header-char">D</span> <span class="header-char">E</span><br />
        <span class="header-char">A</span> A B C D E<br />
        <span class="header-char">B</span> F G H I K<br />
        <span class="header-char">C</span> L M N O P<br />
        <span class="header-char">D</span> Q R S T U<br />
        <span class="header-char">E</span> V W X Y Z
      </div>

      <p>Example: "HELLO" → "BD AE CB CB CD" (using ABCDE as coordinates)</p>

      <h3>Keyed Square</h3>
      <p>
        To increase security, the grid can be filled starting with a secret <strong>keyword</strong> (removing duplicate letters), followed by the remaining letters of the alphabet in order. This ensures that even if an attacker knows the coordinates, they cannot decode the message without the secret grid arrangement.
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

      <h3>The Mathematics</h3>
      <p>
        The Polybius Square is essentially a <strong>base-5</strong> numbering system for the alphabet. By converting a single character into two numerical components, it allows the data to be manipulated in ways that a single letter cannot. This process—breaking a character into parts—is the definition of fractionation.
      </p>

      <h3>Modern Perspective</h3>
      <p>
        The Polybius Square is rarely used alone for security, but it is a critical building block for more complex ciphers like the <strong>Playfair</strong>, the <strong>Nihilist</strong>, and the famous German <strong>ADFGVX</strong> cipher used in World War I. It teaches us how to transform data into different formats (like numbers) to prepare it for further encryption layers.
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
