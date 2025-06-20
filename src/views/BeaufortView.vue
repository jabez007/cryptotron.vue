<script setup lang="ts">
import { beaufort } from '@jabez007/cryptotron.js'
import CipherCard from '@/components/CipherCard.vue'
import KeyBeaufort from '@/components/keys/KeyBeaufort.vue'
import { ref } from 'vue'

const beaufortCipherKey = ref({
  keyword: 'lumberjack',
})
</script>

<template>
  <CipherCard
    title="Beaufort Cipher"
    :encrypt-algorithm="beaufort.encrypt(beaufortCipherKey)"
    :decrypt-algorithm="beaufort.decrypt(beaufortCipherKey)"
    :cipher-key="beaufortCipherKey"
  >
    <template v-slot:theory>
      <p>
        Created by Sir Francis Beaufort in the 19th century, this cipher is similar to Vigenère but
        uses a reversed encryption process. It was used in the Royal Navy for weather logs.
      </p>

      <h3>How It Works</h3>
      <p>
        Encryption involves subtracting the plaintext from the key (mod 26). Example with key "KEY":
      </p>
      <div class="cipher-example">
        Plaintext: A T T A C K<br />
        Key: K E Y K E Y<br />
        Ciphertext: K R J K E M (A→K: (10-0) mod 26 = 10 = K)
      </div>

      <h3>Mathematical Formula</h3>
      <p>Encryption: <strong>E(x_i) = (k_i - x_i) mod 26</strong></p>
      <p>Decryption: <strong>D(y_i) = (k_i - y_i) mod 26</strong></p>

      <h3>Security</h3>
      <p>
        Comparable to Vigenère, but its reciprocal property (encryption = decryption) can simplify
        attacks in some cases.
      </p>
    </template>
    <template v-slot:cipherKey>
      <KeyBeaufort v-model:cipher-key="beaufortCipherKey" />
    </template>
  </CipherCard>
</template>
