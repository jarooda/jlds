<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    eyebrow?: string;
    back?: boolean;
    sticky?: boolean;
    variant?: "surface" | "plain";
    as?: string;
  }>(),
  {
    title: "",
    description: "",
    eyebrow: "",
    back: false,
    sticky: false,
    variant: "surface",
    as: "header",
  }
);

const emit = defineEmits<{ (e: "back"): void }>();

const cls = computed(() =>
  [
    "jl-pageheader",
    props.variant === "plain" ? "jl-pageheader--plain" : "jl-pageheader--surface",
    props.sticky ? "jl-pageheader--sticky" : "",
  ]
    .filter(Boolean)
    .join(" ")
);
</script>

<template>
  <component :is="as" :class="cls">
    <div v-if="$slots.breadcrumb" class="jl-pageheader__crumb"><slot name="breadcrumb" /></div>
    <div class="jl-pageheader__bar">
      <div v-if="$slots.leading || back" class="jl-pageheader__lead">
        <slot name="leading" />
        <button v-if="back" type="button" class="jl-pageheader__back" aria-label="Go back" @click="emit('back')">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m15 6-6 6 6 6" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
      </div>
      <span v-if="$slots.icon" class="jl-pageheader__icon"><slot name="icon" /></span>
      <div class="jl-pageheader__heading">
        <div v-if="eyebrow || $slots.eyebrow" class="jl-pageheader__eyebrow"><slot name="eyebrow">{{ eyebrow }}</slot></div>
        <div class="jl-pageheader__titlerow">
          <h1 v-if="title || $slots.title" class="jl-pageheader__title"><slot name="title">{{ title }}</slot></h1>
          <slot />
        </div>
        <p v-if="description || $slots.description" class="jl-pageheader__desc"><slot name="description">{{ description }}</slot></p>
      </div>
      <div v-if="$slots.actions" class="jl-pageheader__actions"><slot name="actions" /></div>
    </div>
    <div v-if="$slots.tabs" class="jl-pageheader__tabs"><slot name="tabs" /></div>
  </component>
</template>

<style src="./page-header.css"></style>
