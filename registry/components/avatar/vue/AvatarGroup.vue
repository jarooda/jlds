<script setup lang="ts">
import { computed, useSlots } from "vue";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const props = withDefaults(
  defineProps<{
    max?: number;
    size?: AvatarSize | number;
  }>(),
  { size: "md" }
);

const SIZES: Record<AvatarSize, number> = { xs: 22, sm: 28, md: 36, lg: 48, xl: 64 };

const slots = useSlots();
const items = computed(() => (slots.default ? slots.default() : []));
const shown = computed(() =>
  props.max ? items.value.slice(0, props.max) : items.value
);
const extra = computed(() =>
  props.max ? items.value.length - shown.value.length : 0
);
const px = computed(() =>
  typeof props.size === "number" ? props.size : SIZES[props.size] ?? 36
);
</script>

<template>
  <span class="jl-avatar-group">
    <component :is="node" v-for="(node, i) in shown" :key="i" />
    <span
      v-if="extra > 0"
      class="jl-avatar-group__more"
      :style="{ width: `${px}px`, height: `${px}px` }"
    >
      +{{ extra }}
    </span>
  </span>
</template>

<style src="./avatar.css"></style>
