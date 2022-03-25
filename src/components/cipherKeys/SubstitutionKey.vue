<template>
  <vs-card class="card key">
    <vs-row vs-justify="center">
      <ul>
        <li
          v-for="char in key.plainAlphabet"
          :key="char.toUpperCase()"
          style="font-family: monospace, monospace"
        >
          {{ char.toUpperCase() }}
        </li>
      </ul>
    </vs-row>
    <vs-row vs-justify="center">
      <draggable
        tag="ul"
        class="draggable"
        v-model="key.cipherAlphabet"
        v-bind="{ animation: 200 }"
      >
        <transition-group type="transition" name="flip-list">
          <li v-for="char in key.cipherAlphabet" :key="char" color="primary">
            {{ char }}
          </li>
        </transition-group>
      </draggable>
    </vs-row>
    <vs-row>
      <vs-input
        description-text="Key Word"
        v-model.trim="compKeyword"
      ></vs-input>
    </vs-row>
  </vs-card>
</template>

<script>
import draggable from 'vuedraggable';
import { alphaLower, getUniqueCharacters } from '../../lib/ciphers';
import mixin from './cipherKeysMixin';

export default {
  mixins: [mixin],
  components: {
    draggable,
  },
  computed: {
    compKeyword: {
      get() {
        return this.key.keyword;
      },
      set(value) {
        this.key.keyword = value;
      },
    },
  },
  watch: {
    compKeyword(newVal) {
      this.key.cipherAlphabet.splice(
        0,
        this.key.cipherAlphabet.length,
        ...getUniqueCharacters(
          `${(newVal || '').toLowerCase().replace(/[^a-z]/g, '')}${alphaLower}`,
        ),
      );
    },
  },
  created() {
    this.key.plainAlphabet = [...alphaLower]; // display as upper
    this.key.cipherAlphabet = [...alphaLower];
  },
};
</script>

<style scoped>
ul {
  list-style-type: none;
}

ul li {
  display: inline-block;
  font-family: monospace, monospace;
  margin: 0.25rem;
  padding: 0.5rem;
  border-radius: 10%;
}

ul.draggable li {
  background: rgba(var(--vs-primary), 1);
}

.flip-list-move {
  transition: transform 0.5s;
}
</style>
