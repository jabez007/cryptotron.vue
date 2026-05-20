<script setup lang="ts">
import { computed } from 'vue'
import CyberIcon from './icons/CyberIcon.vue'

interface Props {
  text: string
  type?: 'error' | 'warning' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'error',
})

const statusClass = computed(() => {
  return `status-${props.type}`
})
</script>

<template>
  <div class="feedback-container">
    <Transition name="fade-slide">
      <div v-if="text" :class="['status-line', statusClass]">
        <CyberIcon :type="type === 'info' ? 'about' : 'error'" size="16" />
        <span class="feedback-text">{{ text }}</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.feedback-container {
  height: 2rem;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.status-line {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  font-family: 'Space Mono', monospace;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.status-error {
  color: var(--cryptotron-neon-magenta);
}

.status-warning {
  color: var(--cryptotron-neon-magenta);
  opacity: 0.85;
}

.status-info {
  color: var(--cryptotron-neon-cyan);
}

.feedback-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
