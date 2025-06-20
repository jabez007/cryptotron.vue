<script setup lang="ts">
import { autokey } from '@jabez007/cryptotron.js'
import CipherCard from '@/components/CipherCard.vue'
import KeyAutokey from '@/components/keys/KeyAutokey.vue'
import { ref } from 'vue'

const autokeyCipherKey = ref({
  primer: 'bytewalker',
})
</script>

<template>
  <CipherCard
    title="Autokey Cipher"
    :encrypt-algorithm="autokey.encrypt(autokeyCipherKey)"
    :decrypt-algorithm="autokey.decrypt(autokeyCipherKey)"
    :cipher-key="autokeyCipherKey"
  >
    <template v-slot:theory>
      <p>
        Developed by Giovan Battista Bellaso in 1564, the Autokey cipher improves on Vigenère by
        using the plaintext itself as part of the key, making it harder to break with traditional
        methods.
      </p>

      <h3>How It Works</h3>
      <p>
        The key starts with a primer (short initial key), then extends with the plaintext. For
        example, with primer "Q" and plaintext "ATTACK":
      </p>
      <div class="cipher-example">
        Plaintext: A T T A C K<br />
        Key: Q A T T A C<br />
        Ciphertext: Q T X T C O
      </div>

      <h3>Mathematical Formula</h3>
      <p>Encryption: <strong>E(x_i) = (x_i + k_i) mod 26</strong></p>
      <p>
        Where
        <strong
          >k_i = primer_i (for i ≤ primer length) or x_{i-primer length} (for i > primer
          length)</strong
        >
      </p>

      <h3>Security</h3>
      <p>
        More secure than Vigenère against Kasiski examination (no repeating key patterns), but
        vulnerable to known-plaintext attacks.
      </p>
    </template>
    <template v-slot:cipherKey>
      <KeyAutokey v-model:cipher-key="autokeyCipherKey" />
    </template>
  </CipherCard>
</template>
