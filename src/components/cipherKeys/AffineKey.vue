<template>
  <vs-card class="card key">
    <vs-row vs-justify="center">
      <vs-col vs-w="2">
        <vs-input-number
          label="Alpha"
          v-model.number="alpha"
          min="1"
          max="25"
          step="2"
          size="large"
          required
        ></vs-input-number>
      </vs-col>
      <vs-col vs-w="2">
        <vs-input-number
          label="Beta"
          v-model.number="key.beta"
          min="0"
          max="25"
          size="large"
          required
        ></vs-input-number>
      </vs-col>
    </vs-row>
  </vs-card>
</template>

<script>
import Rules from '../../lib/rules';
import { gcd } from '../../lib/ciphers/affine';
import mixin from './cipherKeysMixin';

export default {
  mixins: [mixin],
  computed: {
    alpha: {
      get() {
        return this.key.alpha;
      },
      set(newVal) {
        if (Number.isInteger(newVal)) {
          const direction = (newVal - this.key.alpha) / Math.abs(newVal - this.key.alpha);
          let val = newVal;
          while (gcd(val, 26) !== 1) {
            val += direction;
          }
          this.key.alpha = val % 26;
        }
      },
    },
    rules() {
      return [Rules.required, Rules.integer, val => gcd(val, 26) === 1];
    },
  },
  methods: {
    gcd(a, b) {
      return gcd(a, b);
    },
  },
};
</script>
