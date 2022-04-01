<template>
  <vs-card class="card key">
    <vs-row vs-justify="center">
      <vs-col :vs-w="fullWidth ? 12 : 3">
        <vs-input
          description-text="Key Word"
          v-model.trim="key.keyword"
          required
        ></vs-input>
      </vs-col>
    </vs-row>
    <vs-row vs-justify="center">
      <vs-col :vs-w="fullWidth ? 12 : 3">
        <vs-input
          description-text="Sorted"
          :value="(key.keyword || '').toLowerCase().split('').sort().join('')"
          disabled
          readonly
        ></vs-input>
      </vs-col>
    </vs-row>
  </vs-card>
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
      return [Rules.required, Rules.word, Rules.minLength(2)];
    },
  },
};
</script>
