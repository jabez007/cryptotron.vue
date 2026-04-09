<script setup lang="ts">
import { autokey } from '@jabez007/cryptotron.js'
import CipherCard from '@/components/CipherCard.vue'
import KeyAutokey from '@/components/keys/KeyAutokey.vue'
import ExampleGrid from '@/components/ExampleGrid.vue'
import { ref } from 'vue'

const autokeyCipherKey = ref({
  primer: 'bytewalker',
})
</script>

<template>
  <CipherCard
    title="Autokey Cipher"
    :encrypt-algorithm="() => autokey.encrypt(autokeyCipherKey)"
    :decrypt-algorithm="() => autokey.decrypt(autokeyCipherKey)"
    :crack-algorithm="autokey.crack"
    v-model:cipher-key="autokeyCipherKey"
  >
    <template v-slot:theory>
      <h3>The Origin Story</h3>
      <p>
        The Autokey cipher was designed to fix the greatest weakness of the Vigenère cipher: the
        repeating keyword. It was first described by Girolamo Cardano, but the definitive version
        used today was published by Giovan Battista Bellaso in 1564. By making the key as long as
        the message itself, Bellaso intended to eliminate the periodic patterns that allowed
        cryptanalysts to find the key length.
      </p>

      <h3>The Mechanics</h3>
      <p>
        The Autokey cipher starts with a short secret <strong>primer</strong>. Once the primer is
        exhausted, the cipher uses the <strong>plaintext itself</strong> as the remaining key. For
        example, with primer "K" and plaintext "MEET AT MIDNIGHT":
      </p>

      <div class="cipher-example aligned">
        <ExampleGrid label="Plaintext:" text="MEETATMIDNIGHT" />
        <ExampleGrid label="Key:" text="KMEETATMIDNIGH" type="highlighted" />
        <ExampleGrid label="Ciphertext:" text="WQIXTTFULQVONA" type="result" />
      </div>

      <p>
        This ensures that the key is always unique and never repeats, significantly increasing the
        complexity of the ciphertext.
      </p>

      <h3>The Mathematics</h3>
      <p>
        The encryption process uses the same modular addition as the Vigenère, but with a
        dynamically generated key stream:
      </p>
      <div class="cipher-example">
        <strong>E(p_i) = (p_i + k_i) mod 26</strong>
      </div>
      <p>
        Where <strong>k_i</strong> is the <em>i</em>-th character of the primer for early positions,
        and <strong>p_{i-L}</strong> (the plaintext from <em>L</em> positions ago) for all
        subsequent positions, where <em>L</em> is the primer length.
      </p>

      <h3>The Breach</h3>
      <p>
        While stronger than Vigenère, the Autokey cipher is still vulnerable to modern attacks.
        Because the key is composed of actual language (the plaintext), it still follows linguistic
        patterns. Cryptanalysts use <strong>"Hill Climbing"</strong> algorithms and automated
        dictionary attacks to guess the primer. Once the primer is guessed correctly, the rest of
        the key (and thus the plaintext) reveals itself through a chain reaction.
      </p>

      <h3>Modern Perspective</h3>
      <p>
        The Autokey cipher represents a brilliant attempt to solve the "repeating key" problem. It
        serves as a precursor to more advanced stream ciphers and highlights a core principle of
        cryptography: security is often improved by making the key as unpredictable and
        non-repeating as possible.
      </p>
    </template>
    <template v-slot:cipherKey>
      <KeyAutokey v-model:cipher-key="autokeyCipherKey" />
    </template>
  </CipherCard>
</template>

<style scoped>
@import '@/assets/example-grid.css';
</style>
