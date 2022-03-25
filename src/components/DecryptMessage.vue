<template>
  <vs-card class="card">
    <div class="textareas">
      <slot name="cipherText" v-bind="{ cipherText }">
        <vs-textarea label="Cipher Text" v-model="cipherText"></vs-textarea>
      </slot>
      <slot name="plainText" v-bind="{ plainText, copyToClipboard, save }">
        <vs-row>
          <vs-col vs-w="11">
            <vs-textarea label="Plain Text" :value="plainText" readonly>
            </vs-textarea>
          </vs-col>
          <vs-col vs-w="1" class="action-buttons">
            <vs-row vs-justify="center">
              <vs-button
                icon="file_copy"
                @click="copyToClipboard(plainText)"
              ></vs-button>
            </vs-row>
            <vs-row vs-justify="center">
              <vs-button icon="save" @click="save(plainText)"></vs-button>
            </vs-row>
          </vs-col>
        </vs-row>
      </slot>
    </div>
  </vs-card>
</template>

<script>
import FileSaver from 'file-saver';

export default {
  name: 'DecryptMessage',
  props: {
    decryptAlgorithm: {
      type: Function,
      required: true,
    },
    cipherKey: {
      type: [Object, Boolean], // either a valid key object or false
      required: true,
    },
  },
  data: () => ({
    cipherText: '',
  }),
  computed: {
    plainText() {
      if (this.cipherKey) {
        return this.decryptAlgorithm(this.cipherText, this.cipherKey);
      }
      return '';
    },
  },
  methods: {
    copyToClipboard(txt) {
      const self = this;
      this.$copyText(txt)
        .then(() => {
          self.$emit('success', 'copied!');
        })
        .catch((err) => {
          self.$emit('error', err.message);
        });
    },
    save(txt) {
      const blob = new Blob([txt], {
        type: 'text/plain;charset=utf-8',
      });
      FileSaver.saveAs(blob, 'Plain.txt');
    },
  },
};
</script>
