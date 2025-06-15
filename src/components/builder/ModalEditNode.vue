<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue'
import type { Node } from '@vue-flow/core'

const props = defineProps<{
  node: Node
}>()

const emit = defineEmits<{
  close: []
  'update-node': [node: Node]
}>()

const localNode = ref<Node>(structuredClone(props.node))
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
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div class="modal-overlay" @click="handleClose">
    <div class="modal-content" @click.stop>
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
  </div>
</template>

<style scoped>
@import '@/assets/modal.css';
</style>
