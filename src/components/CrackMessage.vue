<template>
  <vs-card class="card">
    <div class="textareas">
      <vs-row vs-justify="space-between">
        <vs-col vs-w="9">
          <vs-textarea label="Cipher Text" v-model="cipherText"> </vs-textarea>
        </vs-col>
        <vs-col vs-w="3">
          <vs-row vs-justify="center" vs-align="center">
            <vs-col vs-w="8">
              <vs-input
                icon="autorenew"
                label-placeholder="Max key attempts"
                description-text="Enter the number of different keys to attempt"
                v-model.number="maxSteps"
                type="number"
                required
              ></vs-input>
            </vs-col>
            <vs-col vs-w="2">
              <vs-button
                icon="send"
                @click="crackMessage"
                :disabled="!ngrams"
              ></vs-button>
            </vs-col>
          </vs-row>
        </vs-col>
      </vs-row>
      <vs-row>
        <vs-col vs-w="11">
          <vs-textarea label="Plain Text" :value="plainText" readonly>
          </vs-textarea>
        </vs-col>
        <vs-col vs-w="1" class="action-buttons">
          <vs-row vs-justify="center">
            <vs-button icon="file_copy" @click="copyToClipboard"></vs-button>
          </vs-row>
          <vs-row vs-justify="center">
            <vs-button icon="save" @click="save"></vs-button>
          </vs-row>
        </vs-col>
      </vs-row>
    </div>
  </vs-card>
</template>

<script>
import axios from 'axios';
import FileSaver from 'file-saver';
import lzString from 'lz-string/libs/lz-string';

export default {
  name: 'CrackMessage',
  props: {
    decryptAlgorithm: {
      type: Function,
      required: true,
    },
    keysGenerator: {
      type: Function,
      required: true,
    },
    ngramsFile: {
      type: String,
      default: 'quadgrams',
    },
  },
  data: () => ({
    ngrams: null,
    cipherText: '',
    plainText: '',
    maxSteps: 1000,
    crackingMessage: false,
  }),
  computed: {
    L() {
      if (this.ngrams) {
        return parseInt(localStorage.getItem(`${this.ngramsFile}L`), 10);
      }
      return 0;
    },
    N() {
      if (this.ngrams) {
        return parseInt(localStorage.getItem(`${this.ngramsFile}N`), 10);
      }
      return 0;
    },
    floor() {
      if (this.ngrams) {
        return parseFloat(localStorage.getItem(`${this.ngramsFile}floor`));
      }
      return 0.0;
    },
  },
  watch: {
    crackingMessage(newVal) {
      console.log(`cracking: ${newVal}`);
      if (newVal) {
        this.$vs.loading();
      } else {
        this.$vs.loading.close();
      }
    },
  },
  created() {
    const storedNgrams = localStorage.getItem(this.ngramsFile);
    if (storedNgrams) {
      this.ngrams = JSON.parse(lzString.decompress(storedNgrams));
    } else {
      const self = this;
      axios
        .get(`/ngrams/${this.ngramsFile}.json`)
        .then((response) => {
          const ngramsObj = response.data;

          localStorage.setItem(
            self.ngramsFile,
            lzString.compress(JSON.stringify(ngramsObj)),
          );

          localStorage.setItem(
            `${self.ngramsFile}L`,
            Object.keys(ngramsObj)[0].length,
          );

          const sum = Object.values(ngramsObj).reduce((a, b) => a + b, 0);
          localStorage.setItem(`${self.ngramsFile}N`, sum);
          localStorage.setItem(
            `${self.ngramsFile}floor`,
            Math.log10(0.01 / sum),
          );

          self.ngrams = ngramsObj;
          self.$emit('ready', 'N-grams loaded');
        })
        .catch((err) => {
          self.$emit('error', err.message);
        });
    }
  },
  methods: {
    getLogProb(ngram) {
      return Math.log10(this.ngrams[ngram] / this.N);
    },
    getScore(text) {
      const textUpper = text.toUpperCase();
      let score = 0;
      for (let i = 0; i <= textUpper.length - this.L; i += 1) {
        if (textUpper.slice(i, i + this.L) in this.ngrams) {
          score += this.getLogProb(textUpper.slice(i, i + this.L));
        } else {
          score += this.floor;
        }
      }
      return score;
    },
    crackMessage() {
      this.crackingMessage = true;
      const self = this;
      setTimeout(() => {
        const ciphertext = self.cipherText;
        let bestScore = Number.MIN_SAFE_INTEGER;
        let bestKey = null;
        let s = 0;
        let key = null;
        // eslint-disable-next-line
        while ((key = self.keysGenerator(key, ciphertext, bestKey))) {
          const plaintext = self
            .decryptAlgorithm(ciphertext, key)
            .toUpperCase()
            .replace(/[^A-Z]/g, '');
          const currentScore = self.getScore(plaintext);
          if (currentScore > bestScore) {
            bestScore = currentScore;
            bestKey = key;
            self.plainText = plaintext;
            s = 0;
          }
          if (s > self.maxSteps) {
            break;
          } else {
            s += 1;
          }
        }
        self.$emit('update-key', bestKey);
        self.crackingMessage = false;
      }, 100);
    },
    copyToClipboard() {
      const self = this;
      this.$copyText(this.plainText)
        .then(() => {
          self.$emit('success', 'copied!');
        })
        .catch((err) => {
          self.$emit('error', err.message);
        });
    },
    save() {
      const blob = new Blob([this.plainText], {
        type: 'text/plain;charset=utf-8',
      });
      FileSaver.saveAs(blob, 'Plain.txt');
    },
  },
};
</script>
