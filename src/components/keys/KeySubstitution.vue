<template>
  <div class="form-control">
    <label class="control-label">Cipher Alphabet:</label>
    <input class="cipher-input" type="text" v-model.lazy.trim="cipherAlphabet.value" />
    <div v-if="cipherAlphabet.hasError" class="error-messages">
      <p v-for="error in cipherAlphabet.errors" :key="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCipherKey, validationRules } from './mixin'

interface SubstitutionCipherKey {
  cipherAlphabet: string
}

interface Props {
  cipherKey: SubstitutionCipherKey
}

const props = withDefaults(defineProps<Props>(), {
  cipherKey: () => ({
    cipherAlphabet: 'qwertyuiopasdfghjklzxcvbnm',
  }),
})

const emit = defineEmits<{
  'update:cipherKey': [cipherKey: SubstitutionCipherKey]
}>()

const { createPropertyComputed } = useCipherKey(props, emit, {
  cipherAlphabet: [
    validationRules.required,
    validationRules.minLength(26),
    validationRules.maxLength(26),
  ],
})
const cipherAlphabet = createPropertyComputed('cipherAlphabet')
</script>

<style scoped>
@import '@/assets/cipher-key.css';
</style>
