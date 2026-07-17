<script setup lang="ts">
import { inject, useSlots } from "vue";

const props = withDefaults(
  defineProps<{
    checked?: boolean;
    disabled?: boolean;
    shortcut?: string;
    /** Close the menu after toggling. @default false — checkable items keep the menu open. */
    closeOnSelect?: boolean;
  }>(),
  { checked: false, disabled: false, shortcut: "", closeOnSelect: false }
);
const emit = defineEmits<{ "update:checked": [value: boolean]; change: [value: boolean] }>();
const menu = inject<{ close: () => void }>("jlMenu", { close: () => {} });
const slots = useSlots();

function onClick() {
  if (props.disabled) return;
  emit("update:checked", !props.checked);
  emit("change", !props.checked);
  if (props.closeOnSelect) menu.close();
}
</script>

<template>
  <button
    type="button"
    role="menuitemcheckbox"
    class="jl-menu__item"
    :aria-checked="checked"
    :aria-disabled="disabled || undefined"
    @click="onClick"
  >
    <span class="jl-menu__item-check">
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M3.5 8.5l3 3 6-7"
          stroke="currentColor"
          stroke-width="1.9"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
    <span v-if="slots.icon" class="jl-menu__item-icon"><slot name="icon" /></span>
    <span class="jl-menu__item-label"><slot /></span>
    <span v-if="shortcut" class="jl-menu__item-shortcut">{{ shortcut }}</span>
  </button>
</template>
