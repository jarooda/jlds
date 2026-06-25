<script setup lang="ts">
import { inject, computed, useSlots } from "vue";

const props = withDefaults(
  defineProps<{ tone?: "default" | "danger"; disabled?: boolean; shortcut?: string }>(),
  { tone: "default", disabled: false, shortcut: "" }
);
const emit = defineEmits<{ select: [event: MouseEvent] }>();
const menu = inject<{ close: () => void }>("jlMenu", { close: () => {} });
const slots = useSlots();

const cls = computed(() =>
  ["jl-menu__item", props.tone === "danger" ? "jl-menu__item--danger" : ""]
    .filter(Boolean)
    .join(" ")
);
function onClick(e: MouseEvent) {
  if (props.disabled) return;
  emit("select", e);
  menu.close();
}
</script>

<template>
  <button type="button" role="menuitem" :class="cls" :aria-disabled="disabled || undefined" @click="onClick">
    <span v-if="slots.icon" class="jl-menu__item-icon"><slot name="icon" /></span>
    <span class="jl-menu__item-label"><slot /></span>
    <span v-if="shortcut" class="jl-menu__item-shortcut">{{ shortcut }}</span>
  </button>
</template>
