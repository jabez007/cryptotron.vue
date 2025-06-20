<template>
  <div class="form-control">
    <label class="control-label">Shift Value:</label>
    <input class="cipher-input" type="number" v-model.lazy.number="shift.value" min="1" max="25" />
    <div v-if="shift.hasError" class="error-messages">
      <p v-for="error in shift.errors" :key="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCipherKey, validationRules } from './mixin'

interface CaesarCipherKey {
  shift: number
}

interface Props {
  cipherKey: CaesarCipherKey
}

const props = withDefaults(defineProps<Props>(), {
  cipherKey: () => ({
    shift: 13,
  }),
})

const emit = defineEmits<{
  'update:cipherKey': [cipherKey: CaesarCipherKey]
}>()

const { createPropertyComputed } = useCipherKey(props, emit, {
  shift: [validationRules.required, validationRules.numberRange(0, 25)],
})
const shift = createPropertyComputed('shift')
</script>

<style scoped>
@import '@/assets/cipher-key.css';
</style>
