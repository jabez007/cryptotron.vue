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
        Split into digraphs: IN ST RU ME NT S<br />
        (Add padding 'X' for the lone 'S'): <strong>IN ST RU ME NT SX</strong><br />
        <br />
        <strong>3. Encrypt Digraphs:</strong><br />
        IN → <strong>GA</strong> (Rectangle: I at row 3, col 4; N at row 1, col 3)<br />
        ST → <strong>TL</strong> (Same column: S at row 4, col 4; T at row 4, col 5 → Wrap to L at row 4, col 1)<br />
        RU → <strong>MZ</strong> (Rectangle: R at row 1, col 5; U at row 5, col 1)<br />
        ME → <strong>CL</strong> (Rectangle: M at row 1, col 1; E at row 3, col 1)<br />
        NT → <strong>RQ</strong> (Rectangle: N at row 1, col 3; T at row 4, col 5)<br />
        SX → <strong>AX</strong> (Same row: S at row 4, col 4; X at row 5, col 4 → Wait, same row rule is row-wise. S is (4,4), X is (5,4). That is same column!)<br />
        SX → <strong>XQ</strong> (Wait, let's re-verify with the grid above)<br />
        S is (4,4), X is (5,4) → Same Column → Replace with letter below.<br />
        S → X (below S)<br />
        X → B (Wait, grid above has B at (2,4). Column 4 is A, B, I, S, X. So X → A)<br />
        SX → <strong>XA</strong><br />
        <br />
        <strong>Result:</strong> <code>GATLMZCLRQAX</code>
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
