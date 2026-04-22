<template>
  <div class="form-control">
    <label class="control-label">Keyword:</label>
    <input class="cipher-input" type="text" v-model.lazy="keyword.value" placeholder="e.g. MONARCHY" />
    <div v-if="keyword.hasError" class="error-messages">
      <p v-for="error in keyword.errors" :key="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCipherKey, validationRules } from './mixin'

interface PlayfairCipherKey {
  keyword: string
}

interface Props {
  cipherKey: PlayfairCipherKey
}

const props = withDefaults(defineProps<Props>(), {
  cipherKey: () => ({
    keyword: 'PLAYFAIR',
  }),
})

const emit = defineEmits<{
  'update:cipherKey': [cipherKey: PlayfairCipherKey]
}>()

const { createPropertyComputed } = useCipherKey(props, emit, {
  keyword: [
    validationRules.required,
    validationRules.pattern(/^[a-zA-Z]+$/, 'Keyword must contain only letters'),
  ],
})
const keyword = createPropertyComputed('keyword')
</script>

<style scoped>
@import '@/assets/cipher-key.css';
</style>
