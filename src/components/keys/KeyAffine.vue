<template>
  <div class="form-row">
    <div class="form-control">
      <label class="control-label">Alpha Value:</label>
      <select class="cipher-input" v-model.lazy.number="alpha.value">
        <option disabled value="">-- Choose a number --</option>
        <option v-for="num in coprimeNumbers" :key="num" :value="num">
          {{ num }}
        </option>
      </select>
      <div v-if="alpha.hasError" class="error-messages">
        <p v-for="error in alpha.errors" :key="error">{{ error }}</p>
      </div>
    </div>
    <div class="form-control">
      <label class="control-label">Beta Value:</label>
      <input class="cipher-input" type="number" v-model.lazy.number="beta.value" min="0" max="25" />
      <div v-if="beta.hasError" class="error-messages">
        <p v-for="error in beta.errors" :key="error">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCipherKey, validationRules } from './mixin'

interface AffineCipherKey {
  alpha: number
  beta: number
}

interface Props {
  cipherKey: AffineCipherKey
}

const props = withDefaults(defineProps<Props>(), {
  cipherKey: () => ({
    alpha: 1,
    beta: 1,
  }),
})

const emit = defineEmits<{
  'update:cipherKey': [cipherKey: AffineCipherKey]
}>()

const coprimeNumbers = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25]

const isCoprime = (value: number): string | null => {
  if (typeof value !== 'number' || isNaN(value)) {
    return 'Must be a valid number'
  }
  if (!coprimeNumbers.includes(value)) {
    return 'Must be coprime with 26'
  }
  return null
}

const { createPropertyComputed } = useCipherKey(props, emit, {
  alpha: [validationRules.required, validationRules.numberRange(1, 25), isCoprime],
  beta: [validationRules.required, validationRules.numberRange(0, 25)],
})
const alpha = createPropertyComputed('alpha')
const beta = createPropertyComputed('beta')
</script>

<style scoped>
@import '@/assets/cipher-key.css';

.form-row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
}

.form-control {
  margin: 1rem;
  min-width: 13rem;
}
</style>
