<template>
  <vs-row class="card key" vs-justify="center">
    <vs-col :vs-w="fullWidth ? 12 : 2">
      <vs-input-number
        label="Number of Rails"
        v-model.number="key.rails"
        min="1"
        size="large"
        required
      ></vs-input-number>
    </vs-col>
  </vs-row>
</template>

<script>
import Rules from '../../lib/rules';
import mixin from './cipherKeysMixin';

export default {
  mixins: [mixin],
  props: {
    fullWidth: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    rules() {
      return [Rules.required, Rules.integer, Rules.positive];
    },
  },
};
</script>
