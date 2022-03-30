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
        <h5>The Rail-Fence Cipher</h5>
      </div>
      <div class="main">
        <p>
          The rail-fence cipher (also called a zigzag cipher) is a very simple
          form of transposition cipher. It derives its name from the way in
          which it is encoded, following a simple rule for mixing up the
          characters in the plaintext to form the ciphertext.
        </p>
        <p>
          The rail-fence cipher is often decribed as a "write down the columns,
          read along the rows" cipher. This is equivalent to using an un-keyed
          columnar transposition cipher.
        </p>
        <p>
          The rail-fence cipher offers essentially no communication security,
          and can be easily broken even by hand. Although weak on its own, it
          can be combined with other ciphers, such as a
          <a @click="$router.push({ name: 'cryptotron-substitution' })"
            >substitution cipher</a
          >, the combination of which is more difficult to break than either
          cipher on it's own.
        </p>
        <h6 class="title">Example</h6>
        <p>
          The key for the railfence cipher is just the number of rails. To
          encrypt a piece of text, the plain text is written downwards and
          diagonally on successive "rails" of an imaginary fence, then moving up
          when we reach the bottom rail. When we reach the top rail, the message
          is written downwards again. This continues until the whole plaintext
          is written out. The message is then read off in rows.
        </p>
        <p>
          For
          <a
            @click="
              key = { rails: 3 };
              exampleMsg = 'WE ARE DISCOVERED. FLEE AT ONCE';
            "
            >example</a
          >, if we have 3 rails and a message of
          <q>WE ARE DISCOVERED. FLEE AT ONCE</q>
          then the cipher text reads off as
          <q>WECRLTEERDSOEEFEAOCAIVDEN</q>
        </p>
        <vs-popup
          class="dark"
          title="Rail-Fence Example"
          background-color-popup="rgb(30, 30, 30)"
          :active.sync="openExample"
        >
          <div style="text-align: center">
            <vs-row vs-justify="center">
              <vs-col vs-w="12" style="display: flex; justify-content: center">
                <vs-input style="width: 100%" v-model="exampleMsg"></vs-input>
              </vs-col>
              <vs-col vs-w="12">
                <rail-fence-key full-width v-model="key"></rail-fence-key>
              </vs-col>
            </vs-row>
            <table>
              <tr v-for="i in cipherGrid.length" :key="i">
                <td
                  v-for="j in cipherGrid[i - 1].length"
                  :key="j"
                  :style="`color: ${
                    cipherGrid[i - 1][j - 1] === '-' ? '#ffe082' : '#ff8f00'
                  } !important`"
                >
                  {{ cipherGrid[i - 1][j - 1] }}
                </td>
              </tr>
            </table>
            <span style="color: #ffc107 !important">
              {{
                cipherGrid
                  .flat()
                  .map((c) => c.replace(/[^a-z]/, ""))
                  .join("")
              }}
            </span>
          </div>
        </vs-popup>
      </div>
    </vs-card>
    <rail-fence-key slot="key" v-model="key"></rail-fence-key>
  </Cipher>
</template>

<script>
// @ is an alias to /src
import { encrypt, decrypt } from '../lib/ciphers/railFence';
import Cipher from '../components/Cipher.vue';
import RailFenceKey from '../components/cipherKeys/RailFenceKey.vue';

export default {
  components: {
    Cipher,
    RailFenceKey,
  },
  data: () => ({
    key: {
      rails: 1,
    },
    exampleMsg: '',
  }),
  computed: {
    openExample: {
      get() {
        // return this.key.rails >= 3 && this.key.rails <= 5 && !!this.exampleMsg;
        return this.key.rails >= 2 && !!this.exampleMsg;
      },
      set(newVal) {
        if (!newVal) {
          this.exampleMsg = '';
        }
      },
    },
    cipherGrid() {
      const { rails } = this.key;
      if (this.openExample) {
        const msg = this.exampleMsg.toLowerCase().replace(/[^a-z]/g, '');
        const grid = new Array(rails)
          .fill('-')
          .map(() => new Array(msg.length).fill('-'));
        let column = 0; // each character has it's own column
        let row = 0;
        while (column < grid[row].length) {
          while (row < rails - 1) {
            if (msg.charAt(column)) {
              grid[row].splice(column, 1, msg.charAt(column));
            } else {
              grid[row].splice(column, 1, '-');
            }
            column += 1;
            row += 1;
            if (column >= grid[row].length) {
              break;
            }
          }
          if (column >= grid[row].length) {
            break;
          }
          while (row > 0) {
            if (msg.charAt(column)) {
              grid[row].splice(column, 1, msg.charAt(column));
            } else {
              grid[row].splice(column, 1, '-');
            }
            column += 1;
            row -= 1;
            if (column >= grid[row].length) {
              break;
            }
          }
        }
        return grid;
      }
      return [[]];
    },
  },
  methods: {
    encrypt(plainText, cipherKey) {
      return encrypt(cipherKey)(plainText);
    },
    decrypt(cipherText, cipherKey) {
      return decrypt(cipherKey)(cipherText);
    },
    possibleKeys(key, ciphertext) {
      if (!key) {
        // first pass is ''
        return { rails: 1 };
      }
      if (key.rails >= ciphertext.length) {
        return null;
      }
      return { rails: key.rails + 1 };
    },
    onUpdateKey(newKey) {
      this.key = newKey;
    },
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-spacing: 1px;
  border-collapse: separate;
  font-family: monospace, monospace;
  background: rgba(var(--vs-dark), 1);
}
tr:nth-child(odd) {
  background: rgb(40, 40, 40);
}
tr:nth-child(even) {
  background: rgb(20, 20, 20);
}
td {
  text-align: center;
}
</style>

<style>
.dark .vs-popup {
  color: rgb(245, 235, 225);
}

.dark .vs-popup {
  color: rgb(245, 235, 225);
}
</style>
