<script setup lang="ts">
// Small inline device icons for the viewport switcher. `devices` is the
// multidevice glyph used as the control's leading label.
defineProps<{ name: 'fit' | 'mobile' | 'tablet' | 'desktop' | 'devices' }>()
</script>

<template>
  <svg
    viewBox="0 0 16 16"
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    stroke-width="1.4"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="name === 'mobile'">
      <rect x="5" y="2" width="6" height="12" rx="1.4" />
      <line x1="7.2" y1="12" x2="8.8" y2="12" />
    </template>
    <template v-else-if="name === 'tablet'">
      <rect x="3.5" y="2.5" width="9" height="11" rx="1.4" />
      <line x1="7.2" y1="11.4" x2="8.8" y2="11.4" />
    </template>
    <template v-else-if="name === 'desktop'">
      <rect x="2" y="3" width="12" height="8" rx="1.2" />
      <path d="M6 13.5h4M8 11v2.5" />
    </template>
    <template v-else-if="name === 'devices'">
      <rect x="1.5" y="3" width="9" height="7" rx="1" />
      <rect x="10.5" y="6" width="4" height="7" rx="1" />
      <path d="M3.5 12.5h3.5" />
    </template>
    <template v-else>
      <!-- fit: fills the available width -->
      <path d="M2 8h12" />
      <path d="M5 5 2 8l3 3M11 5l3 3-3 3" />
    </template>
  </svg>
</template>
