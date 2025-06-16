<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    delay?: string
  }>(),
  {
    delay: '0s',
  },
)
</script>

<template>
  <div class="scan-line"></div>
</template>

<style scoped>
.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ffff, transparent);
  animation: scan-line-move 3s linear infinite;
  animation-delay: v-bind('props.delay');
}

@keyframes scan-line-move {
  0% {
    transform: translateY(0);
    opacity: 1;
  }

  100% {
    transform: translateY(500px);
    opacity: 0;
  }
}
</style>
