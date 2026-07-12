<script setup lang="ts">
export interface BottomNavItem {
  /** Stable id, compared against `modelValue` for the active tab. */
  id: string;
  /** Tab label (hidden when `showLabels` is false). */
  label?: string;
  /** Inline SVG/HTML markup for the icon (rendered with v-html). */
  icon?: string;
  /** Count badge, or `true` for a bare attention dot. */
  badge?: number | string | boolean;
}

withDefaults(
  defineProps<{
    /** Destinations, left to right (keep to 3–5). */
    items: BottomNavItem[];
    /** Id of the active tab. */
    modelValue?: string;
    /** Show text labels under icons. */
    showLabels?: boolean;
    /** Pin to the viewport bottom (position: fixed). */
    fixed?: boolean;
  }>(),
  { modelValue: undefined, showLabels: true, fixed: true }
);

const emit = defineEmits<{
  "update:modelValue": [id: string];
  change: [id: string];
}>();

function select(id: string) {
  emit("update:modelValue", id);
  emit("change", id);
}
</script>

<template>
  <nav :class="['jl-bottomnav', fixed ? 'jl-bottomnav--fixed' : '']" aria-label="Primary">
    <button
      v-for="it in items"
      :key="it.id"
      type="button"
      class="jl-bottomnav__item"
      :aria-current="it.id === modelValue ? 'page' : undefined"
      @click="select(it.id)"
    >
      <span class="jl-bottomnav__icon">
        <!-- eslint-disable-next-line vue/no-v-html -- icon is developer-authored inline SVG markup, not user input -->
        <span v-if="it.icon" style="display: contents" v-html="it.icon" />
        <span
          v-if="it.badge != null && it.badge !== false && it.badge === true"
          class="jl-bottomnav__dot"
          aria-hidden="true"
        />
        <span
          v-else-if="it.badge != null && it.badge !== false"
          class="jl-bottomnav__badge"
          >{{ it.badge }}</span
        >
      </span>
      <span v-if="showLabels && it.label" class="jl-bottomnav__label">{{ it.label }}</span>
    </button>
  </nav>
</template>

<style src="./bottom-nav.css"></style>
