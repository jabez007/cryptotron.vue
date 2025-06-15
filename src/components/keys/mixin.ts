import { computed, reactive, ref, watchEffect, type WritableComputedRef } from 'vue'

// Validation rule types
type ValidationRule<T> = (value: T) => string | null
type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[]
}

interface ValidationState {
  isValid: boolean
  errors: string[]
}

/**
 * A writable computed ref for a single property, augmented with validation state.
 */
interface PropertyValidation<T> {
  value: WritableComputedRef<T>
  isValid: boolean // ComputedRef<boolean>
  errors: string[] //ComputedRef<string[]>
  hasError: boolean //ComputedRef<boolean>
}

/**
 * A generic composable for managing a reactive object (e.g., a configuration or key)
 * with built-in validation. It enables v-model binding on individual properties of the object.
 *
 * @template T - The shape of the reactive object.
 * @param props - The component props, containing the reactive object.
 * @param emit - The component's emit function.
 * @param validationRules - An object defining validation rules for each property of T.
 * @returns An object with helpers to manage and validate the state.
 */
export function useCipherKey<T extends Record<string, any>>( // eslint-disable-line @typescript-eslint/no-explicit-any
  props: { cipherKey: T },
  emit: (event: 'update:cipherKey', value: T) => void,
  validationRules: ValidationRules<T> = {}
) {

  // Store validation errors for each property - initialize as reactive object
  const validationErrors = ref<Partial<Record<keyof T, string[]>>>({})

  // --- Core Validation Logic ---

  /**
   * Validates a single value against its rules.
   * @param property - The name of the property.
   * @param value - The value to validate.
   * @returns An array of error messages.
   */
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

  // Use watchEffect to automatically validate all properties when they change.
  // This handles both initial validation and re-validation if the prop object changes.
  watchEffect(() => {
    const newErrors: Partial<Record<keyof T, string[]>> = {}
    for (const key in props.cipherKey) {
      if (Object.prototype.hasOwnProperty.call(validationRules, key)) {
        newErrors[key] = validateProperty(key, props.cipherKey[key])
      }
    }
    validationErrors.value = newErrors
  })

  // --- Property-level Helpers ---

  /**
   * Creates a writable computed reference for a specific property of the cipherKey.
   * This allows using v-model on individual fields and handles validation on update.
   *
   * @param property - The key of the property to create a computed for.
   * @returns A `PropertyValidation` object, which is a writable computed ref with added validation state.
   */
  const createPropertyComputed = <K extends keyof T>(
    property: K
  ): PropertyValidation<T[K]> => {
    const baseComputed = computed({
      get: () => props.cipherKey[property],
      set: (newValue: T[K]) => {
        // When the value is set, validate it immediately.
        const errors = validateProperty(property, newValue)
        // More performant and idiomatic state update for Vue
        validationErrors.value[property] = errors

        // Only emit the update to the parent if the new value is valid.
        if (errors.length === 0) {
          emit('update:cipherKey', {
            ...props.cipherKey,
            [property]: newValue
          })
        }
      }
    })

    const errors = computed(() => validationErrors.value[property] || [])
    const isValid = computed(() => errors.value.length === 0)
    const hasError = computed(() => !isValid.value)

    // Combine the writable computed with the validation computeds.
    // The `as` cast is safe because we are programmatically adding the required properties.
    /*
    const result = Object.assign(baseComputed, {
      isValid,
      errors,
      hasError
    })

    return result as PropertyValidation<T[K]>
    */
    // ====================================================================
    // THE FIX: Wrap the returned object in reactive()
    // This creates a reactive proxy for the entire object, ensuring
    // that v-model can connect to its 'value' property correctly.
    // ====================================================================
    return reactive({
      value: baseComputed,
      errors,
      isValid,
      hasError,
    });
  }

  // --- Overall State ---

  /**
   * A computed property representing the overall validation state of the entire object.
   */
  const overallValidation = computed((): ValidationState => {
    const allErrors = Object.values(validationErrors.value).flat()
    return {
      isValid: allErrors.length === 0,
      errors: allErrors as string[]
    }
  })

  return {
    createPropertyComputed,
    validation: overallValidation,
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

