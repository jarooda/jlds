<script setup lang="ts">
import { ref, computed, useSlots } from "vue";

const props = withDefaults(
  defineProps<{
    pressed?: boolean;
    defaultPressed?: boolean;
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
  }>(),
  { defaultPressed: false, size: "md", disabled: false }
);

const emit = defineEmits<{
  (e: "update:pressed", v: boolean): void;
  (e: "change", v: boolean): void;
}>();

const slots = useSlots();
const internal = ref(props.defaultPressed);
const isControlled = computed(() => props.pressed !== undefined);
const on = computed(() => (isControlled.value ? props.pressed : internal.value));

function toggle() {
  if (props.disabled) return;
  const next = !on.value;
  if (!isControlled.value) internal.value = next;
  emit("update:pressed", next);
  emit("change", next);
}

const iconOnly = computed(() => !!slots.icon && !slots.default);
const cls = computed(() =>
  ["jl-toggle", `jl-toggle--${props.size}`, iconOnly.value ? "jl-toggle--icon" : ""]
    .filter(Boolean)
    .join(" ")
);
</script>

<template>
  <button type="button" :class="cls" :aria-pressed="on" :disabled="disabled" @click="toggle">
    <slot name="icon" />
    <slot />
  </button>
</template>

<style src="./toggle.css"></style>
