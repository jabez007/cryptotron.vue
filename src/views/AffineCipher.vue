<template>
  <Cipher
    :encryptAlgorithm="encrypt"
    :decryptAlgorithm="decrypt"
    :cipherKey="key"
    :keysGenerator="possibleKeys"
    @update-key="onUpdateKey"
  >
    <vs-card class="card cipher" slot="description">
      <div class="header" slot="header">
        <h5>The Affine Cipher</h5>
      </div>
      <div class="main">
        <p>
          The Affine cipher is a special case of the more general monoalphabetic
          substitution cipher. The cipher is less secure than a substitution
          cipher as it is vulnerable to all of the attacks that work against
          substitution ciphers, in addition to other attacks. The cipher's
          primary weakness comes from the fact that if the cryptanalyst can
          discover (by means of frequency analysis, brute force, guessing or
          otherwise) the plaintext of two ciphertext characters, then the key
          can be obtained by solving a simultaneous equation.
        </p>
        <p>
          The 'key' for the Affine cipher consists of 2 numbers, we'll call them
          alpha and beta. The following discussion assumes the use of a 26
          character alphabet <code>(m = 26)</code>. Alpha should be chosen to be
          relatively prime to m (i.e. alpha should have no factors in common
          with m). For example 15 and 26 have no factors in common, so 15 is an
          acceptable value for alpha, however 12 and 26 have factors in common
          (e.g. 2) so 12 cannot be used for a value of alpha.
        </p>
        <p>
          When encrypting, we first convert all the letters to numbers ('a'=0,
          'b'=1, ..., 'z'=25).
          <br />
          Then the ciphertext letter c, for any given letter p (remember c and p
          are the numbers each representing a letter) is:
          <code>c = alpha * p + beta (mod m)</code>.
        </p>
        <p>
          The decryption function then is:
          <code>p = alpha^-1 * (c - beta) (mod m)</code>, where alpha^-1 is the
          multiplicative inverse of alpha in the group of integers modulo m.
          <br />
          To find the multiplicative inverse of alpha, we need to find a number
          x such that:
          <code>alpha * x = 1 (mod m)</code>. The easiest way to solve this
          equation (in our small case) is to search each of the numbers 1 to 25,
          and see which one satisfies the equation.
        </p>
        <br />
        <span>
          The
          <a class="example" @click="key = { alpha: 25, beta: 25 }">Atbash</a>
          cipher is also an Affine cipher with alpaha=25 and beta=25.
        </span>
      </div>
    </vs-card>
    <affine-key slot="key" v-model="key"></affine-key>
  </Cipher>
</template>

<script>
// @ is an alias to /src
import { gcd, encrypt, decrypt } from '../lib/ciphers/affine';
import Cipher from '../components/Cipher.vue';
import AffineKey from '../components/cipherKeys/AffineKey.vue';

export default {
  name: 'AffineCipher',
  components: {
    Cipher,
    AffineKey,
  },
  data: () => ({
    key: {
      alpha: 1,
      beta: 0,
    },
  }),
  methods: {
    encrypt(plainText, key) {
      return encrypt(key)(plainText);
    },
    decrypt(cipherText, key) {
      return decrypt(key)(cipherText);
    },
    possibleKeys(key) {
      if (!key) {
        // first pass is ''
        return { alpha: 1, beta: 0 };
      }
      let { alpha } = key;
      let { beta } = key;
      if (alpha >= 25 && beta >= 25) {
        return null;
      }
      if (alpha < 25 && beta === 25) {
        // restart beta and roll alpha up
        beta = 0;
        alpha = (alpha + 1) % 26;
        while (gcd(alpha, 26) !== 1) {
          alpha += 1;
        }
      } else {
        // just increment beta
        beta = (beta + 1) % 26;
      }
      return { alpha, beta };
    },
    onUpdateKey(newKey) {
      this.key = newKey;
    },
  },
};
</script>

<style scoped>
</style>
