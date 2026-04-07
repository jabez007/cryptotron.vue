<script setup lang="ts">
import { polybius } from '@jabez007/cryptotron.js'
import CipherCard from '@/components/CipherCard.vue'
import KeyPolybius from '@/components/keys/KeyPolybius.vue'
import { ref } from 'vue'

const polybiusCipherKey = ref({
  keyword: '',
  cipherChars: 'ABCDE',
})
</script>

<template>
  <CipherCard
    title="Polybius Square"
    :encrypt-algorithm="polybius.encrypt(polybiusCipherKey)"
    :decrypt-algorithm="polybius.decrypt(polybiusCipherKey)"
    :crack-algorithm="polybius.crack"
    :cipher-key="polybiusCipherKey"
  >
    <template v-slot:theory>
      <p>
        The Polybius Square is a technique for telegraphy that represents each letter of the
        alphabet with its coordinates in a 5x5 grid. It was originally invented by the Greek
        historian Polybius around 150 BCE.
      </p>

      <h3>How It Works</h3>
      <p>
        A 5x5 grid is filled with the letters of the alphabet (usually combining I and J into one
        cell). The coordinates of each letter (Row, Column) then represent that letter.
      </p>

      <div class="cipher-example">
        &nbsp;&nbsp;A B C D E<br />
        A A B C D E<br />
        B F G H I K<br />
        C L M N O P<br />
        D Q R S T U<br />
        E V W X Y Z
      </div>

      <p>Example: "HELLO" → "BD AE CB CB CD"</p>

      <h3>Keyed Square</h3>
      <p>
        To increase security, the grid can be filled starting with a secret keyword (removing
        duplicate letters), followed by the remaining letters of the alphabet in order.
      </p>

      <h3>Security</h3>
      <p>
        The Polybius square is primarily a fractionation method rather than a strong encryption by
        itself. It is often used as a component in more complex ciphers like the ADFGVX cipher.
      </p>
    </template>
    <template v-slot:cipherKey>
      <KeyPolybius v-model:cipherKey="polybiusCipherKey" />
    </template>
  </CipherCard>
</template>
