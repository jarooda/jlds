<script setup lang="ts">
import { ref, computed } from "vue";

const props = withDefaults(
  defineProps<{
    trigger?: string;
    open?: boolean;
    defaultOpen?: boolean;
    disabled?: boolean;
    variant?: "ghost" | "bordered";
    chevronPosition?: "start" | "end";
  }>(),
  {
    trigger: "",
    open: undefined,
    defaultOpen: false,
    disabled: false,
    variant: "ghost",
    chevronPosition: "end",
  }
);

const emit = defineEmits<{ (e: "update:open", value: boolean): void }>();

const internal = ref(props.defaultOpen);
const isControlled = computed(() => props.open != null);
const open = computed(() => (isControlled.value ? props.open! : internal.value));
const id = `jlcol-${Math.random().toString(36).slice(2, 8)}`;

function toggle() {
  if (props.disabled) return;
  const next = !open.value;
  if (!isControlled.value) internal.value = next;
  emit("update:open", next);
}

const cls = computed(() =>
  [
    "jl-collapsible",
    props.variant === "bordered" ? "jl-collapsible--bordered" : "jl-collapsible--ghost",
  ].join(" ")
);
</script>

<template>
  <div :class="cls" :data-open="open || undefined">
    <button
      type="button"
      class="jl-collapsible__trigger"
      :data-chevron="chevronPosition"
      :aria-expanded="open"
      :aria-controls="id"
      :disabled="disabled"
      @click="toggle"
    >
      <span v-if="$slots.icon" class="jl-collapsible__leadicon"><slot name="icon" /></span>
      <span class="jl-collapsible__label"><slot name="trigger">{{ trigger }}</slot></span>
      <span class="jl-collapsible__chevron">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 6 6 6-6 6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </span>
    </button>
    <div :id="id" class="jl-collapsible__region" role="region">
      <div class="jl-collapsible__content"><div class="jl-collapsible__inner"><slot /></div></div>
    </div>
  </div>
</template>

<style src="./collapsible.css"></style>
