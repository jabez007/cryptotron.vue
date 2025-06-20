<template>
  <div class="form-control">
    <label class="control-label">Keyword:</label>
    <input class="cipher-input" type="text" v-model.lazy.trim="keyword.value" />
    <div v-if="keyword.hasError" class="error-messages">
      <p v-for="error in keyword.errors" :key="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCipherKey, validationRules } from './mixin'

interface VigenereCipherKey {
  keyword: string
}

interface Props {
  cipherKey: VigenereCipherKey
}

const props = withDefaults(defineProps<Props>(), {
  cipherKey: () => ({
    keyword: 'mockraven',
  }),
})

const emit = defineEmits<{
  'update:cipherKey': [cipherKey: VigenereCipherKey]
}>()

const { createPropertyComputed } = useCipherKey(props, emit, {
  keyword: [validationRules.required, validationRules.minLength(1)],
})
const keyword = createPropertyComputed('keyword')
</script>

<style scoped>
@import '@/assets/cipher-key.css';
</style>
