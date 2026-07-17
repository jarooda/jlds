<script setup lang="ts">
import { inject, computed, useSlots, type ComputedRef } from "vue";

const props = withDefaults(
  defineProps<{
    value: string;
    disabled?: boolean;
    shortcut?: string;
    /** Close the menu after selecting. @default false */
    closeOnSelect?: boolean;
  }>(),
  { disabled: false, shortcut: "", closeOnSelect: false }
);
const menu = inject<{ close: () => void }>("jlMenu", { close: () => {} });
const radio = inject<{ selected: ComputedRef<string | undefined>; select: (v: string) => void }>(
  "jlMenuRadio",
  { selected: computed(() => undefined), select: () => {} }
);
const slots = useSlots();

const checked = computed(() => radio.selected.value === props.value);

function onClick() {
  if (props.disabled) return;
  radio.select(props.value);
  if (props.closeOnSelect) menu.close();
}
</script>

<template>
  <button
    type="button"
    role="menuitemradio"
    class="jl-menu__item"
    :aria-checked="checked"
    :aria-disabled="disabled || undefined"
    @click="onClick"
  >
    <span class="jl-menu__item-check jl-menu__item-check--radio">
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="3.5" fill="currentColor" />
      </svg>
    </span>
    <span v-if="slots.icon" class="jl-menu__item-icon"><slot name="icon" /></span>
    <span class="jl-menu__item-label"><slot /></span>
    <span v-if="shortcut" class="jl-menu__item-shortcut">{{ shortcut }}</span>
  </button>
</template>
