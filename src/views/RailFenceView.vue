<script setup lang="ts">
import { railFence } from '@jabez007/cryptotron.js'
import CipherCard from '@/components/CipherCard.vue'
import KeyRailFence from '@/components/keys/KeyRailFence.vue'
import { ref } from 'vue'

const railFenceCipherKey = ref({
  rails: 3,
})
</script>

<template>
  <CipherCard
    title="Rail-Fence Cipher"
    :encrypt-algorithm="railFence.encrypt(railFenceCipherKey)"
    :decrypt-algorithm="railFence.decrypt(railFenceCipherKey)"
    :crack-algorithm="railFence.crack"
    :cipher-key="railFenceCipherKey"
  >
    <template v-slot:theory>
      <p>
        The Rail-Fence cipher (also called a zigzag cipher) is a form of transposition cipher. It
        derives its name from the way in which it is encoded: the message is written diagonally down
        and up on successive "rails" of an imaginary fence, then read off in rows.
      </p>

      <h3>How It Works</h3>
      <p>
        To encrypt a message, write the plaintext in a zigzag pattern across a set number of rails.
        For example, with 3 rails and the message "WE ARE DISCOVERED":
      </p>

      <div class="cipher-example">
        W . . . E . . . I . . . V . . . E<br />
        . E . R . D . S . O . E . E . D .<br />
        . . A . . . C . . . R . . . R . .
      </div>

      <p>Reading off the rows gives: "WEIVEE RDSOEED ACR R"</p>

      <h3>Mathematical Formula</h3>
      <p>
        While primarily a geometric transposition, the position of each character follows a periodic
        wave function with a period of <strong>2 * (rails - 1)</strong>.
      </p>

      <h3>Security</h3>
      <p>
        The Rail-Fence cipher is very weak. Because the number of rails is usually small, an
        attacker can easily brute-force all possible rail counts to recover the plaintext.
      </p>
    </template>
    <template v-slot:cipherKey>
      <KeyRailFence v-model:cipherKey="railFenceCipherKey" />
    </template>
  </CipherCard>
</template>
