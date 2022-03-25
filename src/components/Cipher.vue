<template>
  <vs-card class="card">
    <vs-collapse>
      <vs-collapse-item open>
        <!-- default closed on smaller screens -->
        <slot name="description"></slot>
      </vs-collapse-item>
    </vs-collapse>
    <vs-row v-if="$slots.key" vs-justify="center" vs-align="center">
      <vs-col vs-w="3">
        <vs-icon icon="vpn_key" size="large"></vs-icon>
      </vs-col>
      <vs-col vs-w="7">
        <slot name="key"></slot>
      </vs-col>
    </vs-row>
    <vs-tabs alignment="fixed">
      <vs-tab label="Encrypt">
        <encrypt-message
          :encryptAlgorithm="encryptAlgorithm"
          :cipherKey="cipherKey"
          @success="onSuccess"
          @error="onError"
        >
          <template slot="plainText" slot-scope="scope">
            <slot name="encrypt-plainText" v-bind="scope"></slot>
          </template>
          <template slot="cipherText" slot-scope="scope">
            <slot name="encrypt-cipherText" v-bind="scope"></slot>
          </template>
        </encrypt-message>
      </vs-tab>
      <vs-tab label="Decrypt">
        <decrypt-message
          :decryptAlgorithm="decryptAlgorithm"
          :cipherKey="cipherKey"
          @success="onSuccess"
          @error="onError"
        >
          <template slot="cipherText" slot-scope="scope">
            <slot name="decrypt-cipherText" v-bind="scope"></slot>
          </template>
          <template slot="plainText" slot-scope="scope">
            <slot name="decrypt-plainText" v-bind="scope"></slot>
          </template>
        </decrypt-message>
      </vs-tab>
      <vs-tab v-if="keysGenerator" label="Analysis">
        <crack-message
          :decryptAlgorithm="decryptAlgorithm"
          :ngramsFile="ngramsFile"
          :keysGenerator="keysGenerator"
          @ready="onReady"
          @update-key="$emit('update-key', $event)"
          @success="onSuccess"
          @error="onError"
        />
      </vs-tab>
    </vs-tabs>
  </vs-card>
</template>

<script>
export default {
  name: 'Cipher',
  components: {
    // @ is an alias to /src
    EncryptMessage: () => import('./EncryptMessage.vue'),
    DecryptMessage: () => import('./DecryptMessage.vue'),
    CrackMessage: () => import('./CrackMessage.vue'),
  },
  props: {
    encryptAlgorithm: {
      type: Function,
      required: true,
    },
    decryptAlgorithm: {
      type: Function,
      required: true,
    },
    cipherKey: {
      type: [Object, Boolean],
      required: true,
    },
    keysGenerator: {
      type: Function,
      required: false,
    },
    ngramsFile: {
      type: String,
      default: 'quadgrams',
    },
  },
  data: () => ({}),
  methods: {
    onReady(message) {
      this.$vs.notify({
        title: 'Ready',
        text: message,
      });
    },
    onSuccess(message) {
      this.$vs.notify({
        title: 'Success',
        text: message,
        color: 'success',
      });
    },
    onError(message) {
      this.$vs.notify({
        title: 'Error',
        text: message,
        color: 'error',
      });
    },
  },
};
</script>

<style>
a.example {
  color: #ff9800;
}

a.example:hover {
  text-decoration: underline;
}
</style>
