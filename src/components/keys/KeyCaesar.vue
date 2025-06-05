<template>
  <label class="control-label">Shift Value:</label>
  <input class="cipher-input" type="number" v-model.number="shift" min="1" max="25">
</template>

<script setup lang="ts">
import { useCipherKey, validationRules } from './mixin';

interface CaesarCipherKey {
  shift: number
}

interface Props {
  cipherKey: CaesarCipherKey
}

const props = withDefaults(defineProps<Props>(), {
  cipherKey: () => ({
    shift: 0
  })
})

const emit = defineEmits<{
  'update:cipherKey': [cipherKey: CaesarCipherKey]
}>()

const { createPropertyComputed } = useCipherKey(props, emit, {
  shift: [
    validationRules.required,
    validationRules.numberRange(0, 25)
  ]
})
const shift = createPropertyComputed('shift')

</script>
