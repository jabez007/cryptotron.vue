<script setup lang="ts">
import { playfair } from '@jabez007/cryptotron.js'
import CipherCard from '@/components/CipherCard.vue'
import KeyPlayfair from '@/components/keys/KeyPlayfair.vue'
import { ref } from 'vue'

const playfairCipherKey = ref({
  keyword: 'MONARCHY',
})
</script>

<template>
  <CipherCard
    title="Playfair Cipher"
    :encrypt-algorithm="() => playfair.encrypt(playfairCipherKey)"
    :decrypt-algorithm="() => playfair.decrypt(playfairCipherKey)"
    :crack-algorithm="playfair.crack"
    v-model:cipher-key="playfairCipherKey"
  >
    <template v-slot:theory>
      <h3>The Origin Story</h3>
      <p>
        The Playfair cipher was the first practical digraph substitution cipher. It was invented in 1854 by Charles Wheatstone, but named after Lord Playfair who promoted its use. The British military used it for tactical purposes during the Boer War and World War I because it was reasonably fast to use and required no special equipment.
      </p>

      <h3>The Mechanics</h3>
      <p>
        The Playfair cipher uses a 5x5 grid of letters (a Polybius square variant, usually combining 'I' and 'J') constructed using a keyword. Instead of replacing single letters, it encrypts pairs of letters (digraphs). 
      </p>
      
      <h3>The Rules</h3>
      <ul>
        <li><strong>Rectangle:</strong> If the two letters form a rectangle in the grid, each is replaced by the letter in its own row but at the other letter's column.</li>
        <li><strong>Same Row:</strong> Each letter is replaced by the letter to its immediate right (wrapping around).</li>
        <li><strong>Same Column:</strong> Each letter is replaced by the letter immediately below it (wrapping around).</li>
      </ul>

      <div class="cipher-example">
        <strong>Example:</strong> Keyword "MONARCHY"<br />
        <strong>1. Build the Grid:</strong> (Combining I/J)<br />
        <br />
        <code>
        M O N A R<br />
        C H Y B D<br />
        E F G I K<br />
        L P Q S T<br />
        U V W X Z<br />
        </code><br />
        <strong>2. Prepare the Message:</strong> "INSTRUMENTS"<br />
        Split into digraphs: <strong>IN ST RU ME NT SX</strong> (padded with X)<br />
        <br />
        <strong>3. Encrypt Digraphs:</strong><br />
        <ul>
          <li><strong>IN → GA:</strong> Rectangle (I at 3,4; N at 1,3). Swap columns.</li>
          <li><strong>ST → TL:</strong> Same Row (S at 4,4; T at 4,5). Shift right (T, wrap to L).</li>
          <li><strong>RU → MZ:</strong> Rectangle (R at 1,5; U at 5,1). Swap columns.</li>
          <li><strong>ME → CL:</strong> Same Column (M at 1,1; E at 3,1). Shift down.</li>
          <li><strong>NT → RQ:</strong> Rectangle (N at 1,3; T at 4,5). Swap columns.</li>
          <li><strong>SX → XA:</strong> Same Column (S at 4,4; X at 5,4). Shift down (X, wrap to A).</li>
        </ul>
        <br />
        <strong>Result:</strong> <code>GATLMZCLRQXA</code>
      </div>

      <h3>Security</h3>
      <p>
        By encrypting digraphs, the Playfair cipher significantly flattens the frequency distribution of the ciphertext compared to monoalphabetic ciphers. However, it is still vulnerable to frequency analysis of digraphs and can be broken with modern cryptanalysis.
      </p>
    </template>
    <template v-slot:cipherKey>
      <KeyPlayfair v-model:cipherKey="playfairCipherKey" />
    </template>
  </CipherCard>
</template>
