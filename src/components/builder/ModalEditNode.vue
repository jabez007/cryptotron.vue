<script setup lang="ts">
import { computed, nextTick, onMounted, ref, shallowRef, watch } from 'vue'
import type { Node } from '@vue-flow/core'

const props = defineProps<{
  isOpen: boolean
  node: Node
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
  'update-node': [node: Node]
}>()

const localNode = ref<Node>({ ...props.node })
const keyComponent = shallowRef(null)

const hasKeyComponent = computed(() => keyComponent.value !== null)

onMounted(async () => {
  // Load the cipher key component if it exists
  if (props.node.data?.cipherKeyComponent) {
    try {
      const component = await props.node.data.cipherKeyComponent()
      keyComponent.value = component.default || component
    } catch (error) {
      console.error('Failed to load cipher key component:', error)
      keyComponent.value = null
    }
  }
})

const handleSave = () => {
  emit('update-node', localNode.value)
  handleClose()
}

const handleClose = () => {
  showModal.value = false
  setTimeout(async () => {
    await nextTick()
    emit('close')
  }, 600)
}
</script>

<template>
  <div :class="['modal-overlay', { active: props.isOpen }]" @click="handleClose">
    <Transition name="cyber-hologram">
      <div v-if="showModal" class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Edit {{ localNode.label }} Key</h3>
          <button class="modal-close" @click="handleClose">&times;</button>
        </div>

        <div class="modal-body">
          <!-- Use the cipher's dedicated key component if available -->
          <div v-if="hasKeyComponent">
            <component :is="keyComponent" v-model:cipherKey="localNode.data.cipherKey" />
          </div>

          <!-- Fallback for nodes without key components -->
          <div v-else>
            <label class="modal-label">Cipher Key:</label>
            <textarea v-model="localNode.data.cipherKey" class="modal-textarea"
              placeholder="Enter cipher key configuration"></textarea>
            <small class="modal-help">This cipher doesn't have a dedicated key editor</small>
          </div>
        </div>

        <div class="modal-footer">
          <button class="modal-button modal-button-cancel" @click="handleClose">Cancel</button>
          <button class="cipher-button" @click="handleSave">Save Changes</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@import '@/assets/modal.css';
</style>
