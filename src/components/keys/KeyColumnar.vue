<template>
  <div class="form-control">
    <label class="control-label">Keyword:</label>
    <input
      class="cipher-input"
      type="text"
      v-model.lazy="keyword.value"
      placeholder="e.g., CRYPTO"
      spellcheck="false"
    />
    <div v-if="keyword.hasError" class="error-messages">
      <p v-for="error in keyword.errors" :key="error">{{ error }}</p>
    </div>
    <small class="control-help">
      Used to determine the order in which columns are read.
    </small>
  </div>
</template>

<script setup lang="ts">
import { useCipherKey, validationRules } from './mixin'

interface ColumnarCipherKey {
  keyword: string
}

interface Props {
  cipherKey: ColumnarCipherKey
}

const props = withDefaults(defineProps<Props>(), {
  cipherKey: () => ({
    keyword: 'NIGHTCITY',
  }),
})

const emit = defineEmits<{
  'update:cipherKey': [cipherKey: ColumnarCipherKey]
}>()

const { createPropertyComputed } = useCipherKey(props, emit, {
  keyword: [
    validationRules.required,
    validationRules.minLength(2),
    validationRules.pattern(/^[A-Za-z]+$/, 'Keyword must contain only letters'),
  ],
})
const keyword = createPropertyComputed('keyword')
</script>

<style scoped>
@import '@/assets/cipher-key.css';
</style>
