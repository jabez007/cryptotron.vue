<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  type:
    | 'theory'
    | 'encrypt'
    | 'decrypt'
    | 'copy'
    | 'crack'
    | 'save'
    | 'load'
    | 'home'
    | 'about'
    | 'builder'
    | 'display'
    | 'display-off'
    | 'error'
  size?: number | string
}>()

const iconSize = computed(() => props.size || 20)

const colors = {
  cyan: 'var(--neon-cyan)',
  magenta: 'var(--neon-magenta)',
  green: 'var(--neon-green)',
  secondary: 'var(--cryptotron-text-secondary)',
}
</script>

<template>
  <svg
    :width="iconSize"
    :height="iconSize"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="cyber-icon"
  >
    <!-- Theory / Documentation -->
    <g v-if="type === 'theory'">
      <path d="M4 4H20V20H4V4Z" :stroke="colors.cyan" stroke-width="1.5" />
      <path d="M7 8H17" :stroke="colors.cyan" stroke-width="1" />
      <path d="M7 12H17" :stroke="colors.cyan" stroke-width="1" />
      <path d="M7 16H13" :stroke="colors.cyan" stroke-width="1" />
      <rect x="15" y="15" width="2" height="2" :fill="colors.magenta" />
    </g>

    <!-- Encrypt / Lock -->
    <g v-if="type === 'encrypt'">
      <rect x="5" y="10" width="14" height="10" :stroke="colors.cyan" stroke-width="1.5" />
      <path d="M8 10V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V10" :stroke="colors.cyan" stroke-width="1.5" />
      <circle cx="12" cy="15" r="1.5" :fill="colors.magenta" />
    </g>

    <!-- Decrypt / Unlock -->
    <g v-if="type === 'decrypt'">
      <rect x="5" y="10" width="14" height="10" :stroke="colors.cyan" stroke-width="1.5" />
      <path d="M8 10V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7" :stroke="colors.cyan" stroke-width="1.5" />
      <circle cx="12" cy="15" r="1.5" :fill="colors.green" />
    </g>

    <!-- Copy / Clipboard -->
    <g v-if="type === 'copy'">
      <path d="M9 4H5V19H15V15" :stroke="colors.cyan" stroke-width="1.5" />
      <path d="M9 4H19V15H9V4Z" :stroke="colors.cyan" stroke-width="1.5" />
      <path d="M12 8H16" :stroke="colors.cyan" stroke-width="1" />
      <path d="M12 11H16" :stroke="colors.cyan" stroke-width="1" />
    </g>

    <!-- Crack / Scanner / Targeting -->
    <g v-if="type === 'crack'">
      <!-- Outer Scope -->
      <circle cx="12" cy="12" r="9" :stroke="colors.cyan" stroke-width="1.5" opacity="0.5" />
      <path d="M12 2V5M12 19V22M2 12H5M19 12H22" :stroke="colors.cyan" stroke-width="1.5" />
      <!-- Inner Diamond Probe -->
      <path d="M12 7L17 12L12 17L7 12L12 7Z" :fill="colors.magenta" />
      <circle cx="12" cy="12" r="1" fill="white" />
    </g>

    <!-- Home -->
    <g v-if="type === 'home'">
      <path d="M3 10L12 3L21 10V20H3V10Z" :stroke="colors.cyan" stroke-width="1.5" />
      <rect x="10" y="14" width="4" height="6" :stroke="colors.cyan" stroke-width="1.5" />
    </g>

    <!-- About -->
    <g v-if="type === 'about'">
      <circle cx="12" cy="12" r="9" :stroke="colors.cyan" stroke-width="1.5" />
      <path d="M12 12V16" :stroke="colors.cyan" stroke-width="2" />
      <circle cx="12" cy="8" r="1" :fill="colors.cyan" />
    </g>

    <!-- Builder / Blocks -->
    <g v-if="type === 'builder'">
      <rect x="4" y="4" width="7" height="7" :stroke="colors.cyan" stroke-width="1.5" />
      <rect x="13" y="13" width="7" height="7" :stroke="colors.cyan" stroke-width="1.5" />
      <path d="M11 7.5H13M13 7.5V13" :stroke="colors.magenta" stroke-width="1.5" />
      <circle cx="13" cy="7.5" r="2" :fill="colors.magenta" />
    </g>

    <!-- Save -->
    <g v-if="type === 'save'">
      <path d="M19 21H5V5H16L21 10V19" :stroke="colors.green" stroke-width="1.5" />
      <rect x="8" y="5" width="6" height="4" :stroke="colors.green" stroke-width="1.5" />
      <rect x="7" y="13" width="10" height="8" :stroke="colors.green" stroke-width="1.5" />
    </g>

    <!-- Display / Monitor -->
    <g v-if="type === 'display'">
      <rect x="3" y="4" width="18" height="12" :stroke="colors.cyan" stroke-width="1.5" />
      <path d="M7 20H17M12 16V20" :stroke="colors.cyan" stroke-width="1.5" />
      <path d="M6 7H18" :stroke="colors.cyan" stroke-width="0.5" opacity="0.5" />
    </g>

    <!-- Display Off / Clean Mode -->
    <g v-if="type === 'display-off'">
      <rect x="3" y="4" width="18" height="12" :stroke="colors.secondary" stroke-width="1.5" opacity="0.6" />
      <path d="M7 20H17M12 16V20" :stroke="colors.secondary" stroke-width="1.5" opacity="0.6" />
      <path d="M3 3L21 21" :stroke="colors.magenta" stroke-width="1.5" />
    </g>

    <!-- Error / High-Voltage / Warning -->
    <g v-if="type === 'error'">
      <!-- High Voltage Bolt -->
      <path d="M12 2L4 15H10L8 22L16 9H10L12 2Z" :fill="colors.magenta" :stroke="colors.magenta" stroke-width="1" />
      <!-- Outer Border Fragments -->
      <path d="M3 21L2 21L2 20M21 21L22 21L22 20M2 4L2 3L3 3M22 4L22 3L21 3" :stroke="colors.magenta" stroke-width="1.5" />
    </g>

    <!-- Load -->
    <g v-if="type === 'load'">
      <path d="M4 6V20H20V10L16 6H4Z" :stroke="colors.cyan" stroke-width="1.5" />
      <path d="M12 15V11M12 11L9 13M12 11L15 13" :stroke="colors.cyan" stroke-width="1.5" />
    </g>
  </svg>
</template>

<style scoped>
.cyber-icon {
  filter: drop-shadow(0 0 2px rgba(0, 255, 255, 0.3));
  transition: all 0.3s ease;
}

@media (hover: hover) {
  .cyber-icon:hover {
    filter: drop-shadow(0 0 5px rgba(0, 255, 255, 0.6));
    transform: scale(1.1);
  }
}

/* Accessibility: Respect OS-level reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .cyber-icon,
  .cyber-icon:hover {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }
}
</style>
