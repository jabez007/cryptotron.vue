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
    :encrypt-algorithm="() => substitution.encrypt(substitutionCipherKey)"
    :decrypt-algorithm="() => substitution.decrypt(substitutionCipherKey)"
    :crack-algorithm="substitution.crack"
    v-model:cipher-key="substitutionCipherKey"
  >
    <template v-slot:theory>
      <h3>The Origin Story</h3>
      <p>
        The simple substitution cipher is one of the oldest forms of encryption, with variants like the <strong>Atbash</strong> cipher appearing in ancient Hebrew texts as early as 500 BCE. Throughout the Middle Ages, it was the standard for diplomatic and personal secrecy. Its most infamous failure occurred in 1586, when the <strong>Babington Plot</strong> to assassinate Queen Elizabeth I was foiled after Mary Queen of Scots' encrypted letters were intercepted and decrypted by Thomas Phelippes.
      </p>

      <h3>The Mechanics</h3>
      <p>
        In this cipher, each letter of the alphabet is replaced by another letter from a scrambled "cipher alphabet." Unlike the Caesar cipher, which uses a predictable shift, a simple substitution can map any letter to any other letter. Once the mapping is set, it remains constant for the entire message. This is a <strong>monoalphabetic</strong> system.
      </p>

      <h3>The Mathematics</h3>
      <p>
        While mathematically simpler than the Affine cipher, the simple substitution cipher boasts an enormous <strong>key space</strong>. The number of ways to arrange the 26 letters of the alphabet is <strong>26 factorial (26!)</strong>.
      </p>
      <div class="cipher-example">
        26! ≈ <strong>403 septillion</strong> (403,291,461,126,605,635,584,000,000)
      </div>
      <p>Even with modern computers, a brute-force attack trying every possible alphabet arrangement is practically impossible.</p>

      <h3>The Breach</h3>
      <p>
        Despite the massive number of keys, this cipher is notoriously easy to break using <strong>Frequency Analysis</strong>. In the 9th century, the polymath Al-Kindi realized that because each letter always maps to the same substitute, the relative frequency of letters in the language remains visible. By analyzing:
      </p>
      <ul>
        <li><strong>Single letters:</strong> 'E', 'T', and 'A' are the most common in English.</li>
        <li><strong>Digrams:</strong> Common pairs like 'TH', 'HE', and 'IN'.</li>
        <li><strong>Trigrams:</strong> Patterns like 'THE' and 'AND'.</li>
      </ul>
      <p>An attacker can piece together the alphabet like a jigsaw puzzle.</p>

      <h3>Modern Perspective</h3>
      <p>
        Simple substitution ciphers are no longer used for serious security, but they live on as <strong>"Cryptograms"</strong>—popular word puzzles found in newspapers. They teach the vital lesson that a large number of keys does not guarantee security if the underlying structure of the language is not obscured.
      </p>
    </template>
    <template v-slot:cipherKey>
      <KeySubstitution v-model:cipher-key="substitutionCipherKey" />
    </template>
  </CipherCard>
</template>
