<template>
  <div class="form-control">
    <label class="control-label">Keyword:</label>
    <input
      class="cipher-input"
      type="text"
      v-model.lazy.trim="keyword.value"
      placeholder="e.g. CYBERPUNK"
    />
    <div v-if="keyword.hasError" class="error-messages">
      <p v-for="error in keyword.errors" :key="error">{{ error }}</p>
    </div>
  </div>
  <div class="form-control">
    <label class="control-label">Cipher Characters (Exactly 5):</label>
    <input class="cipher-input" type="text" v-model.lazy.trim="cipherChars.value" maxlength="5" />
    <div v-if="cipherChars.hasError" class="error-messages">
      <p v-for="error in cipherChars.errors" :key="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCipherKey, validationRules } from './mixin'

interface PolybiusCipherKey {
  keyword: string
  cipherChars: string
}

interface Props {
  cipherKey: PolybiusCipherKey
}

const props = withDefaults(defineProps<Props>(), {
  cipherKey: () => ({
    keyword: '',
    cipherChars: 'ABCDE',
  }),
})

const emit = defineEmits<{
  'update:cipherKey': [cipherKey: PolybiusCipherKey]
}>()

const { createPropertyComputed } = useCipherKey(props, emit, {
  keyword: [],
  cipherChars: [
    validationRules.required,
    (val: string) => (val.length !== 5 ? 'Must be exactly 5 characters' : null),
    (val: string) => (new Set(val).size !== 5 ? 'Characters must be unique' : null),
  ],
})
const keyword = createPropertyComputed('keyword')
const cipherChars = createPropertyComputed('cipherChars')
</script>

<style scoped>
@import '@/assets/cipher-key.css';
</style>
