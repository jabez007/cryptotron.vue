<template>
  <div class="form-control">
    <label class="control-label">Number of Rails:</label>
    <input class="cipher-input" type="number" v-model.lazy.number="rails.value" min="2" max="100" />
    <div v-if="rails.hasError" class="error-messages">
      <p v-for="error in rails.errors" :key="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCipherKey, validationRules } from './mixin'

interface RailFenceCipherKey {
  rails: number
}

interface Props {
  cipherKey: RailFenceCipherKey
}

const props = withDefaults(defineProps<Props>(), {
  cipherKey: () => ({
    rails: 3,
  }),
})

const emit = defineEmits<{
  'update:cipherKey': [cipherKey: RailFenceCipherKey]
}>()

const { createPropertyComputed } = useCipherKey(props, emit, {
  rails: [validationRules.required, validationRules.numberRange(2, 100)],
})
const rails = createPropertyComputed('rails')
</script>

<style scoped>
@import '@/assets/cipher-key.css';
</style>
