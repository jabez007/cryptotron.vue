<template>
  <div class="form-control">
    <label class="control-label">Primer:</label>
    <input class="cipher-input" type="text" v-model.lazy.trim="primer.value" />
    <div v-if="primer.hasError" class="error-messages">
      <p v-for="error in primer.errors" :key="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCipherKey, validationRules } from './mixin'

interface AutokeyCipherKey {
  primer: string
}

interface Props {
  cipherKey: AutokeyCipherKey
}

const props = withDefaults(defineProps<Props>(), {
  cipherKey: () => ({
    primer: 'bytewalker',
  }),
})

const emit = defineEmits<{
  'update:cipherKey': [cipherKey: AutokeyCipherKey]
}>()

const { createPropertyComputed } = useCipherKey(props, emit, {
  primer: [validationRules.required, validationRules.minLength(1)],
})
const primer = createPropertyComputed('primer')
</script>

<style scoped>
@import '@/assets/cipher-key.css';
</style>
