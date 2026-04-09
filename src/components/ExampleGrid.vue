<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  text: string
  type?: 'default' | 'highlighted' | 'result'
}>()

const characters = computed(() => props.text.split(''))
</script>

<template>
  <div class="example-row">
    <span class="row-label">{{ label }}</span>
    <span v-for="(char, index) in characters" :key="index" :class="['char-cell', type]">
      {{ char }}
    </span>
  </div>
</template>

<style scoped>
@import '@/assets/example-grid.css';
</style>
