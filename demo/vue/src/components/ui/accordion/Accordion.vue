<script setup lang="ts">
import { provide, ref, computed } from "vue";

const props = withDefaults(
  defineProps<{
    type?: "single" | "multiple";
    variant?: "bordered" | "separated";
    defaultValue?: string | string[];
  }>(),
  { type: "single", variant: "bordered", defaultValue: undefined }
);

const initial =
  props.defaultValue != null
    ? Array.isArray(props.defaultValue)
      ? props.defaultValue
      : [props.defaultValue]
    : [];
const open = ref<string[]>(initial);

function toggle(value: string) {
  const has = open.value.includes(value);
  if (props.type === "multiple") {
    open.value = has ? open.value.filter((v) => v !== value) : [...open.value, value];
  } else {
    open.value = has ? [] : [value];
  }
}

provide("jlAccordion", { open, toggle });

const cls = computed(() =>
  [
    "jl-accordion",
    props.variant === "separated" ? "jl-accordion--separated" : "jl-accordion--bordered",
  ].join(" ")
);
</script>

<template>
  <div :class="cls"><slot /></div>
</template>

<style src="./accordion.css"></style>
