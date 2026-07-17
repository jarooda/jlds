<script setup lang="ts">
import { computed, provide } from "vue";

const props = defineProps<{ modelValue?: string }>();
const emit = defineEmits<{ "update:modelValue": [value: string]; change: [value: string] }>();

function select(value: string) {
  emit("update:modelValue", value);
  emit("change", value);
}

provide("jlMenuRadio", {
  selected: computed(() => props.modelValue),
  select,
});
</script>

<template>
  <slot />
</template>
