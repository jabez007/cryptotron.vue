<template>
  <vs-card class="card">
    <div class="textareas">
      <slot name="plainText" v-bind="{ plainText }">
        <vs-textarea label="Plain Text" v-model="plainText" height="11rem">
        </vs-textarea>
      </slot>
      <slot name="cipherText" v-bind="{ cipherText, copyToClipboard, save }">
        <vs-row>
          <vs-col vs-w="11">
            <vs-textarea
              label="Cipher Text"
              :value="cipherText"
              height="11rem"
              readonly
            >
            </vs-textarea>
          </vs-col>
          <vs-col vs-w="1" class="action-buttons">
            <vs-row vs-justify="center">
              <vs-button
                icon="file_copy"
                @click="copyToClipboard(cipherText)"
              ></vs-button>
            </vs-row>
            <vs-row vs-justify="center">
              <vs-button icon="save" @click="save(cipherText)"></vs-button>
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
  name: 'EncryptMessage',
  props: {
    encryptAlgorithm: {
      type: Function,
      required: true,
    },
    cipherKey: {
      type: [Object, Boolean], // either a valid key object or false
      required: true,
    },
  },
  data: () => ({
    plainText: '',
  }),
  computed: {
    cipherText() {
      if (this.cipherKey) {
        return this.encryptAlgorithm(this.plainText, this.cipherKey);
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
      FileSaver.saveAs(blob, 'Cipher.txt');
    },
  },
};
</script>
