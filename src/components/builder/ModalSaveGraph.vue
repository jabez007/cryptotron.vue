<template>
  <div :class="['modal-overlay', { active: props.isOpen }]" @click="closeModal">
    <Transition name="cyber-hologram">
      <div v-if="showModal" class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Save Cipher</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label>Cipher Name:</label>
            <input
              v-model="cipherName"
              type="text"
              class="modal-input"
              placeholder="Enter cipher name..."
              @keyup.enter="handleSaveGraph"
              ref="nameInput"
            />
          </div>
        </div>

        <div class="modal-footer">
          <button class="modal-button modal-button-cancel" @click="closeModal">Cancel</button>
          <button class="cipher-button" @click="handleSaveGraph">Save</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'save-graph', name: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showModal = ref(false)

watch(
  () => props.isOpen,
  (newVal) => {
    if (showModal.value !== newVal) {
      setTimeout(async () => {
        await nextTick()
        showModal.value = newVal
      }, 100)
    }
  },
)

const cipherName = ref('')
const nameInput = ref<HTMLInputElement>()

// Focus input when modal opens
watch(
  () => props.isOpen,
  async (isOpen) => {
    if (isOpen) {
      await nextTick()
      nameInput.value?.focus()
    } else {
      // Clear name when modal closes
      cipherName.value = ''
    }
  },
)

const handleSaveGraph = () => {
  if (!cipherName.value.trim()) {
    alert('Please enter a name for your cipher')
    return
  }

  emit('save-graph', cipherName.value.trim())
  closeModal()
}

const closeModal = () => {
  cipherName.value = ''
  showModal.value = false
  setTimeout(async () => {
    await nextTick()
    emit('close')
  }, 600)
}
</script>

<style scoped>
@import '@/assets/modal.css';
</style>
