<script setup lang="ts">
import { columnar } from '@jabez007/cryptotron.js'
import CipherCard from '@/components/CipherCard.vue'
import KeyColumnar from '@/components/keys/KeyColumnar.vue'
import { ref } from 'vue'

const columnarCipherKey = ref({
  keyword: 'NIGHTCITY',
})
</script>

<template>
  <CipherCard
    title="Columnar Transposition"
    :encrypt-algorithm="() => columnar.encrypt(columnarCipherKey)"
    :decrypt-algorithm="() => columnar.decrypt(columnarCipherKey)"
    :crack-algorithm="columnar.crack"
    v-model:cipher-key="columnarCipherKey"
  >
    <template v-slot:theory>
      <h3>Scrambling the Grid</h3>
      <p>
        Unlike substitution ciphers that replace letters, the Columnar Transposition cipher is a
        <strong>transposition</strong> cipher. It keeps the original letters but changes their
        positions by arranging them in a geometric grid and then reading them out in a different
        order.
      </p>

      <h3>The Mechanics</h3>
      <p>The encryption process follows these steps:</p>
      <ol>
        <li>
          <strong>Choose a Keyword:</strong> The length of the keyword determines the number of
          columns in the grid.
        </li>
        <li>
          <strong>Write the Message:</strong> Fill the message into the grid row by row.
        </li>
        <li>
          <strong>Sort the Keyword:</strong> Alphabetize the letters of the keyword to determine the
          reading order of the columns.
        </li>
        <li>
          <strong>Read the Columns:</strong> Extract the letters column by column according to the
          sorted order to produce the ciphertext.
        </li>
      </ol>

      <div class="cipher-example">
        <strong>Example:</strong> Keyword "ZEBRA"<br />
        1. <strong>Assign Ranks:</strong> A=1, B=2, E=3, R=4, Z=5<br />
        2. <strong>Map to Keyword:</strong> Z(5) E(3) B(2) R(4) A(1)<br />
        <br />
        <strong>Grid for "HACKTHEPLANET":</strong><br />
        <code>
          Z E B R A<br />
          ---------<br />
          H A C K T<br />
          H E P L A<br />
          N E T
        </code><br />
        <br />
        <strong>Read columns by rank:</strong><br />
        Rank 1 (Col 5): TA<br />
        Rank 2 (Col 3): CPT<br />
        Rank 3 (Col 2): AEE<br />
        Rank 4 (Col 4): KL<br />
        Rank 5 (Col 1): HHN<br />
        <br />
        <strong>Result:</strong> <code>TACPTAEEKLHHN</code>
      </div>

      <h3>Historical Padding vs. Modern "Ragged" Grids</h3>
      <p>
        In traditional wartime usage, messages were almost always <strong>padded</strong> with
        meaningless "null" characters (often 'X' or 'Q') to ensure the grid was perfectly
        rectangular. This served two purposes:
      </p>
      <ul>
        <li>
          <strong>Simplicity:</strong> It allowed the clerk to read out columns of identical length,
          reducing the chance of manual error.
        </li>
        <li>
          <strong>Obfuscation:</strong> It disguised the true length of the underlying message, making
          it harder for codebreakers to guess the grid dimensions.
        </li>
      </ul>

      <div class="cipher-example historical-note">
        <strong>Historical Padding Example:</strong><br />
        To fill the 5x3 grid for "HACKTHEPLANET" (13 chars), two 'X's would be added:<br />
        <code>... N E T <strong>X X</strong></code><br />
        This would result in a ciphertext like: <code><strong>TA</strong>X <strong>CPT</strong> <strong>AEE</strong> <strong>KL</strong>X <strong>HHN</strong></code>
      </div>

      <p>
        The <code>@jabez007/cryptotron.js</code> library uses a <strong>ragged grid</strong>
        approach, which omits padding and leaves trailing columns shorter. While this is less common
        in historical field manuals, it is a standard implementation in modern digital simulations
        where precision in message length is often preferred over manual convenience.
      </p>

      <h3>The Breach</h3>
      <p>
        Since the letter frequencies remain identical to the original language, transposition
        ciphers are vulnerable to <strong>Anagramming</strong>. An attacker can guess the number of
        columns (the keyword length) and attempt to reorder them until recognizable words appear.
        Using multiple rounds of transposition (Double Columnar) significantly increases security.
      </p>

      <h3>History</h3>
      <p>
        Columnar transposition was widely used in the late 19th and early 20th centuries, notably by
        the German Army during World War I and by various resistance groups during World War II. Its
        manual nature made it ideal for agents in the field who lacked complex machines.
      </p>
    </template>
    <template v-slot:cipherKey>
      <KeyColumnar v-model:cipherKey="columnarCipherKey" />
    </template>
  </CipherCard>
</template>
