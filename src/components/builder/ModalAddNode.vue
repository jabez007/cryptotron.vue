<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { availableCiphers } from './constants'

const props = defineProps<{
  isOpen: boolean
}>()

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

const emit = defineEmits<{
  close: []
  'add-node': [data: { label: string; type: string }]
}>()

const newNodeData = ref({
  label: '',
  type: 'caesar',
})

const handleAddNode = () => {
  emit('add-node', { ...newNodeData.value })
  closeModal()
}

const closeModal = () => {
  newNodeData.value = {
    label: '',
    type: 'caesar',
  }
  showModal.value = false
  setTimeout(async () => {
    await nextTick()
    emit('close')
  }, 600)
}
</script>

<template>
  <div :class="['modal-overlay', { active: props.isOpen }]" @click="closeModal">
    <Transition name="cyber-hologram">
      <div v-if="showModal" class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Add New Cipher Node</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label class="modal-label">Cipher Type:</label>
            <select v-model="newNodeData.type" class="modal-select">
              <option v-for="cipher in availableCiphers" :key="cipher.type" :value="cipher.type">
                {{ cipher.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="modal-label">Custom Label (optional):</label>
            <input type="text" v-model="newNodeData.label" class="modal-input"
              :placeholder="`Default: ${availableCiphers.find((c) => c.type === newNodeData.type)?.label || ''}`" />
            <small class="modal-help">Leave empty to use the default cipher name</small>
          </div>
        </div>

        <div class="modal-footer">
          <button class="modal-button modal-button-cancel" @click="closeModal">Cancel</button>
          <button class="cipher-button" @click="handleAddNode">Add Node</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@import '@/assets/modal.css';
</style>
