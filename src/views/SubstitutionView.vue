<script setup lang="ts">
import { substitution } from '@jabez007/cryptotron.js'
import CipherCard from '@/components/CipherCard.vue'
import KeySubstitution from '@/components/keys/KeySubstitution.vue'
import { ref } from 'vue'

const substitutionCipherKey = ref({
  cipherAlphabet: 'qwertyuiopasdfghjklzxcvbnm',
})
</script>

<template>
  <CipherCard
    title="Simple Substitution Cipher"
    :encrypt-algorithm="substitution.encrypt(substitutionCipherKey)"
    :decrypt-algorithm="substitution.decrypt(substitutionCipherKey)"
    :cipher-key="substitutionCipherKey"
  >
    <template v-slot:theory>
      <p>
        One of the oldest ciphers, where each plaintext letter is mapped to a fixed substitute
        letter, creating a scrambled alphabet.
      </p>

      <h3>How It Works</h3>
      <p>A random permutation of the alphabet is used (e.g., A→Z, B→Y, C→X, ..., Z→A). Example:</p>
      <div class="cipher-example">
        Plaintext: A B C D E F G ... Z<br />
        Ciphertext: Z Y X W V U T ... A
      </div>

      <h3>Mathematical Formula</h3>
      <p>Encryption: <strong>E(x) = σ(x)</strong>, where σ is a permutation function.</p>

      <h3>Security</h3>
      <p>
        Vulnerable to frequency analysis (e.g., E→T, A→E patterns). Possible keys: 26! (~88 bits),
        but broken by linguistic patterns.
      </p>
    </template>
    <template v-slot:cipherKey>
      <KeySubstitution v-model:cipher-key="substitutionCipherKey" />
    </template>
  </CipherCard>
</template>
