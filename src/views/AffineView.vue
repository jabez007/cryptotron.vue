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
    :crack-algorithm="affine.crack"
    :cipher-key="affineCipherKey"
  >
    <template v-slot:theory>
      <h3>The Origin Story</h3>
      <p>
        The Affine cipher is a mathematical generalization of the Caesar cipher. While the Caesar cipher only allows for "shifting" the alphabet (addition), the Affine cipher introduces "scaling" (multiplication). This combination of techniques makes it a classic example of a linear congruential generator applied to cryptography. It represents a significant step in the evolution of cryptography, moving from simple physical shifts to formal algebraic transformations.
      </p>

      <h3>The Mechanics</h3>
      <p>
        In an Affine cipher, each letter is first scaled by a multiplier (often called <em>alpha</em> or <em>a</em>) and then shifted by an offset (called <em>beta</em> or <em>b</em>). This ensures that the relationship between plaintext and ciphertext is more complex than a simple shift, although it remains <strong>monoalphabetic</strong>—meaning the same plaintext letter always maps to the same ciphertext letter.
      </p>

      <h3>The Mathematics</h3>
      <p>
        The power of the Affine cipher lies in its formula:
      </p>
      <div class="cipher-example">
        Encryption: <strong>E(x) = (ax + b) mod 26</strong><br />
        Decryption: <strong>D(y) = a⁻¹(y - b) mod 26</strong>
      </div>
      <p>
        There is a critical constraint: the multiplier <strong>a</strong> must be <strong>coprime</strong> with 26 (i.e., $\gcd(a, 26) = 1$). If it isn't, multiple letters would map to the same ciphertext letter, making decryption impossible. In a 26-letter alphabet, there are only 12 valid values for <em>a</em>: {1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25}.
      </p>

      <h3>The Breach</h3>
      <p>
        Despite its mathematical elegance, the Affine cipher is extremely weak against modern cryptanalysis:
      </p>
      <ul>
        <li><strong>Small Key Space:</strong> With 12 possible values for <em>a</em> and 26 for <em>b</em>, there are only $12 \times 26 = 312$ possible keys. A computer can test all of them instantly.</li>
        <li><strong>Frequency Analysis:</strong> Because it is monoalphabetic, it preserves the frequency distribution of the language. If 'E' is the most common letter in your plaintext, its Affine substitute will be the most common letter in the ciphertext.</li>
      </ul>

      <h3>Modern Perspective</h3>
      <p>
        The Affine cipher is primarily used today to teach the concepts of <strong>Modular Inverses</strong> and <strong>Coprimality</strong>. It demonstrates how scaling and shifting can be combined to obscure data, a principle that, when scaled up significantly, underpins much of modern symmetric encryption.
      </p>
    </template>
    <template v-slot:cipherKey>
      <KeyAffine v-model:cipherKey="affineCipherKey" />
    </template>
  </CipherCard>
</template>
