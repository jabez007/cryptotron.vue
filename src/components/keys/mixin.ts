import { computed, ref, type ComputedRef, type WritableComputedRef } from 'vue'

// Validation rule types
type ValidationRule<T> = (value: T) => string | null
type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[]
}

interface ValidationState {
  isValid: boolean
  errors: string[]
}

interface PropertyValidation<T> extends WritableComputedRef<T> {
  isValid: ComputedRef<boolean>
  errors: ComputedRef<string[]>
  hasError: ComputedRef<boolean>
}

// Generic composable for cipher key management
export function useCipherKey<T extends Record<string, any>>( // eslint-disable-line @typescript-eslint/no-explicit-any
  props: { cipherKey: T },
  emit: (event: 'update:cipherKey', value: T) => void,
  validationRules: ValidationRules<T> = {}
) {

  // Create a computed that handles the full cipherKey object
  const cipherKey = computed({
    get: () => props.cipherKey,
    set: (newCipherKey: T) => emit('update:cipherKey', newCipherKey)
  })

  // Store validation errors for each property - initialize as reactive object
  const validationErrors = ref<Partial<Record<keyof T, string[]>>>({})

  // Validate a specific property
  const validateProperty = <K extends keyof T>(property: K, value: T[K]): string[] => {
    const rules = validationRules[property] || []
    const errors: string[] = []

    for (const rule of rules) {
      const error = rule(value)
      if (error) {
        errors.push(error)
      }
    }

    return errors
  }

  // Helper function to update a specific property in the cipher key
  const updateCipherKeyProperty = <K extends keyof T>(
    property: K,
    value: T[K]
  ) => {
    // Validate the new value
    const errors = validateProperty(property, value)
    validationErrors.value = {
      ...validationErrors.value,
      [property]: errors
    }

    if (errors.length === 0) {
      emit('update:cipherKey', {
        ...props.cipherKey,
        [property]: value
      })
    }
  }

  // Helper function to create a computed for a specific property
  const createPropertyComputed = <K extends keyof T>(
    property: K
  ): PropertyValidation<T[K]> => {
    const baseComputed = computed({
      get: () => props.cipherKey[property],
      set: (newValue: T[K]) => updateCipherKeyProperty(property, newValue)
    })

    const errors = computed(() => validationErrors.value[property] || [])
    const isValid = computed(() => errors.value.length === 0)
    const hasError = computed(() => !isValid.value)

    // Initialize validation for this property
    const initialErrors = validateProperty(property, props.cipherKey[property])
    validationErrors.value = {
      ...validationErrors.value,
      [property]: initialErrors
    }

    const result = Object.assign(baseComputed, {
      isValid,
      errors,
      hasError
    })

    return result as PropertyValidation<T[K]>
  }

  // Get overall validation state
  const overallValidation = computed((): ValidationState => {
    const allErrors = Object.values(validationErrors.value as string).flat()
    return {
      isValid: allErrors.length === 0,
      errors: allErrors
    }
  })

  return {
    cipherKey,
    updateCipherKeyProperty,
    createPropertyComputed,
    validation: overallValidation,
    // Simple version without validation for debugging
    createSimplePropertyComputed: <K extends keyof T>(property: K): WritableComputedRef<T[K]> => {
      return computed({
        get: () => props.cipherKey[property],
        set: (value: T[K]) => {
          emit('update:cipherKey', {
            ...props.cipherKey,
            [property]: value
          })
        }
      })
    }
  }
}

// Common validation rules you can reuse
export const validationRules = {
  required: <T>(value: T): string | null => {
    if (value === null || value === undefined || value === '') {
      return 'This field is required'
    }
    return null
  },

  numberRange: (min: number, max: number) => (value: number): string | null => {
    if (typeof value !== 'number' || isNaN(value)) {
      return 'Must be a valid number'
    }
    if (value < min || value > max) {
      return `Must be between ${min} and ${max}`
    }
    return null
  },

  minLength: (min: number) => (value: string): string | null => {
    if (typeof value !== 'string') {
      return 'Must be a string'
    }
    if (value.length < min) {
      return `Must be at least ${min} characters long`
    }
    return null
  },

  maxLength: (max: number) => (value: string): string | null => {
    if (typeof value !== 'string') {
      return 'Must be a string'
    }
    if (value.length > max) {
      return `Must be no more than ${max} characters long`
    }
    return null
  },

  pattern: (regex: RegExp, message: string) => (value: string): string | null => {
    if (typeof value !== 'string') {
      return 'Must be a string'
    }
    if (!regex.test(value)) {
      return message
    }
    return null
  }
}

// Example usage with validation:
/*
<template>
  <div>
    <label>Shift Value:</label>
    <input
      type="number"
      v-model="shift"
      :class="{ 'error': shift.hasError }"
    >
    <div v-if="shift.hasError" class="error-messages">
      <div v-for="error in shift.errors" :key="error" class="error">
        {{ error }}
      </div>
    </div>

    <button :disabled="!validation.isValid">Apply Cipher</button>
  </div>
</template>

<script setup lang="ts">
import { useCipherKey, validationRules } from './composables/useCipherKey'

interface CaesarCipherKey {
  shift: number
}

interface Props {
  cipherKey: CaesarCipherKey
}

const props = withDefaults(defineProps<Props>(), {
  cipherKey: () => ({ shift: 0 })
})

const emit = defineEmits<{
  'update:cipherKey': [cipherKey: CaesarCipherKey]
}>()

const { createPropertyComputed, validation } = useCipherKey(props, emit, {
  shift: [
    validationRules.required,
    validationRules.numberRange(0, 25)
  ]
})

const shift = createPropertyComputed('shift')
// shift.value - WritableComputedRef for v-model
// shift.isValid - ComputedRef<boolean>
// shift.errors - ComputedRef<string[]>
// shift.hasError - ComputedRef<boolean>
</script>

<style>
.error {
  color: red;
  font-size: 0.875rem;
}
.error-messages {
  margin-top: 0.25rem;
}
input.error {
  border-color: red;
}
</style>
*/

