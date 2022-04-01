<template>
  <vs-card class="card key">
    <vs-row class="card key" vs-justify="center">
      <vs-col vs-w="2">
        <vs-input-number
          label="Shift"
          v-model.number="key.shift"
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
