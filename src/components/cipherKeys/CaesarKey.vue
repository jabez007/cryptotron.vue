<template>
  <vs-row class="card key" vs-justify="center">
    <vs-col vs-w="2">
      <vs-input-number
        label="Shift"
        v-model.number="key.shift"
        min="0"
        max="26"
        size="large"
      ></vs-input-number>
    </vs-col>
  </vs-row>
</template>

<script>
import Rules from '../../lib/rules';
import mixin from './cipherKeysMixin';

export default {
  mixins: [mixin],
  computed: {
    rules() {
      return [Rules.required, Rules.integer];
    },
  },
};
</script>
